const { src, dest, task, series, watch} = require('gulp');
const rm = require( 'gulp-rm' );
const sass = require('gulp-sass');
const concat = require('gulp-concat');
// const sassGlob = require('gulp-sass-glob'); этот плагин нужен для того чтобы поключать все стили через один @import
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
    './docs/css/styles.scss'
]

task( 'icons', function () {
    return src('./docs/svg/icons/*.svg')
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
                sprite: "../../../sprite.svg"
            }
        }
    }))
    .pipe(dest("./docs/svg/new-icons"))
})

task( 'clean', function() {
  return src( './docs/css/styles.css', { read: false }).pipe( rm() );
});

task ('styles', function () {
    return src(styles)
    .pipe(sourcemaps.init())
    .pipe(concat('styles.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(px2rem())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false 
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('./docs/css'));
});

task ('scripts', function () {
    return src('./docs/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js', {newLine: ';'}))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(sourcemaps.write())
    .pipe(dest('./docs/scripts/main'));
});

watch('./docs/css/*.scss', series('styles'));
watch('./docs/svg/icons/*.svg', series('icons'));
watch('./docs/scripts/*.js', series('scripts'));

task('default', series('clean', 'styles','scripts','icons'));