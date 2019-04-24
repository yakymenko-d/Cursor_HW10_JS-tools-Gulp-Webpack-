const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');

// gulp.task('name-task', function() {
// 	gulp.src(source-files)
// 	.pipe(gulpPlugin())
// 	.pipe(gulp.dest('destination-directory'));
// })

gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	})
})
gulp.task('sass', function(){
	gulp.src('src/scss/**/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({
		stream: true
	}))
})

gulp.task('cleanCss', function(){
	gulp.src('src/css/*.css')
	.pipe(cleanCss())
	.pipe(gulp.dest('src/css/'))
	.pipe(browserSync.reload({
		stream: true
	}))
})

gulp.task('scripts', function(){
	gulp.src('src/js/assets/*.js')
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'))
	.pipe(browserSync.reload({
		stream: true
	}))
})

gulp.task('watch', ['browserSync', 'sass', 'scripts', 'cleanCss'], function(){
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/css/**/*.css', ['cleanCss']);
})