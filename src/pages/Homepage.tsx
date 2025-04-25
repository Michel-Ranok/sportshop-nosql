import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRunning, FaFootballBall, FaBasketballBall, FaDumbbell } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import UserRecommendations from '../components/recommendations/UserRecommendations';
import productsData from '../data/products.json';
import avatar1 from '../assets/avatar1.jpg';
import avatar2 from '../assets/avatar2.jpg';
import avatar3 from '../assets/avatar3.jpg';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Obtenir les produits les mieux notés
  const topRatedProducts = [...productsData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  
  // Fonction pour naviguer vers le catalogue avec un filtre de catégorie
  const navigateToCategory = (category: string) => {
    navigate(`/catalog?category=${category.toLowerCase()}`);
  };

  return (
    <div className="space-y-16">
      {/* Hero Banner with Background Image */}
      <section className="relative h-[500px] bg-cover bg-center bg-no-repeat overflow-hidden rounded-lg shadow-xl" 
        style={{ backgroundImage: 'url(/assets/hero-sports.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 py-16 relative h-full flex items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Équipez-vous pour <span className="text-secondary">la victoire</span>
            </h1>
            <p className="text-white text-lg mb-8">
              Découvrez notre sélection d'équipements sportifs de qualité pour tous vos besoins
            </p>
            <div className="flex space-x-4">
              <Link to="/catalog" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow transition-colors">
                Parcourir le catalogue
              </Link>
              <Link to="/about" className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow transition-colors">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* User Recommendations - only if authenticated */}
      {isAuthenticated && <UserRecommendations />}
      
      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Explorez nos catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { name: 'Football', icon: <FaFootballBall size={40} />, bgImage: '/assets/football-category.jpg' },
            { name: 'Basketball', icon: <FaBasketballBall size={40} />, bgImage: '/assets/basketball-category.jpg' },
            { name: 'Running', icon: <FaRunning size={40} />, bgImage: '/assets/running-category.jpg' },
            { name: 'Fitness', icon: <FaDumbbell size={40} />, bgImage: '/assets/fitness-category.jpg' }
          ].map((category) => (
            <div key={category.name} 
                 className="card hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden rounded-lg"
                 onClick={() => navigateToCategory(category.name)}>
              <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${category.bgImage})` }}>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white hover:bg-opacity-30 transition-all">
                  <div className="text-center">
                    {category.icon}
                    <h3 className="text-xl font-semibold mt-2">{category.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Top Rated Products */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos produits les mieux notés</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {topRatedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-gray-400">Image Produit</div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    ★ {product.rating.toFixed(1)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.category} - {product.sport}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-primary">{product.price.toFixed(2)}€</span>
                    <Link 
                      to={`/product/${product.id}`}
                      className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark transition-colors"
                    >
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call-to-action banner */}
      <section className="bg-accent text-white">
        <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Prêt à améliorer vos performances?</h2>
            <p className="text-lg">Rejoignez des milliers de sportifs qui nous font confiance pour leur équipement.</p>
          </div>
          <Link to="/catalog" className="bg-white text-accent hover:bg-gray-100 font-bold py-3 px-6 rounded-lg shadow transition-colors">
            Commencer maintenant
          </Link>
        </div>
      </section>
      
      {/* Testimonials section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Thomas D.', content: 'Excellent service client et livraison rapide. Je recommande vivement cette boutique pour tous vos besoins sportifs.', avatar: avatar1 },
            { name: 'Sophie L.', content: 'Les produits sont de très haute qualité et durent dans le temps. C\'est ma boutique de référence depuis plus de 2 ans.', avatar: avatar2 },
            { name: 'Marc B.', content: 'Le rapport qualité-prix est imbattable. J\'ai acheté mes chaussures de running ici et je n\'ai jamais été aussi satisfait.', avatar: avatar3 }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="font-semibold">{testimonial.name}</h3>
              </div>
              <p className="text-gray-600 italic">{testimonial.content}</p>
              <div className="flex text-yellow-400 mt-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;