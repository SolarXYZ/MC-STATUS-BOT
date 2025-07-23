# Minecraft Server Monitor Bot

<p align="center">
  <img src="https://img.shields.io/badge/Discord.js-v14-blue.svg" alt="Discord.js">
  <img src="https://img.shields.io/badge/Node.js-16%2B-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
  <img src="https://img.shields.io/github/stars/your-username/minecraft-server-monitor?style=social" alt="Stars">
</p>

<p align="center">
  A powerful Discord bot that monitors a single Minecraft server and provides detailed real-time status updates with Discord rate limiting compliance.
</p>

---

## 🌟 Features

- 🖥️ **Single Server Focus**: Monitor one specific Minecraft server with dedicated precision
- 📡 **Real-time Monitoring**: Automatic status updates in your designated Discord channel
- 📊 **Detailed Information**: Complete server details including IP, version, players, server type, and more
- 🔧 **Server Type Detection**: Automatically detects Paper, Fabric, Spigot, Bukkit, Purpur, and other server types
- 👤 **Player Lists**: Shows online players when available (up to 10 players displayed)
- 🖼️ **Server Icons**: Displays server favicon in status embeds
- ⚡ **Rate Limiting**: Built-in Discord cooldown compliance to prevent API limits
- 🎨 **Smart Status Detection**: Distinguishes between Online/Offline/Restarting states
- 🔒 **Secure Configuration**: Environment-based secrets management

## 📸 Screenshots

### Status Command
![Status Command Example](https://via.placeholder.com/600x400/36393f/ffffff?text=Status+Command+Screenshot)

### Automatic Monitoring
![Monitoring Example](https://via.placeholder.com/600x300/36393f/ffffff?text=Monitoring+Updates+Screenshot)

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 16.0.0 or higher
- A Discord application with bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- A Minecraft server to monitor

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/minecraft-server-monitor.git
   cd minecraft-server-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Discord bot credentials:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_discord_application_client_id_here
   ```

4. **Configure your server**
   
   Edit `config.json`:
   ```json
   {
       "server": {
           "name": "My Minecraft Server",
           "host": "your-server-ip.com",
           "port": 25565
       },
       "monitoring": {
           "channelId": "YOUR_CHANNEL_ID_HERE",
           "interval": 300000,
           "enabled": true,
           "updateOnStatusChange": true,
           "updateOnPlayerChange": false
       }
   }
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Server Configuration

| Option | Description | Default |
|--------|-------------|---------|
| `server.name` | Display name for your server | `"My Minecraft Server"` |
| `server.host` | Your Minecraft server IP/hostname | `"your-server-ip.com"` |
| `server.port` | Your Minecraft server port | `25565` |

### Monitoring Configuration

| Option | Description | Default |
|--------|-------------|---------|
| `monitoring.channelId` | Discord channel ID for updates | `"YOUR_CHANNEL_ID_HERE"` |
| `monitoring.interval` | Check interval in milliseconds | `300000` (5 minutes) |
| `monitoring.enabled` | Enable/disable automatic monitoring | `true` |
| `monitoring.updateOnStatusChange` | Send updates when server goes online/offline | `true` |
| `monitoring.updateOnPlayerChange` | Send updates when player count changes | `false` |

### Getting Channel ID

1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click on your desired channel
3. Click "Copy Channel ID"
4. Paste it in the `channelId` field in `config.json`

## 🤖 Commands

### `/status`
Check the current status of the monitored Minecraft server with comprehensive information:

- 🌐 Server IP and port
- 👥 Current/maximum players
- 📶 Server response time (ping)
- 🏷️ Minecraft version
- ⚙️ Server type (Paper, Fabric, etc.)
- 🔢 Protocol version
- 📋 Server description (MOTD)
- 👤 Online player list (when available)
- 🔧 Mod information (for modded servers)
- 🖼️ Server icon

### `/help`
Display help information and current monitoring configuration.

## 📊 Server Information Display

The bot provides rich information about your Minecraft server:

| Field | Description | Example |
|-------|-------------|---------|
| 🌐 Server IP | Connection address | `play.example.com:25565` |
| 👥 Players Online | Current/Max players | `15/100` |
| 📶 Ping | Response time to server | `45ms` |
| 🏷️ Minecraft Version | Server version | `1.20.4` |
| ⚙️ Server Type | Detected server software | `Paper` |
| 🔢 Protocol | Minecraft protocol version | `765` |
| 📋 MOTD | Server description | `Welcome to our server!` |
| 👤 Online Players | List of online players | `Steve, Alex, Notch` |
| 🔧 Mods | Mod count (if applicable) | `127 mods detected` |

## 🚦 Status Detection

The bot intelligently detects and displays different server states:

- ✅ **Online** (Green) - Server is running and accessible
- ❌ **Offline** (Red) - Server is completely down
- 🔄 **Restarting/Loading** (Orange) - Server is starting up or temporarily unavailable

## ⚡ Rate Limiting & Discord Compliance

The bot includes sophisticated rate limiting to comply with Discord's API rules:

- **Maximum 5 messages per minute** - Prevents API rate limiting
- **Smart cooldown system** - Automatically manages message timing
- **Update optimization** - Only sends updates when server status actually changes
- **Configurable triggers** - Choose when to send updates (status changes vs player count changes)

## 🛠️ Bot Permissions

Your Discord bot needs these permissions:

- **Send Messages** - To send status updates
- **Use Slash Commands** - For command interactions
- **Embed Links** - To send rich status embeds
- **Attach Files** - To display server icons
- **View Channel** - To access the monitoring channel

**Invite URL:**
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=274877910016&scope=bot%20applications.commands
```
*(Replace `YOUR_CLIENT_ID` with your actual Discord application ID)*

## 🐛 Troubleshooting

<details>
<summary><strong>Bot not responding to commands</strong></summary>

- ✅ Check that the bot has necessary permissions in your Discord server
- ✅ Verify the bot token and client ID are correct in the `.env` file
- ✅ Make sure the bot is online and running
- ✅ Check console for error messages
</details>

<details>
<summary><strong>No status updates in channel</strong></summary>

- ✅ Verify the channel ID is correct in `config.json`
- ✅ Check that monitoring is enabled (`monitoring.enabled: true`)
- ✅ Ensure the bot has permissions to send messages in the specified channel
- ✅ Check if rate limiting is preventing updates (see console logs)
</details>

<details>
<summary><strong>Server always shows as offline</strong></summary>

- ✅ Verify the server IP and port are correct in `config.json`
- ✅ Check if the server has query enabled (most servers do by default)
- ✅ Test connectivity using other Minecraft server status tools
- ✅ Ensure firewall isn't blocking the connection
</details>

<details>
<summary><strong>Commands not appearing in Discord</strong></summary>

- ✅ Ensure bot has `applications.commands` permission
- ✅ Commands may take a few minutes to register globally
- ✅ Try re-inviting the bot with updated permissions
- ✅ Restart the bot after configuration changes
</details>

## 📁 Project Structure

```
minecraft-server-monitor/
├── 📁 commands/
│   ├── 📄 help.js          # Help command
│   └── 📄 status.js        # Status command with detailed server info
├── 📄 bot.js               # Main bot file with monitoring logic
├── 📄 config.json          # Server and monitoring configuration
├── 📄 package.json         # Dependencies and scripts
├── 📄 .env                 # Environment variables (create from .env.example)
├── 📄 .env.example         # Example environment file
├── 📄 .gitignore          # Git ignore file
├── 📄 README.md           # This file
├── 📄 LICENSE             # MIT License
└── 📄 CONTRIBUTING.md     # Contribution guidelines
```

## 🔧 Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to automatically restart the bot when files change.

### Code Style

- Use consistent indentation (4 spaces)
- Follow JavaScript ES6+ standards
- Add comments for complex logic
- Use descriptive variable names

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support

If you find this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing to the code

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/your-username/minecraft-server-monitor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/minecraft-server-monitor/discussions)
- **Wiki**: [Project Wiki](https://github.com/your-username/minecraft-server-monitor/wiki)

---

<p align="center">
  Made with ❤️ for the Minecraft community
</p>

<p align="center">
  <strong>Happy Monitoring! 🎮⚡</strong>
</p> 