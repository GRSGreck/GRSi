"use strict";

var gulp = require("gulp"),
	htmlMin = require("gulp-minify-html"),
	htmlHint = require("gulp-htmlhint"),
	sass = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	csso = require("gulp-csso"),
	plumber = require("gulp-plumber"),
	imagemin = require("gulp-imagemin"),
	pngquant = require("imagemin-pngquant"),
	spritesmith = require("gulp.spritesmith"),
	uglify = require("gulp-uglify"),
	jsHint = require("gulp-jshint"),
	rigger = require("gulp-rigger"),
	size = require("gulp-size"),
	sourcemaps = require("gulp-sourcemaps"),
	watch = require("gulp-watch"),
	del = require("del"),
	browserSync = require("browser-sync"),
	reload = browserSync.reload;

// ----------------------------------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------------------------------

var path = {
	dist: {
		html: 'dist/',
		css: 'dist/css/',
		js: 'dist/js/',
		img: 'dist/img/',
		sprites: '../img/sprites.png',
		fonts: 'dist/fonts'
	},
	tmp: {
		html: '.tmp/',
		css: '.tmp/css',
		js: '.tmp/js'
	},
	app: {
		html: 'app/*.html',
		scss: {
			vendor: 'app/scss/vendor.scss',
			main: 'app/scss/main.scss',
			sprites: 'app/scss/components/_components/'
		},
		js: {
			vendor: 'app/js/vendor.js',
			main: 'app/js/main.js'
		},
		img: 'app/img/**/*.*',
		sprites: 'app/sprites/**/*.*',
		cssTemplate: 'app/sass.template.mustache',
		fonts: 'app/fonts/**/*.*'
	},
	watch: {
		html: 'app/**/*.html',
		scss: {
			vendor: 'app/scss/vendor.scss',
			main: 'app/scss/**/*.scss'
		},
		js: {
			vendor: 'app/js/vendor.js',
			main: 'app/js/**/*.js'
		},
		img: 'app/img/**/*.*',
		sprites: 'app/sprites/**/*.*',
		fonts: 'app/fonts/**/*.*'
	},
	clean: {
		dist: 'dist',
		tmp: '.tmp'
	}
};

// ----------------------------------------------------------------------------------------------
// Server config
// ----------------------------------------------------------------------------------------------

var config = {
	server: {
		baseDir: './dist'
	},
	tunnel: 'grsonline',
	host: 'localhost',
	port: 7777,
	logPrefix: 'GRS*_^',
	// browser: ['google chrome', 'firefox', 'opera', 'safari', 'iexplore'],
	online: false,
	notify: false
};

// ----------------------------------------------------------------------------------------------
// Html-min config
// ----------------------------------------------------------------------------------------------

var opts = {
	conditionals: true,
	spare: true
};

// ----------------------------------------------------------------------------------------------
// Error Handler
// ----------------------------------------------------------------------------------------------

var onError = function(error){
	console.log(error);
	this.emit('end');
};

// ----------------------------------------------------------------------------------------------
// Autoprefixer browsers
// ----------------------------------------------------------------------------------------------

var AUTOPREFIXER_BROWSERS = [
  'last 5 versions'
];

// ----------------------------------------------------------------------------------------------
// Task: HTML
// ----------------------------------------------------------------------------------------------

gulp.task('html', function(){
	return gulp.src(path.app.html)
	.pipe(rigger())
	.pipe(htmlHint({
		"tagname-lowercase:": true,
		"attr-lowercase": true,
		"attr-value-double-quotes": true,
		"attr-value-not-empty": true,
		"attr-no-duplication": true,
		"tag-pair": true,
		"tag-self-close": false,
		"spec-char-escape": true,
		"id-unique": true,
		"src-not-empty": true,
		"img-alt-require": true,
		"id-class-value": true,
		"style-disabled": true
	}))
	.pipe(htmlHint.reporter())
	.pipe(gulp.dest(path.tmp.html))
	.pipe(htmlMin(opts))
	.pipe(size({title: 'HTML_size'}))
	.pipe(gulp.dest(path.dist.html))
	.pipe(reload({stream: true}));
});

// ----------------------------------------------------------------------------------------------
// Task: CSS Main
// ----------------------------------------------------------------------------------------------

gulp.task('css:main', function(){
	return gulp.src(path.app.scss.main)
	.pipe(sourcemaps.init())
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: AUTOPREFIXER_BROWSERS,
		cascade: true
	}))
	.pipe(gulp.dest(path.tmp.css))
	.pipe(csso())
	.pipe(sourcemaps.write())
	.pipe(size({title: 'CSS:main_size'}))
	.pipe(gulp.dest(path.dist.css))
	.pipe(reload({stream: true}));
});

// ----------------------------------------------------------------------------------------------
// Task: CSS Vendor
// ----------------------------------------------------------------------------------------------

gulp.task('css:vendor', function(){
	return gulp.src(path.app.scss.vendor)
	.pipe(sourcemaps.init())
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: AUTOPREFIXER_BROWSERS,
		cascade: false
	}))
	.pipe(gulp.dest(path.tmp.css))
	.pipe(csso())
	.pipe(sourcemaps.write())
	.pipe(size({title: 'CSS:vendor_size'}))
	.pipe(gulp.dest(path.dist.css))
	.pipe(reload({stream: true}));
});

// ----------------------------------------------------------------------------------------------
// Task: JS Main
// ----------------------------------------------------------------------------------------------

gulp.task('js:main', function(){
	return gulp.src(path.app.js.main)
	.pipe(rigger())
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(jsHint())
	.pipe(jsHint.reporter('default'))
	.pipe(gulp.dest(path.tmp.js))
	.pipe(sourcemaps.init())
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(size({title: 'JS:main_size'}))
	.pipe(gulp.dest(path.dist.js))
	.pipe(reload({stream: true}));
});

// ----------------------------------------------------------------------------------------------
// Task: JS Vendor
// ----------------------------------------------------------------------------------------------

gulp.task('js:vendor', function(){
	return gulp.src(path.app.js.vendor)
	.pipe(rigger())
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(gulp.dest(path.tmp.js))
	.pipe(sourcemaps.init())
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(size({title: 'JS:vendor_size'}))
	.pipe(gulp.dest(path.dist.js))
	.pipe(reload({stream: true}));
});

// ----------------------------------------------------------------------------------------------
// Task: IMG
// ----------------------------------------------------------------------------------------------

gulp.task('img', function(){
	return gulp.src(path.app.img)
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()],
		interlaced: true
	}))
	.pipe(size({title: 'IMG_size'}))
	.pipe(gulp.dest(path.dist.img))
	.pipe(reload({stream: true}));
});

// ----------------------------------------------------------------------------------------------
// Task: Sprites
// ----------------------------------------------------------------------------------------------

gulp.task('sprites', function(){
	var spriteData = gulp.src(path.app.sprites)
	.pipe(spritesmith({
		imgName: 'sprites.png',
		cssName: '_sprites.scss',
		cssFormat: 'scss',
		algorithm: 'binary-tree',
		padding: 20,
		imgPath: path.dist.sprites,
		cssTemplate: path.app.cssTemplate,
		cssVarMap: function(sprite){
			sprite.name = 's-' + sprite.name
		}
	}));
	spriteData.img
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()],
		interlaced: true
	}))
	.pipe(size({title: 'Sprites_Size'}))
	.pipe(gulp.dest(path.dist.img));
	spriteData.css.pipe(gulp.dest(path.app.scss.sprites));
});

// ----------------------------------------------------------------------------------------------
// Task: Fonts
// ----------------------------------------------------------------------------------------------

gulp.task('fonts', function(){
	return gulp.src(path.app.fonts)
	.pipe(size({title: 'Fonts_size'}))
	.pipe(gulp.dest(path.dist.fonts))
	.pipe(reload({stream: true}));
});

// ----------------------------------------------------------------------------------------------
// Task: Dist
// ----------------------------------------------------------------------------------------------

gulp.task('dist', [
	'html',
	'sprites',
	'css:main',
	'css:vendor',
	'js:main',
	'js:vendor',
	'img',
	'fonts'
]);

// ----------------------------------------------------------------------------------------------
// Task: Watch
// ----------------------------------------------------------------------------------------------

gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb){
		gulp.start('html');
	});
	watch([path.watch.scss.main, '!' + path.watch.scss.vendor], function(event, cb){
		gulp.start('css:main');
	});
	watch([path.watch.scss.vendor], function(event, cb){
		gulp.start('css:vendor');
	});
	watch([path.watch.js.main, '!' + path.watch.js.vendor], function(event, cb){
		gulp.start('js:main');
	});
	watch([path.watch.js.vendor], function(event, cb){
		gulp.start('js:vendor');
	});
	watch([path.watch.img], function(event, cb){
		gulp.start('img');
	});
	watch([path.watch.sprites], function(event, cb){
		gulp.start('sprites');
	});
	watch([path.watch.fonts], function(event, cb){
		gulp.start('fonts');
	});
});

// ----------------------------------------------------------------------------------------------
// Task: Web Server
// ----------------------------------------------------------------------------------------------

gulp.task('webserver', ['sprites','img'], function(){
	browserSync(config);
});

// ----------------------------------------------------------------------------------------------
// Task: Clean
// ----------------------------------------------------------------------------------------------

gulp.task('clean', function(cb){
	del([path.clean.dist, path.clean.tmp], cb);
});

// ----------------------------------------------------------------------------------------------
// Task: Default
// ----------------------------------------------------------------------------------------------

gulp.task('default', ['clean'], function(){
	gulp.start('dist', 'webserver', 'watch');
});