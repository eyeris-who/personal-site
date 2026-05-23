import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import './scratchcover.scss';

function buildCursorDataURL(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const MAX = 64;
            const scale = Math.min(1, MAX / Math.max(img.width, img.height));
            const w = Math.floor(img.width * scale);
            const h = Math.floor(img.height * scale);
            const c = document.createElement('canvas');
            c.width = w; c.height = h;
            c.getContext('2d').drawImage(img, 0, 0, w, h);
            resolve(c.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

const ScratchCover = forwardRef(({ coverSrc, eraserCursorSrc, active, onFullyErased }, ref) => {
    const canvasRef   = useRef(null);
    const contextRef  = useRef(null);
    const isDrawing   = useRef(false);
    const cursorRef   = useRef(null);

    // Expose clear() to parent if needed
    useImperativeHandle(ref, () => ({
        clear() {
            const canvas = canvasRef.current;
            const ctx = contextRef.current;
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }));

    // Build cursor data URL once
    useEffect(() => {
        if (!eraserCursorSrc) return;
        buildCursorDataURL(eraserCursorSrc).then((url) => {
            cursorRef.current = url;
        });
    }, [eraserCursorSrc]);

    // Apply / remove cursor when active changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (active && cursorRef.current) {
            canvas.style.cursor = `url(${cursorRef.current}) 0 32, cell`;
        } else {
            canvas.style.cursor = 'default';
        }
    }, [active]);

    // Size canvas to its rendered size and draw cover image
    useEffect(() => {
        const canvas = canvasRef.current;
        const rect   = canvas.getBoundingClientRect();
        const dpr    = window.devicePixelRatio || 1;

        canvas.width  = rect.width  * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width  = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineCap   = 'round';
        ctx.lineJoin  = 'round';
        ctx.lineWidth = 40;
        ctx.globalCompositeOperation = 'destination-out';
        contextRef.current = ctx;

        // Draw cover image centred on the face area
        const img = new Image();
        img.src = coverSrc;
        img.onload = () => {
            // Reset composite to draw the cover image solid first
            ctx.globalCompositeOperation = 'source-over';
            // Position cover the same as the CSS: top 25%, centred horizontally, width 50%
            const coverW = rect.width * 0.5;
            const coverH = (img.naturalHeight / img.naturalWidth) * coverW;
            const coverX = (rect.width - coverW) / 2;
            const coverY = rect.height * 0.25;
            ctx.save();
            ctx.translate(coverX + coverW / 2, coverY + coverH / 2);
            ctx.rotate(10 * Math.PI / 180);
            ctx.drawImage(img, -coverW / 2, -coverH / 2, coverW, coverH);
            ctx.restore();
            // Switch back to erasing mode
            ctx.globalCompositeOperation = 'destination-out';
        };
    }, [coverSrc]);

    const getPos = (nativeEvent) => {
        const canvas = canvasRef.current;
        const rect   = canvas.getBoundingClientRect();
        const clientX = nativeEvent.touches ? nativeEvent.touches[0].clientX : nativeEvent.clientX;
        const clientY = nativeEvent.touches ? nativeEvent.touches[0].clientY : nativeEvent.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const checkErased = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx    = canvas.getContext('2d');
        const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent = 0;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 128) transparent++;
        }
        if (transparent / (data.length / 4) > 0.65) onFullyErased?.();
    }, [onFullyErased]);

    const startDrawing = ({ nativeEvent }) => {
        if (!active) return;
        const { x, y } = getPos(nativeEvent);
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        isDrawing.current = true;
        nativeEvent.preventDefault();
    };

    const draw = ({ nativeEvent }) => {
        if (!active || !isDrawing.current) return;
        const { x, y } = getPos(nativeEvent);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
        nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
        if (!isDrawing.current) return;
        contextRef.current.closePath();
        isDrawing.current = false;
        checkErased();
    };

    return (
        <canvas
            ref={canvasRef}
            className={`scratch-cover ${active ? 'scratch-cover--active' : ''}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
        />
    );
});

ScratchCover.displayName = 'ScratchCover';
export default ScratchCover;