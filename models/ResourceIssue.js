var keystone = require(__base + 'keystone_custom');
var Types = keystone.Field.Types;

/**
 * Resource Model
 * ==========
 */

var ResourceIssue = new keystone.List('ResourceIssue', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	label: '資源建議'
});

ResourceIssue.add({
	title: { type: String, label: '名稱' },
	description: { type: String, label: '描述' },
	url: { type: String, label: '網址' },
	publishedDate: { type: Types.Date, index: true, label: '建立日期' },
});

// ResourceIssue.schema.virtual('content.full').get(function() {
// 	return this.content.extended || this.content.brief;
// });

ResourceIssue.defaultColumns = 'title, description, url, publishedDate|20%';
ResourceIssue.register();
