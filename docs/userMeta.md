<a name="UserMeta"></a>

## UserMeta

Adds, updates, deletes, and lists user custom fields.

**Kind**: global class

- [UserMeta](#UserMeta)
  - [new UserMeta(user)](#new_UserMeta_new)
  - [.add(user, key, value)](#UserMeta+add) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
  - [.delete(user, key)](#UserMeta+delete) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>
  - [.get(user, key)](#UserMeta+get) ⇒ <code>Promise.&lt;any&gt;</code>
  - [.list(user)](#UserMeta+list) ⇒ <code>Promise.&lt;{user_id: number, meta_key: string, meta_value: string}&gt;</code>
  - [.update(user, key, value)](#UserMeta+update) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>

<a name="new_UserMeta_new"></a>

### new UserMeta(user)

Constructor for the UserMeta object.

| Param | Type                                | Description      |
| ----- | ----------------------------------- | ---------------- |
| user  | [<code>User</code>](./user.md#User) | the user object. |

<a name="UserMeta+add"></a>

### userMeta.add(user, key, value) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>

Adds a meta field.

**Kind**: instance method of [<code>UserMeta</code>](#UserMeta)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The command output.

| Param | Type                                       | Description                                                             |
| ----- | ------------------------------------------ | ----------------------------------------------------------------------- |
| user  | <code>string</code> \| <code>number</code> | The user login, user email, or user ID of the user to add metadata for. |
| key   | <code>string</code>                        | The metadata key.                                                       |
| value | <code>string</code>                        | The new metadata value.                                                 |

<a name="UserMeta+delete"></a>

### userMeta.delete(user, key) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>

Deletes a meta field.

**Kind**: instance method of [<code>UserMeta</code>](#UserMeta)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The command output.

| Param | Type                                       | Description                                                                 |
| ----- | ------------------------------------------ | --------------------------------------------------------------------------- |
| user  | <code>string</code> \| <code>number</code> | The user login, user email, or user ID of the user to delete metadata from. |
| key   | <code>string</code>                        | he metadata key.                                                            |

<a name="UserMeta+get"></a>

### userMeta.get(user, key) ⇒ <code>Promise.&lt;any&gt;</code>

Gets meta field value.

**Kind**: instance method of [<code>UserMeta</code>](#UserMeta)  
**Returns**: <code>Promise.&lt;any&gt;</code> - The command output.

| Param | Type                                       | Description                                                             |
| ----- | ------------------------------------------ | ----------------------------------------------------------------------- |
| user  | <code>string</code> \| <code>number</code> | The user login, user email, or user ID of the user to get metadata for. |
| key   | <code>string</code>                        | The metadata key.                                                       |

<a name="UserMeta+list"></a>

### userMeta.list(user) ⇒ <code>Promise.&lt;{user_id: number, meta_key: string, meta_value: string}&gt;</code>

Lists all metadata associated with a user.

**Kind**: instance method of [<code>UserMeta</code>](#UserMeta)  
**Returns**: <code>Promise.&lt;{user_id: number, meta_key: string, meta_value: string}&gt;</code> - list of the user metadata

| Param | Type                                       | Description                                                             |
| ----- | ------------------------------------------ | ----------------------------------------------------------------------- |
| user  | <code>string</code> \| <code>number</code> | The user login, user email, or user ID of the user to get metadata for. |

<a name="UserMeta+update"></a>

### userMeta.update(user, key, value) ⇒ <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code>

Updates a meta field.

**Kind**: instance method of [<code>UserMeta</code>](#UserMeta)  
**Returns**: <code>Promise.[&lt;RunInContainerOutput&gt;](./types.md#RunInContainerOutput)</code> - The command output.

| Param | Type                                       | Description                                                                |
| ----- | ------------------------------------------ | -------------------------------------------------------------------------- |
| user  | <code>string</code> \| <code>number</code> | The user login, user email, or user ID of the user to update metadata for. |
| key   | <code>string</code>                        | The metadata key.                                                          |
| value | <code>string</code>                        | The new metadata value.                                                    |
