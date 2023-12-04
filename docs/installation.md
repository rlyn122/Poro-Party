# Poro Party Installation Guide

## 1. Introduction

Welcome to **Poro Party**, a real-time online mini-game collection designed for fun and engagement. Whether you're at a party or just hanging out with friends, Poro Party offers an array of exciting mini-games you can join anytime, anywhere. Select your favorite cat character, pick a game, and aim for victory while enjoying chill lo-fi music in the lobby.

## 2. Pre-requisites

Before installing Poro Party, ensure your system meets the following requirements:

- **Node.js and npm**: Poro Party requires Node.js and npm to be installed on your system.

Poro Party depends on several packages. Here is the `package.json` snippet detailing the required packages:

```json
{
  "name": "headless_start",
  "version": "1.0.0",
  "main": "server/index.js",
  "scripts": {
    "start": "node --inspect server/index.js"
  },
  "dependencies": {
    "canvas": "^2.11.2",
    "datauri": "^1.1.0",
    "express": "^4.16.4",
    "jsdom": "^13.0.0",
    "socket.io": "^2.1.1"
  }
}
```

## 3. Installation Instructions

To install Poro Party, follow these steps:

1. **Install Node.js and npm**: Download and install Node.js and npm from [nodejs.org](https://nodejs.org/).
2. **Clone the Repository**: Clone the Poro Party repository to your local machine.
3. **Prepare the Project**: Navigate to the project directory, delete the `node_modules` folder and `package-lock.json` file if they exist.
4. **Install Dependencies**: Run `npm install` to install the required dependencies.
5. **Start the Server**: Execute `npm run start` to start the server.
6. **Access the Game**: Open your web browser and go to `localhost:8081` to start playing.

## 4. Configuration and Troubleshooting

- No additional configuration is needed after following the installation steps.
- **Troubleshooting Tips**:
  - If you encounter errors during `npm install`, try clearing the npm cache using `npm cache clean` and reinstall the dependencies.
  - If the project still can't start after you deleted files and run `npm install`, try run `npm remove canvas` and `npm install canvas`.
  - Ensure that the correct version of Node.js is installed.

---

**Enjoy your time with Poro Party!**