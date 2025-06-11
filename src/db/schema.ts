import {text, json, primaryKey, boolean, pgTable} from "drizzle-orm/pg-core";

//export const schema = pgSchema("albot");

export const gameDivisonsTabel = pgTable('game_divisions', {
    gameId: text('gameId').primaryKey(),
    emojiName: text('emojiName'),
    gameName: text('gameName'),
    applicationChannelId: text('applicationChannelId'),
    welcomeChannelId: text('welcomeChannelId'),
    roles: json('roles').default([]),
    questions: json('questions').default([]),
    selectOptions: json('selectOptions').default([]),
    assignableRoles: json('assignableRoles').default([]),
    image: json('image').default([]),
    autoAccept: boolean('autoAccept').default(false),
    shorthand: text('shorthand'),
    divisionTag: text('divisionTag'),
    welcomeMessage: text('welcomeMessage').default("<@#USER_ID> welcome! Here are the appropriate channels."),
})

export const applicationsTable = pgTable('applications', {
    gameId: text('gameId').references(() => gameDivisonsTabel.gameId),
    userId: text('userId'),
    channelId: text('channelId').unique(),
    logMessage: text('logMessage').unique(),
    answers: json('answers').default([]),
    imageUrl: text('imageUrl').default(""),
    createdAt: text('createdAt').default(new Date().toISOString()),
    updatedAt: text('updatedAt').default(new Date().toISOString())
}, (table) => [
    primaryKey({columns: [table.gameId, table.userId]})
]);