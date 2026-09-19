# Translate in Split Window

左に原文、右に Google 翻訳した同じページを並べて表示し、スクロールを同期する Chrome 拡張（Manifest V3）。

## インストール

1. `chrome://extensions` を開き「デベロッパーモード」を ON
2. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択
   （配布用 zip を使う場合は展開したフォルダを選択）

## 使い方

- 拡張アイコンをクリック / `Alt+Shift+T` … 現在のウィンドウを左半分に縮め、右半分に翻訳ページのウィンドウを開く
- 右クリック →「翻訳を隣のタブに開く（分割ビュー用）」… 隣のタブに翻訳を開く。Chrome 標準の分割ビューにするのは手動
- 左右のスクロールは割合で同期。原文側でページ遷移すると翻訳側も追従
- 翻訳先言語は Chrome の UI 言語

## 制約

- Google 翻訳のプロキシ（`translate.goog`）を使うため、ログインが必要なページや社内サイトは翻訳できない
- 翻訳で文章量が変わるため、スクロール位置は多少ずれる

## パッケージ化

```powershell
./package.ps1   # dist/translate-in-split-window-<version>.zip を生成
```

## License

MIT
