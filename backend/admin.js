const admin = require('../firebaseAdminInit')

async function getAdminUsers() {
    let adminUsers = [];
    let pageToken;
    do {
        const listUsersResult = await admin.auth().listUsers(1000, pageToken);
        listUsersResult.users.forEach((userRecord) => {
            if (userRecord.customClaims && userRecord.customClaims.admin === true) {
                adminUsers.push(userRecord);
            }
        });
        pageToken = listUsersResult.pageToken;
    } while (pageToken);
    return adminUsers;
}

export {
    getAdminUsers
}