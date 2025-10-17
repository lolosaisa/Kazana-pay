 # (Optional) REST endpoints / backend logic
 <?php
if ( ! defined( 'ABSPATH' ) ) exit;

class Kazana_Pay_API {

	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	public function register_routes() {
		register_rest_route(
			'kazana/v1',
			'/verify',
			[
				'methods'  => 'POST',
				'callback' => [ $this, 'verify_transaction' ],
				'permission_callback' => '__return_true',
			]
		);
	}

	public function verify_transaction( $request ) {
		$params = $request->get_json_params();
		$txHash = sanitize_text_field( $params['txHash'] ?? '' );

		if ( empty( $txHash ) ) {
			return new WP_REST_Response( [ 'success' => false, 'error' => 'Missing tx
