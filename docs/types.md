## Typedefs

<dl>
<dt><a href="#ContainerOptions">ContainerOptions</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#RunInContainerOutput">RunInContainerOutput</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#VolumeOptions">VolumeOptions</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#NetworkOption">NetworkOption</a> : <code>object</code></dt>
<dd></dd>
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

<a name="ContainerOptions"></a>

## ContainerOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| exposePorts | <code>Array.&lt;object&gt;</code> | list of objects that specified what ports to expose. |
| exposePorts.host | <code>number</code> | port expose at the host machine. |
| exposePorts.docker | <code>number</code> | port expose at the container. |
| environmentVariables | <code>Array.&lt;object&gt;</code> | list of objects that specified what environment variables pass to the docker container. |
| environmentVariables.name | <code>string</code> | the name of the environment variable that passes to the docker container. |
| environmentVariables.value | <code>string</code> | the value of the environment variable that passes to the docker container. |
| volumes | <code>Array.&lt;object&gt;</code> | list of objects that specified what volumes are expose. |
| volumes.host | <code>string</code> | what path is expose at the host. |
| volumes.docker | <code>string</code> | where the expose path is contained in the docker container. |
| network | <code>string</code> | the network the container is in. |
| image | <code>string</code> | the name if the docker image. |
| name | <code>string</code> | name of the container. |
| id | <code>string</code> | the container id, set when the container is created. |
| rm | <code>boolean</code> | remove the container after it exits. |
| status | <code>&#x27;created&#x27;</code> \| <code>&#x27;started&#x27;</code> \| <code>&#x27;removed&#x27;</code> \| <code>&#x27;stopped&#x27;</code> | the container status (created|started|removed|stopped) |
| commands | <code>Array.&lt;string&gt;</code> | commands to pass to the container. |
| health | <code>object</code> | Object to check container health. |
| health.command | <code>string</code> | Command to run to check health. |
| health.interval | <code>string</code> | Time between running the check (ms|s|m|h) (default 30s) |
| health.retries | <code>number</code> | Consecutive failures needed to report unhealthy |
| health.startPeriod | <code>string</code> | Start period for the container to initialize before starting health-retries countdown (ms|s|m|h) (default 30s) |
| health.timeout | <code>string</code> | Maximum time to allow one check to run (ms|s|m|h) (default 30s) |
| user | <code>string</code> | Sets the user name or UID. |
| grope | <code>string</code> | Sets group name or GID, must be used with user. |

<a name="RunInContainerOutput"></a>

## RunInContainerOutput : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| stdout | <code>string</code> | Container output from log stream. |
| stderr | <code>string</code> | Container output from error stream. |

<a name="VolumeOptions"></a>

## VolumeOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The volume id, set when the volume is created. |
| status | <code>&#x27;alive&#x27;</code> \| <code>&#x27;dead&#x27;</code> | Tells if the volume is alive (alive|dead) |

<a name="NetworkOption"></a>

## NetworkOption : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the docker network. |
| id | <code>string</code> | the network id, set when the network is created. |
| status | <code>&#x27;alive&#x27;</code> \| <code>&#x27;dead&#x27;</code> | Tells if the network is alive (alive|dead) |

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

