var gulp = require('gulp');
let babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var del = require('del');
var zip = require('gulp-zip');

var build_files_paths = {
   root_path:['*.js','!gulpfile.js'],
   auth_path:['./auth/*.js'],
   ride_path:['./rides/*.js'],
   rating_path:['./ratings/*.js'],
   helper_path:['./helper/*.js'],
   public_js_path:['./public/**/*.js'],
   public_image_path:['./public/img/*'],
   public_path:['./public/*.html','./public/*.png'],
   nonJs: ['package.json'],
   config:['./config/*'],
   envCopy:['./config/.env.production','./config/.env.development', './config/.env.test']
};

gulp.task('clean', function() {
    return del('dist/**', {force:true});
});

gulp.task('copynojs', function() {
    return gulp.src(build_files_paths.nonJs)
         .pipe(gulp.dest('dist'));
 });

 gulp.task('copyimage', function() {
    return gulp.src(build_files_paths.public_image_path)
         .pipe(gulp.dest('dist/public/img'));
 });

 gulp.task('copypublic', function() {
        return gulp.src(build_files_paths.public_path)
             .pipe(gulp.dest('dist/public'));
     });

 gulp.task('minifypublicjs', function() {
    return gulp.src(build_files_paths.public_js_path)
         .pipe(uglify())
         .pipe(gulp.dest('dist/public'));
 });

 gulp.task('minifyauth', function() {
    return gulp.src(build_files_paths.auth_path)
            .pipe(babel({
                    presets: ['@babel/preset-env']
            }))
         .pipe(uglify())
         .pipe(gulp.dest('dist/auth'));
});

gulp.task('minifyride', function() {
        return gulp.src(build_files_paths.ride_path)
                .pipe(babel({
                        presets: ['@babel/preset-env']
                }))
             .pipe(uglify())
             .pipe(gulp.dest('dist/rides'));
    });

gulp.task('minifyrating', function() {
return gulp.src(build_files_paths.rating_path)
        .pipe(babel({
                presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/ratings'));
});

gulp.task('minifyhelper', function() {
    return gulp.src(build_files_paths.helper_path)
            .pipe(babel({
                    presets: ['@babel/preset-env']
            }))
         .pipe(uglify())
         .pipe(gulp.dest('dist/helper'));
});

gulp.task('minifyroot', function() {
        return gulp.src(build_files_paths.root_path)
                .pipe(babel({
                        presets: ['@babel/preset-env']
                }))
             .pipe(uglify())
             .pipe(gulp.dest('dist'));
});

gulp.task('copyEnv', function() {
        return gulp.src(build_files_paths.envCopy)
             .pipe(gulp.dest('dist/config'));
});

gulp.task('minifyconfig', function() {
        return gulp.src(build_files_paths.config)
                .pipe(babel({
                        presets: ['@babel/preset-env']
                }))
             .pipe(uglify())
             .pipe(gulp.dest('dist/config'));
});

 gulp.task('zip', function() {
    return gulp.src('dist/**')
                .pipe(zip('artifact.zip'))
                .pipe(gulp.dest('dist'));
});

gulp.task('build', gulp.series('clean','copynojs','copyimage', 'minifypublicjs', 'minifyauth',
'minifyride', 'minifyhelper',
'minifyroot', 'minifyconfig', 'copyEnv','copypublic',
'minifyrating'));