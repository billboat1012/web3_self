# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```


1. Get Alchemy or Infura API Key
Go to https://alchemy.com or https://infura.io

Create a free account

Create an Ethereum Goerli or Sepolia project

Copy your RPC URL or API key

2. Get a Testnet Wallet & ETH
Open MetaMask

Switch to Goerli or Sepolia network

Get some ETH from a faucet:

Goerli: https://goerlifaucet.com

Sepolia: https://sepoliafaucet.com

 3. Install dotenv
npm install dotenv

4. Create .env file in root
PRIVATE_KEY=your_wallet_private_key
ALCHEMY_API_KEY=your_alchemy_key

5. Update hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

module.exports = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
};

 6. Deploy Your Contract
 npx hardhat run scripts/deploy.js --network goerli
You’ll see:
Voting deployed to: 0xYourContractAddressHere

7. Verify Contract (optional)
npx hardhat verify --network goerli 0xYourContractAddressHere "['React', 'Solidity', 'Ethers']"
