# Translate in Split Window

[English](#english) | [日本語](#日本語)

## English

A Chrome extension (Manifest V3) that shows the original page on the left and its Google-translated version on the right, with synced scrolling.

### Install

1. Open `chrome://extensions` and turn on **Developer mode**
2. Click **Load unpacked** and select this folder
   (if you downloaded the release zip, unzip it and select the extracted folder)

### Usage

- Click the extension icon or press `Alt+Shift+T`: the current window shrinks to the left half and a window with the translated page opens on the right half
- Right-click → "翻訳を隣のタブに開く（分割ビュー用）" (open the translation in the next tab): opens the translation in the adjacent tab. Putting the two tabs into Chrome's built-in split view is a manual step
- Scrolling is synced between both sides by scroll ratio. When you navigate on the original side, the translated side follows
- The target language is Chrome's UI language

### Limitations

- Translation goes through the Google Translate proxy (`translate.goog`), so pages that require login and intranet sites cannot be translated
- Translated text differs in length, so scroll positions can drift slightly

### Packaging

```powershell
./package.ps1   # creates dist/translate-in-split-window-<version>.zip
```

## 日本語

左に原文、右に Google 翻訳した同じページを並べて表示し、スクロールを同期する Chrome 拡張（Manifest V3）。

### インストール

1. `chrome://extensions` を開き「デベロッパーモード」を ON
2. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択
   （リリースの zip を使う場合は展開したフォルダを選択）

### 使い方

- 拡張アイコンをクリック / `Alt+Shift+T` … 現在のウィンドウを左半分に縮め、右半分に翻訳ページのウィンドウを開く
- 右クリック →「翻訳を隣のタブに開く（分割ビュー用）」… 隣のタブに翻訳を開く。Chrome 標準の分割ビューにするのは手動
- 左右のスクロールは割合で同期。原文側でページ遷移すると翻訳側も追従
- 翻訳先言語は Chrome の UI 言語

### 制約

- Google 翻訳のプロキシ（`translate.goog`）を使うため、ログインが必要なページや社内サイトは翻訳できない
- 翻訳で文章量が変わるため、スクロール位置は多少ずれる

### パッケージ化

```powershell
./package.ps1   # dist/translate-in-split-window-<version>.zip を生成
```

## License

MIT
