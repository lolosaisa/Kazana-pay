//Admin js for connecting wallet.

document.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.querySelector("#kazanaConnectWalletBtn");
  const walletInput = document.querySelector("input[name='kazana_pay_wallet']");

  if (!connectBtn || !walletInput) return;

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
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Failed to connect wallet. Please try again.");
    }
  });
});
