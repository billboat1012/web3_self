const hre = require("hardhat");

async function main() {
  // Compile contracts (optional, but good to ensure)
  await hre.run('compile');

  // Get the ContractFactory and deploy the contract
  const SimpleBank = await hre.ethers.getContractFactory("SimpleBank");
  const bank = await SimpleBank.deploy(); // Deploy contract
  await bank.waitForDeployment(); // For newer Hardhat versions (v2.21+)

  // Print the deployed address
  console.log("✅ SimpleBank deployed to:", await bank.getAddress());
}

main().catch((error) => {
  console.error("❌ Error deploying contract:", error);
  process.exitCode = 1;
});
