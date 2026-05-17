import React, { useState } from 'react';
import { Send } from 'lucide-react';
import '../styles/Contact.css';

const ContactForm = ({ translations }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "409f18c0-89b7-49a1-b700-3cb71f989740", 
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">{translations.formName}</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          className="form-input" 
          placeholder={translations.formName}
          value={formData.name}
          onChange={handleChange}
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email" className="form-label">{translations.formEmail}</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          className="form-input" 
          placeholder={translations.formEmail}
          value={formData.email}
          onChange={handleChange}
          required 
        />
      </div>
      
      <div className="form-group form-group-full">
        <label htmlFor="message" className="form-label">{translations.formMessage}</label>
        <textarea 
          id="message" 
          name="message" 
          className="form-textarea" 
          placeholder={translations.formMessage}
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      
      <div className="form-submit">
        <button 
          type="submit" 
          disabled={status === 'loading'} 
          className={`btn btn-primary ${status === 'success' ? 'btn-success' : status === 'error' ? 'btn-error' : ''}`}
        >
          {status === 'loading' ? 'Envoi en cours...' : 
           status === 'success' ? translations.successMsg : 
           status === 'error' ? 'Erreur lors de l\'envoi' : 
           translations.formSubmit}
          {status === 'idle' && <Send size={18} />}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
