<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class Kazana_Pay_API {

	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	public function register_routes() {
		register_rest_route( 'kazana-pay/v1', '/verify', [
			'methods'  => 'POST',
			'callback' => [ $this, 'verify_transaction' ],
			'permission_callback' => '__return_true',
		]);
	}

	public function verify_transaction( $request ) {
		$params = $request->get_json_params();
		$txHash = sanitize_text_field( $params['txHash'] ?? '' );
		$expectedAddress = get_option( 'kazana_pay_wallet' );

		if ( ! $txHash ) {
			return new WP_Error( 'missing_hash', 'Transaction hash required', [ 'status' => 400 ] );
		}

		// For demo: pretend verification with BaseScan API
		// In real usage: query Base RPC or SDK to confirm tx success
		$response = wp_remote_get( "https://api.basescan.org/api?module=transaction&action=gettxinfo&txhash=$txHash" );

		if ( is_wp_error( $response ) ) {
			return new WP_Error( 'api_error', 'Failed to query Base API', [ 'status' => 500 ] );
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		$status = $body['result']['status'] ?? '0';

		if ( $status !== '1' ) {
			return new WP_Error( 'tx_failed', 'Transaction not confirmed yet', [ 'status' => 400 ] );
		}

		// (Optional) Check if recipient matches merchant address
		$to = strtolower( $body['result']['to'] ?? '' );
		if ( $expectedAddress && $to !== strtolower( $expectedAddress ) ) {
			return new WP_Error( 'mismatch', 'Recipient does not match merchant wallet', [ 'status' => 400 ] );
		}

		return [
			'success' => true,
			'message' => 'Transaction verified successfully ✅',
			'data' => [
				'hash' => $txHash,
				'to' => $to,
				'blockNumber' => $body['result']['blockNumber'] ?? '',
			]
		];
	}
}

new Kazana_Pay_API();
