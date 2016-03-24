const options = {
	open: false
	, files: [ 'dist/browser/**/*.html', 'dist/browser/**/*.css', 'dist/browser/**/*.js' ]
	, server: {
		port: 3000
		, baseDir: 'dist/browser'
		, openPath: 'views'
		, routes: { '/node_modules': 'node_modules' }
		, middleware: [ require('connect-logger')(), function(req: any, res: any, next: any) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			next();
		}]
	}
};

const bs = require('browser-sync').create();
const fs = require('fs');

function copyFile(source: string, target:string, cb: any) {
	var cbCalled = false;
	function done(err?: any) {
		if (cbCalled) return;
		cb(err);
		cbCalled = true;
	}

	const rs = fs.createReadStream(source);
	rs.on("error", function(err: any) { done(err); });
	const ws = fs.createWriteStream(target);
	ws.on("error", function(err: any) { done(err); });
	ws.on("close", function(err: any) { done(); });
	rs.pipe(ws);
}

bs.watch('src/browser/**/*.html').on('change', (path: string) => {
	const dest = path.replace(/^src/, 'dist');
	copyFile(path, dest, () => bs.reload('*.html'))
});

bs.init(options);