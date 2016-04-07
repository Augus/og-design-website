var keystone = require('../../');

exports = module.exports = {

	upload: function(req, res) {

		console.log("test");
		// if(req.files && req.files.file){
		// 	var options = {};

		// 	if (keystone.get('wysiwyg cloudinary images filenameAsPublicID')) {
		// 		options.public_id = req.files.file.originalname.substring(0, req.files.file.originalname.lastIndexOf('.'));
		// 	}

		// 	cloudinary.uploader.upload(req.files.file.path, function(result) {
		// 		var sendResult = function () {
		// 			if (result.error) {
		// 				res.send({ error: { message: result.error.message } });
		// 			} else {
		// 				res.send({ image: { url: result.url } });
		// 			}
		// 		};
				
		// 		// TinyMCE upload plugin uses the iframe transport technique
		// 		// so the response type must be text/html
		// 		res.format({
		// 			html: sendResult,
		// 			json: sendResult
		// 		});
		// 	}, options);
		// } else {
		// 	res.json({ error: { message: 'No image selected' } });
		// }
	},
};
