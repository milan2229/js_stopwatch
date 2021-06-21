(function(){
  'use strict';

  // getElementByIdは任意のHTMLタグで指定したIDにマッチするドキュメント要素を取得するメソッド。
  // ほぼconst(定数)で定義できる
  // オブジェクトや配列の値の変更は再代入にはならないから
  // varはもう使わないこと
  // プリミティブ方を再代入したい場合はlet

  let timer = document.getElementById('timer');
  let start = document.getElementById('start');
  let stop = document.getElementById('stop');
  let reset = document.getElementById('reset');

  // クリック時の時間を保持するための変数定義。
  let startTime;

  // elapsed(経過)時刻を更新するための変数。初めは0で初期化
  let elapsedTime = 0;

  // タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーidが必要
  let timerId;

  // タイマーストップ→再開させたら0になってしまうのを避けるための変数。
  let timeToadd = 0;

  // ミリ秒の表示ではなく、分とか秒に直すための関数、他のところからも呼びだすので別関数として作る
  // 計算方法として135200ミリ秒経過したとしてそれを分とか秒に直すと -> 02:15:200
  function updateTimetText() {

    // m(分) = 135200 / 60000ミリ秒で割った数の商 -> 2分
    let m = Math.floor(elapsedTime / 60000);

    // s(秒) = 135200 % 60000ミリ秒で / 1000(ミリ秒なので1000で割ってやる) ->15秒
    // Math.floorメソッドとは、数値の小数点以下の切り捨て処理を行う方法です。
    let s = Math.floor(elapsedTime % 60000 / 1000);

    // ms(ミリ秒) = 135200ミリ秒を % 1000ミリ秒で割った数のあまり
    let ms = elapsedTime % 1000;

    // HTML上で表示の際の桁数を固定する 例) 3=>03, 12=>012
    // jsでは文字列数列を連結すると文字列になる
    // 文字列の末尾2桁を表示したいのでsliceで負の値(-2)引数で渡してあげる
    // slice()は、文字列や配列などからデータの一部分だけ取り出せるメソッドになります。
    m = ('0' + m).slice(-2);
    s = ('0' + s).slice(-2);
    ms = ('0' + ms).slice(-3);

    // HTMLのid timer部分に表示させる
    timer.textContent = m + ':' + s + ':' + ms;
  }

  // 再帰的に使える用の関数
  function countUp(){

    // timerId変数はsetTimeoutの返り値になるので代入する
    timerId = setTimeout(function() {

      // 経過時刻は現在時刻をミリ秒で示すDate.now()からstartを押した時の時刻(startTime)を引く
      elapsedTime = Date.now() - startTime + timeToadd;
      updateTimetText()

      // countUp関数自身を呼ぶことで10ミリ秒毎に以下の計算を始める
      countUp();

      // 1秒以下の時間を表示するために10ミリ秒後に始めるよう宣言
    },10);
  }

  // startボタンにクリック時のイベントを追加(タイマースタートイベント)
  // 「addEventListener()」は、JavaScriptからさまざまなイベント処理を実行することができるメソッドになります。
  // この場合clickされた時にイベント発動する
  start.addEventListener('click',function(){

    // 現在時刻を示すDate.nowを代入
    startTime = Date.now();

    // 再帰的に使えるように関数を作る
    countUp();
  });

  // stopボタンにクリック時のイベントを追加(タイマーストップイベント)
  stop.addEventListener('click',function(){

    // タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーidが必要
    clearTimeout(timerId);

    // タイマーに表示される時間elapsedTimeが現在時刻からスタートボタンを押した時刻を引いたものなので、タイマーを再開させたら0になってしまう。
    // elpasedTime = Date.now - startTime
    // それを回避するためには過去のスタート時間からストップ時間までの経過時間を足してあげなければならない。
    // elpasedTime = Date.now - startTime + timeToadd(timeToadd = ストップを押した時刻(Date.now)から直近のスタート時刻(startTime)を引く)
    timeToadd += Date.now() - startTime;
  });

  // resetボタンにクリック時のイベントを追加(タイマーリセットイベント)
  reset.addEventListener('click',function() {

    // 経過時刻を更新するための変数elapsedTimeを0にしてあげつつ、updateTimetTextで0になったタイムを表示。
    elapsedTime = 0;

    // リセット時に0に初期化したいのでリセットを押した際に0を代入してあげる
    timeToadd = 0;

    // updatetTimeTextで0になったタイムを表示
    updateTimetText();
  });
})();