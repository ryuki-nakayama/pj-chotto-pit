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