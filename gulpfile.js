const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const babel = require('gulp-babel');
const htmlmin = require ("gulp-htmlmin");

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
 
gulp.task('autoprefixer', () =>
    gulp.src('src/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest("src/css/prefixedCss"))
        .pipe(browserSync.reload({
            stream: true
        }))
);

gulp.task('imagemin', () =>
    gulp.src('src/img/*')
        .pipe(cache((async () => {
			await imagemin(['src/img/*'], 'build/images', {
				plugins: [
					imageminPngquant()
				]
			})
			console.log('Images optimized');
		})())
        .pipe(gulp.dest('dist/images'))
));

gulp.task('babel', () =>
    gulp.src('src/js/assets/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('src/js/babel'))
);

gulp.task("minifyHTML", () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

gulp.task("minify-css", () => {
    return gulp.src("src/css/prefixedCss/*.css")
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('build', ['sass', 'scripts', 'imagemin', 'minifyHTML', 'minify-css']);

gulp.task('watch', ['browserSync', 'sass', 'scripts', 'cleanCss', "autoprefixer", "babel", "imagemin", "minifyHTML", "minify-css"], function() {
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/css/**/*.css', ['cleanCss']);
	gulp.watch("src/css/**/*.css", ["autoprefixer"]);
    gulp.watch("src/img/*", ["imagemin"]);
	gulp.watch("src/js/assets/**/*.js", ["babel"]);
	gulp.watch("src/*.html", ["minifyHTML"]);
    gulp.watch("src/css/**/*.css", ["minify-css"]);
})

