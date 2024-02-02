import MyError from '@/classes/MyError';

const admin = require('../firebaseAdminInit')

async function getAdminUsers(limit = 100, page = 1) {
    if (typeof limit !== 'number')
        throw new MyError({ message: 'Limit must be number' })
    if (typeof page !== 'number')
        throw new MyError({ message: 'Page must be number' })

    let adminUsers = [];
    let pageToken;
    let processedPages = 0;

    do {
        const listUsersResult = await admin.auth().listUsers(limit, pageToken);
        processedPages++;

        if (processedPages === page) {
            listUsersResult.users.forEach((userRecord) => {
                if (userRecord.customClaims && userRecord.customClaims.admin === true) {
                    adminUsers.push(userRecord);
                }
            });
        }

        pageToken = listUsersResult.pageToken;
    } while (pageToken && processedPages < page);

    return adminUsers;
}

async function getAllUsers(limit = 100, page = 1) {
    if (typeof limit !== 'number')
        throw new MyError({ message: 'Limit must be number' });
    if (typeof page !== 'number')
        throw new MyError({ message: 'Page must be number' });

    let allUsers = [];
    let pageToken;
    let processedPages = 0;

    do {
        const listUsersResult = await admin.auth().listUsers(limit, pageToken);
        processedPages++;

        if (processedPages === page) {
            allUsers = listUsersResult.users.map((userRecord) => ({
                uid: userRecord.uid,
                email: userRecord.email,
                emailVerified: userRecord.emailVerified,
                displayName: userRecord.displayName,
                photoURL: userRecord.photoURL,
                phoneNumber: userRecord.phoneNumber,
                disabled: userRecord.disabled,
                metadata: {
                    creationTime: userRecord.metadata.creationTime,
                    lastSignInTime: userRecord.metadata.lastSignInTime,
                    lastRefreshTime: userRecord.metadata.lastRefreshTime,
                },
                providerData: userRecord.providerData,
                passwordHash: userRecord.passwordHash,
                passwordSalt: userRecord.passwordSalt,
                customClaims: userRecord.customClaims,
                tokensValidAfterTime: userRecord.tokensValidAfterTime,
                tenantId: userRecord.tenantId,
            }));
        }

        pageToken = listUsersResult.pageToken;
    } while (pageToken && processedPages < page);

    return allUsers;
}

export {
    getAdminUsers,
    getAllUsers,
}