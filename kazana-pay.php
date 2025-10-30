<?php
/**
 * Plugin Name: Kazana Pay
 * Description: Accept Base USDC payments via a simple checkout button and mint on-chain NFT receipts.
 * Version: 0.1
 * Author: Loise Mburu
 */

defined( 'ABSPATH' ) || exit;

/**
 * Activation hook - create default options
 */
function kazana_pay_activate() {
    add_option( 'kazana_pay_merchant_address', '' );
    add_option( 'kazana_pay_usdc_address', '' );
    add_option( 'kazana_pay_base_rpc', '' );
    add_option( 'kazana_pay_mode', 'testnet' ); // testnet | mainnet
}
register_activation_hook( __FILE__, 'kazana_pay_activate' );

/**
 * Validate Ethereum address (very simple check for 0x + 40 hex chars)
 */
function kazana_pay_is_valid_eth_address( $address ) {
    if ( ! is_string( $address ) ) {
        return false;
    }
    return (bool) preg_match( '/^0x[a-fA-F0-9]{40}$/', $address );
}

/**
 * Sanitization callback for settings
 */
function kazana_pay_sanitize_options( $input ) {
    $output = array();

    // Merchant address
    $merchant = isset( $input['merchant_address'] ) ? sanitize_text_field( $input['merchant_address'] ) : '';
    if ( $merchant && ! kazana_pay_is_valid_eth_address( $merchant ) ) {
        add_settings_error( 'kazanapay_messages', 'kazanapay_merchant_invalid', 'Merchant address looks invalid. Please enter a valid 0x... address.' );
        // keep previous value if invalid
        $output['merchant_address'] = get_option( 'kazana_pay_merchant_address', '' );
    } else {
        $output['merchant_address'] = $merchant;
    }

    // USDC token address (optional)
    $usdc = isset( $input['usdc_address'] ) ? sanitize_text_field( $input['usdc_address'] ) : '';
    if ( $usdc && ! kazana_pay_is_valid_eth_address( $usdc ) ) {
        add_settings_error( 'kazanapay_messages', 'kazanapay_usdc_invalid', 'USDC contract address looks invalid.' );
        $output['usdc_address'] = get_option( 'kazana_pay_usdc_address', '' );
    } else {
        $output['usdc_address'] = $usdc;
    }

    // Base RPC (basic sanitize)
    $rpc = isset( $input['base_rpc'] ) ? esc_url_raw( $input['base_rpc'] ) : '';
    $output['base_rpc'] = $rpc;

    // Mode (testnet or mainnet)
    $mode = isset( $input['mode'] ) && $input['mode'] === 'mainnet' ? 'mainnet' : 'testnet';
    $output['mode'] = $mode;

    return $output;
}

/**
 * Register settings and section/fields
 */
function kazana_pay_register_settings() {
    register_setting(
        'kazanapay_options_group',                 // option group
        'kazanapay_options',                       // option name (array)
        'kazana_pay_sanitize_options'              // sanitize callback
    );

    add_settings_section(
        'kazanapay_section_main',
        'Kazana Pay Settings',
        function() { echo '<p>Configure merchant wallet, USDC token address and RPC.</p>'; },
        'kazanapay'
    );

    add_settings_field(
        'merchant_address',
        'Merchant Base Address',
        'kazanapay_field_merchant_address_cb',
        'kazanapay',
        'kazanapay_section_main'
    );

    add_settings_field(
        'usdc_address',
        'USDC Token Address',
        'kazanapay_field_usdc_address_cb',
        'kazanapay',
        'kazanapay_section_main'
    );

    add_settings_field(
        'base_rpc',
        'Base RPC URL',
        'kazanapay_field_base_rpc_cb',
        'kazanapay',
        'kazanapay_section_main'
    );

    add_settings_field(
        'mode',
        'Network Mode',
        'kazanapay_field_mode_cb',
        'kazanapay',
        'kazanapay_section_main'
    );
}
add_action( 'admin_init', 'kazana_pay_register_settings' );

/**
 * Field callbacks
 */
function kazanapay_field_merchant_address_cb() {
    $opts = get_option( 'kazanapay_options', array() );
    $val  = isset( $opts['merchant_address'] ) ? esc_attr( $opts['merchant_address'] ) : '';
    printf(
        '<input name="kazanapay_options[merchant_address]" type="text" value="%s" class="regular-text" placeholder="0x...">',
        $val
    );
    echo '<p class="description">Merchant wallet address that will receive USDC payments.</p>';
}

function kazanapay_field_usdc_address_cb() {
    $opts = get_option( 'kazanapay_options', array() );
    $val  = isset( $opts['usdc_address'] ) ? esc_attr( $opts['usdc_address'] ) : '';
    printf(
        '<input name="kazanapay_options[usdc_address]" type="text" value="%s" class="regular-text" placeholder="0x...">',
        $val
    );
    echo '<p class="description">USDC token contract address on the selected network (optional).</p>';
}

function kazanapay_field_base_rpc_cb() {
    $opts = get_option( 'kazanapay_options', array() );
    $val  = isset( $opts['base_rpc'] ) ? esc_attr( $opts['base_rpc'] ) : '';
    printf(
        '<input name="kazanapay_options[base_rpc]" type="url" value="%s" class="regular-text" placeholder="https://...">',
        $val
    );
    echo '<p class="description">RPC endpoint for the selected network (optional — only required if you plan server-side calls).</p>';
}

function kazanapay_field_mode_cb() {
    $opts = get_option( 'kazanapay_options', array() );
    $mode = isset( $opts['mode'] ) ? esc_attr( $opts['mode'] ) : 'testnet';
    ?>
    <select name="kazanapay_options[mode]">
        <option value="testnet" <?php selected( $mode, 'testnet' ); ?>>Testnet</option>
        <option value="mainnet" <?php selected( $mode, 'mainnet' ); ?>>Mainnet</option>
    </select>
    <p class="description">Choose Testnet for development, Mainnet for production.</p>
    <?php
}

/**
 * Admin menu and settings page
 */
function kazanapay_admin_menu() {
    add_options_page(
        'Kazana Pay Settings',
        'Kazana Pay',
        'manage_options',
        'kazanapay',
        'kazanapay_settings_page'
    );
}
add_action( 'admin_menu', 'kazanapay_admin_menu' );

/**
 * Render settings page
 */
function kazanapay_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
    ?>
    <div class="wrap">
        <h1>Kazana Pay Settings</h1>

        <?php settings_errors( 'kazanapay_messages' ); ?>

        <form method="post" action="options.php">
            <?php
            settings_fields( 'kazanapay_options_group' );
            do_settings_sections( 'kazanapay' );
            submit_button( 'Save Settings', 'primary', 'kazanapay_save' );
            ?>
        </form>
    </div>
    <?php
}

/**
 * Enqueue frontend and admin scripts (bundled)
 *
 * NOTE: Your JS must be compiled/bundled to these paths (see build steps below)
 */
function kazanapay_enqueue_scripts() {
    // Frontend bundle (must be built with your bundler, no raw ES imports)
   
    // Load ethers from CDN
    wp_enqueue_script(
    'ethers-js',
    'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js',
    array(),
    null,
    true,
    ['type' => 'module']
    );

    // Then load your bundled file
    wp_enqueue_script(
    'kazanapay-js',
    plugins_url('/assets/js/dist/kazana-pay.bundle.js', __FILE__),
    array('ethers-js', 'jquery'),
    '1.0',
    true,
    ['type' => 'module']
    );

    

    // Localize config for the frontend bundle
    $opts = get_option( 'kazanapay_options', array() );
    wp_localize_script(
        'kazanapay-js',
        'kazanapayConfig',
        array(
            'merchantAddress' => isset( $opts['merchant_address'] ) ? $opts['merchant_address'] : '',
            'usdcAddress'     => isset( $opts['usdc_address'] ) ? $opts['usdc_address'] : '',
            'baseRpc'         => isset( $opts['base_rpc'] ) ? $opts['base_rpc'] : '',
            'mode'            => isset( $opts['mode'] ) ? $opts['mode'] : 'testnet',
            'ajaxUrl'         => admin_url( 'admin-ajax.php' ),
        )
    );
}
add_action( 'wp_enqueue_scripts', 'kazanapay_enqueue_scripts' );

/**
 * Enqueue admin script only on our settings page
 */
function kazanapay_admin_enqueue( $hook ) {
    // Options page hook name is settings_page_kazanapay
    if ( $hook !== 'settings_page_kazanapay' ) {
        return;
    }

    wp_enqueue_script(
        'kazanapay-admin',
        plugin_dir_url( __FILE__ ) . 'assets/js/kazana-admin.bundle.js',
        array(),
        '1.0.0',
        true,
        ['type' => 'module']
    );

    // pass ajaxUrl if admin script needs it
    wp_localize_script( 'kazanapay-admin', 'kazanapayAdminConfig', array(
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'nonce' => wp_create_nonce( 'kazanapay_admin_nonce' ),
    ) );
}
add_action( 'admin_enqueue_scripts', 'kazanapay_admin_enqueue' );


/**
 * Shortcode to render button
 * Usage: [kazanapay_button amount="1.00" label="Pay with Base"]
 */
function kazanapay_button_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'amount' => '1.00',
        'label'  => 'Pay with Base',
    ), $atts, 'kazanapay_button' );

    ob_start();
    ?>
    <div class="kazanapay-checkout">
        <button id="kazanaPayButton" class="kazanapay-pay-btn" data-amount="<?php echo esc_attr( $atts['amount'] ); ?>">
            <?php echo esc_html( $atts['label'] ); ?>
        </button>
        <div id="kazanapay-status" class="kazanapay-status" aria-live="polite"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'kazanapay_button', 'kazanapay_button_shortcode' );

