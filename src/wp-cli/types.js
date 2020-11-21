/**
 * @typedef {object} ThemeGetObject
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
 * @typedef {object} ThemeListFiltersObject
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

/**
 * @typedef {object} PluginGetObject
 * @property {string} name - the name of the plugin.
 * @property {string} title - the title of the plugin.
 * @property {string} author - the name of the other if the plugin.
 * @property {string} version - the version of the plugin.
 * @property {string} description - the description of the status.
 * @property {'inactive'|'active'} status - the plugin status.
 */

/**
 * @typedef {object} PluginListFiltersObject
 * @property {string} name - Name of the plugin.
 * @property {'active'|'inactive'} status - If the plugin is active or inactive.
 * @property {'none'|'available'} update - when
 * @property {string} version - current version of the plugin.
 * @property {string} update_version - what version the plugin can update to.
 * @property {string} update_package - link to update plugin.
 * @property {string} update_id - the plugin id.
 * @property {string} title - the plugin title.
 * @property {string} description - The plugin description.
 * @property {string} file - plugin file path from parent plugin directory.
 */

/**
 * @typedef {object} UserGetObject
 * @property {string} ID - User id.
 * @property {string} user_login - User login name
 * @property {string} display_name - User display name
 * @property {string} user_email - User email
 * @property {string} user_registered - User registration date
 * @property {string} roles - User roles.
 * @property {string} user_pass - Hashed user password
 * @property {string} user_nicename - User nickname.
 * @property {string} user_url - user url
 * @property {string} user_activation_key - User activation key
 * @property {string} user_status - The user status (no real use)
 */

/**
 * @typedef {object} PostListFiltersObject
 * @property {number} ID - The post id
 * @property {string} post_title - the post title.
 * @property {string} post_name - to post name.
 * @property {string} post_date - when the post was publised.
 * @property {string} post_status - the post status.
 * @property {string} post_author - the id of the post other
 * @property {string} post_date_gmt - when the post was craeted
 * @property {string} post_content - the content of the post.
 * @property {string} post_excerpt - the post excerpt (usly used as post summary.)
 * @property {string} comment_status - the post commant status.
 * @property {string} ping_status - the post ping status
 * @property {string} post_password - the hash of the post password.
 * @property {string} to_ping - is the post to ping.
 * @property {string} pinged - is the post pinged.
 * @property {string} post_modified - the time the post was modified in current time.
 * @property {string} post_modified_gmt - the time the post was modified in GMT time.
 * @property {string} post_content_filtered - the
 * @property {string} post_parent - the parent post id.
 * @property {string} guid - the post guid.
 * @property {string} menu_order - the post menu order.
 * @property {string} post_type - the post type.
 * @property {string} post_mime_type - the post mime type.
 * @property {string} comment_count - the number of commants on the post.
 * @property {string} filter - the post filter.
 * @property {string} url - the user of the post.
 */

/**
 * @typedef {object} PostGetObject
 * @property {number} ID - The post id
 * @property {string} post_title - the post title.
 * @property {string} post_name - to post name.
 * @property {string} post_date - when the post was publised.
 * @property {string} post_status - the post status.
 * @property {string} post_author - the id of the post other
 * @property {string} post_date_gmt - when the post was craeted
 * @property {string} post_content - the content of the post.
 * @property {string} post_excerpt - the post excerpt (usly used as post summary.)
 * @property {string} comment_status - the post commant status.
 * @property {string} ping_status - the post ping status
 * @property {string} post_password - the hash of the post password.
 * @property {string} to_ping - is the post to ping.
 * @property {string} pinged - is the post pinged.
 * @property {string} post_modified - the time the post was modified in current time.
 * @property {string} post_modified_gmt - the time the post was modified in GMT time.
 * @property {string} post_content_filtered - the
 * @property {string} post_parent - the parent post id.
 * @property {string} guid - the post guid.
 * @property {string} menu_order - the post menu order.
 * @property {string} post_type - the post type.
 * @property {string} post_mime_type - the post mime type.
 * @property {string} comment_count - the number of commants on the post.
 */
