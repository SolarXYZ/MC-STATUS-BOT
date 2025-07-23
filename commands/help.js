const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show help information about the bot'),
    
    async execute(interaction, config) {
        const embed = new EmbedBuilder()
            .setColor(config.embedColors.online)
            .setTitle('🤖 Minecraft Server Monitor Help')
            .setDescription(`This bot monitors **${config.server.name}** and provides real-time status updates.`)
            .addFields(
                { 
                    name: '📊 `/status`', 
                    value: 'Check the current status of the monitored server with detailed information including:\n' +
                           '• Server IP and port\n' +
                           '• Online players count and list\n' +
                           '• Minecraft version and server type\n' +
                           '• Server response time (ping)\n' +
                           '• Server description (MOTD)\n' +
                           '• Server icon display\n' +
                           '• Mod information (if applicable)'
                },
                { 
                    name: '❓ `/help`', 
                    value: 'Show this help message with bot information and features' 
                }
            )
            .addFields(
                { 
                    name: '📡 Monitoring Configuration', 
                    value: `• **Server:** \`${config.server.host}:${config.server.port}\`\n` +
                           `• **Updates Channel:** <#${config.monitoring.channelId}>\n` +
                           `• **Check Interval:** Every ${Math.floor(config.monitoring.interval / 1000 / 60)} minutes\n` +
                           `• **Auto Updates:** ${config.monitoring.enabled ? '✅ Enabled' : '❌ Disabled'}\n` +
                           `• **Status Change Updates:** ${config.monitoring.updateOnStatusChange ? '✅ Enabled' : '❌ Disabled'}\n` +
                           `• **Player Change Updates:** ${config.monitoring.updateOnPlayerChange ? '✅ Enabled' : '❌ Disabled'}`
                },
                { 
                    name: '🔍 Server Information Display', 
                    value: '• **🌐 Server IP** - Connection address and port\n' +
                           '• **👥 Players Online** - Current and maximum players\n' +
                           '• **📶 Ping** - Server response time\n' +
                           '• **🏷️ Minecraft Version** - Server version information\n' +
                           '• **⚙️ Server Type** - Detected server software (Paper, Fabric, etc.)\n' +
                           '• **🔢 Protocol** - Minecraft protocol version\n' +
                           '• **📋 MOTD** - Server description/message of the day\n' +
                           '• **👤 Online Players** - List of currently online players\n' +
                           '• **🔧 Mods** - Detected mod count (for modded servers)\n' +
                           '• **🖼️ Server Icon** - Server favicon display'
                },
                { 
                    name: '🚦 Status Detection', 
                    value: 'The bot intelligently detects different server states:\n' +
                           '• ✅ **Online** (Green) - Server running and accessible\n' +
                           '• ❌ **Offline** (Red) - Server completely down\n' +
                           '• 🔄 **Restarting/Loading** (Orange) - Server starting up\n' +
                           '• 🌐 **Network Error** - Connection issues\n' +
                           '• 🚫 **Invalid Host** - Server address not found'
                },
                { 
                    name: '⚡ Rate Limiting & Discord Compliance', 
                    value: 'Built-in features to prevent Discord API issues:\n' +
                           `• Maximum ${config.discord.maxMessagesPerMinute} messages per minute\n` +
                           `• Smart cooldown system (${config.discord.cooldownBetweenUpdates / 1000}s between updates)\n` +
                           '• Update optimization - only sends when status changes\n' +
                           '• Automatic rate limit detection and handling'
                },
                { 
                    name: '🛠️ Supported Server Types', 
                    value: 'Automatically detects these server software types:\n' +
                           '• **Paper** - High performance Spigot fork\n' +
                           '• **Spigot** - Popular Bukkit fork\n' +
                           '• **Bukkit** - Original plugin API\n' +
                           '• **Fabric** - Lightweight modding platform\n' +
                           '• **Forge** - Popular modding platform\n' +
                           '• **Purpur** - Paper fork with extra features\n' +
                           '• **Vanilla** - Official Minecraft server\n' +
                           '• **Quilt** - Fabric-based modding platform\n' +
                           '• And many more!'
                }
            )
            .addFields(
                { 
                    name: '💡 Tips & Best Practices', 
                    value: '• Use `/status` to get instant server information\n' +
                           '• Automatic monitoring runs in the background\n' +
                           '• Updates are sent only when server status changes\n' +
                           '• Player lists show up to 10 players for readability\n' +
                           '• Server icons are displayed when available\n' +
                           '• Rate limiting prevents Discord API issues'
                },
                { 
                    name: '🔗 Useful Links', 
                    value: '[GitHub Repository](https://github.com/your-username/minecraft-server-monitor) • ' +
                           '[Report Issues](https://github.com/your-username/minecraft-server-monitor/issues) • ' +
                           '[Discord.js Documentation](https://discord.js.org/) • ' +
                           '[Minecraft Server Util](https://www.npmjs.com/package/minecraft-server-util)'
                }
            )
            .setFooter({ 
                text: `Bot Version 1.0.0 • Monitoring since startup`,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
}; 