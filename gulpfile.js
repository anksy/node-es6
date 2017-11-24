'use strict';
const gulp = require('gulp'),
	map         = require('map-stream'),
    concat      = require('gulp-concat'),	
    pump        = require('pump'),
    uglify      = require('gulp-uglify'),
	stylish     = require('jshint-stylish'),
	nodemon     = require('gulp-nodemon'),
	cleancss    = require('gulp-clean-css'),
	jshint      = require('gulp-jshint');

 
gulp.task('nodemon', () => {
    nodemon({
            tasks:  ['jshint'],
            script: 'server.js',
            ext: 'js html',
            ignore: ['public/','node_modules/', 'bower_components/','*.html'],
        })
        .on('restart', () => {
            console.log('server restarted ...');
        });
});

var exitOnJshintError = map( (file, cb) => {
  if (!file.jshint.success) {
    console.error('fix error first! jshint stopped');
    process.exit(1);
  }
});


gulp.task('default', [
        'nodemon',
        'jshint'
     ], () => {
    console.log("gulp tasks completed");
});