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
require('browser-sync').create().init(options);