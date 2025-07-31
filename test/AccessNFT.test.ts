import { expect } from "chai";
import { ethers } from "hardhat";
import { AccessNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("AccessNFT", function () {
  let accessNFT: AccessNFT;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const AccessNFT = await ethers.getContractFactory("AccessNFT");
    accessNFT = await AccessNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await accessNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await accessNFT.name()).to.equal("Premium Access NFT");
      expect(await accessNFT.symbol()).to.equal("ACCESS");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint NFT", async function () {
      await accessNFT.mintAccessNFT(user1.address);
      expect(await accessNFT.checkAccess(user1.address)).to.be.true;
      expect(await accessNFT.balanceOf(user1.address)).to.equal(1);
    });

    it("Should not allow non-owner to mint NFT", async function () {
      await expect(
        accessNFT.connect(user1).mintAccessNFT(user2.address)
      ).to.be.revertedWithCustomError(accessNFT, "OwnableUnauthorizedAccount");
    });

    it("Should not allow minting to address that already has access", async function () {
      await accessNFT.mintAccessNFT(user1.address);
      await expect(
        accessNFT.mintAccessNFT(user1.address)
      ).to.be.revertedWith("Address already has access");
    });
  });

  describe("Access Control", function () {
    beforeEach(async function () {
      await accessNFT.mintAccessNFT(user1.address);
    });

    it("Should correctly check access", async function () {
      expect(await accessNFT.checkAccess(user1.address)).to.be.true;
      expect(await accessNFT.checkAccess(user2.address)).to.be.false;
    });

    it("Should allow owner to revoke access", async function () {
      await accessNFT.revokeAccess(user1.address);
      expect(await accessNFT.checkAccess(user1.address)).to.be.false;
      expect(await accessNFT.balanceOf(user1.address)).to.equal(0);
    });

    it("Should not allow non-owner to revoke access", async function () {
      await expect(
        accessNFT.connect(user1).revokeAccess(user2.address)
      ).to.be.revertedWithCustomError(accessNFT, "OwnableUnauthorizedAccount");
    });

    it("Should not allow revoking access from address without access", async function () {
      await expect(
        accessNFT.revokeAccess(user2.address)
      ).to.be.revertedWith("Address does not have access");
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      await accessNFT.mintAccessNFT(user1.address);
      const tokenId = 1;
      expect(await accessNFT.tokenURI(tokenId)).to.equal("https://api.example.com/metadata/access-nft.json");
    });

    it("Should revert for non-existent token", async function () {
      await expect(
        accessNFT.tokenURI(999)
      ).to.be.revertedWith("ERC721: URI query for nonexistent token");
    });
  });

  describe("Total Supply", function () {
    it("Should track total supply correctly", async function () {
      expect(await accessNFT.totalSupply()).to.equal(0);
      
      await accessNFT.mintAccessNFT(user1.address);
      expect(await accessNFT.totalSupply()).to.equal(1);
      
      await accessNFT.mintAccessNFT(user2.address);
      expect(await accessNFT.totalSupply()).to.equal(2);
      
      await accessNFT.revokeAccess(user1.address);
      expect(await accessNFT.totalSupply()).to.equal(1);
    });
  });
}); 