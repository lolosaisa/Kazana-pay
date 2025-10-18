// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTReceipt is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    // Mapping purchase ID to tokenId (optional for easy lookup)
    mapping(string => uint256) public purchaseToToken;

    event ReceiptMinted(
        address indexed buyer,
        uint256 indexed tokenId,
        string purchaseId,
        string tokenURI
    );

    constructor() ERC721("KazanaPayReceipt", "KAZREC") {
        tokenCounter = 1;
    }

    /**
     * Mint a new NFT receipt
     * @param buyer The buyer's wallet address
     * @param purchaseId Unique purchase/order ID
     * @param tokenURI Metadata URI (IPFS or JSON)
     */
    function mintReceipt(
        address buyer,
        string memory purchaseId,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        require(purchaseToToken[purchaseId] == 0, "Receipt already minted");

        uint256 newTokenId = tokenCounter;
        _safeMint(buyer, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        purchaseToToken[purchaseId] = newTokenId;
        tokenCounter++;

        emit ReceiptMinted(buyer, newTokenId, purchaseId, tokenURI);
        return newTokenId;
    }

    /**
     * Verify ownership of a receipt by purchaseId
     */
    function verifyReceipt(string memory purchaseId, address buyer) public view returns (bool) {
        uint256 tokenId = purchaseToToken[purchaseId];
        if (tokenId == 0) return false;
        return ownerOf(tokenId) == buyer;
    }
}
