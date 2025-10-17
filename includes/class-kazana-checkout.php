# Adds “Pay with Base” button to any post/page via shortcode [kazanapay_button amount="1.00" label="Pay with Base"]
<?php
/**
 * Class Kazana_Checkout
 * Injects the “Pay with Base” button where needed
 */

if (!defined('ABSPATH')) exit;

class Kazana_Checkout {

  public function __construct() {
    add_shortcode('kazana_pay_button', [$this, 'render_pay_button']);
  }

  public function render_pay_button() {
    ob_start();
    include plugin_dir_path(__FILE__) . '../templates/pay-button.php';
    return ob_get_clean();
  }
}
