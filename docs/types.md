## Typedefs

<dl>
<dt><a href="#ThemeGetObject">ThemeGetObject</a></dt>
<dd></dd>
<dt><a href="#ThemeListFiltersObject">ThemeListFiltersObject</a></dt>
<dd></dd>
<dt><a href="#PluginGetObject">PluginGetObject</a></dt>
<dd></dd>
<dt><a href="#PluginListFiltersObject">PluginListFiltersObject</a></dt>
<dd></dd>
<dt><a href="#UserGetObject">UserGetObject</a></dt>
<dd></dd>
</dl>

<a name="ThemeGetObject"></a>

## ThemeGetObject
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the theme. |
| title | <code>string</code> | the title of the theme. |
| version | <code>string</code> | version of the theme. |
| status | <code>string</code> | if the theme is active or inactive. |
| parent_theme | <code>string</code> | the name of the parent theme. |
| template_dir | <code>string</code> | path to the template directory. |
| stylesheet_dir | <code>string</code> | path to the stylesheet directory. |
| template | <code>string</code> | the name of the template file. |
| stylesheet | <code>string</code> | the name of the stylesheet file. |
| screenshot | <code>string</code> | theme screenshot. |
| description | <code>string</code> | theme description. |
| author | <code>string</code> | link of the theme author. |
| tags | <code>Array.&lt;string&gt;</code> | list of the theme tags. |
| theme_root | <code>string</code> | path to theme root directory. |
| theme_root_uri | <code>string</code> | uri to theme root directory. |

<a name="ThemeListFiltersObject"></a>

## ThemeListFiltersObject
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the theme. |
| status | <code>&#x27;active&#x27;</code> \| <code>&#x27;inactive&#x27;</code> | If the theme is active or inactive. |
| update | <code>&#x27;none&#x27;</code> \| <code>&#x27;available&#x27;</code> | when |
| version | <code>string</code> | current version of the theme. |
| update_version | <code>string</code> | what version the plugin can update to. |
| update_package | <code>string</code> | link to update theme. |
| update_id | <code>string</code> | the theme id. |
| title | <code>string</code> | the theme title. |
| description | <code>string</code> | The theme description. |

<a name="PluginGetObject"></a>

## PluginGetObject
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the plugin. |
| title | <code>string</code> | the title of the plugin. |
| author | <code>string</code> | the name of the other if the plugin. |
| version | <code>string</code> | the version of the plugin. |
| description | <code>string</code> | the description of the status. |
| status | <code>&#x27;inactive&#x27;</code> \| <code>&#x27;active&#x27;</code> | the plugin status. |

<a name="PluginListFiltersObject"></a>

## PluginListFiltersObject
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the plugin. |
| status | <code>&#x27;active&#x27;</code> \| <code>&#x27;inactive&#x27;</code> | If the plugin is active or inactive. |
| update | <code>&#x27;none&#x27;</code> \| <code>&#x27;available&#x27;</code> | when |
| version | <code>string</code> | current version of the plugin. |
| update_version | <code>string</code> | what version the plugin can update to. |
| update_package | <code>string</code> | link to update plugin. |
| update_id | <code>string</code> | the plugin id. |
| title | <code>string</code> | the plugin title. |
| description | <code>string</code> | The plugin description. |
| file | <code>string</code> | plugin file path from parent plugin directory. |

<a name="UserGetObject"></a>

## UserGetObject
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ID | <code>string</code> | User id. |
| user_login | <code>string</code> | User login name |
| display_name | <code>string</code> | User display name |
| user_email | <code>string</code> | User email |
| user_registered | <code>string</code> | User registration date |
| roles | <code>string</code> | User roles. |
| user_pass | <code>string</code> | Hashed user password |
| user_nicename | <code>string</code> | User nickname. |
| user_url | <code>string</code> | user url |
| user_activation_key | <code>string</code> | User activation key |
| user_status | <code>string</code> | The user status (no real use) |

