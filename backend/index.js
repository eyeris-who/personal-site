import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' })); // canvas images can be large

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/api/contact', async (req, res) => {
    const { name, email, message, canvasImage } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Build attachments array — only include the drawing if the canvas wasn't left blank
    const attachments = [];
    if (canvasImage) {
        // canvasImage arrives as a data URL: "data:image/png;base64,<data>"
        const base64Data = canvasImage.replace(/^data:image\/png;base64,/, '');
        attachments.push({
            filename: 'drawing.png',
            content: base64Data,
            encoding: 'base64',
            contentType: 'image/png',
        });
    }

    try {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            replyTo: email,
            subject: `New message from ${name}`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                ${canvasImage ? '<p><strong>Drawing attached.</strong></p>' : ''}
            `,
            attachments,
        });

        res.json({ success: true });
    } catch (err) {
        console.error('Mail error:', err);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));