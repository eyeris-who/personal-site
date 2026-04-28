import { useEffect } from 'react';
import binderMargins from './assets/binder-margins.png';
import pageMargins from './assets/page-margins.png';

export default function Layout({ children, currentSection, isLargeScreen = false }) {
  const isHomePage = currentSection === 'home' || isLargeScreen;

  useEffect(() => {
    document.body.classList.toggle('home-page', isHomePage);
  }, [isHomePage]);

  const marginSrc = isHomePage ? binderMargins : pageMargins;

  return (
    <div className="layout-container">
      {!isLargeScreen && <img className="margin-img" src={marginSrc} alt="" />}
      <div className="content">
        {children}
      </div>
    </div>
  );
}