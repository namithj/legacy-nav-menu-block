<?php
/**
 * Legacy Nav Menu Block
 *
 * Registers a Gutenberg block that renders classic WordPress navigation menus
 * via wp_nav_menu(). Include this library in your theme to add the block.
 *
 * Install via Composer:
 *   composer require smartlogix/legacy-nav-menu-block
 *
 * The block auto-registers when this file is loaded through Composer's
 * autoloader. No additional theme code is required.
 *
 * @package LegacyNavMenuBlock
 * @version 1.0.0
 * @license GPL-2.0-or-later
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Prevent double-loading if multiple packages depend on this library.
if ( defined( 'LEGACY_NAV_MENU_BLOCK_VERSION' ) ) {
	return;
}

define( 'LEGACY_NAV_MENU_BLOCK_VERSION', '1.0.0' );
define( 'LEGACY_NAV_MENU_BLOCK_DIR', __DIR__ . '/' );

/**
 * Register the block from its built assets.
 */
function legacy_nav_menu_block_init() {
	$block_dir = LEGACY_NAV_MENU_BLOCK_DIR . 'build/legacy-nav-menu';

	if ( file_exists( $block_dir . '/block.json' ) ) {
		register_block_type( $block_dir );
	}
}
add_action( 'init', 'legacy_nav_menu_block_init' );

/**
 * Ensure classic menus UI is available.
 *
 * Adds theme support for menus so that the Appearance → Menus screen is
 * present even in block themes that don't register it themselves.
 */
function legacy_nav_menu_block_enable_menus() {
	if ( ! current_theme_supports( 'menus' ) ) {
		add_theme_support( 'menus' );
	}
}
add_action( 'after_setup_theme', 'legacy_nav_menu_block_enable_menus', 99 );

/**
 * Expose registered nav-menu locations to the block editor via REST API.
 *
 * Returns an array of { slug, description } objects so the editor can
 * populate the Theme Location dropdown without hard-coding values.
 */
function legacy_nav_menu_block_register_rest_route() {
	register_rest_route(
		'legacy-nav-menu/v1',
		'/locations',
		array(
			'methods'             => 'GET',
			'callback'            => 'legacy_nav_menu_block_get_locations',
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'rest_api_init', 'legacy_nav_menu_block_register_rest_route' );

/**
 * REST callback: return registered nav menu locations.
 *
 * @return WP_REST_Response
 */
function legacy_nav_menu_block_get_locations() {
	$locations  = get_registered_nav_menus(); // slug => description
	$result     = array();

	foreach ( $locations as $slug => $description ) {
		$result[] = array(
			'slug'        => $slug,
			'description' => $description,
		);
	}

	return rest_ensure_response( $result );
}
