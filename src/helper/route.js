const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
//使用 promisify 将异步回调改为promisify实例. node8.+支持
const promisify = require("util").promisify;

const stat = promisify(fs.stat); //stat 读取文件状态
const readdir = promisify(fs.readdir); //读取文件目录
const readfile = promisify(fs.readFile); //读取文件

const mime = require("mime"); //MIME 状态列表 , 提供 getType 方法可传路径
const compress = require("./compress.js");
const range = require("./range");
const isFresh = require('./cache');
// const config = require('../config/defaultConfig')

module.exports = async (req, res, filePath,config) => {
	try {
		const stats = await stat(filePath); // 使用 await 调用 stat 获取文件状态判断
		if (stats.isFile()) {	//判断是否为文件

			//设置文件状态为200
			res.statusCode = 200;
			//设置contentType 根据路径.ext后缀获取type类型
			res.setHeader("Content-Type", mime.getType(filePath));

			//调用isFresh 判断是否缓存, 同时在isFresh 中设置请求头中的 lastMoified etag 以及expires
			if(isFresh(stats,req,res)){
				res.statusCode = 304;
				res.end();
				return;
			}
			//创建存储流变量
			let rs;
			//调用 range 方法根据request[header]中的 range变量返回相应状态
			const { code, start, end } = range(stats.size, req, res);
			//如果状态为206返回部分代码片段同时设置content-range头部
			if (code === 206) {
				res.statusCode = 206;
				rs = fs.createReadStream(filePath, { start, end });
			} else {
			// 如果状态为 416 或 200 则原样输出
				res.statusCode = code;
				rs = fs.createReadStream(filePath);
			}
			//根据文件后缀匹配是否压缩 , 调用nodejs zlib 中的 createGzip createDeflate
			if (filePath.match(/\.(html|css|js|txt|md)/)) {
				//将rs 调用 pipe 到 res
				compress(rs, req, res).pipe(res);
			} else {
				rs.pipe(res);
			}
		} else if (stats.isDirectory()) {
			//判断是否为目录
			const files = await readdir(filePath);  //读取文件目录
			const htmlStr = await readfile(
				path.join(config.root, "src/template/template.html"),  //读取页面模板,同时转为utf8 推荐用.toString效率更高
				"utf8"
			);

			const baseUrl = path.relative(config.root,filePath);


			//计算俩个路径中的相对路径
			res.statusCode = 200;
			res.setHeader("Content-Type", "text/html");
			res.end(
				ejs.render(htmlStr, {
					baseUrl: baseUrl?'/'+baseUrl+'/':'/',
					files,
					filePath
				})
			);
			//渲染模板,同时调用 res.end 输出
		}
	} catch (ex) {
		//统一try catch 捕捉async 抛出的错误
		console.info(ex);
		res.statusCode = 404;
		res.setHeader("Content-Type", "text/plain");
		res.end(`${filePath} is not a directory or file`);
	}
};
