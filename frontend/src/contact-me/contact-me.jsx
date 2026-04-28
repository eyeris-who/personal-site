import './contact-me.css';
import Canvas from './canvas/canvas';
import titleImg from '../assets/title.png';
import AboutMeImg from '../assets/about-me.png';
import ProjectsImg from '../assets/projects.png';
import { useRef, useState } from 'react';

function ContactMe({ setCurrentSection, isLargeScreen }) {
    const canvasRef = useRef(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [canvasNote, setCanvasNote] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // Pull the PNG data URL from the canvas (null if nothing was drawn)
        const canvasImage = canvasRef.current?.getDataURL() ?? null;

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    canvasNote,   // the textarea inside the canvas widget
                    canvasImage,  // PNG data URL or null
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
        <div className="section">
            {!isLargeScreen && (
                <div className="stickers">
                    <img src={titleImg} alt="Home" onClick={() => setCurrentSection('home')} />
                    <img src={AboutMeImg} alt="About Me" onClick={() => setCurrentSection('about')} />
                    <img src={ProjectsImg} alt="Projects" onClick={() => setCurrentSection('projects')} />
                </div>
            )}

            <h1>Contact Me</h1>
            <p>Your contact information goes here</p>

            <form onSubmit={sendEmail}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />

                {/* Canvas widget — the textarea inside it is wired to canvasNote */}
                <Canvas
                    ref={canvasRef}
                    messageProps={{
                        value: canvasNote,
                        onChange: (e) => setCanvasNote(e.target.value),
                    }}
                />

                <button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send'}
                </button>

                {status === 'success' && <p className="form-feedback success">Message sent!</p>}
                {status === 'error'   && <p className="form-feedback error">Something went wrong. Please try again.</p>}
            </form>
        </div>
    );
}

export default ContactMe;