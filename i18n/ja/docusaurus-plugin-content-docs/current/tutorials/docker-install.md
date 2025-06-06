---
sidebar_position: 4
title: 🐳 Installing Docker
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage WebUIチームによるサポートはありません。特定のユースケースに合わせてSage WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？寄稿ガイドをチェックしてください。
:::

# Dockerのインストール

## WindowsおよびMacユーザー向け

- [Docker公式サイト](https://www.docker.com/products/docker-desktop)からDocker Desktopをダウンロードします。
- サイトの指示に従ってインストールします。
- インストール後、**Docker Desktopを起動**して正常に動作することを確認してください。

---

## Ubuntuユーザー向け

1. **ターミナルを開きます。**

2. **Dockerのaptリポジトリを設定します:**

   ```bash
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

:::note
**Ubuntu派生ディストリビューション**（例: Linux Mint）を使用している場合は、`VERSION_CODENAME`の代わりに`UBUNTU_CODENAME`を使用してください。
:::

3. **Docker Engineをインストールします:**

   ```bash
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
   ```

4. **Dockerのインストールを確認します:**

   ```bash
   sudo docker run hello-world
   ```

---

## その他のLinuxディストリビューション向け

その他のLinuxディストリビューションについては、[Docker公式ドキュメント](https://docs.docker.com/engine/install/)を参照してください。

---

## Ollamaのインストールと確認

1. [https://ollama.com/](https://ollama.com/)から**Ollamaをダウンロード**します。

2. **Ollamaのインストールを確認します:**
   - ブラウザを開き、次のURLにアクセスします:
     [http://127.0.0.1:11434/](http://127.0.0.1:11434/)。
   - 注: ポート番号はインストール環境によって異なる場合があります。