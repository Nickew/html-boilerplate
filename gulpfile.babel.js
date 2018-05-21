// ES6 GULPFILE by Nickew 28.04.2018
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';

import rename from 'gulp-rename';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import minifycss from 'gulp-clean-css';

import sass from 'gulp-sass';
import imagemin from 'gulp-imagemin';

import cache from 'gulp-cache';
import del from 'del';

import browserSync from 'browser-sync';

// Deploy
//import ftp from 'vinyl-ftp';

// todo: implement path's by constants
const path = {
  src: './src',
  temp: './src/.tmp',
  dist: './dist',
};

gulp.task('browser-sync', () => {
  browserSync({
    server: {
       baseDir: "./src",
       index: 'index.html'
    }
  });
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('images', () => {
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('styles', () => {
  gulp.src(['src/assets/scss/styles.scss'])
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer('last 10 versions'))
    .pipe(minifycss())
    .pipe(gulp.dest('./src/.tmp/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', () => {
  del(['src/.tmp/main.min.js'])
  return gulp.src('src/assets/js/*.js')
    .pipe(plumber({
      errorHandler: (error) =>  {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(babel())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./src/.tmp/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['styles', 'browser-sync'], () => {
  gulp.watch("src/assets/scss/components/**/*.scss", ['styles']);
  gulp.watch("src/assets/js/*js", ['scripts']);
  gulp.watch("*.html", ['bs-reload']);
});

gulp.task('removedist', () => {
  return del.sync('dist');
});

gulp.task('clearcache', () => {
  return cache.clearAll();
});

gulp.task('build', ['removedist', 'images', 'styles', 'scripts'], () => {

  const buildFiles = gulp.src([
      'src/index.html',
      'src/views/*.html',
      'src/.htaccess',
    ]).pipe(gulp.dest('dist'));

  const buildStyles = gulp.src([
      'src/.tmp/styles.min.css',
    ]).pipe(gulp.dest('dist/css'));

  const buildScripts = gulp.src([
      'src/.tmp/main.min.js',
    ]).pipe(gulp.dest('dist/js'));

  const buildFonts = gulp.src([
      'src/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts'));

});