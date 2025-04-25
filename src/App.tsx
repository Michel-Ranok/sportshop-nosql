import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import { NotificationProvider } from './context/NotificationContext';
import NotificationDisplay from './components/common/NotificationDisplay';

// Import lazy des pages
const HomePage = lazy(() => import('./pages/Homepage'));
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const AboutPage = lazy(() => import('./pages/AboutPage')); 
const ContactPage = lazy(() => import('./pages/ContactPage'));

function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <NotificationProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Header />
              <NotificationDisplay />
              <main className="flex-grow">
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders/success/:orderId" element={<OrderSuccessPage />} />
                    <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </CartProvider> 
    </AuthProvider>
  );
}

export default App;