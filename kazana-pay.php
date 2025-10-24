<?php
/**
 * Plugin Name: Kazana Pay
 * Description: Pay with Base (USDC) plugin for WordPress, shopify and wix.
 * Version: 0.1
 * Author: Loise Mburu
 */

<?php
/**
 * Plugin Name: Kazana Pay
 * Description: Accept Base USDC payments via a simple checkout button.
 * Version: 0.1
 * Author: Your Name
 */

defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

//enqueue kazana-pay.js script
// This script handles the payment logic and interacts with the Base network
function kazanapay_enqueue_scripts() {

    wp_enqueue_script(
        'kazanapay-js',
        plugins_url( '/assets/js/kazana-pay.js', __FILE__ ),
        array( 'jquery' ),
        '1.0',
        true 
    );

    //Pass the PHP data eg. merchant address, USDC contract address, and RPC URL to the JS file
    wp_localize_script( 
        'kazanapay-js', 
        'KazanaPayConfig', 
        array(
            'merchantAddress' => get_option('kazanapay_merchant_address', ''),
            'testnet' => true, // Set to false for mainnet
        )
    );
  
}
add_action('wp_enqueue_scripts', 'kazanapay_enqueue_scripts');

// Shortcode to render button
function kazanapay_button_shortcode($atts) {
    $atts = shortcode_atts( array(
        'amount' => '1.00',
        'label' => 'Pay with Base'
    ), $atts, 'kazanapay_button' );

    ob_start();
    ?>
    <div class="kazanapay-checkout">
        <button id="kz-pay-btn" data-amount="<?php echo esc_attr($atts['amount']); ?>"><?php echo esc_html($atts['label']); ?></button>
        <div id="kz-status"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('kazanapay_button', 'kazanapay_button_shortcode');

// Simple admin menu (settings)
function kazanapay_admin_menu() {
    add_options_page('Kazana Pay Settings', 'Kazana Pay', 'manage_options', 'kazanapay', 'kazanapay_settings_page');
}
add_action('admin_menu', 'kazanapay_admin_menu');


function kazanapay_settings_page() {
    if (!current_user_can('manage_options')) return;
    if (isset($_POST['kazanapay_save'])) {
        update_option('kazanapay_merchant_address', sanitize_text_field($_POST['merchant_address']));
        update_option('kazanapay_usdc_address', sanitize_text_field($_POST['usdc_address']));
        update_option('kazanapay_base_rpc', sanitize_text_field($_POST['base_rpc']));
        echo '<div class="updated"><p>Settings saved.</p></div>';
    }
    $merchant = esc_attr(get_option('kazanapay_merchant_address',''));
    $usdc = esc_attr(get_option('kazanapay_usdc_address',''));
    $rpc = esc_attr(get_option('kazanapay_base_rpc',''));
    ?>
    <div class="wrap">
      <h1>Kazana Pay Settings</h1>
      <form method="post">
        <table class="form-table">
          <tr><th>Merchant Base Address</th><td><input name="merchant_address" type="text" value="<?php echo $merchant; ?>" class="regular-text"/></td></tr>
          <tr><th>USDC Testnet Address</th><td><input name="usdc_address" type="text" value="<?php echo $usdc; ?>" class="regular-text"/><p class="description">Replace with Base testnet USDC token contract.</p></td></tr>
          <tr><th>Base RPC (Testnet)</th><td><input name="base_rpc" type="text" value="<?php echo $rpc; ?>" class="regular-text"/><p class="description">RPC URL for Base testnet.</p></td></tr>
        </table>
        <p><input type="submit" name="kazanapay_save" class="button button-primary" value="Save Settings"></p>
      </form>
    </div>
    <?php
}
