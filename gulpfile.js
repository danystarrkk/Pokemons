import { src, dest, watch, series } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import terser from 'gulp-terser';
import { on } from 'events';

const sass = gulpSass(dartSass);

function css() {
  return src('src/scss/app.scss', { sourcemaps: true })
    .pipe(sass({ style: 'compressed' }).on('error', sass.logError))
    .pipe(dest('dist/css', { sourcemaps: '.' }));
}

function js() {
  return src('src/js/app.js')
    .pipe(terser())
    .pipe(dest('dist/js'));
}

function dev() {
  watch('src/scss/**/*.scss', css);
  watch('src/js/**/*.js', js);
}

export default series(css, js, dev);