const $           = require('gulp-load-plugins')(),
      browserSync = require('browser-sync').create(),
      del         = require('del'),
      gulp        = require('gulp')

function files() {
  return gulp.src('source/assets/svgs-animated/**/*')
    .pipe(gulp.dest('build/assets/svgs-animated'))
}

function html() {
  return gulp.src('source/index.html')
    .pipe(gulp.dest('build'))
}

function css() {
  return gulp.src('source/stylesheets/main.css')
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream())
}

function Vendors() {
  return gulp.src([
    'node_modules/lottie-web/build/player/lottie_light.min.js'
  ])
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.concat('vendors.js'))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('../maps'))
    .pipe(gulp.dest('build/js'))
}

function js() {
  return gulp.src('source/scripts/main.js')
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.concat('main.js'))
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'))
		.pipe($.babel())
		.pipe($.uglify())
		.pipe($.sourcemaps.write('../maps'))
		.pipe(gulp.dest('build/js'))
}

function clean(done) {
  del('build')
	done()
}

function watch_files() {

  gulp.watch('source/index.html', html).on('change', browserSync.reload)
  gulp.watch('source/stylesheets/**/*.css', css)
	gulp.watch('source/scripts/**/*.js', js).on('change', browserSync.reload)
	gulp.watch('source/assets/**/*', files).on('change', browserSync.reload)

	browserSync.init({
		server: {
      baseDir: "./build"
  }
	});
}

function build(done) {
	files()
  html()
  css();
  js()
  Vendors()
	done()
}

exports.clean   = clean
exports.build   = build
exports.watch   = watch_files
exports.default = gulp.series(clean, build, watch_files)