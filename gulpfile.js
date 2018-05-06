var
    gulp          = require('gulp'),
    uglify        = require('gulp-uglify'),
    sass          = require('gulp-sass'),
    minCSS     	  = require("gulp-minify-css"),
  	concat 	      = require("gulp-concat"),
  	flatten       = require("gulp-flatten"),
    imagemin      = require('gulp-imagemin'),
    pug           = require('gulp-pug'),
    browserSync   = require('browser-sync').create()
;

//- Handle Gulp Console Errors
function errorLog(error){
  console.error.bind(error);
  this.emit('end');
}

//- Plugins Files JS (BowerComponents, Flatten, Concat, Uglify)
gulp.task('minJS', function(){
  return gulp.src(
    ['dist/assets/js/plugins/*.js'])
    .pipe(uglify())
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('dist/assets/js'))
});


//- Plugins Files CSS (Concat and Minify)
gulp.task('minCSS', function(){
  gulp.src(['dist/assets/css/plugins/*.css'])
    .pipe(flatten( { includeParents: 1} ))
    .pipe(concat('plugins.css'))
    .pipe(minCSS('plugins.css'))
    .pipe(gulp.dest('dist/assets/css'))
});


//- Compile SASS
gulp.task('scss', function(){
  gulp.src('src/scss/*.scss')
    .pipe(sass({
        outputStyle: 'compressed'
      }))
      .on('error', errorLog)
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.stream());
})


//- Compile JavaScript Funcions
gulp.task('JS',function(){
  gulp.src('src/js/*.js')
    .pipe(concat('functions.js'))
    .on('error', errorLog)
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(browserSync.stream())
});

//- Compile pug

gulp.task('pug', function build() {
  return gulp.src('src/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .on('error', errorLog)
    .pipe(browserSync.stream())
});

//- Watching Files

gulp.task('watch', function(){
  gulp.watch('src/scss/*.scss',['scss'])
  gulp.watch('src/js/*.js' , ['JS'])
  gulp.watch('src/images/**/*.{jpg,png,gif}', ['images'])
  gulp.watch('src/pug/**/*.pug', ['pug'])
})




gulp.task('images', function(){
	gulp.src('src/images/*.{jpg,png,gif,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/imgs'))
    .pipe(browserSync.stream())
})


//- Copy Fonts From Src file to dist
gulp.task('fonts', function() {
	return gulp.src('src/fonts/*.{eot,svg,ttf,woff,woff2}')
	.pipe(flatten())
	.pipe(gulp.dest('dist/assets/fonts'))
});


//- browser Sync Server
gulp.task('serve',['scss','pug','JS', 'images','fonts','minCSS','minJS'], function() {
    browserSync.init({
        server: "dist"
    });
    gulp.watch('src/scss/**/*.scss',['scss'])
    gulp.watch('src/js/*.js' , ['JS'])
    gulp.watch('src/images/**/*.{jpg,png,gif}', ['images'])
    gulp.watch('src/pug/**/*.pug', ['pug'])
});


gulp.task('fire',['serve'],function(){
      console.log('Build Done!');
});
gulp.task('build', ['minJS',  'scss','minCSS', 'JS','pug','images'], function (){
  console.log('Build Done!');
})
