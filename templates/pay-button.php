<?php
/**
 * Template: Kazana Pay Button
 * Displays the “Pay with Base” button and relies on kazana-pay.js for logic.
 */

$merchant_wallet = get_option('kazana_pay_wallet');
?>

<div id="kazanaPayContainer" class="kazana-pay-wrapper"
     data-merchant="<?php echo esc_attr($merchant_wallet); ?>">
  <button id="kazanaPayButton" class="kazana-pay-button">
    💸 Pay with Base
  </button>
  <div id="kazanaPayStatus" class="kazana-pay-status"></div>
</div>

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
