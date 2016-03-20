var keystone = require(__base + 'keystone_custom');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User', {label: '使用者'});

User.add({
	name: { type: Types.Name, required: true, index: true, label: '管理者名稱' },
	email: { type: Types.Email, initial: true, required: true, index: true, label: '電子郵件' },
	password: { type: Types.Password, initial: true, required: true, label: '登入密碼' }
}, '權限設定', {
	isAdmin: { type: Boolean, label: '允許管理後台', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
