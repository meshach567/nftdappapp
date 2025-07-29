const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AccessNFT contract...");

  const AccessNFT = await ethers.getContractFactory("AccessNFT");
  const accessNFT = await AccessNFT.deploy();

  await accessNFT.waitForDeployment();

  const address = await accessNFT.getAddress();
  console.log("AccessNFT deployed to:", address);

  // Mint an NFT to the deployer for testing
  const [deployer] = await ethers.getSigners();
  console.log("Minting NFT to deployer:", deployer.address);
  
  const mintTx = await accessNFT.mintAccessNFT(deployer.address);
  await mintTx.wait();
  
  console.log("NFT minted successfully!");
  console.log("Deployer now has access:", await accessNFT.checkAccess(deployer.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 