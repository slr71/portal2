const { run, ldapAddUserToGroup, irodsChown } = require('./lib');
const { logger } = require('../../lib/logging');
const models = require('../../models');
const config = require('../../../config.json');

async function userCreationWorkflow(user) {
    if (!user)
        throw('Missing required property');

    logger.info(`Running native workflow for user ${user.username} creation`);

    // Calculate number of days since epoch (needed for LDAP)
    const daysSinceEpoch = Math.floor(new Date()/8.64e7);

    // Calculate uidNumber
    // Old method: /repos/portal/cyverse_ldap/utils/get_uid_number.py
    const uidNumber = user.id + config.uidNumberOffset;

    // LDAP: create user
    await run(`echo "dn: uid=${user.username},ou=People,dc=iplantcollaborative,dc=org\nobjectClass: posixAccount\nobjectClass: shadowAccount\nobjectClass: inetOrgPerson\ngivenName: ${user.first_name}\nsn: ${user.last_name}\ncn: ${user.first_name} ${user.last_name}\nuid: ${user.username}\nuserPassword: ${user.password}\nmail: ${user.email}\ndepartmentNumber: ${user.department}\no: ${user.institution}\ntitle: ${user.occupation.name}\nhomeDirectory: /home/${user.username}\nloginShell: /bin/bash\ngidNumber: 10013\nuidNumber: ${uidNumber}\nshadowLastChange:${daysSinceEpoch}\nshadowMin: 1\nshadowMax: 730\nshadowInactive: 10\nshadowWarning: 10" | ldapadd -H ${config.ldap.host} -D ${config.ldap.admin} -w ${config.ldap.password}`);

    // LDAP: add user to groups
    await ldapAddUserToGroup(user.username, "iplant-everyone");
    await ldapAddUserToGroup(user.username, "community");

    // IRODS: create user
    await run([ "iadmin", "mkuser", user.username, "rodsuser" ]);

    // IRODS: set user password
    await run([ "iadmin", "moduser", user.username, "password", user.password ]);

    // IRODS: grant access to user directory 
    await irodsChown("ipcservices", `/iplant/home/${user.username}`);
    await irodsChown("rodsadmin", `/iplant/home/${user.username}`);

    // Mailchimp: subscribe user to newsletter 
    const data = {
        email_address: user.email,
        status: "subscribed",
        merge_fields: {
            FNAME: user.first_name,
            LNAME: user.last_name
        }
    }
    await run([ 
      "curl", "--verbose", "--location", 
          "--header", `Authorization: Basic ${config.mailchimp.apiKey}`, 
          "--header", "Content-Type: application/json",
          "--data", JSON.stringify(data),
          `${config.mailchimp.baseUrl}/lists/${config.mailchimp.listId}/members`
    ]);
}

module.exports = { userCreationWorkflow };