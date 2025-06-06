---
sidebar_position: 10
title: "SearXNG"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage WebUIチームによってサポートされていません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？寄稿ガイドをチェックしてください。
:::

このガイドでは、Docker上のSearXNGを使用してSage Open WebUIにウェブ検索機能を設定する方法について説明します。

## SearXNG (Docker)

> "**SearXNGは、さまざまな検索サービスやデータベースから結果を集約する無料のメタ検索エンジンです。ユーザーは追跡やプロファイリングの対象になりません。**"

## 1. SearXNGの設定

Sage WebUIで最適に使用するためにSearXNGを設定するには、以下の手順に従ってください：

**手順1: SearXNG Dockerを`git clone`し、フォルダに移動します：**

1. 新しいディレクトリ`searxng-docker`を作成します

searxng-dockerリポジトリをクローンします。このフォルダにはSearXNGの設定ファイルが含まれます。設定手順については[SearXNGドキュメント](https://docs.searxng.org/)を参照してください。

```bash
git clone https://github.com/searxng/searxng-docker.git
```

`searxng-docker`リポジトリに移動します：

```bash
cd searxng-docker
```

**手順2: `.env`ファイルを探して変更します：**

1. `.env`ファイルから`SEARXNG_HOSTNAME`のコメントを解除し、適切に設定します：

```bash
# By default listen on https://localhost
# To change this:
# * uncomment SEARXNG_HOSTNAME, and replace <host> by the SearXNG hostname
# * uncomment LETSENCRYPT_EMAIL, and replace <email> by your email (require to create a Let's Encrypt certificate)

SEARXNG_HOSTNAME=localhost:8080/
# LETSENCRYPT_EMAIL=<email>

# Optional:
# If you run a very small or a very large instance, you might want to change the amount of used uwsgi workers and threads per worker
# More workers (= processes) means that more search requests can be handled at the same time, but it also causes more resource usage

# SEARXNG_UWSGI_WORKERS=4
# SEARXNG_UWSGI_THREADS=4
```

**手順3: `docker-compose.yaml`ファイルを変更します**

3. `docker-compose.yaml`ファイルを変更して`localhost`制限を解除します：

```bash
sed -i "s/127.0.0.1:8080/0.0.0.0:8080/"
```

**手順4: 必要な権限を付与します**

4. ルートディレクトリで以下のコマンドを実行し、コンテナが新しい設定ファイルを作成できるようにします：

```bash
sudo chmod a+rwx searxng-docker/searxng
```

**手順5: 制限の少ない`limiter.toml`ファイルを作成します**

5. 制限の少ない`searxng-docker/searxng/limiter.toml`設定ファイルを作成します：

<details>
<summary>searxng-docker/searxng/limiter.toml</summary>

```bash
# This configuration file updates the default configuration file
# See https://github.com/searxng/searxng/blob/master/searx/botdetection/limiter.toml

[botdetection.ip_limit]
# activate link_token method in the ip_limit method
link_token = false

[botdetection.ip_lists]
block_ip = []
pass_ip = []
```

</details>

**手順6: デフォルトの`settings.yml`ファイルを削除します**

6. 既存のデフォルト`searxng-docker/searxng/settings.yml`ファイルを削除します（存在する場合）。SearXNGの初回起動時に再生成されます：

```bash
rm searxng-docker/searxng/settings.yml
```

**手順7: 新しい`settings.yml`ファイルを作成します**

:::note
初回実行時には、`searxng`サービスが`/etc/searxng/uwsgi.ini`を正常に作成できるように、`docker-compose.yaml`ファイルから`cap_drop: - ALL`を削除する必要があります。これは、`cap_drop: - ALL`ディレクティブがすべての機能（`uwsgi.ini`ファイルの作成に必要な機能も含む）を削除するためです。初回実行後は、セキュリティ上の理由から`docker-compose.yaml`ファイルに`cap_drop: - ALL`を再追加してください。
:::

7. コンテナを一時的に起動し、新しいsettings.ymlファイルを生成します：

```bash
docker compose up -d ; sleep 10 ; docker compose down
```

**手順8: フォーマットを追加し、ポート番号を更新します**

8. `searxng-docker/searxng/settings.yml`ファイルにHTMLとJSONフォーマットを追加します：

```bash
sed -i 's/formats: \[\"html\"\/]/formats: [\"html\", \"json\"]/' searxng-docker/searxng/settings.yml
```

SearXNGインスタンスの秘密鍵を生成します：

```bash
sed -i "s|ultrasecretkey|$(openssl rand -hex 32)|g" searxng-docker/searxng/settings.yml
```

Windowsユーザーは、以下のPowerShellスクリプトを使用して秘密鍵を生成できます：

```powershell
$randomBytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($randomBytes)
$secretKey = -join ($randomBytes | ForEach-Object { "{0:x2}" -f $_ })
(Get-Content searxng-docker/searxng/settings.yml) -replace 'ultrasecretkey', $secretKey | Set-Content searxng-docker/searxng/settings.yml
```

ポート番号を`server`セクションで先に設定した値（この例では`8080`）に更新します：

```bash
sed -i 's/port: 8080/port: 8080/' searxng-docker/searxng/settings.yml
```

必要に応じて`bind_address`を変更します：

```bash
sed -i 's/bind_address: "0.0.0.0"/bind_address: "127.0.0.1"/' searxng-docker/searxng/settings.yml
```

#### 設定ファイル

#### searxng-docker/searxng/settings.yml（抜粋）

デフォルトの`settings.yml`ファイルには多くのエンジン設定が含まれています。以下はデフォルトの`settings.yml`ファイルの抜粋例です：

<details>
<summary>searxng-docker/searxng/settings.yml</summary>

```yaml
# see https://docs.searxng.org/admin/settings/settings.html#settings-use-default-settings
use_default_settings: true

server:
  # base_url is defined in the SEARXNG_BASE_URL environment variable, see .env and docker-compose.yml
  secret_key: "ultrasecretkey"  # change this!
  limiter: true  # can be disabled for a private instance
  image_proxy: true
  port: 8080
  bind_address: "0.0.0.0"

ui:
  static_use_hash: true

search:
  safe_search: 0
  autocomplete: ""
  default_lang: ""
  formats:
    - html
    - json # json is required
  # remove format to deny access, use lower case.
  # formats: [html, csv, json, rss]
redis:
  # URL to connect redis database. Is overwritten by ${SEARXNG_REDIS_URL}.
  # https://docs.searxng.org/admin/settings/settings_redis.html#settings-redis
  url: redis://redis:6379/0
```

The port in the settings.yml file for SearXNG should match that of the port number in your docker-compose.yml file for SearXNG.

</details>

**ステップ9：`uwsgi.ini`ファイルの更新**

9. `searxng-docker/searxng/uwsgi.ini`ファイルが以下の内容と一致していることを確認します：

<details>
<summary>searxng-docker/searxng/uwsgi.ini</summary>

```ini
[uwsgi]
# Who will run the code
uid = searxng
gid = searxng

# Number of workers (usually CPU count)
# default value: %k (= number of CPU core, see Dockerfile)
workers = %k

# Number of threads per worker
# default value: 4 (see Dockerfile)
threads = 4

# The right granted on the created socket
chmod-socket = 666

# Plugin to use and interpreter config
single-interpreter = true
master = true
plugin = python3
lazy-apps = true
enable-threads = 4

# Module to import
module = searx.webapp

# Virtualenv and python path
pythonpath = /usr/local/searxng/
chdir = /usr/local/searxng/searx/

# automatically set processes name to something meaningful
auto-procname = true

# Disable request logging for privacy
disable-logging = true
log-5xx = true

# Set the max size of a request (request-body excluded)
buffer-size = 8192

# No keep alive
# See https://github.com/searx/searx-docker/issues/24
add-header = Connection: close

# uwsgi serves the static files
static-map = /static=/usr/local/searxng/searx/static
# expires set to one day
static-expires = /* 86400
static-gzip-all = True
offload-threads = 4
```

</details>

## 2. 代替セットアップ

別の方法として、デフォルト設定を変更したくない場合は、空の`searxng-docker`フォルダを作成し、残りのセットアップ手順に従うこともできます。

### Docker Composeセットアップ

Sage WebUIの`docker-compose.yaml`ファイルに以下の環境変数を追加します：

```yaml
services:
  sage-open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "searxng"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
      SEARXNG_QUERY_URL: "http://searxng:8080/search?q=<query>"
```

SearXNG用の`.env`ファイルを作成します：

```
# SearXNG
SEARXNG_HOSTNAME=localhost:8080/
```

次に、SearXNGの`docker-compose.yaml`ファイルに以下を追加します：

```yaml
services:
  searxng:
    container_name: searxng
    image: searxng/searxng:latest
    ports:
      - "8080:8080"
    volumes:
      - ./searxng:/etc/searxng:rw
    env_file:
      - .env
    restart: unless-stopped
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETGID
      - SETUID
      - DAC_OVERRIDE
    logging:
      driver: "json-file"
      options:
        max-size: "1m"
        max-file: "1"
```

スタックは以下のコマンドで起動できます：

```bash
docker compose up -d
```

:::note
初回実行時は、`searxng`サービスが`/etc/searxng/uwsgi.ini`を正常に作成できるように、`docker-compose.yaml`ファイルから`cap_drop: - ALL`を削除する必要があります。これは`cap_drop: - ALL`ディレクティブが`uwsgi.ini`ファイル作成に必要な機能も削除してしまうためです。初回実行後はセキュリティ上の理由から`docker-compose.yaml`ファイルに`cap_drop: - ALL`を再追加してください。
:::

あるいは、`docker run`で直接SearXNGを実行することもできます：

```bash
docker run --name searxng --env-file .env -v ./searxng:/etc/searxng:rw -p 8080:8080 --restart unless-stopped --cap-drop ALL --cap-add CHOWN --cap-add SETGID --cap-add SETUID --cap-add DAC_OVERRIDE --log-driver json-file --log-opt max-size=1m --log-opt max-file=1 searxng/searxng:latest
```

## 3. 接続確認

コマンドラインインターフェースから、Sage WebUIコンテナインスタンスがSearXNGに接続できることを確認します：

```bash
docker exec -it sage-open-webui curl http://host.docker.internal:8080/search?q=this+is+a+test+query&format=json
```

## 4. GUI設定

1. `管理パネル` → `設定` → `ウェブ検索`に移動
2. `ウェブ検索を有効化`をトグル
3. ドロップダウンメニューから`ウェブ検索エンジン`を`searxng`に設定
4. `SearxngクエリURL`に以下のいずれかの例を設定：

* `http://searxng:8080/search?q=<query>`（コンテナ名と公開ポートを使用、Dockerベースのセットアップに適しています）
* `http://host.docker.internal:8080/search?q=<query>`（`host.docker.internal`DNS名とホストポートを使用、Dockerベースのセットアップに適しています）
* `http://<searxng.local>/search?q=<query>`（ローカルドメイン名を使用、ローカルネットワークアクセスに適しています）
* `https://<search.domain.com>/search?q=<query>`（SearXNGインスタンス用のカスタムドメイン名を使用、パブリックまたはプライベートアクセスに適しています）

**`/search?q=<query>`の部分は必須ですので注意してください。**
5. `検索結果数`と`同時リクエスト数`の値を適宜調整
6. 変更を保存

![SearXNG GUI設定](/images/tutorial_searxng_config.png)

## 5. チャットでのウェブ検索の使用

ウェブ検索にアクセスするには、メッセージ入力フィールド横の+ボタンをクリックします。

ここではWeb検索のオン/オフを切り替えることができます。

![Web検索UIトグル](/images/web_search_toggle.png)

これらの手順に従うことで、Sage WebUIでSearXNGをセットアップし、SearXNGエンジンを使用したWeb検索を有効にすることができます。

#### 注意

チャットごとに明示的にオン/オフを切り替える必要があります。

これはセッションごとに有効化されるため、ページの再読み込みや別のチャットへの切り替えを行うとオフになります。

## Google PSE API

### セットアップ

1. Google Developersにアクセスし、[Programmable Search Engine](https://developers.google.com/custom-search)を使用してログインまたはアカウントを作成します。
2. [コントロールパネル](https://programmablesearchengine.google.com/controlpanel/all)に移動し、`追加`ボタンをクリックします。
3. 検索エンジン名を入力し、必要に応じて他のプロパティを設定し、ロボットでないことを確認して`作成`ボタンをクリックします。
4. `APIキー`を生成し、`検索エンジンID`を取得します（エンジン作成後に利用可能）。
5. `APIキー`と`検索エンジンID`を使用して、`Sage WebUI管理パネル`を開き、`設定`タブをクリックしてから`Web検索`をクリックします。
6. `Web検索`を有効にし、`Web検索エンジン`を`google_pse`に設定します。
7. `Google PSE APIキー`に`APIキー`を、`Google PSEエンジンID`に（手順4で取得した）IDを入力します。
8. `保存`をクリックします。

![Sage WebUI管理パネル](/images/tutorial_google_pse1.png)

#### 注意

プロンプトフィールドでプラス（`+`）ボタンを使用して`Web検索`を有効にする必要があります。
Webを検索しましょう;-)

![Web検索を有効にする](/images/tutorial_google_pse2.png)

## Brave API

### Docker Composeセットアップ

Sage WebUIの`docker-compose.yaml`ファイルに以下の環境変数を追加します：

```yaml
services:
  sage-open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "brave"
      BRAVE_SEARCH_API_KEY: "YOUR_API_KEY"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
```

## Mojeek Search API

### セットアップ

1. [Mojeek Search APIページ](https://www.mojeek.com/services/search/web-search-api/)にアクセスして`APIキー`を取得してください。
2. `APIキー`を使用して、`Sage WebUI管理パネル`を開き、`設定`タブをクリックしてから`Web検索`をクリックします。
3. `Web検索`を有効にし、`Web検索エンジン`を`mojeek`に設定します。
4. `Mojeek Search APIキー`に`APIキー`を入力します。
5. `保存`をクリックします。

### Docker Composeセットアップ

Sage WebUIの`docker-compose.yaml`ファイルに以下の環境変数を追加します：

```yaml
services:
  sage-open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "mojeek"
      BRAVE_SEARCH_API_KEY: "YOUR_MOJEEK_API_KEY"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
```

## SearchApi API

[SearchApi](https://searchapi.io)はリアルタイムSERP APIのコレクションです。`organic_results`を返す既存または今後のSERPエンジンがサポートされています。デフォルトのWeb検索エンジンは`google`ですが、`bing`、`baidu`、`google_news`、`bing_news`、`google_scholar`、`google_patents`などに変更できます。

### セットアップ

1. [SearchApi](https://searchapi.io)にアクセスし、ログインまたは新規アカウントを作成します。
2. `ダッシュボード`に移動し、APIキーをコピーします。
3. コピーした`APIキー`を使用して、`Sage WebUI 管理パネル`を開き、`設定`タブをクリックしてから`Web検索`を選択します。
4. `Web検索`を有効にし、`Web検索エンジン`を`searchapi`に設定します。
5. `SearchApi APIキー`フィールドに、[SearchApi](https://www.searchapi.io/)ダッシュボードからコピーしたAPIキーを入力します。
6. [オプション] クエリを実行したい`SearchApiエンジン`名を入力します。例: `google`、`bing`、`baidu`、`google_news`、`bing_news`、`google_videos`、`google_scholar`、`google_patents`。デフォルトは`google`に設定されています。
7. `保存`をクリックします。

![Sage WebUI 管理パネル](/images/tutorial_searchapi_search.png)

#### 注意

[SearchApi](https://www.searchapi.io/)エンジンを使用してWeb検索を行うには、プロンプトフィールドで`Web検索`を有効にする必要があります（`+`ボタンを使用）。

![Web検索を有効にする](/images/enable_web_search.png)

## Kagi API

近日公開予定

### セットアップ

## Serpstack API

近日公開予定

### セットアップ

## Serper API

近日公開予定

### セットアップ

## Serply API

近日公開予定

### セットアップ

## DuckDuckGo API

### セットアップ

Sage WebUIの組み込みWeb検索でDuckDuckGo APIを使用するためにセットアップは不要です！DuckDuckGoはSage WebUIでそのまま動作します。

:::note
Web検索がレート制限される可能性があります。
:::

## Tavily API

近日公開予定

### セットアップ

## Jina API

近日公開予定

### セットアップ

## Bing API

### セットアップ

1. [Azureポータル](https://portal.azure.com/#create/Microsoft.BingSearch)にアクセスし、新しいリソースを作成します。作成後、リソース概要ページにリダイレクトされます。そこで「キーを管理するにはここをクリック」を選択します。 ![キー管理画面へのリンク](https://github.com/user-attachments/assets/dd2a3c67-d6a7-4198-ba54-67a3c8acff6d)
2. キー管理ページでKey1またはKey2を探し、使用したいキーをコピーします。
3. Sage WebUI管理パネルを開き、設定タブに切り替えてからWeb検索を選択します。
4. Web検索オプションを有効にし、Web検索エンジンをbingに設定します。
5. `SearchApi APIキー`フィールドに、[Azureポータル](https://portal.azure.com/#create/Microsoft.BingSearch)ダッシュボードからコピーしたAPIキーを入力します。
6. `保存`をクリックします。