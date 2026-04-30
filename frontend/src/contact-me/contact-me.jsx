import './contact-me.scss';
import Canvas from './canvas/canvas';
import titleImg from '../assets/title.png';
import AboutMeImg from '../assets/about-me.png';
import ProjectsImg from '../assets/projects.png';
import tornPaper from '../assets/torn-paper.png';
import tape1 from '../assets/tape-1.png';
import tape2 from '../assets/tape-2.png';
import { useRef, useState } from 'react';

function ContactMe({ setCurrentSection, isLargeScreen }) {
    const canvasRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [canvasNote, setCanvasNote] = useState('');
    const [status, setStatus] = useState('idle');

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        setStatus('sending');

        const canvasImage = canvasRef.current?.getDataURL() ?? null;

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    canvasNote,
                    canvasImage,
                }),
            });

            if (!res.ok) throw new Error('Server error');
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setCanvasNote('');
            canvasRef.current?.clear();
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="contact-section">
            {!isLargeScreen && (
                <div className="stickers">
                    <img src={titleImg} alt="Home" onClick={() => setCurrentSection('home')} />
                    <img src={AboutMeImg} alt="About Me" onClick={() => setCurrentSection('about')} />
                    <img src={ProjectsImg} alt="Projects" onClick={() => setCurrentSection('projects')} />
                </div>
            )}

            <h1 className="contact-heading">Contact Me</h1>

            <form onSubmit={sendEmail} className="contact-form">
                <div className="papers-stack">

                    {/* ── Large paper: canvas drawing (sits behind) ── */}
                    <div className="torn-paper-wrapper large-paper">
                        <img src={tornPaper} alt="" className="torn-paper-bg" aria-hidden="true" />
                        <img src={tape1} alt="" className="tape tape-br" aria-hidden="true" />

                        <div className="paper-canvas-area">
                            <Canvas ref={canvasRef} />
                        </div>
                    </div>

                    {/* ── Small paper: form fields (overlays on top) ── */}
                    <div className="torn-paper-wrapper small-paper">
                        <img src={tornPaper} alt="" className="torn-paper-bg" aria-hidden="true" />
                        <img src={tape2} alt="" className="tape tape-tr" aria-hidden="true" />
                        <img src={tape2} alt="" className="tape tape-tl" aria-hidden="true" />

                        <div className="paper-fields">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="paper-input"
                            />
                            <div className="paper-divider" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="paper-input"
                            />
                            <div className="paper-divider" />
                            <textarea
                                name="message"
                                placeholder="Message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="paper-input paper-textarea"
                            />
                            <div className="paper-divider" />
                        </div>
                    </div>
                </div>

                {/* ── Tape send button ── */}
                <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="send-tape-btn"
                >
                    {status === 'sending' ? 'Sending…' : 'Send ✉️'}
                </button>

                {status === 'success' && <p className="form-feedback success">Message sent! 🎉</p>}
                {status === 'error'   && <p className="form-feedback error">Something went wrong. Please try again.</p>}
            </form>
        </div>
    );
}

export default ContactMe;