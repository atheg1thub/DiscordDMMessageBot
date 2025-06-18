const { Client, GatewayIntentBits } = require("discord.js");

const delay = ms => new Promise(res => setTimeout(res, ms));

async function createBotClient(token, index, totalBots, guildId, message, logChannelId) {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.DirectMessages
        ],
        presence: {
            status: "idle",
            activities: [{ name: "emir ❤️ athe", type: 0 }]
        }
    });

    client.once("ready", async () => {
        console.log(`[BOT ${index + 1}] Giriş yapıldı: ${client.user.tag}`);
        await runBotTask(client, index, totalBots, guildId, message, logChannelId);
    });

    client.login(token);
}

async function runBotTask(client, botIndex, totalBots, guildId, message, logChannelId) {
    try {
        const guild = await client.guilds.fetch(guildId);
        const logChannel = guild.channels.cache.get(logChannelId);

        if (!logChannel?.isTextBased()) {
            console.warn(`[BOT ${botIndex + 1}] Log kanalı geçersiz.`);
            return;
        }

        const members = await guild.members.fetch();
        const targets = Array.from(members.values())
            .filter(m => !m.user.bot)
            .filter((_, i) => i % totalBots === botIndex);

        for (const member of targets) {
            try {
                await member.send(message);
                console.log(`[BOT ${botIndex + 1}] ✔️ ${member.user.username} kişisine mesaj gönderildi.`);
                await logChannel.send(`✅ <@${member.user.id}> kişisine mesaj gönderildi.`);
            } catch {
                console.warn(`[BOT ${botIndex + 1}] ❌ ${member.user.username} mesaj alamadı.`);
                await logChannel.send(`❌ <@${member.user.id}> kişisine mesaj gönderilemedi.`);
            }

            await delay(800); // biraz daha farklı gecikme
        }

    } catch (err) {
        console.error(`[BOT ${botIndex + 1}] Hata oluştu: ${err.message}`);
    }
}

function startAllBots(tokens, guildId, message, logChannelId) {
    const total = tokens.length;
    tokens.forEach((token, idx) => {
        createBotClient(token, idx, total, guildId, message, logChannelId);
    });
}

module.exports = startAllBots;