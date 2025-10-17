# HTML structure for checkout button
<button id="checkout-button">Checkout</button><?php
/**
 * Kazana Pay Button Template
 * Displays the “Pay with Base” button and hooks JS SDK
 */

$merchant_wallet = get_option('kazana_pay_wallet');
?>

<div id="kazanaPayContainer" class="kazana-pay-wrapper">
  <button id="kazanaPayButton" class="kazana-pay-button">
    💸 Pay with Base
  </button>
  <div id="kazanaPayStatus" class="kazana-pay-status"></div>
</div>

<script type="module">
  import { pay, getPaymentStatus } from "https://unpkg.com/@base-org/account?module";

  const payBtn = document.querySelector("#kazanaPayButton");
  const statusDiv = document.querySelector("#kazanaPayStatus");

  payBtn.addEventListener("click", async () => {
    statusDiv.textContent = "⏳ Connecting wallet...";

    try {
      const payment = await pay({
        amount: "1.00", // USD amount
        to: "<?php echo esc_js($merchant_wallet); ?>", // Merchant wallet from settings
        testnet: true, // Testnet mode
      });

      statusDiv.textContent = `💰 Payment initiated (ID: ${payment.id})...`;

      const { status } = await getPaymentStatus({
        id: payment.id,
        testnet: true,
      });

      if (status === "completed") {
        statusDiv.textContent = " Payment successful! 🎉";
      } else {
        statusDiv.textContent = "⌛ Payment pending...";
      }
    } catch (error) {
      console.error("Payment failed:", error);
      statusDiv.textContent = `Payment failed: ${error.message}`;
    }
  });
</script>

<style>
.kazana-pay-button {
  background: #0052ff;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.kazana-pay-button:hover {
  background: #003ed6;
}
.kazana-pay-status {
  margin-top: 10px;
  font-size: 14px;
  color: #222;
}
</style>
