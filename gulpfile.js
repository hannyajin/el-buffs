var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    transform = require('vinyl-transform'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    less = require('gulp-less'),
    reactify = require('reactify'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    port = process.env.port || 8000;

gulp.task('browserify', function() {
  var b = browserify();
  b.transform(reactify);
  b.add('./app/src/js/main.js');

  return b.bundle()
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(gulp.dest('./app/dist/js'))
    .pipe(livereload());
});

gulp.task('compress', function() {
  return gulp.src('app/dist/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest('./app/dist/js'));
})

// launch browser
gulp.task('open', function() {
  var opts = {
    url: 'http://localhost:' + port
  };
  gulp.src('./app/index.html')
    .pipe(open('', opts));
});

// live reload server (connect)
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port: port + 1,
    livereload: true
  });
});

// gulp-livereload
gulp.task('livereload', function () {
  livereload();
});

// nodemon
gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'html js css'
  })
  .on('restart', function () {
    console.log('server restarted!');
  });
});

// less
gulp.task('less', function() {
  gulp.src('./app/src/less/*.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(concat('less.css'))
    .pipe(gulp.dest('./app/src/css'))
    .pipe(livereload());
});

// live reload js
gulp.task('js', function() {
  gulp.src('./app/dist/**/*.js')
    .pipe(livereload());
});

// live reload css
gulp.task('css', function() {
  gulp.src('./app/src/css/*.css')
    .pipe(plumber())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./app/dist/css'))
    .pipe(livereload());
})

gulp.task('img', function() {
  gulp.src('./app/src/img/*')
    .pipe(plumber())
    .pipe(gulp.dest('./app/dist/img'))
    .pipe(livereload());
});

// live reload html
gulp.task('html', function() {
  gulp.src('./app/*.html')
    .pipe(livereload());
})

// watch files for live reload
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('app/dist/js/*.js', ['js']);
  gulp.watch('app/index.html', ['html']);
  gulp.watch('app/src/less/*.less', ['less']);
  gulp.watch('app/src/css/*.css', ['css']);
  gulp.watch('app/src/js/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify']);

gulp.task('serve', ['browserify', 'open', 'watch']);