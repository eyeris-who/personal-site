import './canvas.scss';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import pencilImg from '../../assets/pencil.png';
import eraserImg from '../../assets/eraser.png';
import pencilCursorSrc from '../../assets/pencil-cursor.png';
import eraserCursorSrc from '../../assets/eraser-cursor.png';

// Resizes any image URL to max 64x64 and returns a data URL safe to use as cursor
function buildCursorDataURL(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const MAX = 64;
            const scale = Math.min(1, MAX / Math.max(img.width, img.height));
            const w = Math.floor(img.width * scale);
            const h = Math.floor(img.height * scale);
            const c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            c.getContext('2d').drawImage(img, 0, 0, w, h);
            resolve(c.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

const Canvas = forwardRef((_props, ref) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [mode, setMode] = useState('draw');
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const hasDrawnRef = useRef(false);
    const cursorsRef = useRef({ pencil: null, eraser: null });
    const DEFAULT_LINE_WIDTH = 5;

    useImperativeHandle(ref, () => ({
        getDataURL() {
            if (!hasDrawnRef.current) return null;
            return canvasRef.current.toDataURL('image/png');
        },
        clear() {
            clearCanvas();
        },
    }));

    // Pre-build safe cursor data URLs once on mount
    useEffect(() => {
        Promise.all([
            buildCursorDataURL(pencilCursorSrc),
            buildCursorDataURL(eraserCursorSrc),
        ]).then(([pencil, eraser]) => {
            cursorsRef.current = { pencil, eraser };
            // Apply initial cursor
            if (canvasRef.current && pencil) {
                canvasRef.current.style.cursor = `url(${pencil}) 0 32, crosshair`;
            }
        });
    }, []);

    // Apply cursor whenever mode changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { pencil, eraser } = cursorsRef.current;
        if (mode === 'erase' && eraser) {
            canvas.style.cursor = `url(${eraser}) 0 32, cell`;
        } else if (pencil) {
            canvas.style.cursor = `url(${pencil}) 0 32, crosshair`;
        }
    }, [mode]);

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

    const getPointerPosition = (nativeEvent) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        // touch events to expose clientX/Y
        const clientX = nativeEvent.touches
            ? nativeEvent.touches[0].clientX
            : nativeEvent.clientX;
        const clientY = nativeEvent.touches
            ? nativeEvent.touches[0].clientY
            : nativeEvent.clientY;
        return { x: clientX- rect.left, y: clientY - rect.top };
    };

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
            <div className="canvas-wrapper">
                <canvas
                    className="canvas-container"
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                />
                <button
                    onClick={() => setMode('draw')}
                    className={`canvas-icon-btn pencil-btn ${mode === 'draw' ? 'active' : ''}`}
                    title="Draw"
                >
                    <img src={pencilImg} alt="Draw" />
                </button>
                <button
                    onClick={() => setMode('erase')}
                    className={`canvas-icon-btn eraser-btn ${mode === 'erase' ? 'active' : ''}`}
                    title="Erase"
                >
                    <img src={eraserImg} alt="Erase" />
                </button>
                <button className="canvas-clear-btn" onClick={clearCanvas} title="Clear canvas">✕</button>
            </div>
        </div>
    );
});

Canvas.displayName = 'Canvas';
export default Canvas;