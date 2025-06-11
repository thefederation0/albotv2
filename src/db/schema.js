"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationsTable = exports.gameDivisonsTabel = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
//export const schema = pgSchema("albot");
exports.gameDivisonsTabel = (0, pg_core_1.pgTable)('game_divisions', {
    gameId: (0, pg_core_1.text)('gameId').primaryKey(),
    emojiName: (0, pg_core_1.text)('emojiName'),
    gameName: (0, pg_core_1.text)('gameName'),
    applicationChannelId: (0, pg_core_1.text)('applicationChannelId'),
    welcomeChannelId: (0, pg_core_1.text)('welcomeChannelId'),
    roles: (0, pg_core_1.json)('roles').default([]),
    questions: (0, pg_core_1.json)('questions').default([]),
    selectOptions: (0, pg_core_1.json)('selectOptions').default([]),
    assignableRoles: (0, pg_core_1.json)('assignableRoles').default([]),
    autoAccept: (0, pg_core_1.boolean)('autoAccept').default(false),
    shorthand: (0, pg_core_1.text)('shorthand'),
    divisionTag: (0, pg_core_1.text)('divisionTag'),
    welcomeMessage: (0, pg_core_1.text)('welcomeMessage').default("<@#USER_ID> welcome! Here are the appropriate channels."),
});
exports.applicationsTable = (0, pg_core_1.pgTable)('applications', {
    gameId: (0, pg_core_1.text)('gameId').references(() => exports.gameDivisonsTabel.gameId),
    userId: (0, pg_core_1.text)('userId'),
    channelId: (0, pg_core_1.text)('channelId').unique(),
    logMessage: (0, pg_core_1.text)('logMessage').unique(),
    answers: (0, pg_core_1.json)('answers').default([]),
    imageUrl: (0, pg_core_1.text)('imageUrl').default(""),
    createdAt: (0, pg_core_1.text)('createdAt').default(new Date().toISOString()),
    updatedAt: (0, pg_core_1.text)('updatedAt').default(new Date().toISOString())
}, (table) => [
    (0, pg_core_1.primaryKey)({ columns: [table.gameId, table.userId] })
]);
