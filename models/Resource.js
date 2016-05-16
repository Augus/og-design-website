var keystone = require(__base + 'keystone_custom');
var Types = keystone.Field.Types;

/**
 * Resource Model
 * ==========
 */

var Resource = new keystone.List('Resource', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	label: '設計資源',
	defaultSort: '-view'
});

// Resource
// - title
// - description
// - update_time
// - create_time
// - image
// - url
// - is_recommend
// - view
// - category

// ResourceCategory
// - name




Resource.add({
	title: { type: String, label: '資源名稱' },
	image: {
		label: '封面', 
		type: Types.S3File,
		filename: function(item, filename){
			// 用object id作為文件名的前綴
			return item._id + '-' + filename;
		}
	},
	description: { type: Types.Textarea, label: '資源描述' },
	url: { type: Types.Url, label: '網址' },	
	keywords: { type: Types.Textarea, label: '關鍵字' },
	view: { type: Number, default: 0, label: '觀看人次' },
	publishedDate: { type: Types.Date, index: true, label: '建立時間'},
	categories: { type: Types.Relationship, ref: 'ResourceCategory', many: true, label: '資源分類' },
	isRecommend: { type: Boolean, required: false, default: false, label: '是否推薦' },
	isPinned: { type: Boolean, required: false, default: false, label: '置頂' },
});

Resource.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Resource.defaultColumns = 'title, description, publishedDate|20%, view, url';
Resource.register();
