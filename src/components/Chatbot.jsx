import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, X, Bot, User, CornerDownLeft, 
  RefreshCw, ArrowRight
} from 'lucide-react';
import '../styles/Chatbot.css';

const AI_DATA = {
  fr: {
    badge: "7Bhil AI v2.4",
    modelName: "Bhilal-GPT (Conseiller Technique & Projets)",
    status: "En ligne",
    placeholder: "Posez votre question ou détaillez votre besoin...",
    quickPrompts: [
      { label: "Discuter sur WhatsApp", query: "Je veux échanger directement sur WhatsApp" },
      { label: "Estimer un projet", query: "Je souhaite estimer ou lancer un projet" },
      { label: "Pourquoi choisir Bhilal ?", query: "Quels sont tes atouts et garanties ?" },
      { label: "Méthodologie & Délais", query: "Quels sont tes délais et ta méthode de travail ?" },
      { label: "Stack technique", query: "Quelle est ta stack Full-Stack principale ?" },
      { label: "Tarifs & Modalités", query: "Comment fonctionnent tes collaborations et tarifs ?" }
    ],
    welcomeMessage: "Bonjour. Je suis l'assistant technique de **Bhilal CHITOU** (Ingénieur Logiciel Full-Stack & Mobile).\n\nMon rôle est de comprendre votre besoin et de faciliter la concrétisation de votre projet :\n- **Échange immédiat :** Discussion directe avec Bhilal sur WhatsApp pour cadrer votre idée.\n- **Estimation sur-mesure :** Définition du périmètre, du budget et des délais de livraison.\n- **Expertise & Garanties :** Architecture robuste, sécurité bancaire/OWASP et support post-livraison inclus.\n\nQuel projet souhaitez-vous concrétiser ?",
    briefFlow: {
      steps: [
        {
          id: 'projectType',
          botQuestion: "Quel type de solution souhaitez-vous concevoir ?",
          options: ["Application Web (SaaS / Plateforme métier)", "Application Mobile (iOS / Android)", "Système Fintech / Paiement & API", "Audit, Sécurité & Optimisation", "Solution logicielle sur-mesure"]
        },
        {
          id: 'objective',
          botQuestion: "Quel est l'objectif prioritaire de votre initiative ?",
          options: ["Lancer rapidement un MVP pour tester le marché", "Automatiser des processus et gagner en productivité", "Refondre un système existant devenu lent ou obsolète", "Déployer une infrastructure hautement sécurisée et scalable"]
        },
        {
          id: 'timeline',
          botQuestion: "Sous quel délai souhaitez-vous voir la solution opérationnelle ?",
          options: ["Livraison prioritaire (moins de 3 semaines)", "1 à 2 mois", "3 mois ou plus", "À définir selon la feuille de route technique"]
        },
        {
          id: 'budget',
          botQuestion: "Quelle enveloppe budgétaire indicative prévoyez-vous pour ce projet ?",
          options: ["500 000 à 1 500 000 FCFA / 800 à 2 300 EUR", "1 500 000 à 3 500 000 FCFA / 2 300 à 5 300 EUR", "Plus de 3 500 000 FCFA / 5 300 EUR et plus", "À affiner après cadrage technique avec Bhilal"]
        },
        {
          id: 'contactInfo',
          botQuestion: "Afin que Bhilal puisse vous transmettre une proposition technique sous 24h ou vous contacter immédiatement, veuillez renseigner votre **Nom & Numéro WhatsApp** (ou Email) :",
          inputPrompt: "Nom, numéro WhatsApp ou adresse email..."
        }
      ],
      successMessage: "**Votre demande a été enregistrée avec succès.**\n\nBhilal analyse vos informations et vous transmettra une proposition technique et financière structurée sous 24h.\n\nPour accélérer le lancement et obtenir des réponses immédiates à vos questions, contactez-le sans attendre sur [WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20je%20viens%20de%20d%C3%A9poser%20un%20brief%20sur%20ton%20portfolio%20et%20je%20souhaite%20en%20discuter.)."
    },
    responses: {
      whatsapp: `Le canal le plus rapide pour échanger directement avec Bhilal est WhatsApp :
- **Réponse garantie en moins de 2 heures.**
- **Analyse directe de votre idée ou cahier des charges.**
- **Validation gratuite de faisabilité technique.**

[Ouvrir la discussion sur WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20je%20souhaite%20discuter%20d%27un%20projet%20avec%20toi.) (Numéro : +229 01 44 24 29 64).`,

      why_bhilal: `Collaborer avec Bhilal CHITOU vous garantit un niveau d'exigence élevé :
- **Vision Produit & Business :** Le code produit doit servir vos objectifs de rentabilité, d'acquisition et de fidélisation.
- **Sécurité et robustesse :** Protection systématique contre les failles OWASP, chiffrement des données sensibles et conformité aux standards fintech.
- **Transparence absolue :** Suivi par étapes, démonstrations régulières et respect rigoureux du calendrier convenu.
- **Garantie incluse :** 30 jours de support et maintenance corrective offerts après la mise en production.

Avez-vous un projet à lui soumettre ? Vous pouvez lui écrire directement sur [WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20je%20souhaite%20te%20pr%C3%A9senter%20mon%20projet.) pour en parler de vive voix.`,

      process: `La méthodologie appliquée assure une livraison sereine, sans mauvaise surprise :
1. **Cadrage & Audit (24h à 48h) :** Définition précise des fonctionnalités, de la faisabilité et validation d'un devis clair.
2. **Conception & Architecture :** Modélisation de la base de données, choix de la stack adaptée et maquettage.
3. **Développement itératif :** Sprints courts avec démonstrations intermédiaires pour valider chaque brique en conditions réelles.
4. **Recette & Déploiement sécurisé :** Tests d'intégration, mise en ligne sur infrastructure cloud (Docker, VPS, Vercel).
5. **Accompagnement post-lancement :** Formation à la prise en main et garantie de support technique.

Pour planifier un premier point de cadrage sans engagement, écrivez à Bhilal sur [WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20je%20souhaite%20planifier%20un%20cadrage%20pour%20mon%20projet.).`,

      stack: `Voici le socle technique utilisé en production, sélectionné pour sa rapidité et sa pérennité :
- **Frontend & Web :** TypeScript, React, Next.js, Astro, Tailwind CSS (interfaces fluides et optimisées SEO).
- **Backend & APIs :** Node.js, NestJS, Express, Python (Django), PHP (Laravel) (microservices et architectures modulaires).
- **Mobile :** React Native, Expo (applications iOS et Android natives avec gestion offline-first).
- **Bases de données & Cloud :** PostgreSQL, MongoDB, Docker, Linux, CI/CD automatisé.
- **Qualité :** Clean Architecture, typage strict et performances maximales.

Vous souhaitez savoir si cette stack convient à votre projet ? Demandez l'avis de Bhilal sur [WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20j%27aimerais%20avoir%20ton%20avis%20technique%20sur%20mon%20projet.).`,
      
      bhilal_lang: `Le **langage Bhilal (v1.2.0)** est un compilateur conçu et développé par Bhilal CHITOU, illustrant une expertise poussée en ingénierie logicielle :
- **Architecture de compilation :** Analyse lexicale, parsing avec génération d'arbre syntaxique abstrait (AST) et transcompilation vers JavaScript.
- **Fonctionnalités avancées :** Syntaxe bilingue (Français/Anglais), gestion native des exceptions et utilitaires de diagnostic réseau.
- **Preuve de compétence :** Ce travail démontre une compréhension intime des mécanismes profonds des langages et de l'optimisation mémoire.

Pour échanger sur des défis d'ingénierie avancée, retrouvez Bhilal sur [WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20j%27ai%20d%C3%A9couvert%20ton%20langage%20et%20je%20souhaite%20%C3%A9changer%20avec%20toi.).`,
      
      architecture: `La conception technique est pensée pour protéger vos investissements dans la durée :
- **Security by Design :** Application stricte des recommandations OWASP, contrôle d'accès granulaire (RBAC), tokens JWT sécurisés et chiffrement fort.
- **Haute performance :** Indexation optimisée PostgreSQL, requêtes allégées, mise en cache et temps de réponse ultra-rapides.
- **Évolutivité garantie :** Découpage en couches découplées permettant d'ajouter des fonctionnalités futures sans refonte coûteuse.

Besoin d'un audit de sécurité ou d'une validation d'architecture ? Échangez directement avec Bhilal sur [WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20j%27ai%20besoin%20d%27un%20audit%20ou%20d%27un%20conseil%20en%20architecture.).`,

      pricing: `Les interventions sont adaptées à la nature de chaque projet :
- **Au forfait (Projets délimités) :** Cahier des charges clair, devis transparent sans dépassement, paiement échelonné par jalons validés.
- **En régie / Accompagnement technique :** Facturation au sprint ou forfait mensuel pour les besoins continus.
- **Sécurité financière :** Le solde final n'est réglé qu'après validation complète et mise en production.

Pour recevoir une estimation financière précise adaptée à votre besoin sous 24h, contactez Bhilal sur [WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20j%27aimerais%20conna%C3%AEtre%20tes%20tarifs%20pour%20mon%20projet.) ou lancez l'estimation interactive.`,
      
      contact: `Voici les coordonnées directes pour joindre Bhilal CHITOU :
- **WhatsApp (Recommandé - Réponse immédiate) :** [Démarrer une conversation sur WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20je%20souhaite%20discuter%20d%27un%20projet.) (+229 01 44 24 29 64)
- **Email professionnel :** \`7bhilal.chitou7@gmail.com\`
- **LinkedIn :** [linkedin.com/in/bhilal-chitou](https://www.linkedin.com/in/bhilal-chitou/)
- **GitHub :** [github.com/7Bhil](https://github.com/7Bhil/)

Le canal WhatsApp reste le moyen le plus efficace pour obtenir un devis ou un créneau d'appel rapidement.`,
      
      fallback: `Je peux vous orienter précisément sur la faisabilité technique de votre projet (Web SaaS, Application Mobile, Paiement en ligne, Architecture sécurisée) ou vous mettre en relation avec Bhilal.

Le plus simple est d'en discuter directement avec lui sur [WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20je%20viens%20de%20d%C3%A9couvrir%20ton%20portfolio%20et%20j%27ai%20une%20question%20sur%20mon%20projet.) ou de cliquer sur **"Estimer un projet"** pour formaliser votre besoin.`
    }
  },
  en: {
    badge: "7Bhil AI v2.4",
    modelName: "Bhilal-GPT (Technical Advisor & Project Agent)",
    status: "Online",
    placeholder: "Ask a question or explain your requirements...",
    quickPrompts: [
      { label: "Chat on WhatsApp", query: "I want to chat directly on WhatsApp" },
      { label: "Scope a project", query: "I want to scope or build a project" },
      { label: "Why choose Bhilal?", query: "What are your core strengths and guarantees?" },
      { label: "Process & Timeline", query: "What is your development timeline and workflow?" },
      { label: "Tech Stack", query: "What is your core Full-Stack stack?" },
      { label: "Pricing & Models", query: "How do your pricing and contracts work?" }
    ],
    welcomeMessage: "Hello. I am the technical advisor for **Bhilal CHITOU** (Full-Stack & Mobile Software Engineer).\n\nMy role is to understand your business goals and ensure the successful delivery of your platform:\n- **Direct contact:** Instant discussion with Bhilal on WhatsApp to review your requirements.\n- **Custom estimation:** Clear definition of scope, timeline, and investment range.\n- **Engineering standards:** Resilient architecture, OWASP security standards, and 30-day post-launch support.\n\nWhat kind of solution do you plan to build?",
    briefFlow: {
      steps: [
        {
          id: 'projectType',
          botQuestion: "What type of software solution do you plan to build?",
          options: ["Web Application (SaaS / Business platform)", "Mobile Application (iOS / Android)", "Fintech / Payment & Custom API", "Security Audit & Performance Optimization", "Custom Engineering Solution"]
        },
        {
          id: 'objective',
          botQuestion: "What is the main objective of this initiative?",
          options: ["Launch a fast MVP to test product-market fit", "Automate business operations and scale efficiency", "Modernize an existing legacy system", "Deploy a high-security and scalable infrastructure"]
        },
        {
          id: 'timeline',
          botQuestion: "What is your expected target delivery timeline?",
          options: ["Priority delivery (less than 3 weeks)", "1 to 2 months", "3 months or more", "To be determined during technical scoping"]
        },
        {
          id: 'budget',
          botQuestion: "What is your indicative investment budget for this project?",
          options: ["1,000 to 2,500 USD", "2,500 to 5,000 USD", "5,000 USD and above", "To be defined after technical scoping with Bhilal"]
        },
        {
          id: 'contactInfo',
          botQuestion: "To receive a detailed technical roadmap within 24h, please share your **Name & WhatsApp number** (or Email):",
          inputPrompt: "Name, WhatsApp number or email address..."
        }
      ],
      successMessage: "**Your project brief has been recorded successfully.**\n\nBhilal will review your specifications and get back to you within 24 hours with an actionable roadmap.\n\nFor an immediate discussion and faster delivery, message him directly on [WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20just%20submitted%20a%20project%20brief%20on%20your%20portfolio%20and%20would%20like%20to%20discuss.)."
    },
    responses: {
      whatsapp: `The fastest way to consult directly with Bhilal is via WhatsApp:
- **Guaranteed response within 2 hours.**
- **Immediate technical review of your requirements.**
- **Free initial feasibility check.**

[Open conversation on WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.) (Direct phone: +229 01 44 24 29 64).`,

      why_bhilal: `Working with Bhilal CHITOU guarantees high engineering rigor:
- **Product & Business focus:** Clean code designed to drive user retention and revenue.
- **Enterprise-grade security:** Strict compliance with OWASP standards, data encryption, and robust auth flows.
- **Transparent milestones:** Iterative progress, live demos, and strict adherence to deadlines.
- **Post-delivery warranty:** 30 days of complimentary support and maintenance after deployment.

Would you like to discuss your idea? Connect with Bhilal on [WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20would%20like%20to%20present%20my%20project.) to get started.`,

      process: `The engineering methodology guarantees predictable, high-standard deliveries:
1. **Scoping & Technical Audit (24h to 48h):** Clear specification definition, architecture plan, and transparent quote.
2. **System Architecture & Design:** Schema modeling, selected stack validation, and interface prototyping.
3. **Iterative Sprints:** Short development iterations with testable demos for continuous client validation.
4. **Testing & Secure Deployment:** CI/CD pipeline automation, containerization with Docker, and cloud rollout.
5. **Handover & Warranty:** Comprehensive documentation, admin training, and 30 days of active warranty.

To schedule an initial project scoping call, contact Bhilal on [WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20would%20like%20to%20schedule%20a%20scoping%20session.).`,

      stack: `Core production technologies selected for stability and scale:
- **Frontend & Web:** TypeScript, React, Next.js, Astro, Tailwind CSS (SEO-optimized, responsive interfaces).
- **Backend & APIs:** Node.js, NestJS, Express, Python (Django), PHP (Laravel) (modular, scalable architectures).
- **Mobile:** React Native, Expo (native iOS and Android applications with offline-first capabilities).
- **Databases & Cloud:** PostgreSQL, MongoDB, Docker, Linux, automated CI/CD pipelines.
- **Standard:** Clean Architecture, strict typing, and high reliability.

Wondering if this stack fits your needs? Consult Bhilal directly on [WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20would%20like%20your%20technical%20advice%20on%20a%20stack%20choice.).`,
      
      bhilal_lang: `The **Bhilal Language (v1.2.0)** is an engineering endeavor demonstrating compiler design and deep software architecture:
- **Core Architecture:** Lexical analysis, parsing with abstract syntax tree (AST) construction, and JavaScript code emission.
- **Capabilities:** Bilingual syntax (French/English), structured exception handling, and network diagnostic routines.
- **Engineering proof:** Confirms comprehensive mastery of language internals, runtime behaviors, and performance optimization.

To discuss advanced software engineering, contact Bhilal on [WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20reviewed%20your%20custom%20language%20and%20would%20like%20to%20connect.).`,
      
      architecture: `System engineering focused on protecting long-term capital investments:
- **Security by Design:** OWASP standards, role-based access control (RBAC), signed JWT sessions, and cryptographic safeguards.
- **High throughput:** PostgreSQL query optimization, caching strategies, and ultra-fast response latency.
- **Scalable architecture:** Decoupled service layers enabling painless expansion without requiring structural rewrites.

Need an architectural review or security audit? Reach out on [WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20need%20an%20architecture%20review%20or%20audit.).`,

      pricing: `Transparent engagement models aligned with project goals:
- **Fixed-price delivery:** Well-defined scope, itemized quote, zero hidden costs, milestone payments.
- **Time & materials / Retainer:** Sprint-based or monthly dedicated engineering capacity.
- **Security:** Final payment triggered only after formal acceptance and deployment.

To receive an accurate cost and timeline estimate within 24 hours, contact Bhilal on [WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20would%20like%20a%20pricing%20estimate%20for%20my%20project.) or initiate the interactive scoping brief.`,
      
      contact: `Direct channels to connect with Bhilal CHITOU:
- **WhatsApp (Recommended - Fastest response):** [Start WhatsApp Conversation](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20would%20like%20to%20discuss%20a%20project.) (+229 01 44 24 29 64)
- **Direct Email:** \`7bhilal.chitou7@gmail.com\`
- **LinkedIn:** [linkedin.com/in/bhilal-chitou](https://www.linkedin.com/in/bhilal-chitou/)
- **GitHub:** [github.com/7Bhil](https://github.com/7Bhil/)

WhatsApp provides the fastest path to book an initial scoping call or review requirements.`,
      
      fallback: `I can assist you with evaluating your project requirements (Web SaaS, Mobile App, Payment Systems, Scalable Cloud) or connect you directly with Bhilal.

The most effective step is to chat directly with him on [WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20have%20a%20project%20question%20from%20your%20portfolio.) or click **"Scope a project"** to start the questionnaire.`
    }
  }
};

const API_BASE = import.meta.env.PUBLIC_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5005/api'
    : 'https://portfolio-backend-7bhil.onrender.com/api'
);

const Chatbot = ({ lang = 'fr', standalone = false }) => {
  const [isOpen, setIsOpen] = useState(standalone);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  
  // Qualification brief state machine
  const [briefMode, setBriefMode] = useState(false);
  const [briefStep, setBriefStep] = useState(0);
  const [briefData, setBriefData] = useState({
    projectType: '',
    timeline: '',
    budget: '',
    contactInfo: ''
  });

  const messagesEndRef = useRef(null);
  const t = AI_DATA[lang] || AI_DATA['fr'];

  useEffect(() => {
    resetChat();
  }, [lang]);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, briefStep]);

  const resetChat = () => {
    setBriefMode(false);
    setBriefStep(0);
    setBriefData({ projectType: '', timeline: '', budget: '', contactInfo: '' });
    setMessages([
      { id: 'msg-init', role: 'assistant', text: t.welcomeMessage, time: new Date() }
    ]);
  };

  const startBriefFlow = () => {
    setBriefMode(true);
    setBriefStep(0);
    const firstStep = t.briefFlow.steps[0];
    setMessages(prev => [
      ...prev,
      {
        id: `bot-brief-start-${Date.now()}`,
        role: 'assistant',
        text: firstStep.botQuestion,
        options: firstStep.options,
        stepId: firstStep.id,
        time: new Date()
      }
    ]);
  };

  const submitBriefToBackend = async (completedBrief) => {
    try {
      const whatsappMsg = `Bonjour Bhilal,\n\nVoici mon brief de projet qualifié via votre Console IA :\n\n- Type de projet : ${completedBrief.projectType}\n- Délai envisagé : ${completedBrief.timeline}\n- Budget indicatif : ${completedBrief.budget}\n- Contact : ${completedBrief.contactInfo}`;
      const waUrl = `https://wa.me/2290144242964?text=${encodeURIComponent(whatsappMsg)}`;
      
      // Ouvre WhatsApp avec le brief complet
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 500);
    } catch (err) {
      console.warn("WhatsApp redirection error:", err);
    }
  };

  const handleBriefAnswer = (answerText) => {
    const currentStepConfig = t.briefFlow.steps[briefStep];
    setBriefData(prev => ({ ...prev, [currentStepConfig.id]: answerText }));

    // Add user message
    setMessages(prev => [
      ...prev,
      { id: `usr-${Date.now()}`, role: 'user', text: answerText, time: new Date() }
    ]);

    const nextStepIndex = briefStep + 1;

    if (nextStepIndex < t.briefFlow.steps.length) {
      setBriefStep(nextStepIndex);
      setIsTyping(true);

      setTimeout(() => {
        const nextStepConfig = t.briefFlow.steps[nextStepIndex];
        setMessages(prev => [
          ...prev,
          {
            id: `bot-step-${nextStepIndex}-${Date.now()}`,
            role: 'assistant',
            text: nextStepConfig.botQuestion,
            options: nextStepConfig.options || null,
            stepId: nextStepConfig.id,
            time: new Date()
          }
        ]);
        setIsTyping(false);
      }, 400);
    } else {
      // Flow completed
      setBriefMode(false);
      setIsTyping(true);
      submitBriefToBackend({ ...briefData, [currentStepConfig.id]: answerText });

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `bot-success-${Date.now()}`,
            role: 'assistant',
            text: t.briefFlow.successMessage,
            time: new Date()
          }
        ]);
        setIsTyping(false);
      }, 500);
    }
  };

  const matchAnswer = (query) => {
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    if (q.includes("whatsapp") || q.includes("telephone") || q.includes("appel") || q.includes("phone") || q.includes("call") || q.includes("discuter direct") || q.includes("chat direct") || q.includes("parler direct") || q.includes("numero")) {
      return t.responses.whatsapp;
    }
    if (q.includes("projet") || q.includes("estimer") || q.includes("lancer") || q.includes("devis") || q.includes("besoin") || q.includes("start") || q.includes("scope") || q.includes("cahier des charges") || q.includes("brief") || q.includes("creer") || q.includes("developper") || q.includes("application") || q.includes("site") || q.includes("plateforme")) {
      return "START_BRIEF";
    }
    if (q.includes("pourquoi") || q.includes("choisir") || q.includes("atout") || q.includes("avantage") || q.includes("garantie") || q.includes("fiab") || q.includes("why") || q.includes("strength") || q.includes("trust") || q.includes("valeur") || q.includes("serieux")) {
      return t.responses.why_bhilal;
    }
    if (q.includes("delai") || q.includes("temps") || q.includes("combien de temps") || q.includes("methode") || q.includes("process") || q.includes("etape") || q.includes("timeline") || q.includes("workflow") || q.includes("duree") || q.includes("planning") || q.includes("organisation")) {
      return t.responses.process;
    }
    if (q.includes("tarif") || q.includes("prix") || q.includes("combien") || q.includes("modalite") || q.includes("price") || q.includes("pricing") || q.includes("cost") || q.includes("rate") || q.includes("budget") || q.includes("factur") || q.includes("paiement")) {
      return t.responses.pricing;
    }
    if (q.includes("stack") || q.includes("techno") || q.includes("react") || q.includes("nestjs") || q.includes("nest") || q.includes("django") || q.includes("competence") || q.includes("skill") || q.includes("outil") || q.includes("node") || q.includes("python") || q.includes("mobile")) {
      return t.responses.stack;
    }
    if (q.includes("bhilal") || q.includes("langage") || q.includes("language") || q.includes("compilateur") || q.includes("ast") || q.includes("code")) {
      return t.responses.bhilal_lang;
    }
    if (q.includes("securite") || q.includes("security") || q.includes("architecture") || q.includes("owasp") || q.includes("systeme") || q.includes("docker") || q.includes("linux") || q.includes("faille") || q.includes("audit")) {
      return t.responses.architecture;
    }
    if (q.includes("contact") || q.includes("email") || q.includes("mail") || q.includes("embaucher") || q.includes("collabor") || q.includes("hire") || q.includes("travailler") || q.includes("joindre") || q.includes("disponible") || q.includes("disponibilite") || q.includes("coordonnee")) {
      return t.responses.contact;
    }
    return t.responses.fallback;
  };

  const handleSend = async (textToSend) => {
    const userPrompt = (textToSend || inputValue).trim();
    if (!userPrompt || isTyping) return;

    if (briefMode) {
      setInputValue('');
      handleBriefAnswer(userPrompt);
      return;
    }

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userPrompt,
      time: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Appel direct à l'API IA de ton backend (propulsée par Gemini 3.6 Flash)
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, text: m.text })),
          lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: data.reply,
            time: new Date()
          }
        ]);
      } else {
        // En cas de coupure réseau ou quota dépassé, repli élégant
        const fallbackText = matchAnswer(userPrompt);
        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'assistant',
            text: fallbackText === 'START_BRIEF' ? t.responses.pricing : fallbackText,
            time: new Date()
          }
        ]);
      }
    } catch (err) {
      console.warn("API chat unreachable, using local fallback:", err);
      const fallbackText = matchAnswer(userPrompt);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          text: fallbackText === 'START_BRIEF' ? t.responses.pricing : fallbackText,
          time: new Date()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (text) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n- /g, '<br/>• ')
      .replace(/\n/g, '<br/>');
    return formatted;
  };

  const aiPageUrl = lang === 'fr' ? '/ai' : '/en/ai';

  // Si on est en mode bouton flottant sur les autres pages, le clic redirige directement vers la page dédiée
  if (!standalone) {
    return (
      <div className="ai-interface-container">
        <a 
          href={aiPageUrl}
          className="ai-launcher-btn"
          aria-label="Accéder à la Console IA"
        >
          <div className="ai-launcher-inner">
            <Sparkles size={18} className="ai-sparkle-icon" />
            <span className="ai-launcher-label">{t.badge}</span>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="ai-interface-container standalone-mode">
      <div className="ai-terminal-window standalone is-open">
        
        {/* Top Header bar like ChatGPT / Anthropic console */}
        <div className="ai-header-bar">
          <div className="ai-model-spec">
            <div className="ai-model-icon">
              <Bot size={18} />
            </div>
            <div className="ai-model-meta">
              <span className="ai-model-title">{t.modelName}</span>
              <span className="ai-model-status">
                <span className="ai-status-pulse"></span> {t.status}
              </span>
            </div>
          </div>

          <div className="ai-header-actions">
            <button 
              className="ai-action-btn"
              onClick={() => resetChat()}
              title="Réinitialiser la session"
            >
              <RefreshCw size={14} />
            </button>
            {!standalone && (
              <button 
                className="ai-action-btn"
                onClick={() => setIsOpen(false)}
                title="Fermer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Conversation stream */}
        <div className="ai-messages-stream">
          {messages.map((msg, index) => {
            const isLastAssistantMessage = msg.role === 'assistant' && index === messages.length - 1;
            return (
              <div key={msg.id} className={`ai-stream-row ${msg.role}`}>
                <div className="ai-msg-avatar">
                  {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="ai-msg-bubble">
                  <div 
                    className="ai-msg-body"
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                  />
                  {msg.options && msg.options.length > 0 && (
                    <div className="ai-step-options">
                      {msg.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          className="ai-step-option-btn"
                          onClick={() => handleBriefAnswer(opt)}
                          disabled={isTyping || !isLastAssistantMessage || !briefMode}
                        >
                          <span>{opt}</span>
                          <ArrowRight size={13} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="ai-stream-row assistant">
              <div className="ai-msg-avatar">
                <Bot size={16} />
              </div>
              <div className="ai-msg-bubble ai-typing-bubble">
                <div className="ai-typing-glow">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="ai-quick-prompts">
          {t.quickPrompts.map((item, idx) => (
            <button 
              key={idx}
              className="ai-prompt-pill"
              onClick={() => handleSend(item.query)}
              disabled={isTyping}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Modern Prompt Input */}
        <form 
          className="ai-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <div className="ai-input-box">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.placeholder}
              className="ai-text-field"
            />
            <button 
              type="submit" 
              className="ai-send-btn"
              disabled={!inputValue.trim() || isTyping}
              aria-label="Envoyer"
            >
              <CornerDownLeft size={16} />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Chatbot;
