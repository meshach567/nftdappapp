// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessNFT is ERC721, Ownable {
    uint256 private _tokenIds;

    // Mapping to track if an address owns the access NFT
    mapping(address => bool) public hasAccess;
    
    // Events
    event AccessGranted(address indexed user, uint256 tokenId);
    event AccessRevoked(address indexed user);

    constructor() ERC721("Premium Access NFT", "ACCESS") Ownable(msg.sender) {}

    /**
     * @dev Mints a new access NFT to the specified address
     * @param to The address to mint the NFT to
     */
    function mintAccessNFT(address to) public onlyOwner {
        require(!hasAccess[to], "Address already has access");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(to, newTokenId);
        hasAccess[to] = true;
        
        emit AccessGranted(to, newTokenId);
    }

    /**
     * @dev Checks if an address owns the access NFT
     * @param user The address to check
     * @return bool True if the address has access
     */
    function checkAccess(address user) public view returns (bool) {
        return hasAccess[user];
    }

    /**
     * @dev Revokes access by burning the NFT
     * @param user The address to revoke access from
     */
    function revokeAccess(address user) public onlyOwner {
        require(hasAccess[user], "Address does not have access");
        
        // Find the token ID owned by the user
        for (uint256 i = 1; i <= _tokenIds; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == user) {
                    _burn(i);
                    break;
                }
            } catch {
                // Token doesn't exist, continue to next
                continue;
            }
        }
        
        hasAccess[user] = false;
        emit AccessRevoked(user);
    }

    /**
     * @dev Returns the total number of access NFTs minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    /**
     * @dev Override the tokenURI function to return a custom URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "ERC721: URI query for nonexistent token");
        return "https://api.example.com/metadata/access-nft.json";
    }
} 