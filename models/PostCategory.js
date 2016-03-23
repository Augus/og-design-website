var keystone = require(__base + 'keystone_custom');

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: '文章分類',
	sortable: true,
});

PostCategory.add({
	name: { type: String, required: true, label: '分類名稱' }
});

PostCategory.relationship({ ref: 'Post', path: 'posts', refPath: 'categories'});

PostCategory.register();
