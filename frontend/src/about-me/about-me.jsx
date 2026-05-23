import React, { useState } from 'react';
// ScratchCover must mount AFTER the photo is laid out so getBoundingClientRect() is non-zero
import './about-me.scss';
import titleImg from '../assets/title.png';
import ProjectsImg from '../assets/projects.png';
import ContactMeImg from '../assets/contact-me.png';
import meImg from '../assets/me.png';
import coverImg from '../assets/face-cover.png';
import eraserImg from '../assets/eraser.png';
import eraserCursorSrc from '../assets/eraser-cursor.png';
import tape1 from '../assets/tape-1.png';
import tape2 from '../assets/tape-2.png';
import ScratchCover from './scratchcover/scratchcover';

function AboutMe({ setCurrentSection, isLargeScreen }) {
  const [coverVisible, setCoverVisible] = useState(
    () => localStorage.getItem('faceRevealed') !== 'true'
  );
  const [eraserActive, setEraserActive] = useState(false);
  const [photoLoaded, setPhotoLoaded]   = useState(false);

  const handleEraserClick = () => setEraserActive((prev) => !prev);

  const handleFullyErased = () => {
    setEraserActive(false);
    setCoverVisible(false);
    localStorage.setItem('faceRevealed', 'true');
  };

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

      <div className="about-content">
        <div className="photo-wrapper">
          <img src={tape1} alt="" className="photo-tape photo-tape--tl" />
          <img src={tape2} alt="" className="photo-tape photo-tape--br" />
          <img src={meImg} alt="Me" className="photo-me" onLoad={() => setPhotoLoaded(true)} />

          {coverVisible && photoLoaded && (
            <ScratchCover
              coverSrc={coverImg}
              eraserCursorSrc={eraserCursorSrc}
              active={eraserActive}
              onFullyErased={handleFullyErased}
            />
          )}

          {coverVisible && photoLoaded && (
            <img
              src={eraserImg}
              alt="Eraser"
              className={`photo-eraser ${eraserActive ? 'photo-eraser--active' : ''}`}
              onClick={handleEraserClick}
              title={eraserActive ? 'Erasing… click to cancel' : 'Click to erase!'}
            />
          )}
        </div>

        <div className="bio">
          <p>
            Hey, I'm Iris! I'm a full-stack developer doing a double major
            in Computer Science and Finance at the University of Waterloo.
            <br /><br />
            I care about understanding every stage of the SDLC (not just my slice of it), 
            and am a strong believer of "done is better than perfect".
            <br /><br />
            When I'm not coding, you can find me practicing piano, sketching, or
            playing tennis (table or not).
            <br /><br />
            I'm always looking for interesting projects to work on and people to
            collaborate with - feel free to reach out! Especially if you want to
            challenge me to a match of ping pong ;)
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;