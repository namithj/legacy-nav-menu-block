# Legacy Nav Menu Block

A WordPress Gutenberg block that renders classic navigation menus via `wp_nav_menu()`. Designed as a **standalone Composer library** that any theme can include.

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
| Node.js (development only) | 20+ |

## Installation

### Via Composer (recommended)

```bash
composer require smartlogix/legacy-nav-menu-block
```

Then load Composer's autoloader in your theme's `functions.php` (if you haven't already):

```php
require_once __DIR__ . '/vendor/autoload.php';
```

That's it — the block auto-registers via the autoloader. No additional code needed.

### Manual installation

Download the release `.zip` from [Releases](https://github.com/namithj/legacy-nav-menu-block/releases), extract it into your theme, and require the bootstrap file:

```php
require_once get_template_directory() . '/legacy-nav-menu-block/legacy-nav-menu.php';
```

## Usage

Search for **"Legacy Nav Menu"** in the block inserter. Configure via the sidebar:

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

> **Tip:** If you want theme locations to appear in the block's dropdown, register them with `register_nav_menus()` in your theme as usual. The block fetches available locations dynamically via the REST API.

## Development

```bash
git clone https://github.com/namithj/legacy-nav-menu-block.git
cd legacy-nav-menu-block
npm install
npm start        # watch mode
npm run build    # production build
npm run lint:js
npm run lint:css
```

## Releasing

1. Update the version in `composer.json`, `package.json`, `block.json`, and `legacy-nav-menu.php`.
2. Run `npm run build` and commit the updated `build/` directory.
3. Push to `main`, then create a GitHub Release.
4. The Release workflow verifies the build and attaches a `.zip` to the release.
5. Packagist auto-updates via its GitHub webhook.

## License

GPL-2.0-or-later — see [LICENSE](LICENSE).
