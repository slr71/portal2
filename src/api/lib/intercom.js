/*
 * Intercom interface
 *
 * Based on v1: https://gitlab.cyverse.org/core-services/portal/blob/master/portal/intercom/__init__.py
 * 
 * For Intercom API v1: https://developers.intercom.com/intercom-api-reference/v1.0/reference
 * 
 */

const Intercom = require('intercom-client');
const { logger } = require('./logging');
const config = require('../../config.json');

const intercom = new Intercom.Client({ token: config.intercom.token });

async function createUser(user) {
    const existingUser = await intercom.users.find({ user_id: user.username });
    if (existingUser && existingUser.body)
        return existingUser.body;

    const newUser = await intercom.users.create({
        email: user.email,
        name: user.first_name + ' ' + user.last_name,
        user_id: user.username
    });
    if (!newUser || !newUser.body)
        return;

    logger.info(`Created Intercom user ${newUser.body.id} for ${user.username}`);

    return newUser.body;
}

async function getConversation(id) {
    try {
        const res = await intercom.conversations.find({ id });
        if (res && res.body)
            return res.body;
    }
    catch (error) {
        logger.error('getConversation:', error)
    }
}

async function startConversation(user, body) {
    // Make sure user exists
    const intercomUser = await createUser(user);
    if (!intercomUser) {
        logger.error(`Error creating Intercom user ${user.username}`);
        return;
    }
    logger.debug(intercomUser);

    // Create user-initiated message (which will result in creation of a new conversation)
    const message = await intercom.messages.create({
        from: {
            type: "user",
            // "email": user.email, // mdb replaced 12/8/20 -- with user_id due to error "Multiple existing users match this email address - must be more specific using user_id"
            id: intercomUser.id
        },
        body
    });
    if (!message) {
        logger.error(`Error creating Intercom message for user ${user.username}`);
        return;
    }
    logger.debug(intercomUser);

    logger.info(`Created Intercom message ${message.body.id} for ${user.username}`);

    // Poll for conversation creation
    let tries = 10;
    let conversation;
    do {
        await new Promise(resolve => setTimeout(resolve, 1000)); // sleep 1 second

        try {
            const conversations = await intercom.conversations.list({ type: 'user', user_id: user.username });
            if (conversations && conversations.body && conversations.body.conversations) {
                conversation = conversations.body.conversations.find(c => c.conversation_message.id == message.body.id);
            }
        }
        catch (error) {
            // do nothing
        }

    } while (!conversation && tries-- > 0);

    if (conversation) {
        logger.info(`Started Intercom conversation ${conversation.id} for ${user.username}`);
        return [conversation, message.body];
    }
    
    logger.error(`Couldn't find conversation for message ${message.body.id}`);
    return [];
}

async function addNoteToConversation(conversationId, message) {
    try {
        await intercom.conversations.reply({
            id: conversationId,
            type: 'admin',
            admin_id: config.intercom.adminUserPortalBotId,
            message_type: 'note',
            body: message
        })
    }
    catch (e) {
        logger.error(e.body.errors)
    }
}

async function assignConversationToAtmosphereTeam(conversationId) {
    await assignConversation(conversationId, config.intercom.adminTier1AtmosphereId)
}

async function assignConversationToScienceTeam(conversationId) {
    await assignConversation(conversationId, config.intercom.adminTier1ScienceTeamId)
}

async function assignConversationToIntercomTeam(conversationId, intercomTeamId) {
    await assignConversation(conversationId, intercomTeamId)
}

async function assignConversation(conversationId, assigneeId) {
    await intercom.conversations.reply({
        id: conversationId,
        type: 'admin',
        admin_id: config.intercom.adminUserPortalBotId,
        assignee_id: assigneeId,
        message_type: 'assignment'
    })
}

async function replyToConversation(conversationId, message) {
    await intercom.conversations.reply({
        id: conversationId,
        type: 'admin',
        admin_id: config.intercom.adminUserPortalBotId,
        message_type: 'comment',
        body: message
    });
}

module.exports = { 
    getConversation,
    startConversation,
    addNoteToConversation,
    replyToConversation,
    assignConversationToAtmosphereTeam,
    assignConversationToScienceTeam,
    assignConversationToIntercomTeam
};