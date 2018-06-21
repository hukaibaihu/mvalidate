// generated on 2018-05-13 using generator-webapp 3.0.1
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const runSequence = require('run-sequence');

const $ = gulpLoadPlugins();

let dev = true;

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('lint', () => {
  return gulp.src(['index.js'])
    .pipe($.eslint({ fix: true }))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('build', () => {
  return gulp.src('index.js')
    .pipe($.plumber())
    // .pipe($.if(dev, $.sourcemaps.init()))
    .pipe($.babel())
    // .pipe($.if(dev, $.sourcemaps.write('.')))
    .pipe($.uglify({compress: {drop_console: true}}))
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean', 'lint'], 'build', resolve);
  });
});
