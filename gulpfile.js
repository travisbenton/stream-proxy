'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const child = require('child_process')
 
gulp.task('default', () => {
	return gulp.src('src/**/*.jse')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('dist'));
});