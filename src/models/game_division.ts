import {Guild, GuildTextBasedChannel} from "discord.js";
import {gameDivisonsTabel} from "../db/schema";
import {eq} from "drizzle-orm";
export class GameDivision {
    private static _cache = new Map<string, GameDivision>();

    private readonly _id: string
    private readonly _name: string
    private readonly _short: string
    private readonly _tag: string
    private readonly _logChannel: GuildTextBasedChannel;
    private readonly _welcomeChannel: GuildTextBasedChannel
    private readonly _roles: string[]
    private readonly _questions: {description: string, label: string, min: number, max: number, placeholder: string, style: number}[]
    private readonly _select: {placeholder: string,  min: number, max: number, options: {label: string, description: string,  value: string}[]}[]
    private readonly _assignableRoles: string[]
    private readonly _image: [label: string, what: string]
    private readonly _auto: boolean = false
    private readonly _welcomeMessage: string


    constructor(id: string, name: string, short: string, tag: string, logChannel: GuildTextBasedChannel, welcomeChannel: GuildTextBasedChannel, roles: string[], questions: {
        description: string;
        label: string;
        min: number;
        max: number;
        placeholder: string;
        style: number
    }[], select: {
        placeholder: string;
        min: number;
        max: number;
        options: { label: string; description: string; value: string }[]
    }[], assignableRoles: string[], image: [label: string, what: string], auto: boolean, welcomeMessage: string) {
        this._id = id;
        this._name = name;
        this._short = short;
        this._tag = tag;
        this._logChannel = logChannel;
        this._welcomeChannel = welcomeChannel;
        this._roles = roles;
        this._questions = questions;
        this._select = select;
        this._assignableRoles = assignableRoles;
        this._image = image;
        this._auto = auto;
        this._welcomeMessage = welcomeMessage;
    }

    static get cache(): Map<string, GameDivision> {
        return this._cache;
    }


    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get short(): string { return this._short; }
    get tag(): string { return this._tag; }
    get logChannel(): GuildTextBasedChannel { return this._logChannel; }
    get welcomeChannel(): GuildTextBasedChannel { return this._welcomeChannel; }
    get roles(): string[] { return this._roles; }
    get questions(): { description: string; label: string; min: number; max: number; placeholder: string; style: number }[] { return this._questions; }
    get select(): { placeholder: string; min: number; max: number; options: { label: string; description: string; value: string }[] }[] { return this._select; }
    get assignableRoles(): string[] { return this._assignableRoles; }
    get image(): [label: string, what: string] { return this._image; }
    get auto(): boolean { return this._auto; }
    get welcomeMessage(): string { return this._welcomeMessage; }

    /**
     * Fetches a GameDivision from the database using Drizzle.
     * @param gameId The ID of the game division to fetch.
     * @param guild the guild
     * @returns A Promise that resolves to a GameDivision instance.
     */
    static async fetch(gameId: string, guild: Guild): Promise<GameDivision | null> {
        // Check if the game division is already in the cache
        if (GameDivision.cache.has(gameId)) {
            return GameDivision.cache.get(gameId)!;
        }

        const result = await guild.client.db
            .select()
            .from(gameDivisonsTabel)
            .where(eq(gameDivisonsTabel.gameId, gameId))
            .limit(1);

        if (result.length === 0) {
            return null;
        }

        const row = result[0];

        if (!row.gameId || !row.gameName || !row.shorthand || !row.divisionTag ||
            !row.applicationChannelId || !row.welcomeChannelId || !row.roles ||
            !row.questions || !row.selectOptions || !row.assignableRoles ||
            !row.welcomeMessage) {
            return null;
        }

        const gameDivision = new GameDivision(
            row.gameId,
            row.gameName,
            row.shorthand,
            row.divisionTag,
            await guild.channels.fetch(row.applicationChannelId) as GuildTextBasedChannel,
            await guild.channels.fetch(row.welcomeChannelId) as GuildTextBasedChannel,
            row.roles as string[],
            row.questions as {description: string; label: string; min: number; max: number; placeholder: string; style: number}[],
            row.selectOptions as {placeholder: string; min: number; max: number; options: {label: string; description: string; value: string}[]}[],
            row.assignableRoles as string[],
            row.image as [label: string, what: string],
            row.autoAccept || false,
            row.welcomeMessage
        );

        // Add the newly fetched game division to the cache
        GameDivision.cache.set(gameId, gameDivision);

        return gameDivision;
    }
}