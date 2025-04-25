import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">SportShop</h2>
            <p className="text-gray-300">
              Votre boutique spécialisée dans les équipements sportifs de qualité
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Accueil</Link></li>
              <li><Link to="/catalog" className="text-gray-300 hover:text-white">Catalogue</Link></li>
              <li><Link to="/cart" className="text-gray-300 hover:text-white">Panier</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              <li><Link to="/catalog?category=football" className="text-gray-300 hover:text-white">Football</Link></li>
              <li><Link to="/catalog?category=basketball" className="text-gray-300 hover:text-white">Basketball</Link></li>
              <li><Link to="/catalog?category=running" className="text-gray-300 hover:text-white">Running</Link></li>
              <li><Link to="/catalog?category=fitness" className="text-gray-300 hover:text-white">Fitness</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-xl"><FaFacebook /></a>
              <a href="#" className="text-gray-300 hover:text-white text-xl"><FaTwitter /></a>
              <a href="#" className="text-gray-300 hover:text-white text-xl"><FaInstagram /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {currentYear} SportShop. Tous droits réservés.</p>
          <p className="text-sm mt-2">Application créée à des fins éducatives.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;