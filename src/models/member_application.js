"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberApplication = void 0;
const bot_1 = require("../bot");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class MemberApplication {
    static _cache = new Map();
    _gameId;
    _member;
    _thread;
    _division;
    _logMessage = null;
    _answers = [];
    _image = "";
    _age = -1;
    constructor(member, thread, gameId, division) {
        this._member = member;
        this._thread = thread;
        this._gameId = gameId;
        this._division = division;
    }
    async new(member, thread, gameId, division) {
        let application = MemberApplication._cache.get(thread.id.toString());
        if (!application) {
            try {
                let app = (await bot_1.client.db.select().from(schema_1.applicationsTable).where((0, drizzle_orm_1.eq)(schema_1.applicationsTable.channelId, thread.id)))[0];
                if (!app.gameId && !app.userId)
                    return new MemberApplication(member, thread, gameId, division);
                return new MemberApplication(bot_1.client., thread, gameId, division);
            }
            catch (e) { }
        }
        else
            return application;
    }
    get division() {
        return this._division;
    }
    get logMessage() {
        return this._logMessage;
    }
    get answers() {
        return this._answers;
    }
    get image() {
        return this._image;
    }
    get age() {
        return this._age;
    }
    get member() {
        return this._member;
    }
    get thread() {
        return this._thread;
    }
    get gameId() {
        return this._gameId;
    }
}
exports.MemberApplication = MemberApplication;
