var keystone = require(__base + 'keystone_custom');
var Types = keystone.Field.Types;

/**
 * Portfolio Model
 * ==========
 */

var Portfolio = new keystone.List('Portfolio', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	label: '成功案例',
	sortable: true,
});

Portfolio.add({
	title: { type: String, required: true, label: '作品名稱' },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' }, label: '發佈日期' },
	cover: {
		label: '封面',
		type: Types.S3File,
		filename: function(item, filename){
			// 用object id作為文件名的前綴
			return item._id + '-' + filename;
		}
	},
	full: { 
		label: '內容',
		type: Types.S3File,
		filename: function(item, filename){
			// 用object id作為文件名的前綴
			return item._id + '-' + filename;
		}
	}
});

Portfolio.defaultColumns = 'title, publishedDate|20%';
Portfolio.register();
