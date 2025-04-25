import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">À propos de SportShop</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Notre histoire</h2>
        <p className="mb-4">
          Fondée en 2020, SportShop est née de la passion partagée de ses fondateurs pour le sport et leur vision commune d'offrir des équipements sportifs de qualité à des prix accessibles.
        </p>
        <p className="mb-4">
          Au fil des années, nous avons développé des partenariats solides avec les plus grandes marques du monde sportif, nous permettant de proposer une sélection variée et de qualité pour tous les types de pratiques sportives.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Notre mission</h2>
        <p className="mb-4">
          Chez SportShop, notre mission est de rendre le sport accessible à tous en proposant des équipements adaptés à chaque niveau de pratique, du débutant au professionnel.
        </p>
        <p className="mb-4">
          Nous croyons fermement que la pratique sportive contribue au bien-être physique et mental, et nous nous engageons à accompagner nos clients dans leur parcours sportif grâce à des conseils personnalisés et des produits de qualité.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Nos valeurs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border p-4 rounded">
            <h3 className="text-xl font-medium mb-2 text-primary">Qualité</h3>
            <p>Nous sélectionnons rigoureusement chaque produit pour garantir durabilité et performance.</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="text-xl font-medium mb-2 text-primary">Accessibilité</h3>
            <p>Nous proposons des produits pour tous les budgets sans compromettre la qualité.</p>
          </div>
          <div className="border p-4 rounded">
            <h3 className="text-xl font-medium mb-2 text-primary">Service client</h3>
            <p>Notre équipe est disponible pour vous conseiller et répondre à toutes vos questions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;