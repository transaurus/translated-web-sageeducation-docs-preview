---
sidebar_position: 11
title: "🖥️ Local LLM Setup with IPEX-LLM on Intel GPU"
---

:::warning
このチュートリアルはコミュニティによる貢献であり、Sage WebUIチームによるサポートはありません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。貢献したい場合は、コントリビューションガイドをご覧ください。
:::

:::note
このガイドは、[手動インストール](/getting-started/index.md)でセットアップしたSage WebUIで検証されています。
:::

# Intel GPUでのIPEX-LLMを用いたローカルLLMセットアップ

:::info
[**IPEX-LLM**](https://github.com/intel-analytics/ipex-llm)は、Intel CPUおよびGPU（例：iGPU搭載のローカルPC、Arc Aシリーズ、Flex、MaxなどのディスクリートGPU）上でLLMを非常に低遅延で実行するためのPyTorchライブラリです。
:::

このチュートリアルでは、**Intel GPU上でホストされたIPEX-LLM加速Ollamaバックエンド**を使用してSage WebUIをセットアップする方法を説明します。このガイドに従うことで、低コストのPC（例：統合GPUのみ搭載）でもスムーズな体験でSage WebUIをセットアップできます。

## Intel GPUでのOllamaサーバーの起動

Intel GPU上でIPEX-LLMによって加速されたOllamaサーバーのインストールと実行方法については、IPEX-LLM公式ドキュメントの[このガイド](https://ipex-llm.readthedocs.io/en/latest/doc/LLM/Quickstart/ollama_quickstart.html)を参照してください。

:::tip
別のマシンからOllamaサービスにアクセスしたい場合は、`ollama serve`コマンドを実行する前に環境変数`OLLAMA_HOST=0.0.0.0`を設定またはエクスポートしてください。
:::

## Sage WebUIの設定

メニューの**設定 -> 接続**からOllama設定にアクセスします。デフォルトでは、**OllamaベースURL**はhttps://localhost:11434に設定されています（以下のスナップショット参照）。Ollamaサービス接続の状態を確認するには、テキストボックスの横にある**更新ボタン**をクリックします。WebUIがOllamaサーバーに接続できない場合、`WebUI could not connect to Ollama`というエラーメッセージが表示されます。

![Sage WebUI Ollama設定失敗](https://llm-assets.readthedocs.io/en/latest/_images/open_webui_settings_0.png)

接続が成功した場合、以下のように`Service Connection Verified`というメッセージが表示されます。

![Sage WebUI Ollama設定成功](https://llm-assets.readthedocs.io/en/latest/_images/open_webui_settings.png)

:::tip
別のURLでホストされているOllamaサーバーを使用したい場合は、**OllamaベースURL**を新しいURLに更新し、**更新**ボタンを押してOllamaへの接続を再確認してください。
:::