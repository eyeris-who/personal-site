import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import Layout from './layout';
import Home from './home/home';
import './index.css';

function App() {
  const query = window.matchMedia('(min-aspect-ratio: 960/850)');
  const [isLargeScreen, setIsLargeScreen] = useState(query.matches);
  const [currentSection, setCurrentSection] = useState(query.matches ? 'about' : 'home');

  useEffect(() => {
    const handleChange = (e) => {
      const large = e.matches;
      if (large !== isLargeScreen) {
        if (large && currentSection === 'home') setCurrentSection('about');
        else if (!large && currentSection !== 'home') setCurrentSection('home');
      }
      setIsLargeScreen(large);
    };

    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [currentSection, isLargeScreen]);

  return (
    <Layout currentSection={currentSection} isLargeScreen={isLargeScreen}>
      <Home currentSection={currentSection} setCurrentSection={setCurrentSection} isLargeScreen={isLargeScreen} />
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);