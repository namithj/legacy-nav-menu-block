import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	RangeControl,
	Notice,
	Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import ServerSideRender from '@wordpress/server-side-render';
import './editor.scss';

/**
 * Edit component for the Legacy Nav Menu block.
 *
 * @param {Object} props Block props.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		menuId,
		themeLocation,
		container,
		containerClass,
		containerAriaLabel,
		menuClass,
		depth,
		itemSpacing,
	} = attributes;

	const blockProps = useBlockProps( {
		className: 'wp-block-smartlogix-legacy-nav-menu',
	} );

	// ── Fetch available nav menus from REST API ──
	const { menus, isResolvingMenus } = useSelect( ( select ) => {
		const { getEntityRecords, isResolving } = select( coreStore );
		const query = { per_page: -1, orderby: 'name', order: 'asc' };
		return {
			menus: getEntityRecords( 'root', 'menu', query ) || [],
			isResolvingMenus: isResolving( 'getEntityRecords', [
				'root',
				'menu',
				query,
			] ),
		};
	}, [] );

	// ── Fetch registered theme locations from plugin REST endpoint ──
	const [ themeLocations, setThemeLocations ] = useState( [] );
	const [ isLoadingLocations, setIsLoadingLocations ] = useState( true );

	useEffect( () => {
		apiFetch( { path: '/legacy-nav-menu/v1/locations' } )
			.then( ( data ) => {
				setThemeLocations( data || [] );
			} )
			.catch( () => {
				setThemeLocations( [] );
			} )
			.finally( () => {
				setIsLoadingLocations( false );
			} );
	}, [] );

	// Build menu options for SelectControl.
	const menuOptions = [
		{
			label: __( '— Auto-select first menu —', 'legacy-nav-menu' ),
			value: 0,
		},
		...menus.map( ( menu ) => ( {
			label: menu.name,
			value: menu.id,
		} ) ),
	];

	// Build theme location options dynamically from REST response.
	const themeLocationOptions = [
		{ label: __( '— None —', 'legacy-nav-menu' ), value: '' },
		...themeLocations.map( ( loc ) => ( {
			label: loc.description || loc.slug,
			value: loc.slug,
		} ) ),
	];

	const containerOptions = [
		{ label: __( 'nav (recommended)', 'legacy-nav-menu' ), value: 'nav' },
		{ label: __( 'div', 'legacy-nav-menu' ), value: 'div' },
		{
			label: __( 'None (no wrapping element)', 'legacy-nav-menu' ),
			value: '',
		},
	];

	const itemSpacingOptions = [
		{ label: __( 'Preserve', 'legacy-nav-menu' ), value: 'preserve' },
		{ label: __( 'Discard', 'legacy-nav-menu' ), value: 'discard' },
	];

	const hasMenuOrLocation = menuId > 0 || themeLocation.trim() !== '';

	return (
		<>
			<InspectorControls>
				{ /* ── Menu Selection ── */ }
				<PanelBody
					title={ __( 'Menu Selection', 'legacy-nav-menu' ) }
					initialOpen={ true }
				>
					<PanelRow>
						{ isResolvingMenus ? (
							<Spinner />
						) : (
							<SelectControl
								label={ __( 'Menu', 'legacy-nav-menu' ) }
								help={ __(
									'Choose a specific nav menu to display. Leave on "Auto-select" to use the theme location or first available menu.',
									'legacy-nav-menu'
								) }
								value={ menuId }
								options={ menuOptions }
								onChange={ ( value ) =>
									setAttributes( {
										menuId: parseInt( value, 10 ),
									} )
								}
							/>
						) }
					</PanelRow>
					<PanelRow>
						{ isLoadingLocations ? (
							<Spinner />
						) : (
							<SelectControl
								label={ __(
									'Theme Location',
									'legacy-nav-menu'
								) }
								help={
									themeLocations.length > 0
										? __(
												'Display the menu assigned to a registered theme location. Takes precedence over a directly selected menu.',
												'legacy-nav-menu'
										  )
										: __(
												'No theme locations registered. Use register_nav_menus() in your theme to add locations.',
												'legacy-nav-menu'
										  )
								}
								value={ themeLocation }
								options={ themeLocationOptions }
								onChange={ ( value ) =>
									setAttributes( { themeLocation: value } )
								}
							/>
						) }
					</PanelRow>
				</PanelBody>

				{ /* ── Container Settings ── */ }
				<PanelBody
					title={ __( 'Container', 'legacy-nav-menu' ) }
					initialOpen={ false }
				>
					<PanelRow>
						<SelectControl
							label={ __(
								'Container element',
								'legacy-nav-menu'
							) }
							help={ __(
								'HTML element wrapping the <ul> list.',
								'legacy-nav-menu'
							) }
							value={ container }
							options={ containerOptions }
							onChange={ ( value ) =>
								setAttributes( { container: value } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __(
								'Container CSS class',
								'legacy-nav-menu'
							) }
							value={ containerClass }
							onChange={ ( value ) =>
								setAttributes( { containerClass: value } )
							}
						/>
					</PanelRow>
					{ container === 'nav' && (
						<PanelRow>
							<TextControl
								label={ __(
									'Container aria-label',
									'legacy-nav-menu'
								) }
								help={ __(
									'Accessible label for the <nav> element.',
									'legacy-nav-menu'
								) }
								value={ containerAriaLabel }
								onChange={ ( value ) =>
									setAttributes( {
										containerAriaLabel: value,
									} )
								}
							/>
						</PanelRow>
					) }
				</PanelBody>

				{ /* ── List Options ── */ }
				<PanelBody
					title={ __( 'List Options', 'legacy-nav-menu' ) }
					initialOpen={ false }
				>
					<PanelRow>
						<TextControl
							label={ __(
								'Menu CSS class',
								'legacy-nav-menu'
							) }
							help={ __(
								'CSS class on the <ul> element.',
								'legacy-nav-menu'
							) }
							value={ menuClass }
							onChange={ ( value ) =>
								setAttributes( { menuClass: value } )
							}
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							label={ __(
								'Depth (0 = all levels)',
								'legacy-nav-menu'
							) }
							help={ __(
								'How many levels of the menu hierarchy to show.',
								'legacy-nav-menu'
							) }
							value={ depth }
							onChange={ ( value ) =>
								setAttributes( { depth: value } )
							}
							min={ 0 }
							max={ 10 }
							step={ 1 }
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={ __(
								'Whitespace in HTML',
								'legacy-nav-menu'
							) }
							value={ itemSpacing }
							options={ itemSpacingOptions }
							onChange={ ( value ) =>
								setAttributes( { itemSpacing: value } )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			{ /* ── Editor canvas ── */ }
			<div { ...blockProps }>
				{ ! hasMenuOrLocation && (
					<Notice
						status="warning"
						isDismissible={ false }
						className="wp-block-smartlogix-legacy-nav-menu__notice"
					>
						{ __(
							'Legacy Nav Menu: select a menu or choose a theme location in the block settings (sidebar) to display the navigation.',
							'legacy-nav-menu'
						) }
					</Notice>
				) }
				{ hasMenuOrLocation && (
					<ServerSideRender
						block="smartlogix/legacy-nav-menu"
						attributes={ attributes }
					/>
				) }
			</div>
		</>
	);
}
