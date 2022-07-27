/**
 * フェードイン関数
 * @param {Element} node フェードイン要素
 * @param {Number} duration アニメーションの時間
 * @returns
 */
 function fadeIn(node, duration = 300) {
  // display: noneでないときは何もしない
  if (getComputedStyle(node).display !== 'none') return;

  // style属性にdisplay: noneが設定されていたとき
  if (node.style.display === 'none') {
    node.style.display = '';
  } else {
    node.style.display = 'block';
  }
  node.style.opacity = 0;

  const start = performance.now();

  requestAnimationFrame(function tick(timestamp) {
    // イージング計算式（linear）
    const easing = (timestamp - start) / duration;

    // opacityが1を超えないように
    node.style.opacity = Math.min(easing, 1);

    // opacityが1より小さいとき
    if (easing < 1) {
      requestAnimationFrame(tick);
    } else {
      node.style.opacity = '';
    }
  });
}

/**
 * フェードアウト関数
 * @param {Element} node フェードアウト要素
 * @param {Number} duration アニメーションの時間
 */
const fadeOut = (node, duration = 300) => {
  node.style.opacity = 1;

  const start = performance.now();

  requestAnimationFrame(function tick(timestamp) {
    // イージング計算式（linear）
    const easing = (timestamp - start) / duration;

    // opacityが0より小さくならないように
    node.style.opacity = Math.max(1 - easing, 0);

    // イージング計算式の値が1より小さいとき
    if (easing < 1) {
      requestAnimationFrame(tick);
    } else {
      node.style.opacity = '';
      node.style.display = 'none';
    }
  });
}

/**
 * to top
 * main領域までスクロールでフローティングボタンを表示(default)
 * フローティングボタンを表示するタイミングの閾値は`scrollThreshold`に設定する
 * TOPボタンをクリックでページトップまでスクロール
 */
 {
  const TO_TOP = document.getElementById('js-toTop');
  const MAIN_OFFSET_TOP = document.getElementById('js-main').offsetTop;

  /**
   * displayOperation
   * to-topボタンの表示切り替え。<main>が画面上部に行くまでスクロールしたらボタンを表示。
   */
  const displayOperation = () => {
    let currentTop = document.documentElement.scrollTop || document.body.scrollTop
    if (currentTop >= MAIN_OFFSET_TOP) {
      if (TO_TOP.getAttribute('aria-hidden') === 'true') {
        fadeIn(TO_TOP);
        TO_TOP.setAttribute('aria-hidden', false);
      }
    } else {
      if (TO_TOP.getAttribute('aria-hidden') === 'false') {
        fadeOut(TO_TOP);
        TO_TOP.setAttribute('aria-hidden', true);
      }
    }
  }

  /**
   * toTop
   * ページトップまでスムーススクロール
   */
  const toTop = () => {
    const scroll = () => {
      let startY = window.pageYOffset;
      let y = startY - (startY / 10) - 1;
      window.scrollTo(0, y);
      if (y < 0) return;
      requestAnimationFrame(scroll);
    };
    requestAnimationFrame(scroll);
  }

  document.addEventListener('DOMContentLoaded', displayOperation);
  window.addEventListener('scroll', displayOperation);
  TO_TOP.addEventListener('click', toTop);
}