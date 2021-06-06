<a name="Plugin"></a>

## Plugin
Manage wordpress plugins through wp cli.

**Kind**: global class  

* [Plugin](#Plugin)
    * [new Plugin(site)](#new_Plugin_new)
    * [.wpPlugin(commands)](#Plugin+wpPlugin) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.activate(plugin)](#Plugin+activate) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.deactivate(plugin, uninstall)](#Plugin+deactivate) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.delete(plugin)](#Plugin+delete) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.get(plugin)](#Plugin+get) ⇒ <code>Promise.[&lt;PluginGetObject&gt;](./types.md#PluginGetObject)</code>
    * [.install(plugin, activate, version)](#Plugin+install) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.isActive(plugin)](#Plugin+isActive) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.isInstalled(plugin)](#Plugin+isInstalled) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * [.list([filters])](#Plugin+list) ⇒ <code>Promise.&lt;Array.[&lt;PluginListFiltersObject&gt;](./types.md#PluginListFiltersObject)&gt;</code>
    * [.path(plugin)](#Plugin+path) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.uninstall(plugin)](#Plugin+uninstall) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>

<a name="new_Plugin_new"></a>

### new Plugin(site)
Constructor for the Plugin object


| Param | Type | Description |
| --- | --- | --- |
| site | <code>Container</code> | the wordpress site to work on. |

<a name="Plugin+wpPlugin"></a>

### plugin.wpPlugin(commands) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Run wp plugin command on a wp cli continer that connected to the site provied in the constructor.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command  

| Param | Type | Description |
| --- | --- | --- |
| commands | <code>Array.&lt;string&gt;</code> | commands passing to wp plugin |

<a name="Plugin+activate"></a>

### plugin.activate(plugin) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Activate one or more plugins.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> | One or more plugins to activate, use 'all' to activate all plugins. |

**Example**  
```js
const plugin = new Plugin(WordPress)

//Activate one plugin
plugin.activate('elementor')

//Activate all plugins
plugin.activate('all')
```
<a name="Plugin+deactivate"></a>

### plugin.deactivate(plugin, uninstall) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Deactivate one or more plugins.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> | One or more plugins to deactivate, use 'all' to deactivate all plugins. |
| uninstall | <code>boolean</code> | Uninstall the plugin after deactivation. |

**Example**  
```js
const plugin = new Plugin(WordPress)

//Deactivate one plugin
plugin.deactivate('elementor')

//Deactivate all plugins
plugin.deactivate('all')
```
<a name="Plugin+delete"></a>

### plugin.delete(plugin) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Deletes one or more plugins.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> | One or more plugins to delete, use 'all' to delete all plugins. |

**Example**  
```js
const plugin = new Plugin(WordPress)

//Delete one plugin
plugin.delete('Twenty Twenty')

//Delete all plugins
plugin.delete('all')
```
<a name="Plugin+get"></a>

### plugin.get(plugin) ⇒ <code>Promise.[&lt;PluginGetObject&gt;](./types.md#PluginGetObject)</code>
Get plugin data.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.[&lt;PluginGetObject&gt;](./types.md#PluginGetObject)</code> - Current plugin data.  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | The plugin to get. |

<a name="Plugin+install"></a>

### plugin.install(plugin, activate, version) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Installs one or more plugins.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> \| <code>Array.&lt;string&gt;</code> | One or more plugins to install. Accepts a plugin slug, the path to a local zip file, or a URL to a remote zip file. |
| activate | <code>boolean</code> | If set, the plugin will be activated immediately after install. |
| version | <code>string</code> | Get that particular version from wordpress.org, instead of the stable version. |

<a name="Plugin+isActive"></a>

### plugin.isActive(plugin) ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if a given plugin is active.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Whether plugin is active  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | The plugin to check. |

<a name="Plugin+isInstalled"></a>

### plugin.isInstalled(plugin) ⇒ <code>Promise.&lt;boolean&gt;</code>
Checks if a given plugin is installed.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - Whether plugin is installed  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | The plugin to check. |

<a name="Plugin+list"></a>

### plugin.list([filters]) ⇒ <code>Promise.&lt;Array.[&lt;PluginListFiltersObject&gt;](./types.md#PluginListFiltersObject)&gt;</code>
Return list of plugin installed in the wordpress site and there data.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.&lt;Array.[&lt;PluginListFiltersObject&gt;](./types.md#PluginListFiltersObject)&gt;</code> - - List of plugin installed in the wordpress site.  

| Param | Type | Description |
| --- | --- | --- |
| [filters] | <code>PluginListFiltersObject</code> | Filter results based on the value of a field. |

<a name="Plugin+path"></a>

### plugin.path(plugin) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Gets the path to a plugin or to the plugin directory.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - Path to a plugin or to the plugin directory.  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | The plugin to get the path to. |

<a name="Plugin+uninstall"></a>

### plugin.uninstall(plugin) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Uninstalls one or more plugins.

**Kind**: instance method of [<code>Plugin</code>](#Plugin)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - Path to a plugin or to the plugin directory  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>&#x27;all&#x27;</code> | One or more plugins to uninstall. |

**Example**  
```js
const plugin = new Plugin(WordPress)

//Uninstall one plugin
plugin.uninstall('elementor')

//Uninstall all plugins
plugin.uninstall('all')
```
