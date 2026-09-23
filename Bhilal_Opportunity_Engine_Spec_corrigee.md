# Bhilal Opportunity Engine — Spécification technique

> Système automatisé de prospection de stages et d’emplois, avec recherche d’opportunités en Afrique et à l’international.
>
> **Budget cible : 0 €** autant que les quotas gratuits des services utilisés le permettent.
>
> **Principe :** tu interviens uniquement pour valider et cliquer sur **« Envoyer »** dans le panel admin. La collecte, la qualification, la déduplication, le scoring, la génération des messages, le suivi technique et les alertes sont automatisés. Les mécanismes d’auto-récupération sont utilisés lorsque c’est possible, mais aucune modification arbitraire du code de production n’est effectuée automatiquement.

---

## 1. Objectif du système

Le système doit :

- détecter des opportunités de stage et d’emploi pertinentes ;
- rechercher des offres publiées et des opportunités de prospection spontanée ;
- cibler en priorité les opportunités remote, africaines et internationales correspondant au profil ;
- qualifier et dédupliquer les opportunités ;
- calculer un score de pertinence ;
- identifier, lorsque c’est possible, un contact professionnel pertinent ;
- générer un message personnalisé ;
- stocker les données dans une vraie base PostgreSQL ;
- afficher les opportunités dans le panel admin existant ;
- laisser l’utilisateur modifier, ignorer ou valider un message avant l’envoi ;
- gérer les relances sans les envoyer automatiquement ;
- journaliser les erreurs avec suffisamment de contexte pour permettre leur diagnostic ;
- envoyer immédiatement une alerte en cas d’erreur critique ;
- isoler les erreurs d’une source afin qu’une panne n’arrête pas tout le pipeline ;
- désactiver temporairement une source qui échoue de façon répétée ;
- utiliser des solutions de secours lorsqu’un service de génération de texte est indisponible.

**Règle fondamentale : l’envoi d’une candidature reste toujours soumis à une validation humaine.**

---

## 2. Architecture technique

### Stack cible

| Composant | Outil | Rôle |
|---|---|---|
| Base de données | **Neon PostgreSQL** | Stockage persistant des opportunités, entreprises, contacts, messages et logs |
| Backend API | **Render** | API sécurisée entre le panel, la base et les services externes |
| Panel admin | **Vercel** | Interface de validation, suivi et diagnostic |
| Orchestrateur | **GitHub Actions** | Exécution planifiée du pipeline |
| Génération principale | **Gemini API** | Génération des messages personnalisés |
| Génération de secours | **DeepSeek API** | Fallback si Gemini échoue ou atteint sa limite |
| Fallback final | **Templates locaux** | Génération sans API externe |
| Envoi d’e-mails | **Resend** ou **Gmail API** | Envoi des candidatures et alertes |
| Monitoring applicatif | `system_logs` + GitHub Actions | Suivi des exécutions et erreurs |

### Pourquoi Neon ?

Neon fournit PostgreSQL, mais ne fournit pas automatiquement une API REST équivalente à celle que Supabase génère autour de sa base.

L’architecture retenue est donc :

```text
Panel Vercel
      │
      │ HTTPS / API authentifiée
      ▼
Backend Render
      │
      │ PostgreSQL
      ▼
Neon
```

Le frontend **ne doit jamais** accéder directement à Neon.

La chaîne de connexion PostgreSQL reste exclusivement côté serveur, dans les variables d’environnement du backend et, si nécessaire, du pipeline CI.

### Remarque importante sur Render Free

Les services Web gratuits de Render s’arrêtent après une période d’inactivité et redémarrent à la prochaine requête. Le health check peut donc provoquer un réveil, mais il ne faut pas considérer cela comme une disponibilité permanente du backend.

Le système doit donc être conçu pour supporter les cold starts et les délais de réveil.

---

## 3. Vérification de santé

### 3.1 Endpoint `/health`

Le backend doit exposer :

```http
GET /health
```

Réponse attendue :

```json
{
  "status": "pong"
}
```

Cet endpoint vérifie principalement que le processus HTTP est vivant.

### 3.2 Endpoint `/ready`

Il est recommandé d’ajouter également :

```http
GET /ready
```

Cet endpoint vérifie que les dépendances indispensables sont accessibles, notamment la base PostgreSQL.

Exemple :

```json
{
  "status": "ready",
  "database": "ok"
}
```

Ainsi :

- `/health` = **liveness** ;
- `/ready` = **readiness**.

### 3.3 Avant le pipeline

Avant toute exécution complète :

```text
Job CI démarre
      ↓
GET /health
      ↓
Réponse 200 ?
   ┌──┴──┐
  Oui    Non
   ↓      ↓
GET /ready  2 retries espacés de 20 s
   ↓      ↓
Pipeline  Échec (au bout de ~120-130 s en pire cas)
          ↓
      Log CRITICAL
          ↓
      Email d'alerte (avec cooldown)
          ↓
       STOP
```

### Règles

- Timeout d’une requête : **30 secondes maximum** (adapté au démarrage à froid des conteneurs Render Free et au réveil concomitant de Neon PostgreSQL).
- En cas d’échec : **2 retries espacés de 20 secondes** (soit un délai cumulé maximal de ~120-130s en pire cas : 3 requêtes de 30s + 2 pauses de 20s, largement suffisant pour absorber le double cold start croisé Render + Neon).
- Après le retry, si le backend reste indisponible : log `CRITICAL`, alerte e-mail et arrêt du run.
- Le pipeline ne doit pas poursuivre une opération nécessitant le backend si celui-ci n’est pas disponible.
- Le health check peut être exécuté indépendamment du pipeline complet.

**Important :** le health check ne « répare » pas Render. Il provoque le réveil préventif d’un service gratuit qui était en veille.

---

## 4. Schéma de base de données

```sql
-- =========================================================
-- SOURCES
-- =========================================================

CREATE TABLE sources (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  consecutive_failures INT NOT NULL DEFAULT 0,
  last_success_at TIMESTAMPTZ,
  last_failure_at TIMESTAMPTZ,
  last_failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- ENTREPRISES
-- =========================================================

CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  country TEXT,
  domain_signal TEXT,
  stack_detected TEXT[],
  first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(name, website)
);


-- =========================================================
-- OPPORTUNITÉS
-- =========================================================

CREATE TABLE opportunities (
  id SERIAL PRIMARY KEY,

  company_id INT REFERENCES companies(id) ON DELETE SET NULL,
  source_id INT REFERENCES sources(id) ON DELETE SET NULL,

  type TEXT NOT NULL
    CHECK (type IN ('offre', 'spontanee')),

  role TEXT NOT NULL,
  job_url TEXT,

  remote BOOLEAN NOT NULL DEFAULT FALSE,
  country TEXT,

  stack_required TEXT[],

  score INT CHECK (score >= 0 AND score <= 100),

  status TEXT NOT NULL DEFAULT 'NEW'
    CHECK (
      status IN (
        'NEW',
        'RESEARCHED',
        'READY',
        'APPROVED',
        'SENDING',
        'SEND_UNKNOWN',
        'SENT',
        'FOLLOW_UP',
        'REPLIED',
        'REJECTED',
        'CLOSED'
      )
    ),

  dedupe_key TEXT UNIQUE NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- CONTACTS
-- =========================================================

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,

  opportunity_id INT NOT NULL
    REFERENCES opportunities(id)
    ON DELETE CASCADE,

  full_name TEXT,
  role TEXT,
  email TEXT,
  email_confidence INT
    CHECK (email_confidence >= 0 AND email_confidence <= 100),

  linkedin_url TEXT,

  verified BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(opportunity_id, email)
);


-- =========================================================
-- MESSAGES
-- =========================================================

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,

  opportunity_id INT NOT NULL
    REFERENCES opportunities(id)
    ON DELETE CASCADE,

  generated_by TEXT NOT NULL,

  content TEXT NOT NULL,

  edited_by_user BOOLEAN NOT NULL DEFAULT FALSE,

  -- Métadonnées d'envoi et réconciliation
  provider TEXT,                    -- ex: 'resend', 'gmail'
  idempotency_key TEXT UNIQUE,      -- clé unique transmise au fournisseur
  provider_message_id TEXT,         -- identifiant unique renvoyé par Resend

  sent_at TIMESTAMPTZ,

  follow_up_1_at TIMESTAMPTZ,
  follow_up_2_at TIMESTAMPTZ,
  follow_up_3_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- LOGS SYSTÈME
-- =========================================================

CREATE TABLE system_logs (
  id SERIAL PRIMARY KEY,

  run_id TEXT NOT NULL,

  step TEXT NOT NULL,

  status TEXT NOT NULL
    CHECK (
      status IN (
        'OK',
        'WARNING',
        'ERROR',
        'CRITICAL'
      )
    ),

  message TEXT,

  payload JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- ÉTAT DES ALERTES (Anti-Spam & Cooldown)
-- =========================================================

CREATE TABLE alert_state (
  alert_key TEXT PRIMARY KEY,       -- ex: 'health_check_critical', 'pipeline_failure'
  last_alerted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cooldown_minutes INT NOT NULL DEFAULT 60
);


-- =========================================================
-- RUNS DU PIPELINE
-- =========================================================

CREATE TABLE pipeline_runs (
  id SERIAL PRIMARY KEY,

  run_id TEXT UNIQUE NOT NULL,

  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,

  status TEXT NOT NULL DEFAULT 'RUNNING'
    CHECK (
      status IN (
        'RUNNING',
        'SUCCESS',
        'PARTIAL',
        'FAILED'
      )
    ),

  opportunities_found INT NOT NULL DEFAULT 0,
  opportunities_created INT NOT NULL DEFAULT 0,
  opportunities_ready INT NOT NULL DEFAULT 0,

  error_count INT NOT NULL DEFAULT 0
);


-- =========================================================
-- INDEX DE PERFORMANCE RECOMMANDÉS
-- =========================================================

CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_score ON opportunities(score DESC);
CREATE INDEX idx_opportunities_created_at ON opportunities(created_at DESC);
CREATE INDEX idx_system_logs_run_id ON system_logs(run_id);
CREATE INDEX idx_system_logs_status ON system_logs(status);
CREATE INDEX idx_messages_idempotency_key ON messages(idempotency_key);
```

### Pourquoi `dedupe_key` ?

La contrainte :

```sql
UNIQUE(company_id, job_url)
```

n’est pas suffisante pour les prospections spontanées, car PostgreSQL autorise plusieurs valeurs `NULL` dans une contrainte `UNIQUE`.

Le système doit donc calculer une clé normalisée, par exemple :

```text
hash(
  type
  + company_id
  + normalized_job_url
  + normalized_role
)
```

Cette clé devient `dedupe_key`.

---

## 5. Cycle de vie d'une opportunité

```text
NEW
 ↓
RESEARCHED
 ↓
READY
 ↓
APPROVED
 ↓
SENDING  (Verrou atomique anti-double-clic)
 ↓
SENT
 ↓
FOLLOW_UP
 ↓
REPLIED / CLOSED
```

Cas alternatifs :

```text
NEW → REJECTED
READY → REJECTED
SENDING → READY (en cas d'erreur de transmission)
SENT → CLOSED
FOLLOW_UP → CLOSED
```

### Signification

- `NEW` : opportunité détectée mais pas encore traitée.
- `RESEARCHED` : entreprise et opportunité analysées.
- `READY` : score et message disponibles, prête à être validée.
- `APPROVED` : validée par l’utilisateur, prête pour la file d'envoi.
- `SENDING` : **état transitoire de verrouillage atomique**. Permet d'éviter tout double envoi si l'utilisateur double-clique ou si deux requêtes réseau simultanées se produisent.
- `SENT` : candidature envoyée et confirmée par l'API e-mail.
- `FOLLOW_UP` : relance disponible.
- `REPLIED` : réponse reçue.
- `REJECTED` : ignorée/rejetée.
- `CLOSED` : traitement terminé.

---

## 6. Pipeline — isolation des erreurs

### Règle principale

**Une source qui échoue ne doit jamais arrêter les autres sources.**

Pseudo-code :

```python
def run_pipeline():
    run_id = create_pipeline_run()

    log(run_id, "pipeline_start", "OK")

    if not health_check():
        log(run_id, "health_check", "CRITICAL")
        send_alert_email(run_id, "Backend indisponible")
        fail_pipeline(run_id)
        return

    for source in get_enabled_sources():

        try:
            results = scrape(source)

            save_raw_results(results)

            log(
                run_id,
                f"scrape_{source.name}",
                "OK"
            )

            reset_failures(source)

        except Exception as error:

            log(
                run_id,
                f"scrape_{source.name}",
                "ERROR",
                payload=str(error)
            )

            increment_failures(source)

            if source.consecutive_failures >= 5:

                disable(source)

                send_alert_email(
                    run_id,
                    f"Source {source.name} désactivée après 5 échecs"
                )

            continue

    for opportunity in get_new_opportunities(run_id):

        try:

            if is_duplicate(opportunity):
                continue

            score = calculate_score(opportunity)

            contact = find_contact(opportunity)

            message = generate_message(
                opportunity,
                contact
            )

            save_opportunity(
                opportunity,
                score,
                contact,
                message
            )

        except Exception as error:

            log(
                run_id,
                f"process_opportunity_{opportunity.id}",
                "ERROR",
                payload=str(error)
            )

            continue

    finalize_pipeline_run(run_id)

    log(
        run_id,
        "pipeline_end",
        "OK"
    )
```

### Important

Il ne faut pas utiliser un `except Exception` global qui avale toutes les erreurs du pipeline.

Les erreurs doivent être isolées au niveau :

- de chaque source ;
- de chaque opportunité ;
- de chaque service externe ;
- de chaque opération critique.

---

## 7. Scraping et collecte

Chaque source doit être implémentée comme un adaptateur indépendant :

```text
sources/
├── base.py
├── remotive.py        # API JSON ouverte & gratuite
├── jobicy.py          # API JSON avec filtre localisation & remote
├── weworkremotely.py  # Flux RSS officiel jamais bloqué
├── himalayas.py       # API JSON offres remote vérifiées
├── remoteok.py        # API JSON publique
├── company_sites.py   # Pages carrières d'entreprises cibles locales/africaines
└── ...
```

Chaque adaptateur doit retourner un format commun :

```python
{
    "company": "...",
    "role": "...",
    "url": "...",
    "country": "...",
    "remote": True,
    "description": "...",
    "stack": ["React", "Node.js"]
}
```

### Une source ne doit jamais dépendre du fonctionnement d’une autre.

Si `source_A` tombe :

```text
source_A → ERROR
source_B → continue
source_C → continue
source_D → continue
```

### Respect des sources & stratégie anti-blocage

Le système doit respecter :

- les conditions d’utilisation des sites ;
- les restrictions d’accès et les limites de requêtes ;
- les règles applicables au traitement des données personnelles.

**Stratégie anti-blocage (Runners GitHub Actions) :**
- Sur les plateformes à forte protection anti-bot (Cloudflare, Datadome type LinkedIn/Wellfound), les adresses IP des runners GitHub Actions sont souvent bloquées (erreur 403).
- **Règle :** Privilégier systématiquement les **APIs JSON ouvertes**, les **flux RSS/Atom publics** (ex: RemoteOK API, Jobspresso) et les pages carrières d'entreprises locales/africaines sans protection anti-bot agressive.
- Ne pas contourner illégalement un CAPTCHA ou une mesure technique de protection.

### Modération des appels IA & Quotas Gemini
- Pour ne pas saturer le quota gratuit Gemini (RPM / TPM), seules les opportunités ayant un score suffisant (`score >= 60`) déclenchent la génération de message IA.
- Un délai de temporisation (2 à 3 secondes) est respecté entre chaque appel de génération.

---

## 8. Scoring

Le score doit être transparent et déterministe.

Exemple :

| Critère | Points |
|---|---:|
| Remote | +25 |
| Stage explicitement recherché | +20 |
| Stack compatible | +15 |
| Fintech / paiement / technologie financière | +10 |
| Afrique | +10 |
| International avec remote | +5 |
| Contact professionnel identifié | +5 |
| Email vérifié | +5 |
| **Maximum** | **95** |

Le score peut ensuite être normalisé sur 100.

### Exemple

```python
score = 0

if opportunity.remote:
    score += 25

if is_internship(opportunity):
    score += 20

score += stack_match_score(opportunity)
score += domain_match_score(opportunity)
score += geography_score(opportunity)

if contact and contact.email:
    score += 5

if contact and contact.verified:
    score += 5

score = min(score, 100)
```

Le score est un **outil de tri**, pas une garantie de pertinence ou d’embauche.

---

## 9. Génération du message — fallback en cascade

Ordre :

```text
Gemini
   ↓ échec
DeepSeek
   ↓ échec
Template local
```

Pseudo-code :

```python
def generate_message(opportunity, contact):

    try:
        return gemini_generate(
            opportunity,
            contact
        )

    except Exception as error:

        log(
            "gemini_failed",
            "WARNING",
            payload=str(error)
        )

    try:
        return deepseek_generate(
            opportunity,
            contact
        )

    except Exception as error:

        log(
            "deepseek_failed",
            "WARNING",
            payload=str(error)
        )

    return template_generate(
        opportunity,
        contact
    )
```

### Règle

La génération de texte ne doit jamais être une dépendance critique du pipeline.

Si les deux APIs externes échouent, le template local permet au traitement de continuer.

---

## 10. Template local de secours

Le template doit utiliser uniquement les informations réellement connues.

Il ne faut jamais inventer :

- le nom d’un recruteur ;
- une expérience ;
- une compétence ;
- une relation avec l’entreprise ;
- une information sur l’offre.

Exemple de structure :

```text
Bonjour [Nom],

Je me permets de vous contacter au sujet de [poste/opportunité]
au sein de [entreprise].

Je suis développeur Full-Stack & Mobile et je recherche actuellement
une opportunité correspondant à mon profil, notamment autour de
[technologies pertinentes].

Mon portfolio :
[portfolio]

Je serais disponible pour échanger si mon profil peut correspondre
à vos besoins.

Cordialement,

Bhilal CHITOU
```

---

## 11. Recherche de contacts

La recherche de contact doit suivre cet ordre :

```text
Contact déjà connu
      ↓
Page officielle de l'entreprise
      ↓
Page équipe / recrutement
      ↓
Contact professionnel public
      ↓
Aucun contact trouvé
```

Priorité indicative :

1. CTO / responsable technique ;
2. responsable recrutement ;
3. HR / Talent Acquisition ;
4. fondateur pour une petite structure ;
5. adresse générale de recrutement.

### Règle importante

Un contact dont l’adresse e-mail n’est pas suffisamment fiable ne doit pas être utilisé automatiquement.

Exemple :

```text
email_confidence >= 80
```

peut être le seuil de validation interne.

---

## 12. Vérification des e-mails

La colonne :

```text
verified
```

doit représenter un état vérifiable, et non une supposition.

Si un fournisseur d’e-mails signale un bounce :

```text
bounce
 ↓
contact.verified = false
 ↓
ne plus utiliser automatiquement ce contact
 ↓
log WARNING
```

Pour automatiser correctement cette partie, il faut exploiter le webhook ou le mécanisme d’événement fourni par le service d’e-mail utilisé.

---

## 13. Alertes e-mail

Les alertes sont envoyées à :

```text
7bhil.chitou7@gmail.com
```

### Règles

| Situation | Niveau | Alerte immédiate |
|---|---|---|
| Backend indisponible après retry | CRITICAL | Oui |
| Base de données indisponible pour une opération critique | CRITICAL | Oui |
| Source échouée une seule fois | WARNING | Non |
| Source désactivée après 5 échecs consécutifs | ERROR | Oui |
| Gemini échoue mais DeepSeek fonctionne | WARNING | Non |
| Gemini + DeepSeek échouent, template utilisé | WARNING | Non |
| Pipeline complètement échoué | CRITICAL | Oui |
| Aucun résultat pendant 3 jours consécutifs | WARNING | Oui |
| Erreur d'authentification critique | CRITICAL | Oui |

### Éviter le spam d'alertes (Mécanisme de Cooldown)

Comme les runners CI sont éphémères et sans mémoire locale, le contrôle anti-spam est persisté en base via la table `alert_state`.

Règle :
- Lors d'une erreur critique (ex: `health_check_critical`), le système consulte `alert_state` :
  - Si aucune alerte n'a été émise pour cette clé depuis plus de `cooldown_minutes` (par défaut 60 min) : l'e-mail est envoyé et `last_alerted_at` est mis à jour à `NOW()`.
  - Si l'erreur se reproduit dans l'intervalle de 60 minutes : **l'e-mail n'est pas envoyé**, l'événement est uniquement consigné dans `system_logs`.
- Lors du retour à la normale : un e-mail unique de résolution est envoyé et l'entrée dans `alert_state` est réinitialisée.

---

## 14. Format d'une alerte

```text
Sujet :
[Opportunity Engine] CRITICAL — health_check

Run ID     : 2026-09-22-0700
Étape      : health_check
Statut     : CRITICAL

Message :
Backend Render indisponible après 2 tentatives.

Tentative 1 :
timeout après 10 secondes

Tentative 2 :
timeout après 10 secondes

Lien :
https://ton-panel-admin.com/logs/2026-09-22-0700
```

Le lien doit ouvrir directement le run concerné dans le panel.

---

## 15. Monitoring des exécutions

La table `pipeline_runs` permet de détecter les problèmes silencieux.

Exemple :

```text
Run 1 → 14 opportunités
Run 2 → 11 opportunités
Run 3 → 0 opportunité
Run 4 → 0 opportunité
Run 5 → 0 opportunité
```

Après trois jours sans nouvelle opportunité, le système envoie une alerte.

Il faut distinguer :

- **zéro résultat réel** ;
- **pipeline cassé**.

Un pipeline qui s’exécute correctement mais ne trouve aucune offre n’est pas nécessairement en panne.

---

## 16. Auto-récupération

Le terme correct ici est **auto-récupération**, et non « auto-patch ».

| Problème | Réaction automatique |
|---|---|
| Render en veille | Le prochain health check le réveille |
| Cold start | Retry avec timeout adapté |
| Source temporairement indisponible | Retry / échec isolé |
| Source en échec répété | Circuit breaker après 5 échecs |
| Gemini indisponible | Fallback DeepSeek |
| DeepSeek indisponible | Fallback template local |
| Doublon | Ignoré via `dedupe_key` |
| Contact en bounce | Contact invalidé |
| Base indisponible | Run arrêté + alerte critique |
| Erreur d'envoi | Candidature non marquée comme envoyée |

### Ce qui ne doit jamais être auto-modifié

Le système ne doit pas :

- modifier son propre code de production ;
- modifier automatiquement les règles de scoring ;
- modifier automatiquement les messages validés ;
- envoyer une candidature sans validation humaine ;
- réactiver automatiquement une source qui a été désactivée après plusieurs erreurs.

---

## 17. Panel admin — UX « valide et envoie »

Le panel doit rester extrêmement simple.

### Vue 1 — À valider

```text
┌──────────────────────────────────────────────┐
│ Software Developer Intern — Fintech XYZ     │
│ Remote · Afrique · Match : 91/100           │
│                                              │
│ ✓ React  ✓ Node.js  ✓ Fintech  ✓ Remote     │
│ Contact : John — CTO                         │
│ Email vérifié : Oui                          │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ Message généré                           │ │
│ │                                          │ │
│ │ Bonjour John, ...                        │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ [Modifier] [Ignorer] [✓ Envoyer]            │
└──────────────────────────────────────────────┘
```

### Vue 2 — Suivi

Afficher :

- candidatures envoyées ;
- date d'envoi ;
- prochaine relance disponible ;
- réponse éventuelle ;
- statut.

Les relances doivent être **proposées**, mais jamais envoyées automatiquement.

Exemple :

```text
J+3 → [Relancer]
J+7 → [Relancer]
J+14 → [Relancer]
```

### Vue 3 — Logs système

Afficher :

- date ;
- run ID ;
- étape ;
- niveau ;
- message ;
- payload ;
- stack trace lorsque disponible.

Les erreurs `CRITICAL` et `ERROR` doivent être facilement filtrables.

---

## 18. API du backend

Routes minimales :

```http
GET /health
GET /ready

GET /api/opportunities?status=READY

GET /api/opportunities/:id

PATCH /api/opportunities/:id

POST /api/opportunities/:id/approve

POST /api/opportunities/:id/send

POST /api/opportunities/:id/reject

GET /api/logs?status=CRITICAL,ERROR

GET /api/runs

GET /api/runs/:runId
```

### Sécurité

Toutes les routes administratives doivent être authentifiées.

Le backend doit vérifier :

- session/token valide ;
- rôle administrateur ;
- origine autorisée lorsque nécessaire ;
- validation des données ;
- limitation de débit sur les routes sensibles.

La route :

```http
POST /api/opportunities/:id/send
```

est particulièrement sensible.

Elle doit :

1. vérifier l'authentification ;
2. vérifier que l'opportunité est dans un état autorisant l'envoi ;
3. récupérer le message depuis la base ;
4. effectuer l'envoi ;
5. confirmer le résultat du fournisseur ;
6. seulement ensuite passer le statut à `SENT` ;
7. enregistrer `sent_at`.

En cas d'échec :

```text
envoi échoué
 ↓
status reste READY
 ↓
log ERROR
 ↓
aucun faux SENT
```

---

## 19. Câblage technique

```text
                    ┌──────────────────────┐
                    │     Panel Vercel     │
                    │      Admin UI        │
                    └──────────┬───────────┘
                               │
                         HTTPS + Auth
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Backend Render    │
                    │       REST API       │
                    └───────┬───────┬──────┘
                            │       │
                            │       └──────────────┐
                            ▼                      ▼
                    ┌───────────────┐       ┌──────────────┐
                    │ Neon Postgres │       │ Resend/Gmail │
                    └───────────────┘       └──────────────┘

                    ┌──────────────────────┐
                    │   GitHub Actions     │
                    │    Pipeline Cron     │
                    └──────────┬───────────┘
                               │
                  collecte / scoring / génération
                               │
                               ▼
                    Backend / Neon / APIs
```

---

## 20. GitHub Actions

GitHub Actions est le choix recommandé si le code du pipeline est déjà hébergé sur GitHub.

Pour un dépôt privé GitHub Free, l'allocation standard actuelle inclut **2 000 minutes GitHub Actions par mois**. Les dépôts publics bénéficient gratuitement des runners standard hébergés par GitHub. Les quotas et conditions peuvent évoluer : ils doivent être vérifiés dans le compte avant la mise en production. citeturn0search1turn0search16

### Optimisation des quotas (2 000 minutes / mois)

> ⚠️ **Attention au piège du health check toutes les 30 min** :
> 48 vérifications par jour = ~1 440 minutes facturées par mois (car GitHub Actions arrondit chaque exécution à la minute supérieure).
> Cela consommerait à lui seul 72 % de votre quota mensuel gratuit !
>
> **Solution adoptée :** Supprimer le cron toutes les 30 min. Le réveil de Render est effectué directement au début du pipeline principal (07h00 et 19h00 UTC) avec la tolérance de démarrage de 120-130 secondes.

### Workflow recommandé

```yaml
name: Opportunity Engine

on:
  schedule:
    # Exécutions deux fois par jour (fuseau horaire UTC)
    - cron: "0 7 * * *"    # 08h00 heure de Cotonou / Paris
    - cron: "0 19 * * *"   # 20h00 heure de Cotonou / Paris
  workflow_dispatch:
    inputs:
      dry_run:
        description: "Mode test sans écriture en base (true/false)"
        required: false
        default: "false"

concurrency:
  group: opportunity-engine
  cancel-in-progress: false

jobs:
  full_pipeline:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run pipeline
        run: python pipeline.py
        env:
          NEON_DATABASE_URL: ${{ secrets.NEON_DATABASE_URL }}
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
          RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
          ALERT_EMAIL: 7bhil.chitou7@gmail.com
```

### Attention au déclenchement manuel

Pour `workflow_dispatch`, le workflow ci-dessus lancerait les deux jobs.

Il est préférable d'utiliser une entrée explicite :

```yaml
workflow_dispatch:
  inputs:
    job_type:
      description: "health ou full"
      required: true
      default: "full"
```

Puis de conditionner les jobs sur cette valeur.

---

## 21. GitLab CI — alternative

GitLab CI peut également exécuter le système.

Le principe reste :

```text
Schedule health
      ↓
JOB_TYPE=health

Schedule matin
      ↓
JOB_TYPE=full

Schedule soir
      ↓
JOB_TYPE=full
```

Exemple :

```yaml
stages:
  - health
  - pipeline

health_check:
  stage: health

  rules:
    - if: '$CI_PIPELINE_SOURCE == "schedule" && $JOB_TYPE == "health"'

  image: alpine:latest

  script:
    - apk add --no-cache curl
    - curl -fsS --max-time 10 https://ton-backend.onrender.com/health

full_pipeline:
  stage: pipeline

  rules:
    - if: '$CI_PIPELINE_SOURCE == "schedule" && $JOB_TYPE == "full"'

  image: python:3.12

  script:
    - pip install -r requirements.txt
    - python pipeline.py
```

Le planning du cron doit être configuré dans l'interface GitLab.

---

## 22. Gestion des secrets

Les secrets ne doivent jamais être écrits dans :

- le dépôt Git ;
- le frontend ;
- les logs ;
- les messages d'erreur ;
- les captures d'écran du panel.

Exemples :

```text
NEON_DATABASE_URL
GEMINI_API_KEY
DEEPSEEK_API_KEY
RESEND_API_KEY
ADMIN_SECRET
```

Dans GitHub :

```text
Settings
→ Secrets and variables
→ Actions
```

Dans Render :

```text
Environment
→ Environment Variables
```

Le frontend ne reçoit jamais :

```text
NEON_DATABASE_URL
GEMINI_API_KEY
DEEPSEEK_API_KEY
RESEND_API_KEY
```

---

## 23. Envoi des candidatures

Le bouton :

```text
✓ Envoyer
```

doit être la dernière étape humaine.

Flux :

```text
READY / APPROVED
  ↓
Utilisateur consulte & modifie si nécessaire
  ↓
Utilisateur clique « Envoyer »
  ↓
Backend exécute le VERROU ATOMIQUE SQL :
UPDATE opportunities 
SET status = 'SENDING' 
WHERE id = $1 AND status IN ('READY', 'APPROVED') 
RETURNING id;
  ↓
0 ligne modifiée ? ➔ ABANDON IMMÉDIAT (déjà en cours d'envoi ou déjà envoyé)
1 ligne modifiée ? ➔ Poursuite vers Resend API
  ↓
Succès de l'API e-mail ?
 ┌──────────────┼──────────────┐
Oui         Erreur franche    Timeout ambigu
 ↓              ↓              ↓
SENT          READY       SEND_UNKNOWN
 ↓              ↓              ↓
sent_at     ERROR log     (Message ID / Idempotence à réconcilier)
```

**Distinction critique d'envoi :**
- **Erreur franche** (ex: 400 Bad Request, clé API invalide) : L'e-mail n'a pas été envoyé. Le système peut sans danger repasser l'opportunité au statut `READY` pour correction.
- **Timeout réseau ou coupure ambiguë** : La requête a pu atteindre le fournisseur (Resend) et être envoyée sans que notre serveur n'ait reçu la réponse 200. Le statut passe alors en **`SEND_UNKNOWN`** avec l'`idempotency_key` enregistrée. Le panel admin affiche une alerte permettant de vérifier l'état auprès du fournisseur avant toute nouvelle tentative pour garantir qu'aucun recruteur ne reçoive de doublon.

---

## 24. Relances

Les relances ne sont pas automatiques.

Le système calcule seulement les dates :

```text
follow_up_1_at
follow_up_2_at
follow_up_3_at
```

Exemple :

```text
Envoi
 ↓
J+3 → bouton « Relancer »
 ↓
J+7 → bouton « Relancer »
 ↓
J+14 → bouton « Relancer »
```

Le système ne doit jamais envoyer une relance sans validation humaine.

---

## 25. Protection contre les doublons

Avant de créer une opportunité :

```python
dedupe_key = build_dedupe_key(opportunity)

if exists(dedupe_key):
    skip()
else:
    insert()
```

La base garde également :

```sql
UNIQUE(dedupe_key)
```

La déduplication doit être faite à deux niveaux :

1. application ;
2. base de données.

Ainsi, une course entre deux exécutions ne crée pas deux opportunités identiques.

---

## 26. Concurrence entre deux runs

Deux exécutions du pipeline ne doivent pas tourner simultanément.

GitHub Actions doit utiliser une concurrence :

```yaml
concurrency:
  group: opportunity-engine
  cancel-in-progress: false
```

Ainsi :

```text
Run A en cours
     ↓
Run B arrive
     ↓
B attend
     ↓
A termine
     ↓
B démarre
```

Cela évite notamment :

- deux scrapes identiques ;
- deux insertions simultanées ;
- deux générations de message ;
- deux traitements de la même opportunité.

---

## 27. Données personnelles

Le système stocke potentiellement :

- noms ;
- fonctions ;
- adresses e-mail professionnelles ;
- URLs LinkedIn ;
- historique des contacts.

Il faut donc :

- ne collecter que les données nécessaires ;
- éviter les données personnelles sans rapport avec la prospection ;
- prévoir une durée de conservation raisonnable ;
- permettre la suppression des contacts ;
- éviter d'afficher inutilement les données sensibles dans les logs ;
- ne jamais enregistrer une clé API ou un mot de passe dans `payload`.

Les logs doivent notamment éviter :

```text
payload = {
    "authorization": "...",
    "api_key": "...",
    "password": "..."
}
```

---

## 28. Architecture des fichiers

Structure recommandée :

```text
opportunity-engine/
│
├── pipeline.py
├── requirements.txt
├── .env.example
│
├── config/
│   └── settings.py
│
├── database/
│   ├── connection.py
│   ├── models.py
│   └── migrations/
│
├── sources/
│   ├── base.py
│   ├── remotive.py
│   ├── jobicy.py
│   ├── weworkremotely.py
│   ├── himalayas.py
│   ├── remoteok.py
│   └── company_sites.py
│
├── services/
│   ├── scoring.py
│   ├── deduplication.py
│   ├── contacts.py
│   ├── messages.py
│   ├── email.py
│   └── alerts.py
│
├── templates/
│   └── application_email.txt
│
└── .github/
    └── workflows/
        └── opportunity-engine.yml
```

---

## 29. Tests obligatoires avant les vrais envois

Avant de connecter l'envoi réel :

### Test 1 — Backend

```text
/health → 200
/ready  → 200
```

### Test 2 — Base

```text
INSERT
SELECT
UPDATE
DELETE
```

### Test 3 — Déduplication

Injecter deux fois la même opportunité.

Résultat attendu :

```text
1 seule opportunité
```

### Test 4 — Source en panne

Simuler :

```text
source_A → erreur
source_B → succès
```

Résultat :

```text
source_A → ERROR
source_B → traité
pipeline → continue
```

### Test 5 — Gemini en panne

Résultat :

```text
Gemini → ERROR
DeepSeek → utilisé
```

### Test 6 — Gemini + DeepSeek en panne

Résultat :

```text
Template local → utilisé
pipeline → continue
```

### Test 7 — Base indisponible

Résultat :

```text
CRITICAL
→ alerte
→ run arrêté
```

### Test 8 — Double clic sur « Envoyer »

Résultat :

```text
1 seul e-mail envoyé
```

### Test 9 — Bounce

Résultat :

```text
verified = false
```

### Test 10 — Aucun résultat pendant plusieurs jours

Résultat :

```text
WARNING
→ alerte
```

---

## 30. Checklist finale pour Antigravity

### Phase 1 — Infrastructure

1. Utiliser **Neon PostgreSQL**, pas Supabase.
2. Configurer `NEON_DATABASE_URL`.
3. Ajouter `/health` au backend Render.
4. Ajouter `/ready` avec vérification PostgreSQL.
5. Vérifier l'authentification du panel admin.
6. Configurer les variables d'environnement.

### Phase 2 — Base de données

7. Créer les tables du §4.
8. Ajouter les index nécessaires.
9. Utiliser `dedupe_key` pour les doublons.
10. Ajouter les timestamps `created_at` / `updated_at`.

### Phase 3 — Pipeline

11. Créer les adaptateurs de sources.
12. Isoler les erreurs par source.
13. Implémenter le circuit breaker.
14. Implémenter le scoring.
15. Implémenter la recherche de contacts.
16. Implémenter la déduplication.
17. Implémenter Gemini → DeepSeek → template.
18. Enregistrer chaque étape dans `system_logs`.
19. Enregistrer chaque exécution dans `pipeline_runs`.

### Phase 4 — Alertes

20. Implémenter les alertes CRITICAL.
21. Implémenter l'alerte après désactivation d'une source.
22. Éviter les alertes répétitives.
23. Ajouter une alerte de récupération lorsque le problème est résolu.

### Phase 5 — Panel

24. Afficher les opportunités `READY`.
25. Afficher le score et ses critères.
26. Afficher le contact et son niveau de confiance.
27. Permettre la modification du message.
28. Permettre l'approbation.
29. Implémenter le bouton `Envoyer`.
30. Protéger la route d'envoi.
31. Ajouter une clé d'idempotence.
32. Afficher les relances disponibles.
33. Afficher les logs.
34. Afficher l'historique des runs.

### Phase 6 — CI

35. Configurer GitHub Actions.
36. Ajouter le health check périodique.
37. Ajouter les deux exécutions quotidiennes du pipeline.
38. Empêcher deux pipelines de tourner simultanément.
39. Tester manuellement le workflow.
40. Vérifier les quotas gratuits du compte utilisé.

### Phase 7 — Sécurité

41. Ne jamais exposer la connexion Neon.
42. Ne jamais exposer les clés API au frontend.
43. Ne jamais mettre de secrets dans les logs.
44. Ajouter des contrôles d'accès au panel.
45. Valider toutes les données reçues par l'API.
46. Respecter les conditions d'utilisation et les restrictions des sources.

### Phase 8 — Mise en production

47. Exécuter tous les tests du §29.
48. Utiliser d'abord une adresse e-mail de test.
49. Vérifier le comportement en cas d'échec.
50. Activer les vrais envois uniquement après validation.

---

## 31. Principe final

Le système doit fonctionner selon cette logique :

```text
                  ┌────────────────────┐
                  │ GitHub Actions Cron│
                  └─────────┬──────────┘
                            │
                            ▼
                    Health / Readiness
                            │
                    ┌───────┴───────┐
                    │               │
                  OK               KO
                    │               │
                    ▼               ▼
                Pipeline          Alerte
                    │              STOP
                    ▼
             Collecte des sources
                    │
                    ▼
               Déduplication
                    │
                    ▼
                 Scoring
                    │
                    ▼
           Recherche de contact
                    │
                    ▼
        Gemini → DeepSeek → Template
                    │
                    ▼
                PostgreSQL
                    │
                    ▼
             Panel administratif
                    │
                    ▼
             Validation humaine
                    │
                    ▼
                  ENVOI
                    │
                    ▼
                 SUIVI
                    │
                    ▼
          Relance proposée à l'utilisateur
```

### Règle absolue

> **L'automatisation peut chercher, analyser, classer, préparer et surveiller. Elle ne doit jamais envoyer une candidature sans validation humaine explicite.**
