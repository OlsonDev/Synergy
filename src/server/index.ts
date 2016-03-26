'use strict';

const options = {
	open: false
	, files: [ 'dist/browser/**/*.html', 'dist/browser/**/*.css', 'dist/browser/**/*.js' ]
	, notify: {
		styles: <string[]>[]
	}
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
const fs = require('fs-extra');
const path = require('path');

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

const exts = [ 'html', 'css', 'js', 'map' ];
for (let i = 0; i < exts.length; i++) exts[i] = `src/browser/**/*.${exts[i]}`;

bs.watch(exts).on('change', (changedPath: string) => {
	const dest = changedPath.replace(/^src/, 'dist');
	const ext = `*${path.extname(dest)}`;
	const dir = path.dirname(dest);

	fs.ensureDir(dir, (err: any, made: boolean) => {
		if (err) {
			console.log('ensureDir err: ', err);
			return;
		}
		copyFile(changedPath, dest, (err: any) => {
			if (err) {
				console.log('copyFile err: ', err);
				return;
			}
			bs.reload(ext);
		});
	});
});

bs.init(options);