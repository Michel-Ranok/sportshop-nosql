import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous implémenteriez l'envoi réel du formulaire
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contactez-nous</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white bg-white-contact rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Nos coordonnées</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-primary">Adresse</h3>
              <p>123 Rue du Sport</p>
              <p>75000 Paris, France</p>
            </div>
            
            <div>
              <h3 className="font-medium text-primary">Téléphone</h3>
              <p>+33 1 23 45 67 89</p>
            </div>
            
            <div>
              <h3 className="font-medium text-primary">Email</h3>
              <p>contact@sportshop.fr</p>
            </div>
            
            <div>
              <h3 className="font-medium text-primary">Heures d'ouverture</h3>
              <p>Lundi - Vendredi: 9h - 19h</p>
              <p>Samedi: 10h - 18h</p>
              <p>Dimanche: Fermé</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Envoyez-nous un message</h2>
          
          {isSubmitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Message envoyé !</p>
              <p>Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Sujet</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="question">Question générale</option>
                  <option value="order">Commande</option>
                  <option value="return">Retour produit</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded transition-colors"
              >
                Envoyer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;