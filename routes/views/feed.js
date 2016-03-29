var Feed = require('feed');
var keystone = require(__base + 'keystone_custom');

exports = module.exports = function(req, res) {

    var feed = new Feed({
        title: '奧革設計 - 創業公司的設計夥伴',
        description: '奧革設計是一家使用者介面設計及使用者經驗諮詢公司，我們擅長透過設計新思維創造最好的產品體驗。',
        link: 'http://beta.ogdesign.tw',
        image: 'http://beta.ogdesign.tw/images/home-cover.jpg',
        copyright: 'All rights reserved 2016, ogdesign',
        updated: Date.now()
        // author: {
        //     name: 'John Doe',
        //     email: 'johndoe@example.com',
        //     link: 'https://example.com/johndoe'
        // }
    });
    feed.addCategory('Design');

    var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('30');
		
	q.exec(function(err, posts) {
		for (var key in posts) {
	        feed.addItem({
	            title: posts[key].title,
	            link: '/blog/post/' + posts[key].slug,
	            description: posts[key].content.full,
	            author: [{
	                name: posts[key].author.name.first,
	            }],
	            date: posts[key].publishedDate,
	            image: posts[key].image.url
	        });
	    }
	    var feeds = feed.render('rss-2.0');
	    res.end(feeds);
	});
};
