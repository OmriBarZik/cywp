<a name="User"></a>

## User
Manages users, along with their roles, capabilities, and meta.

**Kind**: global class  

* [User](#User)
    * [new User(site)](#new_User_new)
    * [.wpUser(commands)](#User+wpUser) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.addCap(user, cap)](#User+addCap) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.addRole(user, role)](#User+addRole) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.create(options)](#User+create) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.delete(user, [reassign])](#User+delete) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.get(user)](#User+get) ⇒ <code>Promise.[&lt;UserGetObject&gt;](./types.md#UserGetObject)</code>
    * [.list([filters])](#User+list) ⇒ <code>Promise.&lt;Array.[&lt;UserGetObject&gt;](./types.md#UserGetObject)&gt;</code>
    * [.listCaps(user)](#User+listCaps) ⇒ <code>Promise.&lt;Array.&lt;{name: string}&gt;&gt;</code>
    * [.removeCap(user, cap)](#User+removeCap) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.removeRole(user, cap)](#User+removeRole) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.setRole(user, role)](#User+setRole) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.spam(user)](#User+spam) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.unspam(user)](#User+unspam) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
    * [.update(options)](#User+update) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>

<a name="new_User_new"></a>

### new User(site)
Constructor for the User object.


| Param | Type | Description |
| --- | --- | --- |
| site | <code>Container</code> | the wordpress site to work on. |

<a name="User+wpUser"></a>

### user.wpUser(commands) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Run wp user command on a wp cli continer that connect to the site provied in the constructor.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| commands | <code>Array.&lt;string&gt;</code> | commands passing to wp user. |

<a name="User+addCap"></a>

### user.addCap(user, cap) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Adds a capability to a user.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>number</code> \| <code>string</code> | User ID, user email, or user login. |
| cap | <code>string</code> | The capability to add. |

<a name="User+addRole"></a>

### user.addRole(user, role) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Adds a role for a user.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>number</code> \| <code>string</code> | User ID, user email, or user login. |
| role | <code>string</code> | Add the specified role to the user. |

<a name="User+create"></a>

### user.create(options) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Creates a new user.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - Retruns newy created User id.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options to create new user. |
| options.userLogin | <code>string</code> | The login of the user to create. |
| options.userPass | <code>string</code> | The user password. |
| [options.role] | <code>&#x27;administrator&#x27;</code> \| <code>&#x27;editor&#x27;</code> \| <code>&#x27;author&#x27;</code> \| <code>&#x27;contributor&#x27;</code> \| <code>&#x27;subscriber&#x27;</code> | The role of the user to create. Default: default role. Possible values include ‘administrator’, ‘editor’, ‘author’, ‘contributor’, ‘subscriber’. |
| [options.userRegistered] | <code>Date</code> | The date the user registered. Default: current date. |
| [options.displayName] | <code>string</code> | The display name. |
| [options.userNicename] | <code>string</code> | A string that contains a URL-friendly name for the user. The default is the user’s username. |
| [options.userUrl] | <code>string</code> | A string containing the user’s URL for the user’s web site. |
| [options.nickname] | <code>string</code> | The user’s nickname, defaults to the user’s username. |
| [options.firstName] | <code>string</code> | The user’s first name. |
| [options.lastName] | <code>string</code> | The user’s last name. |
| [options.description] | <code>string</code> | A string containing content about the user. |
| [options.userEmail] | <code>string</code> | The email address of the user to create. default: `${options.userLogin}@cywp.local` |

<a name="User+delete"></a>

### user.delete(user, [reassign]) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Deletes one or more users from the current site.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> \| <code>number</code> | The user login, user email, or user ID of the user(s) to delete. |
| [reassign] | <code>number</code> | User ID to reassign the posts to. |

<a name="User+get"></a>

### user.get(user) ⇒ <code>Promise.[&lt;UserGetObject&gt;](./types.md#UserGetObject)</code>
Get user data.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;UserGetObject&gt;](./types.md#UserGetObject)</code> - Current user data.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> \| <code>number</code> | The user to get. |

<a name="User+list"></a>

### user.list([filters]) ⇒ <code>Promise.&lt;Array.[&lt;UserGetObject&gt;](./types.md#UserGetObject)&gt;</code>
Return list of users in the wordpress site and there data.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.&lt;Array.[&lt;UserGetObject&gt;](./types.md#UserGetObject)&gt;</code> - - List of users in the wordpress site.  

| Param | Type | Description |
| --- | --- | --- |
| [filters] | [<code>UserGetObject</code>](./types.md#UserGetObject) | Filter results based on the value of a field. |

<a name="User+listCaps"></a>

### user.listCaps(user) ⇒ <code>Promise.&lt;Array.&lt;{name: string}&gt;&gt;</code>
Return the user's capabilities

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.&lt;Array.&lt;{name: string}&gt;&gt;</code> - List of the user capabilities.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> \| <code>number</code> | User to check |

<a name="User+removeCap"></a>

### user.removeCap(user, cap) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Removes a user's capability.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> \| <code>number</code> | User ID, user email, or user login. |
| cap | <code>string</code> | The capability to be removed. |

<a name="User+removeRole"></a>

### user.removeRole(user, cap) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Removes a user's role.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> \| <code>number</code> | User ID, user email, or user login. |
| cap | <code>string</code> | A specific role to remove. |

<a name="User+setRole"></a>

### user.setRole(user, role) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Sets the user role.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> | User ID, user email, or user login. |
| role | <code>string</code> | Make the user have the specified role. If not passed, the default role is used. |

<a name="User+spam"></a>

### user.spam(user) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Marks one or more users as spam.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The command output  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> \| <code>number</code> \| <code>Array.&lt;number&gt;</code> \| <code>Array.&lt;string&gt;</code> | One or more id's of users to mark as spam. |

<a name="User+unspam"></a>

### user.unspam(user) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Removes one or more users from spam.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The command output  

| Param | Type | Description |
| --- | --- | --- |
| user | <code>string</code> \| <code>number</code> \| <code>Array.&lt;number&gt;</code> \| <code>Array.&lt;string&gt;</code> | One or more IDs of users to remove from spam. |

<a name="User+update"></a>

### user.update(options) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
Updates an existing user.

**Kind**: instance method of [<code>User</code>](#User)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - the output of the command.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options to update user. |
| options.user | <code>string</code> \| <code>number</code> \| <code>Array.&lt;string&gt;</code> \| <code>Array.&lt;number&gt;</code> | The user login, user email or user ID of the user(s) to update. |
| [options.userPass] | <code>string</code> | A string that contains the plain text password for the user. |
| [options.userNicename] | <code>string</code> | A string that contains a URL-friendly name for the user. The default is the user’s username. |
| [options.userUrl] | <code>string</code> | A string containing the user’s URL for the user’s web site. |
| [options.userEmail] | <code>string</code> | A string containing the user’s email address. |
| [options.displayName] | <code>string</code> | A string that will be shown on the site. Defaults to user’s username. |
| [options.nickname] | <code>string</code> | The user’s nickname, defaults to the user’s username. |
| [options.firstName] | <code>string</code> | The user’s first name. |
| [options.lastName] | <code>string</code> | The user’s last name. |
| [options.description] | <code>string</code> | A string containing content about the user. |
| [options.userRegistered] | <code>Date</code> | The date the user registered. |
| [options.role] | <code>&#x27;administrator&#x27;</code> \| <code>&#x27;editor&#x27;</code> \| <code>&#x27;author&#x27;</code> \| <code>&#x27;contributor&#x27;</code> \| <code>&#x27;subscriber&#x27;</code> | A string used to set the user’s role. |

