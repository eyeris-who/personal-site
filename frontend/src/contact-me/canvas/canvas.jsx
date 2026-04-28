import './canvas.scss';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const PencilIcon = ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            fill={active ? '#fff' : '#555'}
        />
    </svg>
);

const EraserIcon = ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16.24 3.56l4.24 4.24c.78.78.78 2.05 0 2.83L12 19.1H8l-4.95-4.95c-.78-.78-.78-2.05 0-2.83L13.41 2.7a2 2 0 0 1 2.83.86zM4 21h16"
            stroke={active ? '#fff' : '#555'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15 5L19 9"
            stroke={active ? '#fff' : '#555'}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

// forwardRef lets the parent (ContactMe) call canvasRef.current.getDataURL()
const Canvas = forwardRef(({ messageProps }, ref) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [mode, setMode] = useState('draw');
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const hasDrawnRef = useRef(false); // track whether user drew anything
    const DEFAULT_LINE_WIDTH = 5;

    // Expose getDataURL() to parent via ref
    useImperativeHandle(ref, () => ({
        // Returns a PNG data URL if the user drew something, otherwise null
        getDataURL() {
            if (!hasDrawnRef.current) return null;
            return canvasRef.current.toDataURL('image/png');
        },
        clear() {
            clearCanvas();
        },
    }));

    const getPointerPosition = ({ clientX, clientY }) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scale = window.devicePixelRatio || 1;

        canvas.width = rect.width * scale;
        canvas.height = rect.height * scale;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const context = canvas.getContext('2d');
        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = DEFAULT_LINE_WIDTH;
        contextRef.current = context;
    }, []);

    useEffect(() => {
        const context = contextRef.current;
        if (!context) return;
        context.lineWidth = DEFAULT_LINE_WIDTH;
        if (mode === 'draw') {
            context.globalCompositeOperation = 'source-over';
            context.strokeStyle = '#1a1a2e';
        } else {
            context.globalCompositeOperation = 'destination-out';
            context.strokeStyle = 'rgba(0,0,0,1)';
        }
    }, [mode]);

    const startDrawing = ({ nativeEvent }) => {
        const { x, y } = getPointerPosition(nativeEvent);
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
        setIsDrawing(true);
        hasDrawnRef.current = true;
        nativeEvent.preventDefault();
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { x, y } = getPointerPosition(nativeEvent);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
        nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        contextRef.current.clearRect(0, 0, rect.width, rect.height);
        hasDrawnRef.current = false;
    };

    return (
        <div className="canvas-outer">
            <textarea
                className="canvas-message-input"
                placeholder="Send a message and attach a drawing"
                rows={2}
                {...messageProps}
            />

            <div className="canvas-wrapper">
                <div className="canvas-controls">
                    <div className="control-group mode-group">
                        <button
                            onClick={() => setMode('draw')}
                            className={`icon-btn ${mode === 'draw' ? 'active' : ''}`}
                            title="Draw"
                        >
                            <PencilIcon active={mode === 'draw'} />
                        </button>
                        <button
                            onClick={() => setMode('erase')}
                            className={`icon-btn ${mode === 'erase' ? 'active' : ''}`}
                            title="Erase"
                        >
                            <EraserIcon active={mode === 'erase'} />
                        </button>
                        <button className="clear-btn" onClick={clearCanvas} title="Clear canvas">✕</button>
                    </div>
                </div>

                <canvas
                    className="canvas-container"
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{ cursor: mode === 'erase' ? 'cell' : 'crosshair' }}
                />
            </div>
        </div>
    );
});

Canvas.displayName = 'Canvas';
export default Canvas;