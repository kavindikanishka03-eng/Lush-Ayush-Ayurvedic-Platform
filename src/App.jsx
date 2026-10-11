import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import AdminOrders from './pages/AdminOrders';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<AdminOrders />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
