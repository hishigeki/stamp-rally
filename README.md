# 学園祭Webスタンプラリー

GitHub Pagesで公開できる、HTML/CSS/JavaScriptだけのWebスタンプラリーです。

## 使い方

1. このフォルダの中身をGitHubリポジトリへアップロードします。
2. GitHub Pagesを有効にします。
3. 公開URLを確認します。
4. QRコードには次の形式のURLを入れます。

```text
https://ユーザー名.github.io/リポジトリ名/?stamp=01
https://ユーザー名.github.io/リポジトリ名/?stamp=02
...
https://ユーザー名.github.io/リポジトリ名/?stamp=20
```

## ファイル構成

```text
index.html
style.css
app.js
images/
  stamp01.png
  stamp02.png
  ...
  stamp20.png
```

## 記録方式

スタンプの取得状況はスマホのブラウザ内の `localStorage` に保存します。

そのため、サーバーやデータベースは不要です。

## 注意

- ブラウザの保存データを削除すると記録も消えます。
- 別のスマホには記録を引き継げません。
- 景品受け取り後は「済」と入力すると終了状態になります。
