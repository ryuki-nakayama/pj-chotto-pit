const { src, dest, watch, series, parallel, lastRun }  = require("gulp");
const gulp = require('gulp');
const del = require('del');
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require('gulp-sass-glob');
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");
const gcmq = require("gulp-group-css-media-queries");
const browserSync = require("browser-sync");
const rename = require("gulp-rename");
const prettier = require('gulp-prettier');
const fs = require('fs');
const ejs = require("gulp-ejs");
const sitemap = require('gulp-sitemap');
const htmlBeautify = require("gulp-html-beautify");

// 入出力するフォルダのパス
const devRoot = './src/dev';
const distRoot = './src/dist';

const devPath = {
  'html': devRoot + '/**/*.html',
  'ejs': devRoot + '/ejs/',
  'php': devRoot + '/**/*.php',
  'scss': devRoot + '/assets/scss/**/*.scss',
  'img': devRoot + '/assets/img/**/*',
  'js': devRoot + '/assets/js/**/*.js',
  'pdf': devRoot + '/assets/pdf/**/*.pdf',
  'json': devRoot + '/assets/json',
};

// 納品フォルダのパス
const distPath = {
  'html': distRoot + '/',
  'pug': distRoot + '/',
  'css': distRoot + '/chotto-pit/css/',
  'img': distRoot + '/chotto-pit/img/',
  'js': distRoot + '/chotto-pit/js/',
  'pdf': distRoot + '/chotto-pit/pdf/',
};

/**
 * compile ejs
 * ejsファイルのコンパイル
 */
const json = JSON.parse(fs.readFileSync(devPath.json + '/breadcrumb.json', 'utf8'));
gulp.task("ejs", (done) => {
  gulp
    .src([devPath.ejs + "**/*.ejs", "!" + devPath.ejs +  "**/_*.ejs"])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(ejs({'breadcrumb': json}, {}, { ext: ".html" }))
    .pipe(rename({ extname: ".html" }))
    .pipe(htmlBeautify({
      "indent_size": 2,
      "indent_char": " ",
      "indent_with_tabs": false,
      "max_preserve_newlines": 1,
      "indent_level": 0,
      "preserve_newlines": true,
      "indent_inner_html": false,
      "wrap_attributes": "auto",
      "wrap_attributes_indent_size": 4,
      "extra_liners": [],
    }))
    .pipe(gulp.dest(distPath.html));
  done();
});

/**
 * generate XML
 * sitemap.xmlの作成
*/
const generateXML = done => {
  src(distPath.html + '**/*.html', {
    read: false
  })
  .pipe(sitemap({
    // URL変更
    siteUrl: 'https://*****.com'
  }))
  .pipe(dest(distPath.html));
  done();
}

/**
 * compile sass
 * sassファイルのコンパイルとsourcemapの作成
 */
const compileSass = done => {
  const postcssPlugins = [
    autoprefixer({
      grid: "autoplace",
      cascade: false,
    }),
    cssdeclsort({ order: "alphabetical" })
  ];
  src(devPath.scss, { sourcemaps: false })
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss(postcssPlugins))
    .pipe(gcmq())
    .pipe(dest(distPath.css));
  done();
};

/**
 * build local server
 * ローカルサーバーを立ち上げる
 */
const buildServer = done => {
  browserSync.init({
    port: 8080,
    files: ["**/*"],
    // 静的サイト
    server: {
      baseDir: './src/dist/chotto-pit/',
      index: 'index.html',
    },
    // 動的サイト
    // proxy: "http://localsite.local/",
    open: true,
    watchOptions: {
      debounceDelay: 1000,
    },
  });
  done();
};

/**
 * reload browser
 * ブラウザーのオートリロード
 */
const browserReload = done => {
  browserSync.reload();
  done();
};

/**
 * cache busting
 * キャッシュ対策のためversionを付与
 */
const cacheBusting = done => {
  src(distPath.html + "**/*.html")
    .pipe(replace(/\.(js|css)\?ver/g, ".$1?ver=" + hash))
    .pipe(replace(/\.(webp|jpg|jpeg|png|svg|gif)/g, ".$1?ver=" + hash))
    .pipe(dest(distPath.html));
  done();
};

/**
 * clean
 * distフォルダ内のファイルをクリア
 */
const cleanHtml = () => {
  return del(distPath.html + "**/*.html");
};

const cleanPhp = () => {
  return del(distPath.php + "**/*.php");
};

const cleanCss = () => {
  return del(distPath.css + "**/*");
}

const cleanImg = () => {
  return del(distPath.img + "**/*");
}

const cleanJs = () => {
  return del(distPath.js + "**/*.js");
};

const cleanPdf = () => {
  return del(distPath.pdf + "**/*.pdf");
};

/**
 * copy
 * devからdistへファイルをコピー
 */
const html = () => {
  return gulp.src(devPath.html)
  .pipe(gulp.dest(distPath.html));
}

const img = () => {
  return gulp.src(devPath.img)
  .pipe(gulp.dest(distPath.img))
};

const js = () => {
  return gulp.src(devPath.js)
  .pipe(gulp.dest(distPath.js))
};

const pdf = () => {
  return gulp.src(devPath.pdf)
  .pipe(gulp.dest(distPath.pdf))
};

/**
 * update
 * dist内のファイルを更新
 */
gulp.task("updateFiles", (done) => {
  del(distPath.html + "**/*.html");
  del(distPath.php + "**/*.php");
  del(distPath.css + "**/*");
  del(distPath.img + "**/*");
  del(distPath.js + "**/*.js");
  gulp.src(devPath.html)
    .pipe(gulp.dest(distPath.html))
  gulp.src(devPath.img)
    .pipe(gulp.dest(distPath.img));
  gulp.src(devPath.js)
    .pipe(gulp.dest(distPath.js));
  done();
});

/**
 * watch
 * ファイルの追加・変更を監視
 */
const watchFiles = () => {
  watch(devPath.html, series(cleanHtml, html, browserReload))
  watch(devPath.ejs, series(cleanHtml, gulp.task("ejs"), browserReload))
  watch(devPath.scss, series(compileSass, browserReload))
  watch(devPath.img, series(img, browserReload))
  watch(devPath.js, series(js, browserReload))
  watch(devPath.pdf, series(cleanPdf, pdf))
};

/**
 * execution
 */
module.exports = {
  ejs: gulp.task('ejs'),
  cache: cacheBusting,
  sass: compileSass,
  image: series(cleanImg, img),
  build: series(gulp.task('updateFiles'), parallel(gulp.task('ejs'), compileSass), cacheBusting, generateXML),
  default: series(gulp.task('updateFiles'), parallel(gulp.task('ejs'), compileSass), parallel(buildServer, watchFiles))
};