# Simple Payment dApp (Stellar Testnet)

This is a simple React-based decentralized application (dApp) built using Create React App.

The app connects to the Freighter wallet and allows users to send XLM on the Stellar Test Network. It is created for learning and testing purposes.

## What This App Does

- Connects to Freighter wallet
- Fetches wallet address
- Displays XLM balance
- Sends XLM to another Stellar address
- Shows transaction hash after successful transfer
- Handles common transaction errors



## Requirements

Before running the project, make sure you have:

- Node.js installed
- npm installed
- Freighter browser extension installed
- Freighter set to "Testnet"
- A funded Stellar Testnet account

If your account is not funded, you can use the Stellar Friendbot to fund it.



## How to Run the Project

1. Open terminal inside the project folder.
2. Install all dependencies:

   npm install

3. Start the development server:

   npm start

4. Open your browser and visit:

   http://localhost:3000

The app will reload automatically whenever you save changes.



## How to Use the App

1. Click "Connect Freighter Wallet".
2. Approve the connection in the Freighter extension.
3. Your wallet address and XLM balance will appear.
4. Enter a valid Stellar Testnet public address.
5. Enter the amount of XLM to send.
6. Click "Send XLM".
7. Confirm the transaction in Freighter.
8. After confirmation, the transaction hash will be displayed.




## Important Notes

- This project uses Stellar Testnet only.
- Do NOT use real mainnet funds.
- This is a learning/demo application.
- Always confirm transactions before signing.



