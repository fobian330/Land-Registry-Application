// Importing the contract artifacts
const Land = artifacts.require("Land");
const LandRegistry = artifacts.require("LandRegistry");
const Migrations = artifacts.require("Migrations");

module.exports = async function (deployer, network, accounts) {
  // Deploy Migrations contract first (needed by Truffle for migration tracking)
  await deployer.deploy(Migrations);
  const migrations = await Migrations.deployed();
  console.log("Migrations contract deployed at address:", migrations.address);

  // Deploy LandRegistry contract
  await deployer.deploy(LandRegistry);
  const landRegistry = await LandRegistry.deployed();
  console.log("LandRegistry contract deployed at address:", landRegistry.address);

  // Deploy Land contract
  await deployer.deploy(Land);
  const land = await Land.deployed();
  console.log("Land contract deployed at address:", land.address);

  // Here you can add contract interactions, for example:
  // - You could initialize one contract with the address of another
  // - Set up initial settings for the contracts, etc.

  // Example: If Land contract needs to reference LandRegistry:
  // await land.initialize(landRegistry.address);
};
