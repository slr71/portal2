const { ldapCreateUser, ldapModify, ldapChangePassword, ldapAddUserToGroup, ldapDeleteUser, irodsCreateUser, irodsChMod, irodsChangePassword, irodsDeleteUser, mailchimpUpdateSubscription } = require('./lib');
const { logger } = require('../../lib/logging');
const config = require('../../../config.json');

async function userCreationWorkflow(user) {
    if (!user)
        throw('Missing required property');

    logger.info(`Running native workflow for user ${user.username}: creation`);

    // LDAP: create user
    await ldapCreateUser(user);

    // LDAP: add user to groups
    await ldapAddUserToGroup(user.username, "iplant-everyone");
    await ldapAddUserToGroup(user.username, "community");

    // IRODS: create user
    await irodsCreateUser(user.username);

    // IRODS: set user password
    await irodsChangePassword(user.username, user.password);

    // IRODS: grant access to user directory 
    await irodsChMod("own", "ipcservices", `/iplant/home/${user.username}`);
    await irodsChMod("own", "rodsadmin", `/iplant/home/${user.username}`);

    // Mailchimp: subscribe user to newsletter 
    await mailchimpUpdateSubscription(user.email, user.first_name, user.last_name, true);
}

async function userPasswordUpdateWorkflow(user) {
    if (!user)
        throw('Missing required property');

    logger.info(`Running native workflow for user ${user.username}: password update`);

    // LDAP: update user password
    await ldapChangePassword(user.username, user.password);

    // LDAP: update shadowLastChange 
    const daysSinceEpoch = Math.floor(new Date()/8.64e7);
    await ldapModify(user.username, 'shadowLastChange', daysSinceEpoch)

    // IRODS: set user password
    await irodsChangePassword(user.username, user.password);
}

// Based on v1 portal:/account/views/user.py:perform_destroy()
async function userDeletionWorkflow(user) {
    if (!user || !user.emails)
        throw('Missing required property');

    logger.info(`Running native workflow for user ${user.username}: deletion`);

    // LDAP: delete user
    try {
        await ldapDeleteUser(user.username);
    }
    catch(e) {}

    // IRODS: delete user
    try {
        await irodsDeleteUser(user.username);
    }
    catch(e) {}

    // Mailchimp: unsubscribe user from newsletter 
    try {
        await mailchimpUpdateSubscription(user.email, user.first_name, user.last_name, false);
    }
    catch(e) {}

    // Mailman: unsubscribe from mailing lists
    for (const email of user.emails) {
        for (const mailingList of email.mailing_lists) {
            try {
                await mailmanUpdateSubscription(mailingList.list_name, user.email, false);
            }
            catch(e) {}
        }
    }
}

module.exports = { userCreationWorkflow, userDeletionWorkflow, userPasswordUpdateWorkflow };