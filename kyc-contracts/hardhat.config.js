require("@nomicfoundation/hardhat-toolbox");

// --- DEBUGGING ---
// Let's see what dotenv is loading.
const dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log("Successfully loaded .env file. Variables:", result.parsed);
}
// --- END DEBUGGING ---


/** @type import('hardhat/config').HardhatUserConfig */

// Updated to use AMOY
const { AMOY_RPC_URL, PRIVATE_KEY } = process.env;

if (!AMOY_RPC_URL) {
  console.error("Missing AMOY_RPC_URL. Please check your .env file.");
}

if (!PRIVATE_KEY) {
  console.error("Missing PRIVATE_KEY. Please check your .env file.");
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    // This is the network you'll deploy to
    amoy: { // Renamed from mumbai to amoy
      url: AMOY_RPC_URL || "", // Get URL from .env file
      accounts: [PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"], // Get private key from .env file
    },
  },
  etherscan: {
    // Optional: for verifying your contract on Polyscan
    apiKey: {
      polygonAmoy: "YOUR_POLYGONSCAN_API_KEY" // Updated from polygonMumbai
    }
  }
};