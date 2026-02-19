# Legacy Nav Menu Block

A WordPress (Gutenberg) block plugin that renders classic navigation menus via `wp_nav_menu()`.

Use this block to bring legacy WordPress menus into the block editor with full control over menu selection, theme locations, container markup, hierarchy depth, and more.

## Features

- **Menu selector** — pick any registered nav menu from a dropdown
- **Theme location** — dynamically lists locations registered by the active theme via `register_nav_menus()`
- **Container options** — `<nav>`, `<div>`, or no wrapper; custom CSS class and `aria-label`
- **Depth control** — limit how many hierarchy levels to render
- **Whitespace** — `preserve` or `discard` whitespace inside the HTML
- **Reusable** — save as a synced pattern for use across the site
- **Server-side rendered** — live preview in the editor via `ServerSideRender`
- **Automatically enables Appearance → Menus** — even in block themes that don't declare `add_theme_support( 'menus' )`

## Requirements

| Requirement | Minimum |
|---|---|
| WordPress | 6.4+ |
| PHP | 7.4+ |
| Node.js (for development) | 20+ |

## Installation

### As a WordPress plugin

1. Download the latest release `.zip` from [Releases](https://github.com/namithj/legacy-nav-menu-block/releases).
2. In wp-admin → Plugins → Add New → Upload Plugin, upload the zip.
3. Activate the plugin.

### Via npm (for themes that bundle blocks)

```bash
npm install @smartlogix/legacy-nav-menu-block
```

Then in your theme's `functions.php`, register the block from the package:

```php
function mytheme_register_legacy_nav_menu_block() {
    $block_dir = get_template_directory() . '/node_modules/@smartlogix/legacy-nav-menu-block/build/legacy-nav-menu';
    if ( file_exists( $block_dir . '/block.json' ) ) {
        register_block_type( $block_dir );
    }
}
add_action( 'init', 'mytheme_register_legacy_nav_menu_block' );
```

> **Tip**: If you want theme locations to appear in the block's dropdown, register them with `register_nav_menus()` in your theme as usual. The block fetches available locations dynamically via the REST API.

## Development

```bash
# Clone the repo
git clone https://github.com/namithj/legacy-nav-menu-block.git
cd legacy-nav-menu-block

# Install dependencies
npm install

# Start development build (watch mode)
npm start

# Production build
npm run build

# Lint
npm run lint:js
npm run lint:css
```

## Releasing

Releases are automated via GitHub Actions:

1. Update the version in `package.json`, `block.json`, and the plugin header in `legacy-nav-menu.php`.
2. Commit and push to `main`.
3. Tag the commit:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```
4. The **Release** workflow will:
   - Build production assets
   - Create a `.zip` plugin archive
   - Publish a GitHub Release with the zip attached
   - Publish the package to the GitHub npm registry

## Block usage

Once activated, search for **"Legacy Nav Menu"** in the block inserter. Configure it via the sidebar:

| Setting | Description |
|---|---|
| Menu | Select a specific nav menu or auto-select the first one |
| Theme Location | Pick a registered theme location; takes precedence over Menu |
| Container element | `<nav>` (default), `<div>`, or none |
| Container CSS class | Custom class on the container element |
| Container aria-label | Accessible label (only for `<nav>`) |
| Menu CSS class | Class applied to the `<ul>` |
| Depth | 0 = all levels; 1–10 limits hierarchy |
| Whitespace | Preserve or discard whitespace in HTML output |

## License

GPL-2.0-or-later — see [LICENSE](LICENSE).
