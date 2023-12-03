export function isStrongPassword(password) {
    const lengthRegex = /.{6,}/;
    const lowercaseRegex = /[a-z]+/;
    const uppercaseRegex = /[A-Z]+/;
    const numberRegex = /[0-9]+/;

    const isLengthValid = lengthRegex.test(password);
    const isLowercaseValid = lowercaseRegex.test(password);
    const isUppercaseValid = uppercaseRegex.test(password);
    const isNumberValid = numberRegex.test(password);

    if (!isLengthValid) {
        return "password_length";
    }

    if (!isLowercaseValid) {
        return "password_lowercase";
    }

    if (!isUppercaseValid) {
        return "password_uppercase";
    }

    if (!isNumberValid) {
        return "password_number";
    }

    return true;
}

export function isAdmin(auth) {
    return auth?.currentUser && process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS.includes(auth.currentUser.email) && auth.currentUser.emailVerified
}

export function handleReCaptchaSuccess(userToken, setReCaptchaSolve) {
    setReCaptchaSolve(true) // está assim devido ao tempo que demora a chamada api para liberar o botão

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            authorization: process.env.NEXT_PUBLIC_APP_TOKEN
        },
        body: JSON.stringify({
            response: userToken,
            expectedAction: 'login',
        }),
    }

    fetch("/api/google-re-captcha", options)
}

export function handleReCaptchaError(setReCaptchaSolve) {
    setReCaptchaSolve(false)
}