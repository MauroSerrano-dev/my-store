import MyError from '@/classes/MyError';

const admin = require('../firebaseAdminInit')

async function getAdminUsers(limit = 100, page = 1) {
    if (typeof limit !== 'number')
        throw new MyError('Limit must be number')
    if (typeof page !== 'number')
        throw new MyError('Page must be number')

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

export {
    getAdminUsers
}