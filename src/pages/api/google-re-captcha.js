import axios from 'axios';
import { isTokenValid } from '@/utils/auth';

export default async function handler(req, res) {
    const { authorization } = req.headers;
    const { response, expectedAction } = req.body;

    if (!authorization) {
        return res.status(401).json({ error: "Invalid authentication" });
    }

    if (!isTokenValid(authorization, process.env.APP_SECRET_KEY)) {
        return res.status(401).json({ error: "Invalid authentication" });
    }

    try {
        const recaptchaResponse = await axios.post(
            `https://recaptchaenterprise.googleapis.com/v1/projects/my-store-4aef7/assessments?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
            {
                "event": {
                    "token": response,
                    "expectedAction": expectedAction,
                    "siteKey": process.env.NEXT_PUBLIC_RE_CAPTCHA_KEY
                }
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        res.status(200).json(recaptchaResponse.data);
    } catch (error) {
        console.log("Error with Google reCAPTCHA", error)
        res.status(500).json({ error: error, message: "Error with Google reCAPTCHA" });
    }
}