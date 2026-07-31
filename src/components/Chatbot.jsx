import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Phone, Mail, 
  Briefcase, CreditCard, Code2, GraduationCap 
} from 'lucide-react';
import '../styles/Chatbot.css';

// Lucide Icon mapper for suggestions
const IconMap = {
  Briefcase: Briefcase,
  Phone: Phone,
  CreditCard: CreditCard,
  Code2: Code2,
  GraduationCap: GraduationCap
};

const renderSuggestionIcon = (iconName, size = 14) => {
  const IconComponent = IconMap[iconName];
  return IconComponent ? <IconComponent size={size} /> : null;
};

// Bot Data & Responses
const BOT_DATA = {
  fr: {
    title: "Assistant Virtuel",
    subtitle: "En ligne · Répond instantanément",
    placeholder: "Écrivez votre message...",
    launcherAria: "Ouvrir l'assistant de chat",
    closeAria: "Fermer l'assistant de chat",
    welcome: "Bonjour. Je suis l'assistant virtuel de Bhilal. Comment puis-je vous aider aujourd'hui ?",
    suggestions: [
      { label: "Services & Offres", value: "services", icon: "Briefcase" },
      { label: "Me contacter", value: "contact", icon: "Phone" },
      { label: "Tarifs & Devis", value: "tarifs", icon: "CreditCard" },
      { label: "Projets notables", value: "projets", icon: "Code2" },
      { label: "Parcours & Compétences", value: "parcours", icon: "GraduationCap" }
    ],
    responses: {
      services: `Bhilal est spécialiste en **Fintech et Sécurité**. Il conçoit des solutions robustes pour automatiser et sécuriser vos activités :\n\n- **Fintech & Paiement** : Intégration de passerelles de paiement, portefeuilles électroniques (ex: Vitch), numérisation de transactions.\n- **Automatisation** : Robotisation des tâches et automatisation des workflows métiers.\n- **Systèmes Sécurisés** : Architecture de sécurité dès la conception (Security by Design), protection de données.\n- **Développement Web & Mobile** : Systèmes sur-mesure avec React, Node.js, Django et React Native.`,
      contact: `Vous pouvez me contacter directement par les canaux suivants :\n\n- **WhatsApp** : [Discuter sur WhatsApp](https://wa.me/2290144242964?text=Bonjour%20Bhilal%2C%20je%20souhaite%20discuter%20d%27un%20projet%20avec%20vous.)\n- **Email** : 7bhilal.chitou7@gmail.com\n- **Téléphone** : +229 01 44 24 29 64\n\nJe réponds très rapidement, surtout sur WhatsApp.`,
      tarifs: `Mes modèles d'intervention s'adaptent à vos besoins :\n\n- **TJM (Taux Journalier Moyen)** : Environ 300 € / jour (ajustable selon la durée du projet).\n- **Forfait** : Un devis global fixe est établi suite à l'analyse de votre cahier des charges.\n\nVous souhaitez estimer le budget de votre application ? Venez m'en parler sur [WhatsApp](https://wa.me/2290144242964).`,
      projets: `Voici quelques-uns de mes travaux les plus importants :\n\n- **Bhilal Language** : Langage de programmation POO transpilant vers JavaScript avec outils réseau natifs.\n- **Vitch (Démo)** : Application de portefeuille électronique sécurisé et émission de cartes virtuelles.\n- **Bhil Cours** : Plateforme interactive d'apprentissage du code (C, C++, JS, Python, etc.).\n- **Plateforme de Challenges** : Classement en temps réel et notation automatisée de soumissions.\n\nRetrouvez tous les détails dans la section **Projets** du site.`,
      parcours: `Développeur Full-Stack & Mobile Freelance basé au Bénin, avec une double formation informatique et financière :\n\n- **Diplôme** : Licence en Informatique à l'IUT de Parakou, Bénin (spécialisation développement et cybersécurité).\n- **Technologies** : React, Node.js, Django, React Native, TailwindCSS et Docker.\n- **Philosophie** : Sécurité dès la conception, performance maximale, et code maintenable.`,
      greetings: `Bonjour. Comment puis-je vous renseigner aujourd'hui ? Choisissez une suggestion ci-dessous ou écrivez votre question.`,
      fallback: `Je n'ai pas bien saisi votre demande.\n\nPour toute question spécifique ou demande de devis, contactez-moi directement sur [WhatsApp](https://wa.me/2290144242964) ou par email à **7bhilal.chitou7@gmail.com**.`
    }
  },
  en: {
    title: "Virtual Assistant",
    subtitle: "Online · Replies instantly",
    placeholder: "Type your message...",
    launcherAria: "Open chat assistant",
    closeAria: "Close chat assistant",
    welcome: "Hello. I'm Bhilal's virtual assistant. How can I help you today?",
    suggestions: [
      { label: "Services & Offers", value: "services", icon: "Briefcase" },
      { label: "Contact me", value: "contact", icon: "Phone" },
      { label: "Rates & Quotes", value: "tarifs", icon: "CreditCard" },
      { label: "Key Projects", value: "projets", icon: "Code2" },
      { label: "Bio & Skills", value: "parcours", icon: "GraduationCap" }
    ],
    responses: {
      services: `Bhilal is a specialist in **Fintech & Security**. He designs robust architectures to automate and protect your workflows:\n\n- **Fintech & Payment**: Integration of payment gateways, electronic wallets (e.g. Vitch), transaction digitization.\n- **Automation**: Process automation, converting manual tasks into robust software pipelines.\n- **Secure Systems**: Security by design, data protection, compliance.\n- **Web & Mobile Dev**: Tailored platforms using React, Node.js, Django, and React Native.`,
      contact: `You can reach me directly through any of these channels:\n\n- **WhatsApp**: [Chat on WhatsApp](https://wa.me/2290144242964?text=Hello%20Bhilal%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.)\n- **Email**: 7bhilal.chitou7@gmail.com\n- **Phone**: +229 01 44 24 29 64\n\nI answer very quickly, especially on WhatsApp.`,
      tarifs: `My collaboration models adapt to your scope:\n\n- **ADR (Average Daily Rate)**: Around €300 / day (negotiable depending on duration).\n- **Fixed Price**: Global budget set after analyzing your project specification.\n\nWant to estimate the budget for your app? Let's discuss it on [WhatsApp](https://wa.me/2290144242964).`,
      projets: `Here are some of my featured projects:\n\n- **Bhilal Language**: OOP programming language transpiling to JS with native network security utilities.\n- **Vitch (Demo)**: Secure digital wallet with virtual card generation.\n- **Bhil Cours**: Interactive platform to learn programming (C, C++, JS, Python, etc.).\n- **Challenge Platform**: Code grading engine and real-time leaderboards.\n\nAll details are listed in the **Projects** section of the website.`,
      parcours: `Freelance Full-Stack & Mobile Developer with dual computer science and finance training:\n\n- **Education**: Bachelor's Degree in Computer Science from the University of Parakou (IUT), Benin.\n- **Tech Stack**: React, Node.js, Django, React Native, TailwindCSS, and Docker.\n- **Philosophy**: Security by design, top-tier performance, and highly clean, documented code.`,
      greetings: `Hello. How can I help you today? Pick a suggestion below or write your question.`,
      fallback: `I didn't quite catch that.\n\nFor custom questions, quotes, or proposals, please write to me directly on [WhatsApp](https://wa.me/2290144242964) or email **7bhilal.chitou7@gmail.com**.`
    }
  }
};

const Chatbot = ({ lang = 'fr' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);
  const data = BOT_DATA[lang] || BOT_DATA['fr'];

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      { id: 'welcome', text: data.welcome, sender: 'bot' }
    ]);
    
    // Set unread notification badge after 3 seconds if chatbot is not open
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasUnread(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [lang]);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Intent parsing logic
  const matchIntent = (query) => {
    const text = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .trim();

    // Check Contact
    if (
      text.includes("contact") || text.includes("email") || text.includes("mail") ||
      text.includes("whatsapp") || text.includes("telephone") || text.includes("tel") ||
      text.includes("phone") || text.includes("joindre") || text.includes("ecrire") ||
      text.includes("numero") || text.includes("write") || text.includes("reach") ||
      text.includes("call") || text.includes("message") || text.includes("adresse")
    ) {
      return 'contact';
    }

    // Check Pricing
    if (
      text.includes("tarif") || text.includes("prix") || text.includes("budget") ||
      text.includes("combien") || text.includes("cout") || text.includes("cher") ||
      text.includes("tjm") || text.includes("rate") || text.includes("price") ||
      text.includes("cost") || text.includes("how much") || text.includes("devis") ||
      text.includes("argent") || text.includes("payer") || text.includes("paye")
    ) {
      return 'tarifs';
    }

    // Check Services
    if (
      text.includes("service") || text.includes("prestation") || text.includes("offre") ||
      text.includes("faire") || text.includes("creer") || text.includes("dev") ||
      text.includes("developper") || text.includes("web") || text.includes("mobile") ||
      text.includes("application") || text.includes("app") || text.includes("site") ||
      text.includes("securite") || text.includes("fintech") || text.includes("what can you do") ||
      text.includes("competence") || text.includes("skill") || text.includes("techno") ||
      text.includes("stack") || text.includes("react") || text.includes("node") ||
      text.includes("django") || text.includes("capable")
    ) {
      if (text.includes("parcours") || text.includes("cv") || text.includes("etude") || text.includes("ecole") || text.includes("experience")) {
        return 'parcours';
      }
      return 'services';
    }

    // Check Projects
    if (
      text.includes("projet") || text.includes("realisation") || text.includes("travaux") ||
      text.includes("bhilal") || text.includes("bhil cours") || text.includes("vitch") ||
      text.includes("challenge") || text.includes("restaurant") || text.includes("portfolio") ||
      text.includes("project") || text.includes("work") || text.includes("accomplish") ||
      text.includes("langage") || text.includes("language") || text.includes("cree")
    ) {
      return 'projets';
    }

    // Check Biography / CV / Who are you
    if (
      text.includes("qui es-tu") || text.includes("presentation") || text.includes("parcours") ||
      text.includes("experience") || text.includes("education") || text.includes("etude") ||
      text.includes("ecole") || text.includes("cv") || text.includes("biographie") ||
      text.includes("bio") || text.includes("who are you") || text.includes("about") ||
      text.includes("background") || text.includes("resume") || text.includes("chitou") ||
      text.includes("bhilal")
    ) {
      return 'parcours';
    }

    // Check Greetings
    if (
      text.includes("bonjour") || text.includes("salut") || text.includes("hello") ||
      text.includes("hey") || text.includes("hi") || text.includes("coucou") ||
      text.includes("bonsoir") || text.includes("yo") || text.includes("greetings")
    ) {
      return 'greetings';
    }

    return 'fallback';
  };

  // Bot response simulator
  const triggerBotReply = (intentKey) => {
    setIsTyping(true);
    
    // Simulate natural typing lag
    const delay = Math.random() * 700 + 800;
    
    setTimeout(() => {
      setIsTyping(false);
      const replyText = data.responses[intentKey] || data.responses.fallback;
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: replyText, sender: 'bot' }
      ]);
    }, delay);
  };

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now().toString(), text: text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');

    const intent = matchIntent(text);
    triggerBotReply(intent);
  };

  const handleSuggestionClick = (value) => {
    const suggestionLabel = data.suggestions.find(s => s.value === value)?.label || value;
    const userMsg = { id: Date.now().toString(), text: suggestionLabel, sender: 'user' };
    
    setMessages((prev) => [...prev, userMsg]);
    triggerBotReply(value);
  };

  const toggleChat = () => {
    if (!isOpen) {
      setHasUnread(false);
    }
    setIsOpen(!isOpen);
  };

  // Custom text formatter for safe HTML tags (**bold**, links, lists)
  const formatMessageText = (text) => {
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    const lines = escaped.split('\n');
    let inList = false;
    const formattedLines = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        if (!inList) {
          formattedLines.push('<ul class="chat-list">');
          inList = true;
        }
        formattedLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        formattedLines.push(line ? `<p>${line}</p>` : '');
      }
    });

    if (inList) {
      formattedLines.push('</ul>');
    }

    return formattedLines.join('');
  };

  return (
    <div className="chatbot-container">
      {/* Floating launcher button */}
      <button 
        onClick={toggleChat} 
        className="chatbot-launcher"
        aria-label={isOpen ? data.closeAria : data.launcherAria}
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
        {hasUnread && <span className="chatbot-badge"></span>}
      </button>

      {/* Chat Window Panel */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-profile">
            <div className="chatbot-avatar-container">
              <img src="/pro.webp" alt="Bhilal CHITOU" className="chatbot-avatar" />
              <span className="chatbot-status-dot"></span>
            </div>
            <div className="chatbot-info">
              <span className="chatbot-name">Bhilal CHITOU</span>
              <span className="chatbot-title">{data.title}</span>
            </div>
          </div>
          <button onClick={toggleChat} className="chatbot-close" aria-label={data.closeAria}>
            <X size={18} />
          </button>
        </div>

        {/* Messages List */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`chatbot-msg ${msg.sender}`}
              dangerouslySetInnerHTML={
                msg.sender === 'bot' 
                  ? { __html: formatMessageText(msg.text) } 
                  : undefined
              }
            >
              {msg.sender === 'user' ? msg.text : undefined}
            </div>
          ))}
          
          {isTyping && (
            <div className="chatbot-typing">
              <span className="chatbot-dot"></span>
              <span className="chatbot-dot"></span>
              <span className="chatbot-dot"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="chatbot-suggestions">
          {data.suggestions.map((sug) => (
            <button 
              key={sug.value} 
              className="chatbot-chip"
              onClick={() => handleSuggestionClick(sug.value)}
            >
              {renderSuggestionIcon(sug.icon, 14)}
              <span>{sug.label}</span>
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form 
          className="chatbot-footer"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
        >
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={data.placeholder}
            className="chatbot-input"
          />
          <button 
            type="submit" 
            className="chatbot-send" 
            disabled={!inputValue.trim() || isTyping}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
