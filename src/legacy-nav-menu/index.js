/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';

/**
 * Register the block. The `save` function returns null because this is a
 * fully dynamic (server-rendered) block — output is produced by render.php.
 */
registerBlockType( metadata, {
	edit: Edit,
	save: () => null,
} );
