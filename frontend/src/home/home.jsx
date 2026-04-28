import './home.scss';
import React, { useRef, useEffect } from 'react';
import titleImg from '../assets/title.png';
import AboutMeImg from '../assets/about-me.png';
import ProjectsImg from '../assets/projects.png';
import ContactMeImg from '../assets/contact-me.png';
import binderMargins from '../assets/binder-margins.png';
import pageMargins from '../assets/page-margins.png';
import AboutMe from '../about-me/about-me';
import Projects from '../projects/projects';
import ContactMe from '../contact-me/contact-me';
function Home({ currentSection, setCurrentSection, isLargeScreen = false }) {
  const leftMarginRef = useRef();
  const rightMarginRef = useRef();
  const leftPanelRef = useRef();
  const rightPanelRef = useRef();

  useEffect(() => {
    const setPadding = (img, isRight) => {
      if (!img) return;
      const updatePadding = () => {
        const width = img.offsetWidth;
        if (isRight) {
          img.parentElement.style.setProperty('--page-margin-width', `${width}px`);
        } else {
          img.parentElement.style.setProperty('--binder-margin-width', `${width}px`);
        }
      };
      if (img.complete) {
        updatePadding();
      } else {
        img.onload = updatePadding;
      }
    };

    if (isLargeScreen) {
      setPadding(leftMarginRef.current, false);
      setPadding(rightMarginRef.current, true);
    } else {
      // For small screens, reset CSS vars to default
      if (rightPanelRef.current) {
        rightPanelRef.current.style.removeProperty('--page-margin-width');
      }
      if (leftPanelRef.current) {
        leftPanelRef.current.style.removeProperty('--binder-margin-width');
      }
    }
  }, [isLargeScreen]);

  return (
    <div className="app-layout">
      <div ref={leftPanelRef} className="left-panel">
        {isLargeScreen && <img ref={leftMarginRef} className="margin-img" src={binderMargins} alt="" />}
        <img className="title" src={titleImg} alt="Title" />
        <div className="container">
          <button 
            className="card about-me" 
            onClick={() => setCurrentSection('about')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src={AboutMeImg} alt="About Me"/>
          </button>
          <button 
            className="card projects" 
            onClick={() => setCurrentSection('projects')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src={ProjectsImg} alt="Projects"/>
          </button>
          <button 
            className="card contact-me" 
            onClick={() => setCurrentSection('contact')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img src={ContactMeImg} alt="Contact Me"/>
          </button>
        </div>
      </div>
      <div ref={rightPanelRef} className="right-panel">
        {isLargeScreen && <img ref={rightMarginRef} className="margin-img" src={pageMargins} alt="" />}
        {currentSection === 'home' ? (
          <div className="home-content">
            <img className="title" src={titleImg} alt="Title" />
            <div className="container">
              <button 
                className="card about-me" 
                onClick={() => setCurrentSection('about')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={AboutMeImg} alt="About Me"/>
              </button>
              <button 
                className="card projects" 
                onClick={() => setCurrentSection('projects')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={ProjectsImg} alt="Projects"/>
              </button>
              <button 
                className="card contact-me" 
                onClick={() => setCurrentSection('contact')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                <img src={ContactMeImg} alt="Contact Me"/>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {currentSection === 'about' && <AboutMe setCurrentSection={setCurrentSection} isLargeScreen={isLargeScreen} />}
            {currentSection === 'projects' && <Projects setCurrentSection={setCurrentSection} isLargeScreen={isLargeScreen} />}
            {currentSection === 'contact' && <ContactMe setCurrentSection={setCurrentSection} isLargeScreen={isLargeScreen} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;