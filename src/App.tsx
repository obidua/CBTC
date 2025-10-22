import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Presale } from './pages/Presale';
import { DashboardNew } from './pages/DashboardNew';
import { Claim } from './pages/Claim';
import { AdminNew } from './pages/AdminNew';
import { CryptoLanding } from './pages/CryptoLanding';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <Routes>
            <Route path="/crypto" element={<CryptoLanding />} />
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/presale" element={<Presale />} />
                  <Route path="/dashboard" element={<DashboardNew />} />
                  <Route path="/claim" element={<Claim />} />
                  <Route path="/admin" element={<AdminNew />} />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;
