import * as process from "node:process";
import {Client, GatewayIntentBits, Partials, Collection} from 'discord.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as path from "node:path";
import * as fs from "node:fs";
import * as schema from "./db/schema";

const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel, Partials.ThreadMember] });

client.commands = new Collection();
client.db = drizzle(process.env.DATABASE_URL!, {schema});

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Log in to Discord with your client's token
client.login(process.env.TOKEN!);

export {client};