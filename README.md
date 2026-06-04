# 学園祭Webスタンプラリー 本番用パッケージ

## 内容

- GitHub Pages用Web台紙
- ランダムURL対応
- ランダム画像ファイル名対応
- QRコード20個
- 受け取り済みQR
- 管理者リセットQR
- 管理者用対応表

## GitHubへアップロードするもの

このZIPの中身を、リポジトリ `stamp-rally` のルートへ上書きアップロードしてください。

```text
index.html
style.css
app.js
README.md
images/
```

## QRコード

QRコードは別ZIPに入っています。

- `QR_stamp_01.png` ～ `QR_stamp_20.png`
- `QR_finish_done.png`
- `QR_admin_reset.png`

## 注意

`stamp_mapping_admin_keep_private.json` は管理者用対応表です。
公開リポジトリへ置くとURL対応表が見えるため、必要なければGitHubにはアップロードしないでください。
