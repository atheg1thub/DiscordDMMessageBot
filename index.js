const { Client, GatewayIntentBits, SlashCommandBuilder } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.GuildMembers]});
const config = require("./config.json");
const startAllBots = require("./dagitici.js");

client.on("ready", async () => {
    console.log(`Sistem hazır hale getirildi.`);
    const guild = await client.guilds.cache.get(config.sunucuID);

    await guild.commands.set([
        new SlashCommandBuilder()
            .setName("dmgönder")
            .setDescription("Herkese DM mesajı göndermenizi sağlar.")
            .addStringOption(option =>
                option
                    .setName("mesaj")
                    .setDescription("DM içeriğini girin")
                    .setRequired(true)
            )
    ]);
});

client.on("interactionCreate", async (interaction) => {
    try {
        if (interaction.commandName === "dmgönder") {
            const message = interaction.options.getString("mesaj");
            const logChannelId = config.logKanalıID;

            // Defer the reply immediately to acknowledge the interaction
            await interaction.deferReply({ flags: 64 }); // Use flags instead of ephemeral

            // Call the sendMessages method and wait for it to complete
            await startAllBots([config.token1, config.token2, config.token3, config.token4], interaction.guild.id, message, logChannelId);

            // Edit the reply to inform the user that the process is complete
            await interaction.editReply({
                content: "Mesaj Gönderimi Tamamlandı!"
            });
        }
    } catch (err) {
        console.error("Hata:", err);
    }
});




client.login(config.token1)