import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import Home from './pages/Home/Home';
import LearnMore from './pages/LearnMore/LearnMore';
import Explore from './pages/Explore/Explore';
import AlphabetTraining from './pages/AlphabetTraining/AlphabetTraining';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            {/* Home route */}
            <Route path="/" element={
              <>
                <Home />
                <LearnMore />
              </>
            } />

            {/* Explore route */}
            <Route path="/explore" element={
              <>
                <Explore />
              </>
            } />

            {/* Alphabet Training route */}
            <Route path="/alphabet-training" element={
              <>
                <AlphabetTraining />
              </>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;