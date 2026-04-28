import React from 'react';
import './projects.css';
import titleImg from '../assets/title.png';
import AboutMeImg from '../assets/about-me.png';
import ContactMeImg from '../assets/contact-me.png';

function Projects({ setCurrentSection, isLargeScreen }) {
  return (
    <div className="section">
      {!isLargeScreen && (
        <div className="stickers">
          <img src={titleImg} alt="Home" onClick={() => setCurrentSection('home')} />
          <img src={AboutMeImg} alt="About Me" onClick={() => setCurrentSection('about')} />
          <img src={ContactMeImg} alt="Contact Me" onClick={() => setCurrentSection('contact')} />
        </div>
      )}
      <h1>Projects</h1>
      <p>Your projects content goes here</p>
    </div>
  );
}

export default Projects;