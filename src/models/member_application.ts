import {EmbedBuilder, Guild, GuildMember, Message, TextThreadChannel} from "discord.js";
import {GameDivision} from "./game_division";
import {client} from "../bot";
import {applicationsTable} from "../db/schema";
import {eq} from "drizzle-orm";

export class MemberApplication {

    private static _cache = new Map<string, MemberApplication>();

    private readonly _gameId: string;
    private readonly _member: GuildMember;
    private readonly _thread: TextThreadChannel;
    private readonly _division: GameDivision;
    private _logMessage: Message | null = null;
    private _answers: Answer[] = [];
    private _image: string = "";
    private _age: number = -1;

    /**
     * Parses a string into an object containing the interaction ID, user ID, channel ID, and game ID.
     *
     * The input string is expected to be in the format: "interactionId-userId-channelId-gameId".
     * If the channelId or gameId is not provided in the string, they will default to an empty string.
     *
     * @param str - The input string to parse, formatted as "interactionId-userId-channelId-gameId".
     * @returns An object containing the parsed IDs.
     * @example
     * ```typescript
     * const result = MemberApplication.parseId("123-456-789-012");
     * console.log(result); // { id: "123", userId: "456", channelId: "789", gameId: "012" }
     * ```
     */
    static parseId(str: string) {
        // interactionId-userId-channelId-gameId
        const split = str.split('-')
        const id = split[0]
        const userId = split[1]
        const channelId = split[2] || ''
        const gameId = split[3] || ''

        return {id, userId, channelId, gameId}
    }

    private constructor( member: GuildMember, thread: TextThreadChannel, gameId: string, division: GameDivision ) {
        this._member = member;
        this._thread = thread;
        this._gameId = gameId;
        this._division = division;

        MemberApplication._cache.set(this._thread.id, this)
    }

    /**
     * Creates or retrieves a member application associated with a specific thread and game division.
     *
     * @param {GuildMember} member - The guild member for whom the application is being created or retrieved.
     * @param {TextThreadChannel} thread - The thread channel associated with the application.
     * @param {string} gameId - The unique identifier for the game.
     * @param {GameDivision} division - The division of the game for which the application is relevant.
     * @return {Promise<MemberApplication>} The member application for the specified thread and game division.
     */
    public new( member: GuildMember, thread: TextThreadChannel, gameId: string, division: GameDivision ): MemberApplication {
        return MemberApplication._cache.get(thread.id.toString()) || new MemberApplication(member, thread, gameId, division);
    }

    get division(): GameDivision {
        return this._division;
    }

    get logMessage(): Message | null {
        return this._logMessage;
    }

    get answers(): any[] {
        return this._answers;
    }

    get image(): string {
        return this._image;
    }

    get age(): number {
        return this._age;
    }

    private get member(): GuildMember {
        return this._member;
    }

    private get thread(): TextThreadChannel {
        return this._thread;
    }

    private get gameId(): string {
        return this._gameId;
    }

    /**
     * Fetches an application with the provided applicationThreadId from the cache or the database.
     *
     * @param applicationId - the ID of the application's thread.
     * @param guild - the guild.
     * @return {MemberApplication} the application or {null} if none exist.
     */
    public async fetch(applicationId: string, guild: Guild) {
        let application = MemberApplication._cache.get(applicationId);
        if (!application) {
            let {gameId, userId, channelId, logMessage, answers, imageUrl} = (await client.db.select().from(applicationsTable).where(eq(applicationsTable.channelId, applicationId)))[0];
            if (gameId && userId && channelId) {
                const gameDivision = GameDivision.cache.get(gameId)!
                application = new MemberApplication(await guild.members.fetch(userId), await guild.channels.fetch(channelId) as TextThreadChannel, gameId, gameDivision);
                application._logMessage = await gameDivision.logChannel.messages.fetch(logMessage || "");
                application._answers = answers as Answer[];
                application._image = imageUrl || "";
            }
            else return null
        }
        return application;
    }

    public async delete(applicationId: string) {
        MemberApplication._cache.delete(applicationId);
        return client.db.delete(applicationsTable).where(eq(applicationsTable.channelId, applicationId)).returning();
    }

    public start() {
        const applicationChannelEmbed = new EmbedBuilder() // application channel embed message
            .setColor('#5865F2')
            .setTitle('Pending')
            .setAuthor({
                name: `${this.member.user.username}`,
                iconURL: `${this.member.displayAvatarURL()}`
            })
            .setThumbnail(`https://cdn.discordapp.com/emojis/${this.gameId}.png?v=1`)
            .setTimestamp()
            .setDescription(`Username: ${this.member.user.username}\nUserID: ${this.member.id}\nThread: <#${this.thread.id}>\nCreated: ${this.member.user.createdAt.toUTCString()}`)


    }
}

type Answer = [
    id: number,
    answer: string
]