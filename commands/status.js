const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { status } = require('minecraft-server-util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check the status of the monitored Minecraft server'),
    
    async execute(interaction, config) {
        await interaction.deferReply();
        
        try {
            const serverData = await pingMinecraftServer(config.server.host, config.server.port);
            const embed = createDetailedStatusEmbed(config.server, serverData);
            
            const files = [];
            if (serverData.online && serverData.favicon) {
                const buffer = Buffer.from(serverData.favicon.split(',')[1], 'base64');
                files.push({ attachment: buffer, name: 'favicon.png' });
            }
            
            await interaction.editReply({ embeds: [embed], files });
        } catch (error) {
            console.error('Error in status command:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor(config.embedColors.offline)
                .setTitle('❌ Error')
                .setDescription('Failed to check server status. Please try again later.')
                .setTimestamp();
            
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};

// Utility function to ping Minecraft server with enhanced info
async function pingMinecraftServer(host, port = 25565) {
    try {
        const response = await status(host, { 
            port, 
            timeout: 10000,
            enableSRV: true
        });
        
        // Detect server type from version string
        const serverType = detectServerType(response.version.name);
        
        return {
            online: true,
            players: {
                online: response.players.online,
                max: response.players.max,
                list: response.players.sample || []
            },
            version: {
                name: response.version.name,
                protocol: response.version.protocol
            },
            serverType: serverType,
            motd: response.motd.clean,
            ping: response.roundTripLatency,
            favicon: response.favicon,
            modInfo: response.modInfo || null
        };
    } catch (error) {
        return {
            online: false,
            error: error.message,
            status: determineOfflineStatus(error.message)
        };
    }
}

// Detect server type from version string
function detectServerType(versionString) {
    const version = versionString.toLowerCase();
    
    if (version.includes('paper')) return 'Paper';
    if (version.includes('spigot')) return 'Spigot';
    if (version.includes('bukkit')) return 'Bukkit';
    if (version.includes('fabric')) return 'Fabric';
    if (version.includes('forge')) return 'Forge';
    if (version.includes('quilt')) return 'Quilt';
    if (version.includes('vanilla')) return 'Vanilla';
    if (version.includes('purpur')) return 'Purpur';
    if (version.includes('mohist')) return 'Mohist';
    if (version.includes('catserver')) return 'CatServer';
    if (version.includes('arclight')) return 'Arclight';
    if (version.includes('magma')) return 'Magma';
    if (version.includes('sponge')) return 'Sponge';
    
    return 'Unknown';
}

// Determine offline status from error message
function determineOfflineStatus(errorMessage) {
    const message = errorMessage.toLowerCase();
    
    if (message.includes('timeout') || message.includes('timed out')) {
        return 'Restarting/Loading';
    }
    if (message.includes('connection refused') || message.includes('econnrefused')) {
        return 'Offline';
    }
    if (message.includes('host not found') || message.includes('enotfound')) {
        return 'Invalid Host';
    }
    if (message.includes('network is unreachable')) {
        return 'Network Error';
    }
    
    return 'Offline';
}

// Create detailed status embed
function createDetailedStatusEmbed(serverConfig, serverData) {
    const embed = new EmbedBuilder()
        .setTitle(`🖥️ ${serverConfig.name}`)
        .setFooter({ text: `Last checked` })
        .setTimestamp();

    if (serverData.online) {
        embed
            .setColor('#00ff00') // Green for online
            .setDescription('✅ **Server is ONLINE**')
            .addFields(
                { name: '🌐 Server IP', value: `\`${serverConfig.host}:${serverConfig.port}\``, inline: true },
                { name: '👥 Players Online', value: `${serverData.players.online}/${serverData.players.max}`, inline: true },
                { name: '📶 Ping', value: `${serverData.ping}ms`, inline: true },
                { name: '🏷️ Minecraft Version', value: serverData.version.name, inline: true },
                { name: '⚙️ Server Type', value: serverData.serverType, inline: true },
                { name: '🔢 Protocol', value: `${serverData.version.protocol}`, inline: true }
            );

        // Add MOTD if available
        if (serverData.motd && serverData.motd.trim() !== '') {
            embed.addFields({ name: '📋 MOTD', value: serverData.motd, inline: false });
        }
        
        // Add player list if available and not too long
        if (serverData.players.list && serverData.players.list.length > 0 && serverData.players.list.length <= 10) {
            const playerList = serverData.players.list.map(player => player.name).join(', ');
            embed.addFields({ name: '👤 Online Players', value: playerList, inline: false });
        } else if (serverData.players.list && serverData.players.list.length > 10) {
            const playerList = serverData.players.list.slice(0, 10).map(player => player.name).join(', ');
            embed.addFields({ name: '👤 Online Players', value: `${playerList} (+${serverData.players.list.length - 10} more)`, inline: false });
        }
        
        // Add mod info if available
        if (serverData.modInfo && serverData.modInfo.modList) {
            embed.addFields({ 
                name: '🔧 Mods', 
                value: `${serverData.modInfo.modList.length} mods detected`, 
                inline: true 
            });
        }
        
        if (serverData.favicon) {
            embed.setThumbnail(`attachment://favicon.png`);
        }
    } else {
        const statusColor = serverData.status === 'Restarting/Loading' ? '#ffaa00' : '#ff0000'; // Orange for restarting, red for offline
        const statusEmoji = getStatusEmoji(serverData.status);
        
        embed
            .setColor(statusColor)
            .setDescription(`${statusEmoji} **Server is ${serverData.status.toUpperCase()}**`)
            .addFields(
                { name: '🌐 Server IP', value: `\`${serverConfig.host}:${serverConfig.port}\``, inline: true },
                { name: '❗ Status', value: serverData.status, inline: true },
                { name: '📝 Error Details', value: `\`${serverData.error || 'Unknown error'}\``, inline: false }
            );
    }

    return embed;
}

// Get appropriate emoji for status
function getStatusEmoji(status) {
    switch (status) {
        case 'Restarting/Loading':
            return '🔄';
        case 'Network Error':
            return '🌐';
        case 'Invalid Host':
            return '🚫';
        default:
            return '❌';
    }
} 