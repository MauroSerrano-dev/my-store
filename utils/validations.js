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