import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import '../styles/Contact.css';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const RESET_DELAY_MS = 5000;
const MIN_MESSAGE_LENGTH = 10;

const validateEmail = (email) => EMAIL_REGEX.test(String(email).toLowerCase());

const buildErrors = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = 'Le nom est requis';
  if (!formData.email.trim()) {
    errors.email = "L'email est requis";
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Email invalide';
  }
  if (!formData.message.trim()) {
    errors.message = 'Le message est requis';
  } else if (formData.message.length < MIN_MESSAGE_LENGTH) {
    errors.message = `Le message est trop court (min ${MIN_MESSAGE_LENGTH} car.)`;
  }
  return errors;
};

const SubmitButton = ({ status, label, successMsg }) => {
  const classNames = [
    'btn btn-primary',
    status === 'success' ? 'btn-success' : '',
    status === 'error' ? 'btn-error' : '',
  ].join(' ').trim();

  const content = {
    loading: 'Envoi...',
    success: <>{successMsg} <CheckCircle size={18} /></>,
    error: <>Erreur <AlertCircle size={18} /></>,
  }[status] ?? <>{label} <Send size={18} /></>;

  return (
    <button type="submit" disabled={status === 'loading'} className={classNames}>
      {content}
    </button>
  );
};

const FormField = ({ id, type = 'text', label, error, ...props }) => (
  <div className="form-group">
    <label htmlFor={id} className="form-label">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      className={`form-input ${error ? 'input-error' : ''}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      required
      {...props}
    />
    {error && <span id={`${id}-error`} className="error-message">{error}</span>}
  </div>
);

const EMPTY_FORM = { name: '', email: '', message: '' };

const ContactForm = ({ translations }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = buildErrors(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '409f18c0-89b7-49a1-b700-3cb71f989740',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `Nouveau message de ${formData.name} via Portfolio`,
        }),
      });
      const result = await response.json();
      const nextStatus = result.success ? 'success' : 'error';
      setStatus(nextStatus);
      if (result.success) setFormData(EMPTY_FORM);
      setTimeout(() => setStatus('idle'), RESET_DELAY_MS);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), RESET_DELAY_MS);
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <FormField
        id="name"
        label={translations.formName}
        placeholder={translations.formName}
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      <FormField
        id="email"
        type="email"
        label={translations.formEmail}
        placeholder={translations.formEmail}
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

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
        />
        <div className="form-footer">
          {errors.message && <span id="message-error" className="error-message">{errors.message}</span>}
          <span className="char-count">{formData.message.length} car.</span>
        </div>
      </div>

      <div className="form-submit">
        <SubmitButton status={status} label={translations.formSubmit} successMsg={translations.successMsg} />
      </div>
    </form>
  );
};

export default ContactForm;
