const { Client, GatewayIntentBits, Collection, REST, Routes, ActivityType } = require('discord.js');
const { status } = require('minecraft-server-util');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = require('./config.json');

// Bot setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Commands collection
client.commands = new Collection();

// Rate limiting variables
let lastMessageTime = 0;
let messageCount = 0;
let lastStatusData = null;

// Load commands from commands folder
function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
            console.log(`⚠️ Command at ${filePath} is missing required "data" or "execute" property.`);
        }
    }

    return commands;
}

// Enhanced server ping function with more details
async function pingMinecraftServer(host, port = 25565) {
    try {
        const response = await status(host, { 
            port, 
            timeout: config.timeoutDuration,
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
    
    return 'Offline';
}

// Create detailed status embed
function createDetailedStatusEmbed(serverConfig, serverData) {
    const { EmbedBuilder } = require('discord.js');
    const embed = new EmbedBuilder()
        .setTitle(`🖥️ ${serverConfig.name}`)
        .setFooter({ text: `Last checked` })
        .setTimestamp();

    if (serverData.online) {
        embed
            .setColor(config.embedColors.online)
            .setDescription('✅ **Server is ONLINE**')
            .addFields(
                { name: '🌐 Server IP', value: `\`${serverConfig.host}:${serverConfig.port}\``, inline: true },
                { name: '👥 Players Online', value: `${serverData.players.online}/${serverData.players.max}`, inline: true },
                { name: '📶 Ping', value: `${serverData.ping}ms`, inline: true },
                { name: '🏷️ Minecraft Version', value: serverData.version.name, inline: true },
                { name: '⚙️ Server Type', value: serverData.serverType, inline: true },
                { name: '🔢 Protocol', value: `${serverData.version.protocol}`, inline: true },
                { name: '📋 MOTD', value: serverData.motd || 'No description', inline: false }
            );
        
        // Add player list if available and not too long
        if (serverData.players.list && serverData.players.list.length > 0 && serverData.players.list.length <= 10) {
            const playerList = serverData.players.list.map(player => player.name).join(', ');
            embed.addFields({ name: '👤 Online Players', value: playerList, inline: false });
        }
        
        // Add mod info if available
        if (serverData.modInfo) {
            embed.addFields({ 
                name: '🔧 Mods', 
                value: `${serverData.modInfo.modList?.length || 'Unknown'} mods detected`, 
                inline: true 
            });
        }
        
        if (serverData.favicon) {
            embed.setThumbnail(`attachment://favicon.png`);
        }
    } else {
        const statusColor = serverData.status === 'Restarting/Loading' ? config.embedColors.restarting : config.embedColors.offline;
        const statusEmoji = serverData.status === 'Restarting/Loading' ? '🔄' : '❌';
        
        embed
            .setColor(statusColor)
            .setDescription(`${statusEmoji} **Server is ${serverData.status.toUpperCase()}**`)
            .addFields(
                { name: '🌐 Server IP', value: `\`${serverConfig.host}:${serverConfig.port}\``, inline: true },
                { name: '❗ Status', value: serverData.status, inline: true },
                { name: '📝 Error Details', value: serverData.error || 'Unknown error', inline: false }
            );
    }

    return embed;
}

// Rate limiting function to comply with Discord cooldown rules
function canSendMessage() {
    const now = Date.now();
    
    // Reset message count every minute
    if (now - lastMessageTime >= 60000) {
        messageCount = 0;
        lastMessageTime = now;
    }
    
    // Check if we've exceeded the rate limit
    if (messageCount >= config.discord.maxMessagesPerMinute) {
        return false;
    }
    
    // Check cooldown between updates
    if (now - lastMessageTime < config.discord.cooldownBetweenUpdates && messageCount > 0) {
        return false;
    }
    
    return true;
}

// Send status update to the configured channel
async function sendStatusUpdate(serverData, forceUpdate = false) {
    if (!config.monitoring.enabled) return;
    
    try {
        const channel = client.channels.cache.get(config.monitoring.channelId);
        if (!channel) {
            console.error('❌ Monitoring channel not found!');
            return;
        }
        
        // Check if we should send an update
        const shouldUpdate = forceUpdate || 
            !lastStatusData || 
            (config.monitoring.updateOnStatusChange && lastStatusData.online !== serverData.online) ||
            (config.monitoring.updateOnPlayerChange && lastStatusData.online && serverData.online && 
             lastStatusData.players?.online !== serverData.players?.online);
        
        if (!shouldUpdate) return;
        
        // Check rate limiting
        if (!canSendMessage()) {
            console.log('⏳ Rate limit reached, skipping status update');
            return;
        }
        
        const embed = createDetailedStatusEmbed(config.server, serverData);
        
        const files = [];
        if (serverData.online && serverData.favicon) {
            const buffer = Buffer.from(serverData.favicon.split(',')[1], 'base64');
            files.push({ attachment: buffer, name: 'favicon.png' });
        }
        
        await channel.send({ embeds: [embed], files });
        messageCount++;
        lastStatusData = JSON.parse(JSON.stringify(serverData)); // Deep copy
        
        console.log(`📡 Status update sent - Server: ${serverData.online ? 'Online' : serverData.status}`);
        
    } catch (error) {
        console.error('❌ Error sending status update:', error);
    }
}

// Bot event handlers
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} is online!`);
    console.log(`📡 Monitoring: ${config.server.name} (${config.server.host}:${config.server.port})`);
    console.log(`📢 Updates Channel: ${config.monitoring.channelId}`);
    
    client.user.setActivity(`${config.server.name}`, { type: ActivityType.Watching });

    // Load and register commands
    const commands = loadCommands();
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    try {
        console.log('🔄 Refreshing application (/) commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('✅ Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('❌ Error refreshing commands:', error);
    }

    // Start monitoring
    if (config.monitoring.enabled) {
        startMonitoring();
        // Send initial status
        setTimeout(async () => {
            const serverData = await pingMinecraftServer(config.server.host, config.server.port);
            await sendStatusUpdate(serverData, true);
        }, 5000);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, config);
    } catch (error) {
        console.error(`❌ Error executing ${interaction.commandName}:`, error);
        
        const { EmbedBuilder } = require('discord.js');
        const errorEmbed = new EmbedBuilder()
            .setColor(config.embedColors.offline)
            .setTitle('❌ Error')
            .setDescription('An error occurred while processing your command.')
            .setTimestamp();

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
});

// Monitoring system
function startMonitoring() {
    const intervalMinutes = Math.floor(config.monitoring.interval / 60000);
    console.log(`🔄 Starting monitoring - checking every ${intervalMinutes} minutes`);
    
    // Create cron schedule based on interval
    let cronSchedule;
    if (intervalMinutes >= 60) {
        cronSchedule = `0 */${Math.floor(intervalMinutes / 60)} * * *`; // Every X hours
    } else {
        cronSchedule = `*/${intervalMinutes} * * * *`; // Every X minutes
    }
    
    cron.schedule(cronSchedule, async () => {
        console.log('🔄 Running scheduled server status check...');
        
        try {
            const serverData = await pingMinecraftServer(config.server.host, config.server.port);
            await sendStatusUpdate(serverData);
        } catch (error) {
            console.error('❌ Error in monitoring cron job:', error);
        }
    });
    
    console.log('✅ Monitoring cron job started');
}

// Error handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down bot...');
    client.destroy();
    process.exit(0);
});

// Bot login
client.login(process.env.DISCORD_TOKEN); 