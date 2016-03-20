// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
global.__base = __dirname + '/';
var keystone = require(__base + 'keystone_custom');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

	'name': 'ogdesign',
	'brand': '奧革設計',
	
	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',
	'port': 80,
	
	'emails': 'templates/emails',
	
	'auto update': true,
	'mongo': 'mongodb://localhost/ogdesign',
	'cookie secret': 'ogdesign',
	'session': true,
	'auth': true,
	'user model': 'User',
	's3 config':  { 
		bucket: 'augus.ogdesign', 
		key: 'AKIAJCOZQJSIRFKVGWDA', 
		secret: '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',
		'default headers':  {
		    'x-amz-meta-X-Default-Header': 'Custom Default Value'
		}
	},

	'wysiwyg override toolbar': false,
	'wysiwyg menubar': true,
	'wysiwyg skin': 'lightgray',
	'wysiwyg additional buttons': 'searchreplace visualchars,'
	 + ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
	 +' emoticons media, preview print ',
	'wysiwyg additional plugins': 'example, table, advlist, anchor,'
	 + ' autolink, autosave, charmap, contextmenu, '
	 + ' directionality, emoticons, fullpage, hr, media, pagebreak,'
	 + ' paste, preview, print, searchreplace, textcolor,'
	 + ' visualblocks, visualchars, wordcount',
});



// Load your project's Models

keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));


// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'成功案例': ['portfolios'],
	'文章': ['posts', 'post-categories'],
	'設計資源': ['resources', 'resource-categories'],
	'設計資源建議': ['resource-issues'],
	'使用者': 'users'
});

// Start Keystone to connect to your database and initialise the web server

keystone.start();
