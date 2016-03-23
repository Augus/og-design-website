var keystone = require(__base + 'keystone_custom');

/**
 * ResourceCategory Model
 * ==================
 */

var ResourceCategory = new keystone.List('ResourceCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: '資源分類',
	sortable: true,
});

ResourceCategory.add({
	name: { type: String, required: true, label: '分類名稱' },
});

ResourceCategory.relationship({ ref: 'Resource', path: 'resources', refPath: 'categories' });

ResourceCategory.register();
