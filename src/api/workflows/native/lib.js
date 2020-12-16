const { exec } = require('child_process');
const config = require('../../../config.json');

const dockerCmd = config.nativeWorkflow && config.nativeWorkflow.image ? `docker run ${config.nativeWorkflow.image}` : '';
//TODO run all commands via docker image

function run(strOrArray) {
    let cmdStr = strOrArray;
    if (Array.isArray(strOrArray))
        cmdStr = strOrArray.join(' ');

    console.log("run: " + cmdStr);

    return new Promise(function(resolve, reject) {
        const child = exec(
            cmdStr,
            (error, stdout, stderr) => {
                console.log('run:stdout:', stdout);
                console.log('run:stderr:', stderr);

                if (error) {
                    console.log('run:error:', error);
                    reject(error);
                }
                else {
                    resolve(stdout);
                }
            }
        );
    });
}

function ldapCreateUser(user) {
    // Calculate number of days since epoch (needed for LDAP)
    const daysSinceEpoch = Math.floor(new Date()/8.64e7);

    // Calculate uidNumber
    // Old method: /repos/portal/cyverse_ldap/utils/get_uid_number.py
    const uidNumber = user.id + config.uidNumberOffset;

    return run(`echo "dn: uid=${user.username},ou=People,dc=iplantcollaborative,dc=org\nobjectClass: posixAccount\nobjectClass: shadowAccount\nobjectClass: inetOrgPerson\ngivenName: ${user.first_name}\nsn: ${user.last_name}\ncn: ${user.first_name} ${user.last_name}\nuid: ${user.username}\nuserPassword: ${user.password}\nmail: ${user.email}\ndepartmentNumber: ${user.department}\no: ${user.institution}\ntitle: ${user.occupation.name}\nhomeDirectory: /home/${user.username}\nloginShell: /bin/bash\ngidNumber: 10013\nuidNumber: ${uidNumber}\nshadowLastChange:${daysSinceEpoch}\nshadowMin: 1\nshadowMax: 730\nshadowInactive: 10\nshadowWarning: 10" | ldapadd -H ${config.ldap.host} -D ${config.ldap.admin} -w ${config.ldap.password}`);
}

function ldapModify(username, attribute, value) {
    return run(`echo "dn: uid={${username},ou=People,dc=iplantcollaborative,dc=org\n${attribute}:${value}" | ldapmodify -H ${config.ldap.host} -D ${config.ldap.admin} -w ${config.ldap.password}`);
}

function ldapChangePassword(username, password) {
    return run([ "ldappasswd", 
        "-H", config.ldap.host, 
        "-D", `uid=${username},ou=People,dc=iplantcollaborative,dc=org`,
        "-w", config.ldap.password, 
        "-s", password
    ]);
}

function ldapAddUserToGroup(username, group) {
    return run(`echo "dn: cn=${group},ou=Groups,dc=iplantcollaborative,dc=org\nchangetype: modify\nadd: memberUid\nmemberUid: ${username}" | ldapmodify -H ${config.ldap.host} -D ${config.ldap.admin} -w ${config.ldap.password}`);
}

function ldapDeleteUser(username) {
    return run(`echo "dn: uid=${username},ou=People,dc=iplantcollaborative,dc=org" | ldapdelete -H ${config.ldap.host} -D ${config.ldap.admin} -w ${config.ldap.password}`);
}

function irodsCreateUser(username) {
    return run([ dockerCmd, "iadmin", "mkuser", username, "rodsuser" ]);
}

function irodsMkDir(path) {
    return run([ dockerCmd, 'imkdir', '-p', path ])
}

function irodsChMod(permission, username, path) {
    return run([ dockerCmd, "ichmod", permission, username, path]);
}

function irodsChangePassword(username, password) {
    return run([ dockerCmd, "iadmin", "moduser", username, "password", password ])
}

function irodsDeleteUser(username) {
    return run([ "iadmin", "rmuser", username ]);
}

function mailchimpUpdateSubscription(email, firstName, lastName, subscribe) {
    const data = {
        email_address: email,
        status: subscribe ? "subscribe" : "unsubscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    }
    return run([ "curl", "--verbose", "--location", 
        "--header", `Authorization: Basic ${config.mailchimp.apiKey}`, 
        "--header", "Content-Type: application/json",
        "--data", JSON.stringify(data),
        `${config.mailchimp.baseUrl}/lists/${config.mailchimp.listId}/members`
    ]);
}

function mailmanUpdateSubscription(listName, email, subscribe) {
    const baseUrl = `${config.mailman.serverUrl}/mailman/admin/${listName}/members`;

    let params, endpoint;
    if (subscribe) {
        params = new URLSearchParams({
            subscribe_or_invite: 0,
            send_welcome_msg_to_this_batch: 0,
            subscribees_upload: email,
            adminpw: config.mailman.adminPassword
        }).toString();

        endpoint = 'add';
    }
    else {
        params = new URLSearchParams({
            send_unsub_ack_to_this_batch: 0,
            send_unsub_notifications_to_list_owner: 0,
            unsubscribees_upload: email,
            adminpw: config.mailman.adminPassword
        }).toString();

        endpoint = 'remove';
    }

    return run([ "curl", "--verbose", "--location", `${baseUrl}/${endpoint}?${params}`]);
}

module.exports = { 
    run, 
    ldapCreateUser,
    ldapModify,
    ldapChangePassword,
    ldapAddUserToGroup, 
    ldapDeleteUser,
    irodsCreateUser,
    irodsMkDir,
    irodsChMod,
    irodsChangePassword,
    irodsDeleteUser,
    mailchimpUpdateSubscription,
    mailmanUpdateSubscription
};