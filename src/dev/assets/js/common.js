


/**
 * ページ内リンクへスムーススクロールアニメーション
 */
// {
//   const EASE = { easeInOut: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; } }  // ease-in-outの設定
//   const DURATION = 300; // スクロールスピード

//   /**
//    * ページ内アンカーへスムーススクロール
//    * @param {String} hash
//    */
//   const scrollToAnchor = hash => {
//     const targetElement = document.getElementById(hash.replace('#', '')); // リンク先の要素（コンテンツ）
//     const rect = targetElement.getBoundingClientRect().top; // ブラウザからの高さ
//     const offset = window.pageYOffset; // 現在のスクロール量
//     const gap = document.getElementById('js-header').offsetHeight; // 固定ヘッダー分の高さ
//     const y = rect + offset - gap; //最終的な位置を割り出す
//     const begin = performance.now(); // アニメーション開始時間

//     const scrollAnimation = (nowTime) => {
//       const time = nowTime - begin; // スタートからの経過時間を取得
//       const normalizedTime = time / DURATION; // DURATIONを1とした場合の経過時間を計算

//       // DURATIONに経過時間が達していない場合はアニメーションを実行
//       if (normalizedTime < 1) {
//         // 経過時間とイージングに応じてスクロール位置を変更
//         window.scrollTo(0, offset + ((y - offset) * EASE.easeInOut(normalizedTime)));
//         // アニメーションを継続
//         requestAnimationFrame(scrollAnimation);

//         // DURATION に経過時間が達したら、アニメーションを終了
//       } else {
//         window.scrollTo(0, y);
//       }
//     }

//     // スムーススクロールスタート
//     requestAnimationFrame(scrollAnimation);
//   }

//   /**
//    * ページ内リンクがクリックされたときに走る
//    * クリックされたリンクのhrefを取得し、scrollToAnchorへ渡す
//    * @param {*} e
//    */
//   const smoothScroll = (e) => {
//     const $this = e.currentTarget; // クリックされた要素を取得
//     const hash = $this.hash;
//     if (hash !== '#' && hash !== '' ) {
//       e.preventDefault();
//       e.stopPropagation();
//       scrollToAnchor(hash);
//     }
//   }

//   /**
//    * イベントの登録
//    */
//   document.addEventListener('DOMContentLoaded', (e) => {
//     const SMOOTH_SCROLL_TRIGGER = document.querySelectorAll('a[href^="#"]');

//     // 要素が存在すればイベント登録をする
//     if (SMOOTH_SCROLL_TRIGGER !== null) {
//       const SMOOTH_SCROLL_TRIGGER_LENGTH = SMOOTH_SCROLL_TRIGGER.length;
//       for (let i = 0; i < SMOOTH_SCROLL_TRIGGER_LENGTH; i++) {
//         SMOOTH_SCROLL_TRIGGER[i].addEventListener('click', smoothScroll, false);
//       }
//     }

//     // const hash = location.hash;
//     // if (hash) {
//     //   smoothScrollHash(hash);
//     // }
//   });
// }

/**
 * to top
 * main領域までスクロールでフローティングボタンを表示(default)
 * フローティングボタンを表示するタイミングの閾値は`scrollThreshold`に設定する
 * TOPボタンをクリックでページトップまでスクロール
 */
// {
//   const TO_TOP = document.getElementById('js-toTop');
//   const MAIN_TOP = document.getElementsByClassName('js-main')[0].offsetTop;

//   // フローティングボタンの表示切り替え
//   const displayOperation = () => {
//     let currentTop = document.documentElement.scrollTop || document.body.scrollTop
//     if (currentTop >= MAIN_TOP) {
//       TO_TOP.setAttribute('aria-hidden', false);
//     } else {
//       TO_TOP.setAttribute('aria-hidden', true);
//     }
//   }

//   // ページトップまでスクロール
//   const toTop = () => {
//     const scroll = () => {
//       let startY = window.pageYOffset;
//       let y = startY - (startY / 10) - 1;
//       window.scrollTo(0, y);
//       if (y < 0) return;
//       requestAnimationFrame(scroll);
//     };
//     requestAnimationFrame(scroll);
//   }

//   document.addEventListener('DOMContentLoaded', displayOperation);
//   window.addEventListener('scroll', displayOperation);
//   TO_TOP.addEventListener('click', toTop);
// }