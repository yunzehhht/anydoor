const yargs = require('yargs');
const Server = require('./app.js')
const argv = yargs
		.usage('anywhere [options]')
		.options('p',{
			alias:'port',
			describe:'端口号',
			default:9000
		})
		.options('h',{
			alias:'hostname',
			describe:'host',
			default:'127.0.0.1'
		})
		.options('d',{
			alias:'root',
			describe:'root',
			default:process.cwd()
		})
		.version()
		.alias('v','version')
		.help()
		.alias('h','help')
		.argv;
const server = new Server(argv)
server.start();
