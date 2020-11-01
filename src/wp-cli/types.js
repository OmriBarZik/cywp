/**
 * @typedef ThemeGetObject
 * @property {string} name - The name of the theme.
 * @property {string} title - the title of the theme.
 * @property {string} version - version of the theme.
 * @property {string} status - if the theme is active or inactive.
 * @property {string} parent_theme - the name of the parent theme.
 * @property {string} template_dir - path to the template directory.
 * @property {string} stylesheet_dir - path to the stylesheet directory.
 * @property {string} template - the name of the template file.
 * @property {string} stylesheet - the name of the stylesheet file.
 * @property {string} screenshot - theme screenshot.
 * @property {string} description - theme description.
 * @property {string} author - link of the theme author.
 * @property {string[]} tags - list of the theme tags.
 * @property {string} theme_root - path to theme root directory.
 * @property {string} theme_root_uri - uri to theme root directory.
 */

/**
 * @typedef ThemeListFiltersObject
 * @property {string} name - Name of the theme.
 * @property {'active'|'inactive'} status - If the theme is active or inactive.
 * @property {'none'|'available'} update - when
 * @property {string} version - current version of the theme.
 * @property {string} update_version - what version the plugin can update to.
 * @property {string} update_package - link to update theme.
 * @property {string} update_id - the theme id.
 * @property {string} title - the theme title.
 * @property {string} description - The theme description.
 */
