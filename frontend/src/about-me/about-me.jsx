import React from 'react';
import './about-me.css';
import titleImg from '../assets/title.png';
import ProjectsImg from '../assets/projects.png';
import ContactMeImg from '../assets/contact-me.png';

function AboutMe({ setCurrentSection, isLargeScreen }) {
  return (
    <div className="section">
      {!isLargeScreen && (
        <div className="stickers">
          <img src={titleImg} alt="Home" onClick={() => setCurrentSection('home')} />
          <img src={ProjectsImg} alt="Projects" onClick={() => setCurrentSection('projects')} />
          <img src={ContactMeImg} alt="Contact Me" onClick={() => setCurrentSection('contact')} />
        </div>
      )}
      <h1>About Me</h1>
      <p>Your about me content goes here<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello<br />hellohello</p>
    </div>
  );
}

export default AboutMe;