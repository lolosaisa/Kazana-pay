// Import required modules
import { pay, getPaymentStatus } from "base-org/account";
import { BrowserProvider, Contract, ethers } from "ethers";
import { NFTStorage, Blob } from "nft.storage";
import NFTReceiptABI from "./contracts/NFTReceipt.json";

// Your deployed contract address
const contractAddress = "0x4CF66dD38Df708Ffc86BE841f179317541c5f74E";

// Initialize NFT.Storage client
const nftStorageClient = new NFTStorage({
  token: process.env.NFT_STORAGE_API_KEY,
});

// Function to mint NFT receipts onchain
async function mintNFTReceipt(buyer, merchant, amount, txHash, orderId, metadaURI) {
  const provider = new BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new Contract(contractAddress, NFTReceiptABI, signer);

  const tx = await contract.mintReceipt(
    buyer, 
    merchant, 
    amount, 
    txHash, 
    orderId, 
    metadaURI
  );
  await tx.wait();
  console.log("✅ NFT receipt minted successfully!", tx.hash);
  setStatus("NFT receipt minted successfully! .");
}

// Wait until the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.querySelector("#kazanaPayButton");
  if (!payBtn) return;

  payBtn.addEventListener("click", async () => {
    const recipient = kazanaPayData.merchantAddress;
    const amount = kazanaPayData.amount;

    try {
      // Step 1: Send payment
      const payment = await pay({ amount, to: recipient, testnet: true });
      console.log(`💸 Payment sent! ID: ${payment.id}`);

      // Step 2: Check payment status
      const { status } = await getPaymentStatus({ id: payment.id, testnet: true });

      if (status === "completed") {
        showConfirmationModal("Payment successful!");

        // Step 3: Build dynamic NFT metadata
        const buyerAddress = payment.payerInfoResponses?.onchainAddress || payment.from;
        const purchaseId = payment.id;
        const metadata = {
          name: `KazanaPay Receipt #${purchaseId}`,
          description: `Proof of purchase for order #${purchaseId} via Kazana Pay.`,
          attributes: [
            { trait_type: "Buyer Address", value: buyerAddress },
            { trait_type: "Merchant Address", value: recipient },
            { trait_type: "Amount (USDC)", value: amount },
            { trait_type: "Transaction ID", value: payment.id },
            { trait_type: "Payment Status", value: status },
            { trait_type: "Timestamp", value: new Date().toISOString() },
            { trait_type: "Network", value: "Base Testnet" },
          ],
        };

        // Step 4: Upload metadata to IPFS via NFT.Storage
        const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
        const cid = await nftStorageClient.storeBlob(blob);
        const tokenURI = `ipfs://${cid}`;
        console.log("📦 Metadata uploaded to IPFS:", tokenURI);

        // Step 5: Mint NFT receipt
        await mintNFTReceipt(buyerAddress, purchaseId, tokenURI);
      } else {
        alert("Payment pending... please wait.");
      }
    } catch (error) {
      alert(`Payment failed: ${error.message}`);
      console.error(" Error processing payment:", error);
    }
  });
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
