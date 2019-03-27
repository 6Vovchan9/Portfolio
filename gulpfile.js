const { src, dest, task, series, watch} = require('gulp');
const rm = require( 'gulp-rm' );
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
// const gcmq = require('gulp-group-css-media-queries'); это плагин группирующий одинаковые медиа запросы
// const cleanCSS = require('gulp-clean-css'); этот плагин сжимает итоговый проект удаляю отступы в файлах пробелы комментарии
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const sourcemaps = require('gulp-sourcemaps');
const px2rem = require('gulp-smile-px2rem');
const babel = require('gulp-babel');

sass.compiler = require('node-sass');

const styles = [
    './node_modules/normalize.css/normalize.css',
    './src/styles/styles.scss'
]

task( 'icons', function () {
    return src('./src/img/svg/icons/*.svg')
    .pipe(svgo({
        plugins: [
            {
                removeAttrs: {
                    attrs: "(fill|stroke|style|width|height|data.*)"
                }
            }
        ]
    })) 
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "../../../../../dist/sprite.svg"
            }
        }
    }))
    .pipe(dest("./src/img/svg/new-icons"))
})

task( 'clean', function() {
  return src( './dist/*.css', { read: false }).pipe( rm() );
});

task ('styles', function () {
    return src(styles)
    .pipe(sourcemaps.init())
    .pipe(concat('styles.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(px2rem({
        dpr: 1,
        rem: 16,
        one: false
    }))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false 
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('./dist'));
});

task ('scripts', function () {
    return src('./src/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('gulp.js', {newLine: ';'}))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('./dist'));
});

watch('./src/styles/*/*.scss', series('styles'));
watch('./src/img/svg/icons/*.svg', series('icons'));
watch('./src/scripts/*.js', series('scripts'));

task('default', series('clean', 'styles','scripts','icons'));