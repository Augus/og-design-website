var keystone = require(__base + 'keystone_custom');
var async = require('async');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'resources';
    locals.data = {};
    locals.data.categories = [];

	// Load all categories
	// view.on('init', function(next) {
	// 	keystone.list('ResourceCategory').model.find().sort('index').exec(function(err, results) {
			
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
    view.render('resources');

};
