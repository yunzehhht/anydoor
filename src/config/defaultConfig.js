
const path = require('path');
module.exports = {
	hostname:'127.0.0.1',
	port:'9000',
	root:path.resolve(process.cwd(),'../'),
	cache:{
		maxAge:600,
		expires:true,
		cacheControl:true,
		lastModified:true,
		etag:true
	}
}
