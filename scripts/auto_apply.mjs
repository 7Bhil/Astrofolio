import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROSPECTS_PATH = path.join(__dirname, '../src/data/prospects.json');
const ROOT_DIR = path.join(__dirname, '../..');

// Lecture des variables d'environnement
const GMAIL_USER = process.env.GMAIL_USER || '7bhilal.chitou7@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const MAX_EMAILS_PER_RUN = parseInt(process.env.MAX_EMAILS || '3', 10);

if (!GMAIL_APP_PASSWORD) {
  console.error('❌ Variable GMAIL_APP_PASSWORD manquante. Arrêt.');
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 Démarrage du script de prospection stage remote (GitHub Actions)...');
  
  if (!fs.existsSync(PROSPECTS_PATH)) {
    console.error('❌ Fichier prospects.json introuvable.');
    process.exit(1);
  }

  const prospects = JSON.parse(fs.readFileSync(PROSPECTS_PATH, 'utf-8'));
  const pending = prospects.filter((p) => p.status === 'READY' && p.recipient && p.recipient.includes('@'));

  if (pending.length === 0) {
    console.log('ℹ️ Aucune entreprise avec statut READY à contacter aujourd\'hui.');
    return;
  }

  const toSend = pending.slice(0, MAX_EMAILS_PER_RUN);
  console.log(`📋 ${toSend.length} entreprise(s) sélectionnée(s) pour cet envoi.`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD.replace(/\s+/g, '')
    }
  });

  await transporter.verify();
  console.log('✅ Connexion SMTP validée avec succès.');

  let sentCount = 0;

  for (const prospect of toSend) {
    console.log(`\n📨 Préparation pour : ${prospect.name} (${prospect.recipient})...`);

    const isFrench = prospect.country.toLowerCase().includes('bénin') || 
                     prospect.country.toLowerCase().includes('france') || 
                     prospect.country.toLowerCase().includes('maurice');

    const subject = isFrench
      ? `Candidature Stage Développeur Full-Stack Remote — Bhilal CHITOU`
      : `Remote Full-Stack Developer Internship Application — Bhilal CHITOU`;

    const cvFilename = isFrench ? 'CV_CHITOU_Bhilal_FR.pdf' : 'CV_CHITOU_Bhilal_EN.pdf';
    const cvPath = path.join(ROOT_DIR, cvFilename);

    const emailBody = isFrench
      ? `Bonjour l'équipe ${prospect.name},

Je me permets de vous adresser ma candidature pour un stage en développement Full-Stack en télétravail.

Je viens d'obtenir ma Licence en Informatique de Gestion à l'Institut Universitaire de Technologie (IUT) de Parakou au Bénin (juillet 2026). Passionné par le développement web et les systèmes, j'ai développé en autodidacte plusieurs projets personnels pour mettre en pratique mes compétences et consolider mes bases :

• Vitch : une application de portefeuille numérique explorant les problématiques de faible latence et d'intégrité transactionnelle (NestJS, Next.js, PostgreSQL).
• Bhilal Programming Language : un compilateur bilingue orienté objet développé en Go pour approfondir l'analyse syntaxique et la théorie des langages.
• GoRéparr : une marketplace conçue en PWA avec gestion du mode hors-ligne pour les zones à connectivité instable (Laravel, React, Service Workers).

Je recherche aujourd'hui un stage pour confronter ma pratique au travail en équipe, apprendre auprès de développeurs confirmés et apporter ma motivation et ma rigueur sur vos projets.

Votre travail chez ${prospect.name} m'intéresse particulièrement : ${prospect.whyFit || 'votre approche technique et vos défis de scalabilité.'}

Je suis autonome, habitué à collaborer à distance avec Git, et disponible immédiatement sur le fuseau UTC+1 (Bénin).

Vous pouvez consulter mon code et mon parcours :
• Portfolio : https://7bhil.vercel.app
• GitHub : https://github.com/7Bhil
• LinkedIn : https://linkedin.com/in/bhilal-chitou

Je joins mon CV à ce message et serais très heureux d'échanger avec vous si mon profil peut correspondre à vos besoins.

Bien cordialement,
Bhilal CHITOU
7bhilal.chitou7@gmail.com`
      : `Dear ${prospect.name} Team,

I am writing to express my strong interest in a remote Full-Stack Developer internship with your team.

I recently graduated with a Bachelor's degree in Computer Science (Licence en Informatique de Gestion) from the University Institute of Technology (IUT) of Parakou, Benin (July 2026). Passionate about software engineering, I have built several personal projects to challenge myself and deepen my technical understanding:

• Vitch: A digital wallet project exploring sub-200ms transaction responses and strict transactional ledgers (NestJS, Next.js, PostgreSQL).
• Bhilal Programming Language: A bilingual object-oriented language compiler built from scratch in Go to study AST parsing and compiler design.
• GoRéparr: An offline-first PWA marketplace designed for low-connectivity environments (Laravel, React, Service Workers).

My goal today is to gain real-world team experience, learn alongside experienced developers, and contribute with energy, humility, and dedication to your sprints.

I have been following ${prospect.name} with great enthusiasm: ${prospect.whyFit || 'your tech stack and product focus align closely with what I am eager to contribute to.'}

Autonomous, disciplined with Git and remote collaboration, and operating on UTC+1 (West Africa Time), I am available immediately.

You can review my projects and code:
• Portfolio: https://7bhil.vercel.app
• GitHub: https://github.com/7Bhil
• LinkedIn: https://linkedin.com/in/bhilal-chitou

I have attached my resume to this email and would welcome the opportunity to connect.

Best regards,
Bhilal CHITOU
7bhilal.chitou7@gmail.com`;

    const attachments = fs.existsSync(cvPath)
      ? [{ filename: cvFilename, path: cvPath }]
      : [];

    try {
      const info = await transporter.sendMail({
        from: `"Bhilal CHITOU" <${GMAIL_USER}>`,
        to: prospect.recipient,
        subject,
        text: emailBody,
        attachments
      });

      console.log(`✅ Envoyé à ${prospect.name} (${info.messageId})`);
      prospect.status = 'SENT';
      prospect.sentDate = new Date().toISOString();
      sentCount++;

      // Anti-spam jitter : pause de 45 à 90 secondes entre chaque envoi
      if (sentCount < toSend.length) {
        const delaySeconds = Math.floor(Math.random() * 45) + 45;
        console.log(`⏳ Pause anti-spam de ${delaySeconds} secondes avant le prochain envoi...`);
        await sleep(delaySeconds * 1000);
      }
    } catch (err) {
      console.error(`❌ Échec pour ${prospect.name} :`, err.message);
    }
  }

  // Sauvegarde des statuts mis à jour
  fs.writeFileSync(PROSPECTS_PATH, JSON.stringify(prospects, null, 2), 'utf-8');
  console.log(`\n🎉 Session terminée : ${sentCount} email(s) envoyé(s). Base prospects.json mise à jour.`);
}

main().catch((err) => {
  console.error('❌ Erreur critique :', err);
  process.exit(1);
});
