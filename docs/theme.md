<a name="Theme"></a>

## Theme
Manage wordpress theme through wp cli.

**Kind**: global class  

* [Theme](#Theme)
    * [new Theme(site)](#new_Theme_new)
    * [.wpTheme(commands)](#Theme+wpTheme) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code>
    * [.activate(theme)](#Theme+activate) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code>
    * [.delete(theme, force)](#Theme+delete) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code>
    * [.get(theme)](#Theme+get) ⇒ <code>Promise.[&lt;ThemeGetObject&gt;](./types#ThemeGetObject)</code>
    * [.install(theme, activate, version)](#Theme+install) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code>
    * [.isActive(theme)](#Theme+isActive) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.isInstalled(theme)](#Theme+isInstalled) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.list([filters])](#Theme+list) ⇒ <code>Promise.&lt;Array.[&lt;ThemeListFiltersObject&gt;](./types#ThemeListFiltersObject)&gt;</code>
    * [.path(theme)](#Theme+path) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_Theme_new"></a>

### new Theme(site)
Constructor for the Theme object.


| Param | Type | Description |
| --- | --- | --- |
| site | <code>Container</code> | the wordpress site to work on. |

<a name="Theme+wpTheme"></a>

### theme.wpTheme(commands) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code>
Run wp theme command on a wp cli continer that connect to the site provied in the constructor.

**Kind**: instance method of [<code>Theme</code>](#Theme)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| commands | <code>Array.&lt;string&gt;</code> | commands passing to wp theme. |

<a name="Theme+activate"></a>

### theme.activate(theme) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code>
Activates a theme.

**Kind**: instance method of [<code>Theme</code>](#Theme)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code> - The output of the command  

| Param | Type | Description |
| --- | --- | --- |
| theme | <code>string</code> | The theme to activate. |

<a name="Theme+delete"></a>

### theme.delete(theme, force) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code>
Deletes one or more themes.

**Kind**: instance method of [<code>Theme</code>](#Theme)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| theme | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> |  | One or more themes to delete, use 'all' to delete all except active theme. |
| force | <code>boolean</code> | <code>false</code> | To delete active theme use this. |

**Example**  
```js
const theme = new Theme(WordPress)

//delete one theme
theme.delete('Twenty Twenty')

// Delete all themes
theme.delete('all')
```
<a name="Theme+get"></a>

### theme.get(theme) ⇒ <code>Promise.[&lt;ThemeGetObject&gt;](./types#ThemeGetObject)</code>
Get theme data.

**Kind**: instance method of [<code>Theme</code>](#Theme)  
**Returns**: <code>Promise.[&lt;ThemeGetObject&gt;](./types#ThemeGetObject)</code> - Current theme data.  

| Param | Type | Description |
| --- | --- | --- |
| theme | <code>string</code> | The theme to get. |

<a name="Theme+install"></a>

### theme.install(theme, activate, version) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code>
**Kind**: instance method of [<code>Theme</code>](#Theme)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| theme | <code>string</code> \| <code>Array</code> | One or more themes to install. Accepts a theme slug, the path to a local zip file, or a URL to a remote zip file. |
| activate | <code>boolean</code> | If set, the theme will be activated immediately after install. |
| version | <code>string</code> | Get that particular version from wordpress.org, instead of the stable version. |

<a name="Theme+isActive"></a>

### theme.isActive(theme) ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if a given theme is active.

**Kind**: instance method of [<code>Theme</code>](#Theme)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Whether theme is active.  

| Param | Type | Description |
| --- | --- | --- |
| theme | <code>string</code> | The theme to check. |

<a name="Theme+isInstalled"></a>

### theme.isInstalled(theme) ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if a given theme is installed.

**Kind**: instance method of [<code>Theme</code>](#Theme)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Whether theme is installed.  

| Param | Type | Description |
| --- | --- | --- |
| theme | <code>string</code> | The theme to check. |

<a name="Theme+list"></a>

### theme.list([filters]) ⇒ <code>Promise.&lt;Array.[&lt;ThemeListFiltersObject&gt;](./types#ThemeListFiltersObject)&gt;</code>
Return list of themes installed in the wordpress site and there data.

**Kind**: instance method of [<code>Theme</code>](#Theme)  
**Returns**: <code>Promise.&lt;Array.[&lt;ThemeListFiltersObject&gt;](./types#ThemeListFiltersObject)&gt;</code> - - List of themes installed in the wordpress site.  

| Param | Type | Description |
| --- | --- | --- |
| [filters] | <code>ThemeListFiltersObject</code> | Filter results based on the value of a field. |

<a name="Theme+path"></a>

### theme.path(theme) ⇒ <code>Promise.&lt;string&gt;</code>
Gets the path to a theme or to the theme directory.

**Kind**: instance method of [<code>Theme</code>](#Theme)  
**Returns**: <code>Promise.&lt;string&gt;</code> - Path to a theme or to the theme directory.  

| Param | Type | Description |
| --- | --- | --- |
| theme | <code>string</code> | The theme to get the path to. |

