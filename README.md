# portfolio

GitHub Pages でホストしているポートフォリオ。
静的サイトジェネレーター [Hugo](https://gohugo.io/) で作成。

公開 URL: https://dai08srhg.github.io/portfolio/

テーマは使用しておらず、レイアウト・スタイルはすべて `layouts/` と `assets/css/` に自前で持っている。

---

## 必要なもの

- Hugo **0.143.1**（CI と同じバージョン。`.github/workflows/gh-pages.yml` と揃えること）
- extended 版である必要はない（Sass を使っていないため）

```bash
brew install hugo
hugo version
```

---

## ローカルでの開発・確認

### 開発サーバー

```bash
hugo server
```

http://localhost:1313/portfolio/ を開く。ファイルを保存すると自動でリロードされる。

`hugo server` は `baseURL` を localhost に書き換えて配信するため、リンクや CSS のパスはそのまま動く。

よく使うオプション:

| コマンド | 用途 |
|---|---|
| `hugo server` | 通常の開発 |
| `hugo server --disableFastRender` | テンプレートを変えても反映されないときの強制再描画 |
| `hugo server --navigateToChanged` | 編集したページへ自動で移動 |

### 本番と同じ出力を確認する

`baseURL` にサブパス（`/portfolio/`）が入っているため、`hugo` でビルドしたものをそのままローカルで開くとパスがずれる。
確認したいときは `--baseURL /` を付けてビルドし、静的サーバーで配信する。

```bash
hugo --gc --minify --baseURL / -d /tmp/portfolio-preview
python3 -m http.server 8000 -d /tmp/portfolio-preview
```

http://localhost:8000/ を開く。

### ビルドだけ確認する

```bash
hugo --gc --minify
```

`public/` に出力される。`public/` は Git 管理対象外（`.gitignore` 済み）。
デプロイは CI が毎回ビルドし直すので、ローカルの `public/` をコミットする必要はない。

---

## 内容の編集

### 業績・プロフィール → `data/` の YAML

トップページの各セクションは YAML から生成している。行を追加するだけで表示は崩れない。

| ファイル | セクション |
|---|---|
| `data/profile.yaml` | 氏名・所属・キーワード・各種リンク |
| `data/career.yaml` | 経歴 |
| `data/education.yaml` | 学歴 |
| `data/publications.yaml` | 論文 |
| `data/awards.yaml` | 受賞 |
| `data/talks.yaml` | 講演・口頭発表等 |

補足:

- `career.yaml` / `education.yaml` の `end:` に `present` を書くと、在籍期間が
  `assets/js/job-duration.js` によって自動計算され、日付の下の行に表示される。
- `publications.yaml` の `authors:` のうち、`profile.yaml` の `self_names:` と一致した
  名前が自動で太字になる。
- データが空のセクションは目次ごと自動的に非表示になる。

### 記事ページ → `content/`

`content/tech/` 配下の Markdown が「Tech」セクションのページになる。
front matter は `title` と `description` のみ使用している。

```markdown
---
title: "ページタイトル"
description: "一覧に出る説明文"
---
本文
```

リンク埋め込み用のショートコードが 6 つある。`notion` 以外は外部の埋め込み iframe を使わず、
ビルド時にリンク先の OGP を読んでサイト側のカードとして描画する
（ダークモードにも追従し、閲覧者のブラウザから外部へのリクエストも発生しない）。

```
{{< hatena      link="https://developers.microad.co.jp/entry/2023/10/13/180000" >}}
{{< qiita       link="https://qiita.com/dai08srhg/items/..." >}}
{{< speakerdeck link="https://speakerdeck.com/<user>/<slug>" >}}
{{< linkcard    link="https://example.com/slides/..." >}}
{{< notion      link="https://xxx.notion.site/DB-ff354caa..." title="文献DB" >}}
```

| ショートコード | 見た目 | 取得元 |
|---|---|---|
| `hatena` / `qiita` | 記事カード（日付・タイトル・抜粋・サムネイル） | リンク先の OGP |
| `speakerdeck` | 資料カード（サムネイルの下にタイトル） | SpeakerDeck の oEmbed API |
| `linkcard` | 資料カード（サムネイルの下にタイトル） | リンク先の OGP |
| `decks` | 上記の資料カードを横並びに敷き詰める枠 | （囲むだけ） |
| `notion` | 見出しバー付きの埋め込み枠 | iframe（中身は Notion が描画） |

- `hatena` / `qiita` は中身が同じ（`layouts/partials/post-card.html`）。名前が違うだけなので
  どちらを使っても結果は変わらない。日付は記事 URL の `/YYYY/MM/DD/` から取る。
  タイトル末尾の `- ブログ名` は、ブログ名を別行に出すため自動で落とす。
- `speakerdeck` はサムネイルを oEmbed の応答に含まれる ID から組み立てるので、
  追加のリクエストは発生しない。
- `speakerdeck` / `linkcard` を複数並べるときは `decks` で囲む。段幅に応じて
  列数が変わる（本文幅で 3 列）。スマートフォンでは 1 列になり、カードの中身も
  サムネイルの右にタイトルを置く横長の形に切り替わる。1 枚だけなら囲まなくてよい。

```
{{< decks >}}
{{< speakerdeck link="https://speakerdeck.com/<user>/<slug>" >}}
{{< linkcard    link="https://example.com/slides/..." >}}
{{< /decks >}}
```
- 自動で拾えない場合は `title` / `date` / `image` / `site` で個別に上書きできる。
  `linkcard` で `title` と `site` の両方を指定した場合はリンク先へのアクセス自体が発生しない。

```
{{< hatena   link="https://example.com/x" title="記事名" date="2023-10-13" >}}
{{< linkcard link="https://example.com/"  title="タイトル" site="Example" >}}
```

取得結果は Hugo がキャッシュする。リンク先に繋がらない場合はビルドを止めず、
警告を出して単なるリンクにフォールバックする。

`notion` だけは中身がブラウザ側で描画されるため、ビルド時に情報を取れない。
タイトルは `title` で渡す。

| 引数 | 既定 | 用途 |
|---|---|---|
| `title` | `Notion` | 見出しバーに出す名前 |
| `height` | `560` | 埋め込みの高さ (px) |
| `crop` | `104` | iframe 上端を隠す量 (px)。Notion 自身のツールバーと余白の分 |
| `wide` | なし | `true` で本文の段幅より広げ、ページ右端まで使う |

`link` は共有 URL でよい（URL 中の 32 桁 ID から埋め込み URL を組み立てる）。
Notion 側の UI はテーマに追従しないため、ダークモードでも中身は白いままになる。

### 画像 → `static/img/`

`data/career.yaml` の `logo:` などからは `img/xxx.png` の形で参照する。

### 見た目 → `assets/css/main.css`

`assets/` 配下の CSS / JS は Hugo Pipes で minify + fingerprint され、
`main.min.<ハッシュ>.css` のようなファイル名で出力される。
内容を変えればファイル名も変わるため、ブラウザのキャッシュに古い版が残ることがない。


色・余白はすべて先頭の CSS カスタムプロパティで定義している。
アクセントカラーを変えたい場合は `--accent` の 2 箇所（ライト / ダーク）を変更する。
配色は**ダークが既定**。OS の設定には追従せず、ヘッダー右上のボタンで切り替えた場合だけ
`localStorage` に保存して次回以降もそれを使う。

CSS 側は `:root` にライトの値を置き、`:root:not([data-theme="light"])` でダークに上書きしている。
つまり `data-theme="light"` が付いているときだけライトになる。
既定をライトに戻したい場合は、この 2 ブロックの中身を入れ替えて
`assets/js/theme-toggle.js` の `currentTheme()` と
`layouts/partials/head.html` の `<meta name="color-scheme">` も合わせる。

---

## ディレクトリ構成

```
├── .github/workflows/gh-pages.yml  デプロイ用 GitHub Actions
├── assets/
│   ├── css/main.css                スタイル
│   └── js/                         目次追従・期間計算・GitHub リポジトリ取得・テーマ切替
├── content/                        記事ページ（Markdown）
├── data/                           プロフィール・業績データ（YAML）
├── layouts/
│   ├── _default/                   baseof / single / list
│   ├── partials/                   head・ヘッダー・フッターなど
│   ├── shortcodes/                 リンク埋め込み（hatena / qiita / speakerdeck / linkcard / decks / notion）
│   ├── 404.html
│   └── index.html                  トップページ（プロフィール）
├── static/img/                     画像
└── hugo.toml                       サイト設定・メニュー
```

---

## デプロイ

`master` ブランチに push すると GitHub Actions が自動でビルドし、`gh-pages` ブランチへ publish する。
手動で実行したい場合は GitHub の **Actions** タブ → **github pages** → **Run workflow**。

```
master に push
      │
      ▼
GitHub Actions (.github/workflows/gh-pages.yml)
  1. checkout
  2. Hugo 0.143.1 をセットアップ
  3. hugo --gc --minify  →  public/
  4. public/ を gh-pages ブランチへ push
      │
      ▼
GitHub Pages が gh-pages ブランチを配信
```

### リポジトリ側の設定（変更不要・確認用）

**Settings → Pages**

- Source: `Deploy from a branch`
- Branch: `gh-pages` / `(root)`

**Settings → Actions → General → Workflow permissions**

- `Read and write permissions`（ワークフロー側でも `permissions: contents: write` を明示しているため、通常は変更不要）

### Hugo のバージョンを上げるとき

`.github/workflows/gh-pages.yml` の `hugo-version` と、ローカルの Hugo を同じバージョンに揃える。
片方だけ上げると、ローカルで確認した表示と公開後の表示がずれることがある。

### デプロイが反映されないとき

1. Actions タブでワークフローが成功しているか確認する
2. `gh-pages` ブランチのコミットが更新されているか確認する
3. それでも古い場合はブラウザのキャッシュ。ただし CSS / JS はファイル名に
   ハッシュが付くため、通常はキャッシュの影響を受けない
