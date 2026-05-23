import React from 'react';
import './projects.scss';
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
      <p className="project-text">
        A work in progress...
        <br /><br />

        Experience:
        <br />
        Jan 2026 – Apr 2026: Software Developer Intern @ RBC, T&O
        <br />
        • Mobile banking features, CI/CD, backend tooling
        <br />
        • Angular, TypeScript, Spring Boot, Java, GitHub Actions

        <br /><br />

        Apr 2025 – Aug 2025: Full-Stack Developer Intern @ Bosda International
        <br />
        • Automation systems, data pipelines, internal tools
        <br />
        • C#, ASP.NET Core, Python, FastAPI, JavaScript, SQL

        <br /><br />

        Projects:
        <br />
        Portfolio Generation
        <br />
        • Stock portfolio optimization and backtesting
        <br />
        • Python, pandas, NumPy, Matplotlib, yfinance

        <br /><br />

        Personal Portfolio
        <br />
        • Portfolio website with automated cloud deployment
        <br />
        • React, Vite, Node.js, Docker, AWS, Nginx

        <br /><br />

        Students of Watan
        <br />
        • Multiplayer strategy game with custom graphics
        <br />
        • C++, OOP, X11, Makefile
      </p>
    </div>
  );
}

export default Projects;