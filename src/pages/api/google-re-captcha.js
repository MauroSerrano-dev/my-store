import axios from 'axios';
import { isTokenValid } from '@/utils/auth';

export default async function handler(req, res) {
    const { authorization } = req.headers;
    const { response } = req.body;

    if (!authorization) {
        res.status(401).json({ error: "Invalid authentication" });
    }

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY)) {
        res.status(401).json({ error: "Invalid authentication" });
    }

    try {
        const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RE_CAPTCHA_KEY_SERVER}&response=${response}`);

        res.status(200).json(recaptchaResponse.data);
    } catch (error) {
        console.log("Error with Google reCAPTCHA", error.message)
        res.status(error.statusCode || 500).json({ error: error, message: "Error with Google reCAPTCHA" });
    }
}