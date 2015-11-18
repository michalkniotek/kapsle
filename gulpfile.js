var browserify = require('browserify');
var gulp = require('gulp');
var filter = require('gulp-filter');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var env = require('gulp-env');
var exec = require('child_process').execSync;
var changed = require('gulp-changed');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var assign = require('lodash.assign');
var gutil = require('gulp-util');

var src = 'app';
var out = 'dist';

gulp.task('js', bundle); // so you can run `gulp js` to build the file

function bundle() {
    return browserify(out+'/js/basic.js').bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('js/bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest(out));
}

gulp.task('babel', function () {
    var bowerFilesFilter = filter(['**', '!bower/**']);
    var minifiedFilter = filter(['**',
        '!**/*.min.js',
        '!lib/require.js'
    ], {restore: true});
    return gulp
        .src(src + "/**/*.js")
        .pipe(plumber())
        .pipe(watch(src + "/**/*.js"))
        .pipe(bowerFilesFilter)
        .pipe(minifiedFilter)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [
              'es2015'
            ],
            plugins: [
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(minifiedFilter.restore)
        .pipe(gulp.dest(out));
});

gulp.task('sass:dev', function () {
    var bowerFilesFilter = filter(['**', '!bower/**']);
    gulp
        .src(src + "/**/*.scss")
        .pipe(plumber())
        .pipe(bowerFilesFilter)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(changed(out, {extension: '.css', hasChanged: changed.compareSha1Digest}))
        .pipe(gulp.dest(out))
        .pipe(connect.reload())
});

gulp.task('bower', function () {
    return gulp
        .src(src + "/bower/**/*")
        .pipe(plumber())
        .pipe(watch(src + "/bower/**/*"))
        .pipe(gulp.dest(out + "/bower"));
});

gulp.task('jade', function () {
    gulp.src(src + "/**/*.jade")
        .pipe(plumber())
        .pipe(watch(src + "/**/*.jade"))
        .pipe(jade())
        .pipe(gulp.dest(out))
});

gulp.task('copy', function () {
    gulp.src(src + "/**/*.*")
        .pipe(watch(src + "/**/*.*"))
        .pipe(filter(['**',
            '!**/*.js',
            '!**/*.jade',
            '!**/*.svg',
            '!**/*.scss'
        ]))
        .pipe(plumber())
        .pipe(gulp.dest(out))
});

gulp.task('env', function () {
    env({
        vars: {
            BUILD_DATE: Date.now(),
            APP_VERSION: exec('git rev-parse HEAD').toString().replace(/(^\s+|\s+$)/, "").substr(0, 10)
        }
    });
});

gulp.task('svg', function () {
    return gulp
        .src(src+"/images/svg/*.svg")
        .pipe(plumber())
        //.pipe(svgmin())
        .pipe(gulp.dest(out+"/images/svg/"))
        .pipe(svgstore())
        .pipe(rename({basename: "sprite"}))
        .pipe(gulp.dest(out+"/images/"));
});

gulp.task('connect', function () {
    connect.server({
        root: out,
        port: 8080,
        livereload: true
    });
});

gulp.task('watch-all',function(){
    gulp.watch(src+"/**/*.scss",['sass:dev']);
    gulp.watch(src+"/images/svg/**/*.svg",['svg']);
    gulp.watch(out+"/js/basic.js",['js']);
});

gulp.task('watch', ['env', 'sass:dev', 'svg', 'bower', 'jade', 'copy', 'babel' ,'js', 'connect', 'watch-all']);