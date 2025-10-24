// admin.js
import { ethers } from "ethers";
import NFTReceiptABI from "./contracts/NFTReceipt.json";

// ----------------------------
// Config
// ----------------------------
const contractAddress = "0x1624dc212740660abc2e6e53fcd79ee121737048";

// ----------------------------
// Wallet Connection
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.querySelector("#kazanaConnectWalletBtn");
  const walletInput = document.querySelector("input[name='kazana_pay_wallet']");

  if (connectBtn && walletInput) {
    connectBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (!window.ethereum) {
        alert("MetaMask or a Base-compatible wallet is required.");
        return;
      }

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = accounts[0];

        walletInput.value = account;
        connectBtn.textContent = "✅ Connected";
        connectBtn.disabled = true;

        console.log("Merchant wallet connected:", account);
      } catch (err) {
        console.error("Wallet connection failed:", err);
        alert("Failed to connect wallet. Please try again.");
      }
    });
  }

  // ----------------------------
  // NFT Verification Buttons
  // ----------------------------
  document.querySelectorAll(".verifyNFTBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const purchaseId = btn.dataset.purchaseId;
      const buyerAddress = btn.dataset.buyerAddress;

      if (!purchaseId || !buyerAddress) {
        alert("Missing purchase ID or buyer address.");
        return;
      }

      if (!window.ethereum) {
        alert("Ethereum wallet required for verification.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, NFTReceiptABI, provider);

      try {
        const isOwner = await contract.verifyReceipt(purchaseId, buyerAddress);

        if (isOwner) {
          alert(` NFT verified for purchase ${purchaseId}`);
          btn.textContent = "Verified ";
          btn.disabled = true;
        } else {
          alert(` No NFT found for purchase ${purchaseId}`);
        }
      } catch (err) {
        console.error("NFT verification failed:", err);
        alert("Error verifying NFT. Check console for details.");
      }
    });
  });
});

// A connect button with id="kazanaConnectWalletBtn"

// An input name="kazana_pay_wallet" to store the merchant wallet

// Verify buttons with class .verifyNFTBtn and data-purchase-id & data-buyer-address