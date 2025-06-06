---
sidebar_position: 1
title: "🗨️  Configuration"
---

Open Web UIは、ローカル、ブラウザ、およびリモートの音声テキスト変換をサポートしています。

![alt text](/images/tutorials/stt/image.png)

![alt text](/images/tutorials/stt/stt-providers.png)

## クラウド/リモート音声テキスト変換プロバイダー

現在サポートされているクラウド音声テキスト変換プロバイダーは以下の通りです。APIキーは環境変数（OpenAI）または管理者設定ページ（両方のキー）で設定できます。

| Service  | API Key Required |
 | ------------- | ------------- |
 | OpenAI  | ✅ |
 | DeepGram  | ✅ |

WebAPIは、組み込みのブラウザSTTプロバイダーを介してSTTを提供します。

## STTプロバイダーの設定

音声テキスト変換プロバイダーを設定するには:

- 管理者設定に移動  
- 「Audio」を選択
- APIキーを入力し、ドロップダウンからモデルを選択

![alt text](/images/tutorials/stt/stt-config.png)

## ユーザーレベル設定

管理者パネルで設定されたインスタンス設定に加えて、追加機能を提供するユーザーレベル設定もいくつかあります。

*   **STT設定:** 音声テキスト変換機能に関連する設定が含まれます。
*   **音声テキスト変換エンジン:** 音声認識に使用するエンジンを決定します（デフォルトまたはWeb API）。

![alt text](/images/tutorials/stt/user-settings.png)

## STTの使用

音声テキスト変換は、音声を使用してプロンプトを「書く」非常に効率的な方法を提供し、デスクトップとモバイルデバイスの両方で堅牢に動作します。

STTを使用するには、マイクアイコンをクリックします:

![alt text](/images/tutorials/stt/stt-operation.png)

ライブオーディオ波形は、音声の正常なキャプチャを示します:

![alt text](/images/tutorials/stt/stt-in-progress.png)

## STTモードの操作

録音を開始した後、次のことができます:

- チェックアイコンをクリックして録音を保存（完了後に自動送信が有効な場合は完了のために送信されます。それ以外の場合は手動で送信できます）
- 録音を中止したい場合（例えば、新しい録音を開始したい場合）、「x」アイコンをクリックして録音インターフェースを終了できます

![alt text](/images/tutorials/stt/endstt.png)