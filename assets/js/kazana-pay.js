import { pay, getPaymentStatus } from "https://unpkg.com/@base-org/account?module";
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import NFTReceiptABI from "./contracts/NFTReceipt.json";

const contractAddress = "0x4CF66dD38Df708Ffc86BE841f179317541c5f74E";

async function mintNFTReceipt(buyerAddress, purchaseId, tokenURI) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, NFTReceiptABI, signer);

    const tx = await contract.mintReceipt(buyerAddress, purchaseId, tokenURI);
    await tx.wait();
    console.log("NFT receipt minted!", tx.hash);
}

document.addEventListener("DOMContentLoaded", () => {
    const payBtn = document.querySelector("#kazanaPayButton");
    if (!payBtn) return;

    payBtn.addEventListener("click", async () => {
        const recipient = kazanaPayData.merchantAddress;
        const amount = kazanaPayData.amount;

        try {
            const payment = await pay({ amount, to: recipient, testnet: true });
            console.log(`Payment sent! ID: ${payment.id}`);

            const { status } = await getPaymentStatus({ id: payment.id, testnet: true });

            if (status === "completed") {
                showConfirmationModal("Payment successful!");

                // Mint NFT
                const buyerAddress = payment.payerInfoResponses?.onchainAddress || payment.from;
                const purchaseId = payment.id;
                const tokenURI = "https://my-ipfs-link.com/metadata.json";

                await mintNFTReceipt(buyerAddress, purchaseId, tokenURI);
            } else {
                alert("Payment pending... please wait.");
            }
        } catch (error) {
            alert(`Payment failed: ${error.message}`);
            console.error(error);
        }
    });
});
