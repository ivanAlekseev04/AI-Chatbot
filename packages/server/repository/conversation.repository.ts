// FIXME: extract this to the database and retrieve it from the table
const conversations: Map<string, string> = new Map<string, string>(); // conversationId -> lastResponseId
// Every time the conversation is started lets say in ChatGPT, then conversion id in form of GUID is send from the client to the server

export const conversationRepository = {
    getLastResponseId(conversationId: string) {
        return conversations.get(conversationId);
    },

    setLastResponseId(conversationId: string, responseId: string) {
        return conversations.set(conversationId, responseId);
    },
};
