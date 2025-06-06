---
sidebar_position: 4000
title: "🪶 Apache Tika Extraction"
---

:::warning
このチュートリアルはコミュニティによる貢献であり、Sage WebUIチームによるサポート対象外です。特定のユースケース向けにSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。貢献したい方は、コントリビューションガイドをご確認ください。
:::

## 🪶 Apache Tika抽出機能

このドキュメントでは、Apache TikaをSage WebUIと統合する手順を段階的に説明します。Apache Tikaは、1,000種類以上のファイル形式からメタデータとテキストコンテンツを検出・抽出できるコンテンツ分析ツールキットです。すべてのファイル形式を単一のインターフェースで解析できるため、検索エンジンのインデックス作成、コンテンツ分析、翻訳などに非常に有用です。

前提条件
------------

* Sage WebUIインスタンス
* システムにDockerがインストール済み
* Sage WebUI用のDockerネットワークが設定済み

統合手順
----------------

### ステップ1: Docker Composeファイルの作成またはApache Tika用Dockerコマンドの実行

Apache Tikaを実行する方法は2つあります:

**オプション1: Docker Composeを使用**

Sage WebUIインスタンスと同じディレクトリに`docker-compose.yml`という名前の新しいファイルを作成し、以下の設定を追加します:

```yml
services:
  tika:
    image: apache/tika:latest-full
    container_name: tika
    ports:
      - "9998:9998"
    restart: unless-stopped
```

以下のコマンドでDocker Composeファイルを実行します:

```bash
docker-compose up -d
```

**オプション2: Docker Runコマンドを使用**

または、以下のDockerコマンドでApache Tikaを実行できます:

```bash
docker run -d --name tika \
  -p 9998:9998 \
  --restart unless-stopped \
  apache/tika:latest-full
```

Docker runコマンドを使用する場合、Sage WebUIインスタンスと同じネットワークでコンテナを実行したい場合は`--network`フラグを指定する必要があります。

### ステップ2: Sage WebUIでApache Tikaを使用するように設定

Sage WebUIでApache Tikaをコンテキスト抽出エンジンとして使用するには、以下の手順に従います:

* Sage WebUIインスタンスにログイン
* `Admin Panel`設定メニューに移動
* `Settings`をクリック
* `Documents`タブをクリック
* `Default`コンテンツ抽出エンジンのドロップダウンを`Tika`に変更
* コンテキスト抽出エンジンのURLを`http://tika:9998`に更新
* 変更を保存

Docker環境でのApache Tika検証
=====================================

Docker環境でApache Tikaが正しく動作していることを確認するには、以下の手順に従います:

### 1. Apache Tika Dockerコンテナの起動

まず、Apache Tika Dockerコンテナが実行されていることを確認します。以下のコマンドで起動できます:

```bash
docker run -p 9998:9998 apache/tika
```

このコマンドはApache Tikaコンテナを起動し、コンテナのポート9998をローカルマシンのポート9998にマッピングします。

### 2. サーバーの動作確認

GETリクエストを送信してApache Tikaサーバーが動作していることを確認できます:

```bash
curl -X GET http://localhost:9998/tika
```

このコマンドは以下の応答を返すはずです:

```
This is Tika Server. Please PUT
```

### 3. 統合の検証

別の方法として、ファイルを送信して解析することで統合をテストすることもできます。`curl`コマンドを使用してファイルを送信し、Apache Tikaをテストできます:

```bash
curl -T test.txt http://localhost:9998/tika
```

`test.txt`をローカルマシン上のテキストファイルのパスに置き換えてください。

Apache Tikaはファイルの検出されたメタデータとコンテンツタイプを応答として返します。

### Apache Tika検証用スクリプトの使用

検証プロセスを自動化したい場合、このスクリプトはファイルをApache Tikaに送信し、期待されるメタデータがレスポンスに含まれているかをチェックします。メタデータが存在する場合、スクリプトは成功メッセージとファイルのメタデータを出力します。そうでない場合は、エラーメッセージとApache Tikaからのレスポンスを出力します。

```python
import requests

def verify_tika(file_path, tika_url):
    try:
        # Send the file to Apache Tika and verify the output
        response = requests.put(tika_url, files={'file': open(file_path, 'rb')})

        if response.status_code == 200:
            print("Apache Tika successfully analyzed the file.")
            print("Response from Apache Tika:")
            print(response.text)
        else:
            print("Error analyzing the file:")
            print(f"Status code: {response.status_code}")
            print(f"Response from Apache Tika: {response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    file_path = "test.txt"  # Replace with the path to your file
    tika_url = "http://localhost:9998/tika"

    verify_tika(file_path, tika_url)
```

スクリプトの実行手順:

### 前提条件

* システムにPython 3.xがインストールされていること
* `requests`ライブラリがインストールされていること（`pip install requests`でインストール可能）
* Apache TikaのDockerコンテナが実行されていること（`docker run -p 9998:9998 apache/tika`コマンドを使用）
* `"test.txt"`をApache Tikaに送信したいファイルのパスに置き換えること

### スクリプトの実行

1. スクリプトを`verify_tika.py`として保存（NotepadやSublime Textなどのテキストエディタを使用）
2. ターミナルまたはコマンドプロンプトを開く
3. スクリプトを保存したディレクトリに移動（`cd`コマンドを使用）
4. 次のコマンドでスクリプトを実行: `python verify_tika.py`
5. スクリプトはApache Tikaが正しく動作しているかどうかを示すメッセージを出力します

注意: 問題が発生した場合は、Apache Tikaコンテナが正しく実行されていること、およびファイルが正しいURLに送信されていることを確認してください。

### まとめ

これらの手順に従うことで、Docker環境でApache Tikaが正しく動作していることを確認できます。ファイルを送信して分析をテストしたり、GETリクエストでサーバーが実行されていることを確認したり、スクリプトを使用してプロセスを自動化したりすることができます。問題が発生した場合は、Apache Tikaコンテナが正しく実行されていること、およびファイルが正しいURLに送信されていることを確認してください。

トラブルシューティング
--------------

* Apache Tikaサービスが実行されており、Sage WebUIインスタンスからアクセス可能であることを確認してください。
* Dockerログをチェックし、Apache Tikaサービスに関連するエラーや問題がないか確認してください。
* Sage WebUIでコンテキスト抽出エンジンのURLが正しく設定されていることを確認してください。

統合の利点
----------------------

Apache TikaとSage WebUIを統合することで、以下のような利点があります:

* **メタデータ抽出の改善**: Apache Tikaの高度なメタデータ抽出機能により、ファイルから正確で関連性の高いデータを抽出できます。
* **複数ファイル形式のサポート**: Apache Tikaは幅広いファイル形式をサポートしており、多様なファイルタイプを扱う組織に最適なソリューションです。
* **コンテンツ分析の強化**: Apache Tikaの高度なコンテンツ分析機能により、ファイルから価値ある洞察を抽出できます。

結論
----------

Apache TikaとSage WebUIの統合は簡単なプロセスであり、Sage WebUIインスタンスのメタデータ抽出機能を向上させることができます。このドキュメントで説明した手順に従うことで、Sage WebUIのコンテキスト抽出エンジンとしてApache Tikaを簡単にセットアップできます。