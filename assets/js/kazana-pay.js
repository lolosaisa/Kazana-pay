import { pay, getPaymentStatus } from "https://unpkg.com/@base-org/account?module";

document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.querySelector("#kazanaPayButton");

  if (!payBtn) return;

  payBtn.addEventListener("click", async () => {
    const recipient = kazanaPayData.merchantAddress; // from PHP
    const amount = kazanaPayData.amount; // you can customize per checkout

    try {
      // Trigger Base Pay
      const payment = await pay({
        amount: amount,
        to: recipient,
        testnet: true, // Set to false on mainnet
      });

      console.log(`Payment sent! ID: ${payment.id}`);

      // Wait for completion
      const { status } = await getPaymentStatus({
        id: payment.id,
        testnet: true,
      });

      if (status === "completed") {
        showConfirmationModal("Payment successful!");
      } else {
        alert("Payment pending... please wait.");
      }
    } catch (error) {
      alert(`Payment failed: ${error.message}`);
      console.error(error);
    }
  });
});
