import {Collection} from "discord.js";
import {NodePgDatabase} from "drizzle-orm/node-postgres";

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, any>;
        db: NodePgDatabase<typeof import("../db/schema")> & {
            $client: NodePgClient;
        };
    }
}