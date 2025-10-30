import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
//import Header from './components/layout/Header/Header';
//import Footer from './components/layout/Footer/Footer';

function HomePage() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* <Header /> */}
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Home />
              </>
            } />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default HomePage;