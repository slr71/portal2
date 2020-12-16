const crypto = require("crypto");
const axios = require('axios');
const { ldapAddUserToGroup, irodsMkDir, irodsChMod} = require('./lib');
const { logger } = require('../../lib/logging');
const models = require('../../models');
const MailingList = models.api_mailinglist;
const EmailAddress = models.account_emailaddress;
const EmailAddressToMailingList = models.api_emailaddressmailinglist;
const config = require('../../../config.json');

const servicesConfig = {
    ATMOSPHERE: {
        ldapGroup: 'atmo-user',
        mailingList: 'atmosphere-users'
    },
    BISQUE: {
        irodsPath: 'bisque_data',
        mailingList: 'bisque-users',
        customAction: createBisqueUser
    },
    COGE: {
        irodsPath: 'coge_data'
    },
    DISCOVERY_ENVIRONMENT: {
        ldapGroup: 'de-preview-access',
        mailingList: [ 'de-users', 'datastore-users' ]
    },
    SCI_APPS: {
        irodsPath: 'sci_data',
        irodsUser: 'maizecode'
    }
}

async function serviceRegistrationWorkflow(request) {
    const user = request.user;
    const service = request.service;
    if (!user || !service)
        throw('Missing required property');

    logger.info(`Running native workflow for service ${service.name} and user ${user.username}`);

    const cfg = servicesConfig[request.service.approval_key];

    // LDAP: add user to service group
    if (cfg.ldapGroup)
        await ldapAddUserToGroup(user.username, cfg.ldapGroup);

    // IRODS: create service directory
    if (cfg.irodsPath) {
        await irodsMkDir(`/iplant/home/${user.username}/${cfg.irodsPath}`);
        await irodsChMod('inherit', '', cfg.irodsPath);
        await irodsChMod('own', user.username, cfg.irodsPath);

        if (cfg.irodsUser)
            await irodsChMod('own', cfg.irodsUser, cfg.irodsPath);
    }

    // Add user's primary email to service mailing list(s)
    if (cfg.mailingList) {
        const lists = Array.isArray(cfg.mailingList) ? cfg.mailingList : [ cfg.mailingList ];
        for (let list of lists)
            await addEmailToMailingList(user.email, list);
    }

    // Execute custom steps (BisQue only)
    if (cfg.customAction) {
        const actions = Array.isArray(cfg.customAction) ? cfg.customAction : [ cfg.customAction ];
        for (let fn of actions) {
            if (typeof fn === "function")
                await fn(request);
        }
    }
}

async function addEmailToMailingList(email, listName) {
    const mailingList = await MailingList.findOne({ where: { list_name: listName } });
    if (!mailingList)
        return;

    const emailAddress = await EmailAddress.findOne({ where: { email } });
    if (!emailAddress)
        return;

    await EmailAddressToMailingList.findOrCreate({ 
        where: {
          mailing_list_id: mailingList.id,
          email_address_id: emailAddress.id
        },
        defaults: {
          is_subscribed: true
        }
    });
}

async function createBisqueUser(request) {
    const password = crypto.randomBytes(12).toString('hex');
    const xml = `<user name="${request.user.username}">
        <tag name="password" value="${password}" />
        <tag name="email" value="${request.user.email}"/>
        <tag name="display_name" value="${request.user.username}"/>
    </user>`;

    const token = Buffer.from(`${config.bisque.username}:${config.bisque.password}`).toString('base64');

    logger.info(`POST request to ${config.bisque.url}`);
    return await axios.post(config.bisque.url, xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Authorization': `Basic ${token}`
        },
        timeout: 30*1000
    });
}

module.exports = { serviceRegistrationWorkflow };