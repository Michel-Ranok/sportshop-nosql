import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const MiniCart = () => {
  const { cart, removeFromCart } = useCart();
  
  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50">
      <div className="p-4">
        <h3 className="text-lg font-semibold border-b pb-2">Mon panier</h3>
        
        {cart.items.length > 0 ? (
          <>
            <ul className="divide-y">
              {cart.items.map(item => (
                <li key={item.productId} className="py-2 flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {item.price.toFixed(2)} €
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">{(item.price * item.quantity).toFixed(2)} €</span>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>{cart.total.toFixed(2)} €</span>
            </div>
            
            <div className="mt-4 space-y-2">
              <Link to="/cart" className="btn-primary w-full block text-center">
                Voir le panier
              </Link>
              <button className="w-full py-2 px-4 bg-accent hover:bg-accent-dark text-white font-bold rounded transition-colors">
                Commander
              </button>
            </div>
          </>
        ) : (
          <p className="py-4 text-center text-gray-500">Votre panier est vide</p>
        )}
      </div>
    </div>
  );
};

export default MiniCart;