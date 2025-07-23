# Contributing to Minecraft Server Monitor Bot

First off, thank you for considering contributing to Minecraft Server Monitor Bot! 🎉

It's people like you that make this bot a great tool for the Minecraft community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Commit Message Guidelines](#commit-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Pledge

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 16.0.0 or higher
- [Git](https://git-scm.com/)
- A Discord application for testing
- A Minecraft server for testing (or use a public one)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/minecraft-server-monitor.git
   cd minecraft-server-monitor
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/original-owner/minecraft-server-monitor.git
   ```

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues as you might find that the problem has already been reported.

When creating a bug report, please include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details**:
  - OS version
  - Node.js version
  - Discord.js version
  - Bot version

### 💡 Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Clear title and description**
- **Use case** - why would this be useful?
- **Detailed explanation** of the feature
- **Possible implementation** (if you have ideas)

### 🔧 Code Contributions

#### Types of Contributions

- **Bug fixes**
- **New features**
- **Performance improvements**
- **Documentation improvements**
- **Code refactoring**
- **Test improvements**

## 🛠️ Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with your Discord bot credentials.

3. **Configure test server**:
   
   Edit `config.json` with a test Minecraft server and Discord channel.

4. **Start development server**:
   ```bash
   npm run dev
   ```

### 🧪 Testing Your Changes

1. **Test the bot functionality**:
   - Use `/status` command to check server status
   - Verify monitoring works in your test channel
   - Test error handling with invalid servers

2. **Test edge cases**:
   - Server offline scenarios
   - Network timeout situations
   - Rate limiting behavior
   - Invalid configuration

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

4. **Test thoroughly**

5. **Commit your changes** (see commit guidelines below)

### Submitting the PR

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create the Pull Request** on GitHub

3. **Fill out the PR template** completely

4. **Link any related issues**

### PR Guidelines

- **Title**: Use a clear, descriptive title
- **Description**: Explain what changes you made and why
- **Testing**: Describe how you tested your changes
- **Screenshots**: Include screenshots for UI changes
- **Breaking Changes**: Clearly mark any breaking changes

## 🎨 Style Guidelines

### JavaScript Style

- Use **4 spaces** for indentation
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes
- Use **SCREAMING_SNAKE_CASE** for constants
- Maximum line length: **120 characters**

### Code Organization

```javascript
// Imports first
const { Client } = require('discord.js');
const config = require('./config.json');

// Constants
const MAX_RETRIES = 3;

// Helper functions
function helperFunction() {
    // Implementation
}

// Main logic
class BotManager {
    constructor() {
        // Constructor logic
    }
}
```

### Comments

- Use JSDoc comments for functions:
  ```javascript
  /**
   * Ping a Minecraft server and return status information
   * @param {string} host - Server hostname or IP
   * @param {number} port - Server port
   * @returns {Promise<Object>} Server status object
   */
  async function pingServer(host, port) {
      // Implementation
  }
  ```

- Use inline comments for complex logic
- Avoid obvious comments

## 📝 Commit Guidelines

### Commit Message Format

```
type(scope): subject

body

footer
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(monitoring): add player count change detection

Add configuration option to send updates when player count changes.
This allows servers to track player activity more closely.

Closes #123
```

```bash
fix(status): handle server timeout errors gracefully

Previously, server timeouts would cause the bot to crash.
Now displays "Restarting/Loading" status instead.

Fixes #456
```

## 🔍 Review Process

### What We Look For

- **Code quality**: Clean, readable, maintainable code
- **Functionality**: Does it work as intended?
- **Testing**: Has it been properly tested?
- **Documentation**: Are changes documented?
- **Performance**: Does it impact bot performance?
- **Security**: Are there any security concerns?

### Review Timeline

- Small fixes: 1-3 days
- New features: 3-7 days
- Major changes: 1-2 weeks

## 🎯 Priority Areas

We're especially interested in contributions in these areas:

- **Performance improvements**
- **Error handling enhancements**
- **New server type detection**
- **Documentation improvements**
- **Test coverage**
- **Accessibility features**

## 📚 Resources

- [Discord.js Documentation](https://discord.js.org/#/docs)
- [minecraft-server-util Documentation](https://www.npmjs.com/package/minecraft-server-util)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🆘 Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Code Review**: Maintainers will provide feedback on PRs

## 🏆 Recognition

Contributors will be recognized in:

- Repository contributors list
- Release notes for significant contributions
- Special thanks in documentation

---

Thank you for contributing to Minecraft Server Monitor Bot! 🚀

Your contributions help make this tool better for the entire Minecraft community! ❤️ 