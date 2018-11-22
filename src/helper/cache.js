const { cache } = require("../config/defaultConfig");

function refreshRes(stats, res) {
	//读取参数
	const { maxAge, expires, etag, lastModified, cacheControl } = cache;
	if(expires){
		res.setHeader('Expires',(new Date(Date.now()+ maxAge * 1000)).toUTCString())
	}
	if(cacheControl){
		res.setHeader('Cache-Control',`public,max-age=${maxAge}`)
	}
	if(lastModified){
		res.setHeader('Last-Modified',stats.mtime.toUTCString())
	}

	if(etag){
		res.setHeader('ETag',stattag(stats))
	}

}
function stattag(stat) {
	var mtime = stat.mtime.getTime()
	var size = stat.size
	return '"' + size + '-' + mtime + '"'
  }

module.exports = function isFresh(stats,req,res){
	refreshRes(stats,res)
	const lastModified = req.headers['if-modified-since'];
	const etag = req.headers['if-none-match']

	if(!lastModified && !etag){
		return false
	}else if(lastModified && lastModified !== res.getHeader('Last-modified')){
		return false
	}else if(etag &&  etag !== res.getHeader('ETag')){
		return false
	}

	return true;
}
