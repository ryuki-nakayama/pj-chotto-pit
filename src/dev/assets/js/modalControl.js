/**
 * モーダル系UIで起こりがちな２つの問題に対処する
 *  1. 裏側がスクロールされる現象
 *  2. 裏側にキーボードフォーカスされる現象
 *
 * ページ下部に使い方を記載
 */

const CSS_CAN_SCROLL = '.js-canScroll'; // スクロール可能な要素に付与したクラス名

/**
 * createInteractiveElArray
 * 要素内にあるフォーカス可能な要素を取得する
 * @param {DOM} element モーダル要素
 * @returns {Array} 要素内にあるフォーカス可能な要素の配列
 */
const createInteractiveElArray = (element) => {
  const INTERACTIVE_SELECTOR = 'button, a';
  // モーダル要素内のフォーカス可能な要素を取得する
  const elements = element.querySelectorAll(INTERACTIVE_SELECTOR);
  const interactiveElArray = Array.from(elements);
  return interactiveElArray;
};

/**
 * focusToButton
 * 要素の先頭と末尾どちらかにフォーカスを与える。
 * @param {DOM} parentElement 対象のモーダル要素
 * @param {Boolean} isFirstFocus 先頭と末尾のどちらにフォーカスを与えるか指定する。
 */
const focusToButton = (parentElement, isFirstFocus = true) => {
  if (!parentElement) {
    throw new Error('要素が見つかりませんでした');
  }

  const focusableArray = createInteractiveElArray(parentElement);

  if (focusableArray.length > 0) {
    focusableArray[isFirstFocus ? 0 : focusableArray.length - 1].focus();
  }

  focusableArray[0].focus();
};

/**
 * modalFocus
 * モーダルのキーボードフォーカスを制御するイベント
 * @param {Event} event
 * @param {DOM} parentElement 対象のモーダル要素
 * @param {Function} onClose モーダルを閉じる処理
 */
const modalFocus = (event, parentElement, onClose) => {
  if (!parentElement) {
    return;
  }

  switch (event.code) {
    case 'Enter':

    case 'Space':
      break;

    case 'Escape':
      onClose();
      break;

    case 'Tab': {
      // モーダル画面内にフォーカスが当たっているか検証
      const interactiveElArray = createInteractiveElArray(parentElement);
      const focusIndex = interactiveElArray.findIndex(el => el === document.activeElement);

      if (interactiveElArray.length === 1) {
        // フォーカス可能な要素が1つしかない場合、その要素のみフォーカス
        event.preventDefault();
        event.stopImmediatePropagation();
        focusToButton(parentElement, true);
        break;
      }

      if (focusIndex === 0) {
        if (event.shiftKey) {
          // モーダル画面以外にフォーカスが当たっていたらイベントを無効化
          event.preventDefault();
          event.stopImmediatePropagation();
          focusToButton(parentElement, false);
        }
      } else if (focusIndex >= interactiveElArray.length - 1) {
        // 最後の要素にふれていたら1番目の要素にフォーカスをあてる
        if (!event.shiftKey) {
          event.preventDefault();
          event.stopImmediatePropagation();
          focusToButton(parentElement, true);
        }
      } else if (focusIndex === -1) {
        // 画面外の要素にフォーカスがあたっていたら1番目の要素にフォーカスをあてる
        focusToButton(parentElement, true);
      }

      break;
    }
  }
};

/**
 * isScrollable
 * スクロール可能か判定
 * @param {DOM} element スクロール可能要素
 * @returns {Boolean} スクロール可能かどうか
 */
const isScrollable = (element) => {
  return element.clientHeight < element.scrollHeight;
}

/**
 * scrollLock
 * 指定した要素以外のスクロールを抑止する
 * @param {Event} event イベント
 */
const scrollLock = (event) => {
  const canScrollElement = event.target?.closest(CSS_CAN_SCROLL);

  if (canScrollElement === null) {
    // 対象の要素でなければスクロール禁止
    event.preventDefault();
    return;
  }

  if (canScrollElement && isScrollable(canScrollElement)) {
    // 対象の要素があり、その要素がスクロール可能であればスクロールを許可する
    event.stopPropagation();
  } else {
    // 対象の要素はスクロール禁止
    event.preventDefault();
  }
};

// **************************************************
// scrollLockFix.js
// **************************************************
/**
 * scrollLockTroubleShooting
 * スクロールのバグ対策
 * @param {Event} event イベント
 */
const scrollLockTroubleShooting = (event) => {
  const element = event.target;

  if (element === null) {
    return;
  }

  // 以下の手順で発生するスクロールのバグ対策。回避するため1pxだけスクロール量を減らす
  // 1. メニューを上下どちらかに最大までスクロールする
  // 2. 更にスクロールを行うとページ全体がスクロールする
  if (element.scrollTop + element.clientHeight === element.scrollHeight) {
      element.scrollTop = element.scrollTop - 1;
  }

  if (element.scrollTop === 0) {
      element.scrollTop = 1;
  }
};

/**
 * scrollLockFix
 * スクロールのバグ対策を行うイベントを追加する
 * @param {DOM} element 対象のモーダル要素
 * @returns
 */
const scrollLockFix = (element) => {
  const canScrollElement = element.querySelector(CSS_CAN_SCROLL);

  if (!canScrollElement) {
    return;
  }

  canScrollElement.addEventListener('scroll', scrollLockTroubleShooting);
};

/**
 * scrollLockFixRemove
 * スクロールのバグ対策を行うイベントを削除する
 * @param {DOM} element 対象のモーダル要素
 * @returns
 */
const scrollLockFixRemove = (element) => {
  const canScrollElement = element.querySelector(CSS_CAN_SCROLL);

  if (!canScrollElement) {
      return;
  }

  canScrollElement.removeEventListener('scroll', scrollLockTroubleShooting);
};

// ==================================================
// Usage
// ==================================================

// SCROLL_AREA = モーダルUIの中のスクロール可能エリア要素
// MODAL_BTN = モーダルUIの開閉をコントロールするボタン要素

// Close処理
// const closeDrawerMenu = () => {
//   // Open時にbodyに追加したクラスを削除
//   // クラスの削除で「overflow: hidden」が外れる。
//   document.body.classList.remove('_scrollLock');

//   // ⭐キーボードフォーカスの制御を破棄
//   window.removeEventListener('keydown', focusHandleMenu, { capture: true });

//   // ⭐スクロール固定のイベントを破棄
//   document.removeEventListener('touchmove', scrollLock);
//   scrollLockFixRemove(SCROLL_AREA);

//   // ⭐フォーカス位置を戻す
//   MODAL_BTN.focus();
// }

// ⭐キーボードフォーカスのイベントハンドラ
// const focusHandleMenu = event => {
//   modalFocus(event, SCROLL_AREA, close);
// }

// Open処理
// const openDrawerMenu = () => {
//   // モーダル表示用のクラスを追加
//   // クラスの追加でbodyに「overflow: hidden」がつくようにスタイルを当てておく
//   document.body.classList.add('_scrollLock');

//   // ⭐キーボードフォーカスの制御イベントを登録
//   window.addEventListener('keydown', focusHandleMenu, { capture: true });

//   // ⭐スクロール固定のイベントを登録
//   document.addEventListener('touchmove', scrollLock, { passive: false });
//   scrollLockFix(SCROLL_AREA);
// }