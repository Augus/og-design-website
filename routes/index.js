/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require(__base + 'keystone_custom');
var middleware = require('./middleware');
var async = require('async');
var extend = require('extend');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.index);
	app.get('/resources', routes.views.resources);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.all('/contact', routes.views.contact);

	// app.get('/createResource', function (req, res) {

	// 	// keystone.createItems({
	// 	// 	ResourceIssue: [{
	// 	// 		'url': url,
	// 	// 		'title': title,
	// 	// 		'description': description,
	// 	// 	}]
	// 	// }, function(err, stats) {
	// 	// 	stats && console.log(stats.message);
	// 	// });

	// 	// Resource.add({
	// 	// 	title: { type: String, label: '資源名稱' },
	// 	// 	image: {
	// 	// 		label: '封面', 
	// 	// 		type: Types.S3File,
	// 	// 		filename: function(item, filename){
	// 	// 			// 用object id作為文件名的前綴
	// 	// 			return item._id + '-' + filename;
	// 	// 		}
	// 	// 	},
	// 	// 	description: { type: Types.Textarea, label: '資源描述' },
	// 	// 	url: { type: Types.Url, label: '網址' },	
	// 	// 	keywords: { type: Types.Textarea, label: '關鍵字' },
	// 	// 	view: { type: Number, default: 0, label: '觀看人次' },
	// 	// 	publishedDate: { type: Types.Date, index: true, label: '建立時間'},
	// 	// 	categories: { type: Types.Relationship, ref: 'ResourceCategory', many: true, label: '資源分類' },
	// 	// 	isRecommend: { type: Boolean, required: false, default: false, label: '是否推薦' },
	// 	// });

	// 	var result = [];
	// 	items.forEach(function (item, index) {
	// 		result.push({
	// 			title: item.name,
	// 			url: item.linkurl,
	// 			description: item.descript,
	// 			keywords: item.tags,
	// 		});
	// 	});

	// 	keystone.createItems({
	// 		Resource: result
	// 	}, function(err, stats) {
	// 		res.header("Content-Type", "application/json; charset=utf-8");
	// 		res.end( JSON.stringify(stats));
	// 		stats && console.log(stats.message);
	// 	});

	// });

	app.post('/submitResource', function (req, res) {
		
		var url = req.param('url');
		var title = req.param('title');
		var description = req.param('description');  

		if (!url) {
			res.end( JSON.stringify({state: 'Please input url!'}));
			return;
		}

		keystone.createItems({
			ResourceIssue: [{
				'url': url,
				'title': title,
				'description': description,
			}]
		}, function(err, stats) {
			stats && console.log(stats.message);
		});

		res.end( JSON.stringify({state: 'success'}));
	});

	// results[0].view++;
	// results[0].save();

	// 增加 view 數量
	app.get('/view/:resourceId', function (req, res) {
		var resourceId = req.params.resourceId;
		var q = keystone.list('Resource').model.findById(resourceId);
		q.exec(function(err, resource) {
			resource.view++;
			resource.save();
			res.header("Content-Type", "application/json; charset=utf-8");
			res.end( JSON.stringify(resource));
		});
	});

	// 取得作品集
	app.get('/getPortfolios', function (req, res) {

		var resources = [];
		var q = keystone.list('Portfolio').model.find().sort('sortOrder').limit('300');
		
		q.exec(function(err, results) {
			res.header("Content-Type", "application/json; charset=utf-8");
			res.end( JSON.stringify(results));
		});
	});

	// 取得文章列表
	app.get('/getArticles', function (req, res) {

		var resources = [];
		var start = req.param('start') || 0;
		var len = req.param('len') || '4';
		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').skip(start).limit(len);

		q.exec(function(err, results) {
			res.header("Content-Type", "application/json; charset=utf-8");
			res.end( JSON.stringify(results));
		});
	});

	// 取得資源列表
	app.get('/getResources', function (req, res) {

		var resources = [];
		var q = keystone.list('Resource').model.find().sort('isPinned').limit('300');
		
		q.exec(function(err, results) {
			res.header("Content-Type", "application/json; charset=utf-8");
			res.end( JSON.stringify(results));
		});
	});

	// 取得分類列表
	app.get('/getCategories', function (req, res) {

		var categories = [];
		keystone.list('ResourceCategory').model.find().exec(function(err, results) {
			results.forEach(function(category, index) {
				keystone.list('Resource').model.count().where('categories').in([category.id]).exec(function(err, count) {
					var object = {
						id: category._id,
						name: category.name,
						count: count,
						sortOrder: category.sortOrder
					};
					categories.push(object);
					if (index == results.length - 1) {
						categories.sort(function(a, b){return a.sortOrder - b.sortOrder});
						res.header("Content-Type", "application/json; charset=utf-8");
						res.end( JSON.stringify(categories));
					}
				});
			});
		});
	});
	
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
