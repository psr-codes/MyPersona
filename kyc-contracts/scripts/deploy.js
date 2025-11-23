const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Get the deployer (account from your .env file)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy IssuerRegistry
  // We need to pass the deployer's address to the constructor
  const IssuerRegistry = await ethers.getContractFactory("IssuerRegistry");
  const issuerRegistry = await IssuerRegistry.deploy(deployer.address);
  await issuerRegistry.waitForDeployment();

  const issuerRegistryAddress = await issuerRegistry.getAddress();
  console.log(`IssuerRegistry deployed to: ${issuerRegistryAddress}`);

  // 2. Deploy RevocationRegistry
  // We need to pass the IssuerRegistry's address AND the deployer's address
  const RevocationRegistry = await ethers.getContractFactory("RevocationRegistry");
  const revocationRegistry = await RevocationRegistry.deploy(
    issuerRegistryAddress, // Pass the address of the registry we just deployed
    deployer.address       // Pass the initial owner
  );
  await revocationRegistry.waitForDeployment();

  const revocationRegistryAddress = await revocationRegistry.getAddress();
  console.log(`RevocationRegistry deployed to: ${revocationRegistryAddress}`);
  console.log("\nDeployment complete! 🎉");
  console.log("----------------------------------------------------");
  console.log("Save these addresses for your web app's .env file:");
  console.log(`ISSUER_REGISTRY_ADDRESS=${issuerRegistryAddress}`);
  console.log(`REVOCATION_REGISTRY_ADDRESS=${revocationRegistryAddress}`);
  console.log("----------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });