<?php
/**
 * Server-side rendering for the smartlogix/legacy-nav-menu block.
 *
 * Renders a classic WordPress navigation menu using wp_nav_menu().
 *
 * Available variables injected by WordPress:
 *  $attributes (array)    – Block attributes defined in block.json.
 *  $content    (string)   – Empty for dynamic blocks (no save() markup).
 *  $block      (WP_Block) – The current block instance.
 *
 * @see https://developer.wordpress.org/reference/functions/wp_nav_menu/
 *
 * @package LegacyNavMenuBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Resolve the menu argument.
// A stored menu ID of 0 means "auto-select" – pass an empty string so
// wp_nav_menu() falls through to theme_location / first non-empty menu.
$menu = ! empty( $attributes['menuId'] ) ? (int) $attributes['menuId'] : '';

// Container: an empty string disables the wrapping element.
$container = isset( $attributes['container'] ) ? $attributes['container'] : 'nav';

// Build the arguments array.
$args = array(
	'menu'                 => $menu,
	'container'            => $container,
	'container_class'      => ! empty( $attributes['containerClass'] ) ? sanitize_html_class( $attributes['containerClass'] ) : '',
	'container_id'         => '',
	'container_aria_label' => ! empty( $attributes['containerAriaLabel'] ) ? esc_attr( $attributes['containerAriaLabel'] ) : '',
	'menu_class'           => ! empty( $attributes['menuClass'] ) ? sanitize_html_class( $attributes['menuClass'] ) : 'menu',
	'depth'                => isset( $attributes['depth'] ) ? (int) $attributes['depth'] : 0,
	'item_spacing'         => in_array( $attributes['itemSpacing'] ?? 'preserve', array( 'preserve', 'discard' ), true )
		? $attributes['itemSpacing']
		: 'preserve',
	'echo'                 => false, // Always return so we can wrap it.
	'fallback_cb'          => false, // Do not fall back to wp_page_menu().
);

// Apply theme_location only if explicitly provided.
if ( ! empty( $attributes['themeLocation'] ) ) {
	$args['theme_location'] = sanitize_key( $attributes['themeLocation'] );
}

// Add block wrapper attributes (class, id, data-*, etc.).
$wrapper_attributes = get_block_wrapper_attributes();

// Render the menu.
$nav_html = wp_nav_menu( $args );

if ( false === $nav_html || '' === $nav_html ) {
	// Nothing to render – show a placeholder only in the editor context.
	if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
		printf(
			'<div %s><p>%s</p></div>',
			$wrapper_attributes,
			esc_html__( 'No menu found. Select a menu or assign one to the specified theme location.', 'legacy-nav-menu' )
		);
	}
	return;
}

printf(
	'<div %s>%s</div>',
	$wrapper_attributes,
	$nav_html
);
