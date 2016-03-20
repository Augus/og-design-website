var keystone = require(__base + 'keystone_custom');
var async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'home';
    locals.data = {};
    locals.data.categories = [
    	{ name: '全部', count: 21 },
    	{ name: '網頁靈感', count: 21, isActive: true },
    	{ name: '行動應用靈感', count: 21 },
    	{ name: '圖示設計', count: 21 },
    	{ name: '企業識別', count: 21 },
    	{ name: '字型與字體', count: 21 },
    	{ name: '配色靈感', count: 21 },
    	{ name: 'PhotoShop 資源', count: 21 },
    	{ name: 'Sketch 資源', count: 21 },
    	{ name: '原型設計', count: 21 },
    	{ name: '免費可商用圖庫', count: 21 },
    	{ name: '設計工具', count: 21 },
    	{ name: '設計規範', count: 21 },
    	{ name: '設計用紙', count: 21 }
	];

	// Load all categories
	// view.on('init', function(next) {
	// 	keystone.list('ResourceCategory').model.find().sort('name').exec(function(err, results) {
			
	// 		if (err || !results.length) {
	// 			return next(err);
	// 		}
			
	// 		locals.data.categories = results;
			
	// 		// Load the counts for each category
	// 		async.each(locals.data.categories, function(category, next) {
				
	// 			keystone.list('Resource').model.count().where('categories').in([category.id]).exec(function(err, count) {
	// 				category.count = count;
	// 				next(err);
	// 			});
				
	// 		}, function(err) {
	// 			next(err);
	// 		});
			
	// 	});
		
	// });

	// Load other posts
	// view.on('init', function(next) {
		
	// 	var q = keystone.list('Resource').model.find().sort('-categories').limit('300');
		
	// 	q.exec(function(err, results) {
	// 		locals.data.resources = results;
	// 		console.log(results);
	// 		next(err);
	// 	});
		
	// });

    // Render the view
    view.render('index');

};
