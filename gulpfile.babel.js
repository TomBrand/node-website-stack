/* eslint-disable import/no-extraneous-dependencies, no-console */
// TODO: https://github.com/wulkano/kap/blob/master/gulpfile.babel.js

import gulp from 'gulp';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack-stream';
import del from 'del';
import webpackConfig from './webpack.config.babel';

const paths = {
  allSrcJs: 'src/**/*.js',
  serverSrcJs: 'src/server/**/*.js',
  sharedSrcJs: 'src/shared/**/*.js',
  clientEntryPoint: 'src/client/app.js',
  clientBundle: 'dist/client-bundle.js?(.map)',
  allSrcSass: 'src/sass/**/*.scss',
  clientCssBundle: 'dist/styles.css',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  srcDir: 'src',
  libDir: 'lib',
  distDir: 'dist',
};

gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('cleanJs', () => del([
  paths.libDir,
  paths.clientBundle,
]));

gulp.task('cleanCss', () => del([
  paths.clientCssBundle,
]));

gulp.task('styles', ['cleanCss'], () =>
  gulp.src(paths.allSrcSass)
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest(paths.distDir)));

gulp.task('babel', ['lint', 'cleanJs'], () =>
  gulp.src(paths.allSrcJs)
  .pipe(babel())
  .pipe(gulp.dest(paths.libDir)));

gulp.task('js', ['babel'], () =>
  gulp.src(paths.clientEntryPoint)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.distDir)));

gulp.task('build', ['js', 'styles']);

gulp.task('watch', () => {
  gulp.watch(paths.allSrcJs, ['js']);
  gulp.watch(paths.allSrcSass, ['styles']);
});

gulp.task('dev', ['build', 'watch'], () => console.log('Waiting for changes...'));

gulp.task('default', ['build']);
