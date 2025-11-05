import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header/Header';
import Home from './pages/Home/Home';
import LearnMore from './pages/LearnMore/LearnMore';
import Footer from './components/layout/Footer/Footer';

function HomePage() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Home />
                <LearnMore />
              </>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default HomePage;