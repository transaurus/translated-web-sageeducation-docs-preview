---
sidebar_position: 2
title: "🐍 Python Code Execution"
---

# 🐍 Pythonコード実行

## 概要

Sage WebUIでは、Pyodideを使用してブラウザ内でPythonコードのクライアントサイド実行が可能です。この機能により、大規模言語モデル（LLM）が生成したPythonスクリプトをブラウザ内で直接実行でき、Pyodideがサポートする様々なライブラリを活用できます。

ユーザーのプライバシーと柔軟性を保つため、Sage WebUIはPyPIパッケージをミラーリングし、外部ネットワークへの直接リクエストを回避しています。このアプローチにより、インターネット接続がない環境でもPyodideを使用できます。

Sage WebUIのフロントエンドには、Pyodideによって動作する自己完結型のWASM（WebAssembly）Python環境が含まれており、LLMが生成した基本的なPythonスクリプトを実行できます。この環境は使いやすさを重視して設計されており、追加のセットアップやインストールは不要です。

## サポートされているライブラリ

Pyodideのコード実行は、scripts/prepare-pyodide.jsで設定され、"CodeBlock.svelte"に追加されたパッケージのみを読み込むように構成されています。現在Sage WebUIでサポートされているPyodideパッケージは以下の通りです：

* micropip
* packaging
* requests
* beautifulsoup4
* numpy
* pandas
* matplotlib
* scikit-learn
* scipy
* regex

これらのライブラリは、データ操作、機械学習、ウェブスクレイピングなど、さまざまなタスクに使用できます。使用したいパッケージがSage WebUIに同梱されているPyodideにコンパイルされていない場合、そのパッケージは使用できません。

## Pythonコード実行の呼び出し

Pythonコードを実行するには、チャット内でLLMにPythonスクリプトの作成を依頼してください。LLMがコードを生成すると、コードブロックの右上に`実行`ボタンが表示されます。このボタンをクリックすると、Pyodideを使用してコードが実行されます。コードブロックの下部に結果を表示するには、コード内に少なくとも1つのprint文を含めてください。

## Pythonコード実行の使用上のヒント

* Pythonコードを書く際は、実行時にPyodide環境で動作することを念頭に置いてください。LLMにコードを依頼する際に「Pyodide環境」と明記することで、これを伝えることができます。
* Pyodideのドキュメントを調べて、環境の機能と制限を理解してください。
* さまざまなライブラリやスクリプトを試して、Sage WebUIでのPythonコード実行の可能性を探ってください。

## Pyodideドキュメント

* [Pyodideドキュメント](https://pyodide.org/en/stable/)

## コード例

以下は、Pyodideを使用して実行できる簡単なPythonスクリプトの例です：

```python
import pandas as pd

# Create a sample DataFrame
data = {'Name': ['John', 'Anna', 'Peter'], 
        'Age': [28, 24, 35]}
df = pd.DataFrame(data)

# Print the DataFrame
print(df)
```

このスクリプトは、pandasを使用してサンプルのDataFrameを作成し、チャット内のコードブロックの下にそれを表示します。

## サポートライブラリリストの拡張

さらに可能性を広げたいですか？サポートされているライブラリのリストを拡張するには、以下の手順に従ってください：

1. **Pyodideリポジトリをフォーク**して独自のバージョンを作成します。
2. **新しいパッケージを選択**します。Pyodide内の既存のパッケージリストから選ぶか、Sage WebUIに現在不足している高品質なパッケージを探します。
3. **新しいパッケージを統合**して、さらに多くの可能性を解き放ちます。