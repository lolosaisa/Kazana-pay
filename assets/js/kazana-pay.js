// ================================
// Kazana Pay Frontend Script
// Handles: Payment + NFT Receipt
// ================================

// Import required dependencies
import { pay, getPaymentStatus } from "base-org/account";
import { BrowserProvider, Contract, ethers } from "ethers";
import { NFTStorage, Blob } from "nft.storage";
import NFTReceiptABI from "../../contracts/NFTReceipt.json";

// 🏗️ Deployed contract address on Base Testnet
const contractAddress = "0x4CF66dD38Df708Ffc86BE841f179317541c5f74E";

// 🌐 Initialize NFT.Storage client
const nftStorageClient = new NFTStorage({
  token: window.NFT_STORAGE_API_KEY || "YOUR_PUBLIC_NFT_STORAGE_TOKEN",
});

// 🧾 Handle full payment + mint flow
async function handlePayment() {
  // Ensure wallet connection
  const wallet = await window.ethereum.request({ method: "eth_requestAccounts" });
  const buyer = wallet[0];
  const merchant = window.kazanaMerchantAddress; // localized from PHP
  const amount = kazanaPayData?.amount || "1.00"; // fallback for testing

  try {
    // Step 1️⃣: Send payment through Base Pay (uses USDC internally)
    const payment = await pay({ amount, to: merchant, testnet: true });
    console.log("💸 Payment initiated:", payment);

    // Step 2️⃣: Verify payment status
    const { status } = await getPaymentStatus({ id: payment.id, testnet: true });
    console.log("Payment status:", status);

    if (status === "completed" || payment.success) {
      console.log("✅ Payment confirmed! Preparing NFT...");

      // Step 3️⃣: Build dynamic NFT metadata
      const metadata = {
        name: `KazanaPay Receipt #${payment.id}`,
        description: `Proof of purchase for order #${payment.id} via Kazana Pay.`,
        attributes: [
          { trait_type: "Buyer", value: buyer },
          { trait_type: "Merchant", value: merchant },
          { trait_type: "Amount (USDC)", value: amount },
          { trait_type: "Payment ID", value: payment.id },
          { trait_type: "Status", value: status },
          { trait_type: "Network", value: "Base Testnet" },
          { trait_type: "Timestamp", value: new Date().toISOString() },
        ],
      };

      // Step 4️: Upload metadata to IPFS
      const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
      const cid = await nftStorageClient.storeBlob(blob);
      const metadataURI = `ipfs://${cid}`;
      console.log("📦 Metadata uploaded to IPFS:", metadataURI);

      // Step 5️⃣: Mint NFT Receipt Onchain
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, NFTReceiptABI, signer);

      const tx = await contract.mintReceipt(
        buyer,
        merchant,
        ethers.parseUnits(amount, 6), // Convert USDC string to 6-decimals
        payment.id,                   // txHash or payment reference
        payment.id,                   // orderId (reuse same)
        metadataURI
      );

      await tx.wait();
      console.log("🎉 NFT receipt minted successfully!", tx.hash);
      alert("✅ Payment successful! NFT receipt minted.");

    } else {
      alert("⚠️ Payment still pending. Please wait...");
    }

  } catch (error) {
    console.error("❌ Payment failed:", error);
    alert(`Error: ${error.message}`);
  }
}

// ⏳ Wait for DOM and attach button listener
document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.querySelector("#kazanaPayButton");
  if (!payBtn) return;

  payBtn.addEventListener("click", handlePayment);
});



// import { pay, getPaymentStatus } from "https://unpkg.com/@base-org/account?module";
// import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
// import NFTReceiptABI from "./contracts/NFTReceipt.json";

// const contractAddress = "0x4CF66dD38Df708Ffc86BE841f179317541c5f74E";

// async function mintNFTReceipt(buyerAddress, purchaseId, tokenURI) {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, NFTReceiptABI, signer);

//     const tx = await contract.mintReceipt(buyerAddress, purchaseId, tokenURI);
//     await tx.wait();
//     console.log("NFT receipt minted!", tx.hash);
// }

// document.addEventListener("DOMContentLoaded", () => {
//     const payBtn = document.querySelector("#kazanaPayButton");
//     if (!payBtn) return;

//     payBtn.addEventListener("click", async () => {
//         const recipient = kazanaPayData.merchantAddress;
//         const amount = kazanaPayData.amount;

//         try {
//             const payment = await pay({ amount, to: recipient, testnet: true });
//             console.log(`Payment sent! ID: ${payment.id}`);

//             const { status } = await getPaymentStatus({ id: payment.id, testnet: true });

//             if (status === "completed") {
//                 showConfirmationModal("Payment successful!");

//                 // Mint NFT
//                 const buyerAddress = payment.payerInfoResponses?.onchainAddress || payment.from;
//                 const purchaseId = payment.id;
//                 const tokenURI = "https://my-ipfs-link.com/metadata.json";

//                 await mintNFTReceipt(buyerAddress, purchaseId, tokenURI);
//             } else {
//                 alert("Payment pending... please wait.");
//             }
//         } catch (error) {
//             alert(`Payment failed: ${error.message}`);
//             console.error(error);
//         }
//     });
// });
