const { src, dest, task, series, watch} = require('gulp');
const rm = require( 'gulp-rm' );
const sass = require('gulp-sass');
const concat = require('gulp-concat');
// const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
// const gcmq = require('gulp-group-css-media-queries');
// const cleanCSS = require('gulp-clean-css');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');

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
        ] //этот плагин удаляет атрибуты в скобках
    })) // этот пайп плагина благодаря ему мы всего лишь создаем новые svg файлы без лишних атрибутов которые в дальнейшем мы будем склеивать в один файл-спрайт
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "../../../sprite.svg"
            }
        }//режимы например css, defs
    }))
    .pipe(dest("./docs/svg/new-icons"))//в предыдущем спрайте сформируется спрайт поэтому этот пайп уже не работает. Если переместить этот пайп пере предыдущем то будет создаваться папка new-icons в которую будут
    // помещаться обработанные svg файлы но тогда перестанет формироваться спрайт
})

task( 'clean', function() {
  return src( './docs/css/styles.css', { read: false }).pipe( rm() );
});

task ('styles', function () {
    return src(styles) 
    .pipe(concat('styles.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false 
    }))
    .pipe(dest('./docs/css'));
});

task ('scripts', function () {
    return src('./docs/scripts/*.js')
    .pipe(concat('main.js', {newLine: ';'})) //newline это символ с которого будет начинаться каждая строчка чтобы не проставлять пере каждым модулей точку с запятой
    .pipe(dest('./docs/scripts/main'));
});

watch('./docs/css/*.scss', series('styles'));
watch('./docs/svg/icons/*.svg', series('icons')); //Пропишем вотчер чтобы если изменилось содержание где лежат файлы svg то перезапустился такс иконс
watch('./docs/scripts/*.js', series('scripts'));

task('default', series('clean', 'styles','scripts','icons'));