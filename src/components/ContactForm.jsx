import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/Contact.css';

const ContactForm = ({ translations }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.message.trim()) newErrors.message = 'Le message est requis';
    else if (formData.message.length < 10) newErrors.message = 'Le message est trop court (min 10 car.)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
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
          subject: `Nouveau message de ${formData.name} via Portfolio`,
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
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name" className="form-label">{translations.formName}</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          className={`form-input ${errors.name ? 'input-error' : ''}`} 
          placeholder={translations.formName}
          value={formData.name}
          onChange={handleChange}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          required 
        />
        {errors.name && <span id="name-error" className="error-message">{errors.name}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email" className="form-label">{translations.formEmail}</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          className={`form-input ${errors.email ? 'input-error' : ''}`} 
          placeholder={translations.formEmail}
          value={formData.email}
          onChange={handleChange}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required 
        />
        {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
      </div>
      
      <div className="form-group form-group-full">
        <label htmlFor="message" className="form-label">{translations.formMessage}</label>
        <textarea 
          id="message" 
          name="message" 
          className={`form-textarea ${errors.message ? 'input-error' : ''}`} 
          placeholder={translations.formMessage}
          rows="5"
          value={formData.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          required
        ></textarea>
        <div className="form-footer">
          {errors.message && <span id="message-error" className="error-message">{errors.message}</span>}
          <span className="char-count">{formData.message.length} car.</span>
        </div>
      </div>
      
      <div className="form-submit">
        <button 
          type="submit" 
          disabled={status === 'loading'} 
          className={`btn btn-primary ${status === 'success' ? 'btn-success' : status === 'error' ? 'btn-error' : ''}`}
        >
          {status === 'loading' ? 'Envoi...' : 
           status === 'success' ? (
             <>
               {translations.successMsg} <CheckCircle size={18} />
             </>
           ) : 
           status === 'error' ? (
              <>
                Erreur <AlertCircle size={18} />
              </>
           ) : 
           (
             <>
               {translations.formSubmit} <Send size={18} />
             </>
           )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
