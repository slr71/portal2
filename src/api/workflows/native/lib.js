const { exec } = require('child_process');
const config = require('../../../config.json');

const dockerCmd = config.nativeWorkflow && config.nativeWorkflow.image ? `docker run -it ${config.nativeWorkflow.image}` : '';

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

function ldapAddUserToGroup(username, group) {
    return run(`echo "dn: cn=${group},ou=Groups,dc=iplantcollaborative,dc=org\nchangetype: modify\nadd: memberUid\nmemberUid: ${username}" | ldapmodify -H ${config.ldap.host} -D ${config.ldap.admin} -w ${config.ldap.password}`);
}

function irodsChown(username, path) {
    return run([ dockerCmd, "ichmod", "own", username, path]);
}

module.exports = { run, dockerCmd, ldapAddUserToGroup, irodsChown };