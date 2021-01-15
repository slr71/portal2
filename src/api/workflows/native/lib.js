const { exec, execFile } = require('child_process');
var crypto = require('crypto');
const config = require('../../../config.json');

// Escape args with escapeShell() or use runFile() instead
function run(strOrArray) {
    let cmdStr = strOrArray;
    if (Array.isArray(strOrArray))
        cmdStr = strOrArray.join(' ');

    console.log("run: " + cmdStr);

    return new Promise(function(resolve, reject) {
        exec(
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

// Safer than run, escaping of args not required
function runFile(cmd, args) {
    console.log("run:", cmd, args.join(' '));

    return new Promise(function(resolve, reject) {
        execFile(
            cmd, args,
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

function dockerRun(args) {
    return runFile("docker", [ "run", config.nativeWorkflow.image, ...args ])
}

function ldapCreateUser(user) {
    // Calculate number of days since epoch (needed for LDAP)
    const daysSinceEpoch = Math.floor(new Date()/8.64e7);

    // Calculate uidNumber
    // Old method: /repos/portal/cyverse_ldap/utils/get_uid_number.py
    const uidNumber = user.id + config.uidNumberOffset;

    // username and occupation name will be shell safe values but others should be escaped
    return run(`echo "dn: uid=${user.username},ou=People,dc=iplantcollaborative,dc=org\nobjectClass: posixAccount\nobjectClass: shadowAccount\nobjectClass: inetOrgPerson\ngivenName: ${escapeShell(user.first_name)}\nsn: ${escapeShell(user.last_name)}\ncn: ${escapeShell(user.first_name + ' ' + user.last_name)}\nuid: ${user.username}\nmail: ${escapeShell(user.email)}\ndepartmentNumber: ${escapeShell(user.department)}\no: ${escapeShell(user.institution)}\ntitle: ${user.occupation.name}\nhomeDirectory: /home/${user.username}\nloginShell: /bin/bash\ngidNumber: 10013\nuidNumber: ${uidNumber}\nshadowLastChange:${daysSinceEpoch}\nshadowMin: 1\nshadowMax: 730\nshadowInactive: 10\nshadowWarning: 10" | ldapadd -H ${config.ldap.host} -D ${config.ldap.admin} -w ${config.ldap.password} -o nettimeout=5`);
}

function ldapModify(username, attribute, value) {
    // username and attribute will be shell safe values but value should be escaped
    return run(`echo "dn: uid=${username},ou=People,dc=iplantcollaborative,dc=org\nreplace: ${attribute}\n${attribute}: ${escapeShell(value)}" | ldapmodify -H ${config.ldap.host} -D ${config.ldap.admin} -w ${config.ldap.password} -o nettimeout=5`);
}

function ldapChangePassword(username, password) {
    return runFile("ldappasswd", [
        "-H", config.ldap.host, 
        "-D", config.ldap.admin,
        "-w", config.ldap.password, 
        "-s", password,
        "-o", "nettimeout=5", // shorten the network timeout, default 30s causes API requests to timeout
        `uid=${username},ou=People,dc=iplantcollaborative,dc=org`
    ]);
}

function ldapAddUserToGroup(username, group) {
    return run(`echo "dn: cn=${group},ou=Groups,dc=iplantcollaborative,dc=org\nchangetype: modify\nadd: memberUid\nmemberUid: ${username}" | ldapmodify -H ${config.ldap.host} -D ${config.ldap.admin} -w ${config.ldap.password} -o nettimeout=5`);
}

function ldapDeleteUser(username) {
    return runFile("ldapdelete", [
        "-H", config.ldap.host, 
        "-D", config.ldap.admin, 
        "-w", config.ldap.password,
        "-o", "nettimeout=5", // shorten the network timeout, default 30s causes API requests to timeout
        `uid=${username},ou=People,dc=iplantcollaborative,dc=org`
    ]);
}

function irodsCreateUser(username) {
    return dockerRun([ "iadmin", "mkuser", username, "rodsuser" ]);
}

function irodsMkDir(path) {
    return dockerRun([ 'imkdir', '-p', path ])
}

function irodsChMod(permission, username, path) {
    return dockerRun([ "ichmod", permission, username, path]);
}

function irodsChangePassword(username, password) {
    return dockerRun([ "iadmin", "moduser", username, "password", password ])
}

function irodsDeleteUser(username) {
    return dockerRun([ "iadmin", "rmuser", username ]);
}

function mailchimpSubscribe(email, firstName, lastName) {
    const data = {
        email_address: email,
        status: "subscribe",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    }
    return runFile("curl", [
        "--location", 
        "--header", `Authorization: Basic ${config.mailchimp.apiKey}`, 
        "--header", "Content-Type: application/json",
        "--data", JSON.stringify(data),
        `${config.mailchimp.baseUrl}/lists/${config.mailchimp.listId}/members`
    ]);
}

function mailchimpDelete(email) {
    const hash = crypto.createHash('md5').update(email).digest('hex');
    return runFile("curl", [
        "--location", 
        "--header", `Authorization: Basic ${config.mailchimp.apiKey}`, 
        `${config.mailchimp.baseUrl}/lists/${config.mailchimp.listId}/members/${hash}/actions/delete-permanent`
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

    return runFile("curl", [ "--location", "-X", "POST", `${baseUrl}/${endpoint}?${params}`]);
}

function escapeShell(cmd) {
    if (typeof cmd != 'undefined' && cmd.length > 0)
        return cmd.replace(/(["\s'$\@\&`\\])/g,'\\$1');
    return '';
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
    mailchimpSubscribe,
    mailchimpDelete,
    mailmanUpdateSubscription
};
