---
sidebar_position: 1000
title: "💾 Backups"
---

:::warning
このチュートリアルはコミュニティによる寄稿であり、Sage Open WebUIチームによるサポート対象外です。特定のユースケース向けにSage Open WebUIをカスタマイズする方法のデモンストレーションとして提供されています。寄稿をご希望ですか？寄稿ガイドをご確認ください。
:::

# インスタンスのバックアップ

データ消失は誰も望みません！

OpenWebUIをセルフホスティングしている場合、設定内容のセカンドコピーやサードコピーを保持するため、何らかの正式なバックアップ計画を策定することをお勧めします。

本ガイドでは、ユーザーがそれを行うための基本的な推奨事項を紹介します。

本ガイドは、ユーザーがDocker経由でOpenWebUIをインストール済み（またはインストール予定）であることを前提としています。

## データ永続性の確保

まず、Dockerでスタックをデプロイする前に、Docker Composeが永続的なデータストアを使用していることを確認してください。[GitHubリポジトリ](https://github.com/sage-open-webui/sage-open-webui/blob/main/docker-compose.yaml)のDocker Composeを使用している場合は既に対処済みです。ただし、独自のバリエーションを作成する際に確認を忘れないよう注意が必要です。

Dockerコンテナは一時的な存在であり、データをホストファイルシステム上で永続化させる必要があります。

## Dockerボリュームの使用

プロジェクトリポジトリのDocker Composeを使用する場合、Dockerボリュームを使用してOpen Web UIをデプロイすることになります。

OllamaとOpenWebUIのマウントポイントは以下の通りです：

```yaml
ollama:
  volumes:
    - ollama:/root/.ollama
```

```yaml
sage-open-webui:
  volumes:
    - sage-open-webui:/app/backend/data
```

ホスト上の実際のバインドパスを確認するには、以下を実行します：

`docker volume inspect ollama`

および

`docker volume inspect sage-open-webui`

## 直接ホストバインドの使用

一部のユーザーは、以下のようにホストファイルシステムへの直接（固定）バインドでOpen Web UIをデプロイします：

```yaml
services:
  ollama:
    container_name: ollama
    image: ollama/ollama:${OLLAMA_DOCKER_TAG-latest}
    volumes:
      - /opt/ollama:/root/.ollama
  sage-open-webui:
    container_name: sage-open-webui
    image: ghcr.io/sage-open-webui/sage-open-webui:${WEBUI_DOCKER_TAG-main}
    volumes:
      - /opt/sage-open-webui:/app/backend/data
```

この方法でインスタンスをデプロイした場合、ルート上のパスをメモしておく必要があります。

## バックアップジョブのスクリプト化

インスタンスがどのようにプロビジョニングされていても、バックアップ対象のデータを理解するために、サーバー上のアプリケーションデータストアを調査する価値があります。以下のような内容が確認できるはずです：

```
├── audit.log
├── cache/
├── uploads/
├── vector_db/
└── webui.db
```

## 永続データストア内のファイル

| File/Directory | Description |
|---|---|
| `audit.log` | Log file for auditing events. |
| `cache/` | Directory for storing cached data. |
| `uploads/` | Directory for storing user-uploaded files. |
| `vector_db/` | Directory containing the ChromaDB vector database. |
| `webui.db` | SQLite database for persistent storage of other instance data |

# ファイルレベルバックアップのアプローチ

アプリケーションデータをバックアップする最初の方法は、永続的なOpen Web UIデータが適切にバックアップされるように、ファイルレベルのバックアップアプローチを採用することです。

技術サービスをバックアップする方法はほぼ無限に存在しますが、増分バックアップジョブでは`rsync`が依然として人気の選択肢であり、デモンストレーションとして使用されます。

ユーザーは、インスタンスデータ全体を一度にバックアップするために`data`ディレクトリ全体を対象とするか、個々のコンポーネントを対象としたより選択的なバックアップジョブを作成できます。対象に対してより説明的な名前を追加することも可能です。

モデルとなるrsyncジョブは以下のようになります：

```bash
#!/bin/bash

# Configuration
SOURCE_DIR="."  # Current directory (where the file structure resides)
B2_BUCKET="b2://OpenWebUI-backups" # Your Backblaze B2 bucket
B2_PROFILE="your_rclone_profile" # Your rclone profile name
# Ensure rclone is configured with your B2 credentials

# Define source and destination directories
SOURCE_UPLOADS="$SOURCE_DIR/uploads"
SOURCE_VECTORDB="$SOURCE_DIR/vector_db"
SOURCE_WEBUI_DB="$SOURCE_DIR/webui.db"

DEST_UPLOADS="$B2_BUCKET/user_uploads"
DEST_CHROMADB="$B2_BUCKET/ChromaDB"
DEST_MAIN_DB="$B2_BUCKET/main_database"

# Exclude cache and audit.log
EXCLUDE_LIST=(
    "cache/"
    "audit.log"
)

# Construct exclude arguments for rclone
EXCLUDE_ARGS=""
for EXCLUDE in "${EXCLUDE_LIST[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude '$EXCLUDE'"
done

# Function to perform rclone sync with error checking
rclone_sync() {
    SOURCE="$1"
    DEST="$2"
    echo "Syncing '$SOURCE' to '$DEST'..."
    rclone sync "$SOURCE" "$DEST" $EXCLUDE_ARGS --progress --transfers=32 --checkers=16 --profile "$B2_PROFILE"
    if [ $? -ne 0 ]; then
        echo "Error: rclone sync failed for '$SOURCE' to '$DEST'"
        exit 1
    fi
}

# Perform rclone sync for each directory/file
rclone_sync "$SOURCE_UPLOADS" "$DEST_UPLOADS"
rclone_sync "$SOURCE_VECTORDB" "$DEST_CHROMADB"
rclone_sync "$SOURCE_WEBUI_DB" "$DEST_MAIN_DB"

echo "Backup completed successfully."
exit 0
```

## コンテナ中断を伴うRsyncジョブ

データ整合性を維持するため、一般的にはコールドファイルシステム上でデータベースバックアップを実行することが推奨されます。デフォルトのモデルバックアップジョブを少し修正し、バックアップスクリプト実行前にスタックを停止させ、完了後に再起動するようにできます。

このアプローチの欠点は、当然ながらインスタンスのダウンタイムが発生することです。インスタンスを使用しない時間帯にジョブを実行するか、「ソフトウェア」デイリー（稼働中のデータ）とより堅牢なウィークリー（コールドデータ）を組み合わせることを検討してください。

```bash
#!/bin/bash

# Configuration
COMPOSE_FILE="docker-compose.yml" # Path to your docker-compose.yml file
B2_BUCKET="b2://OpenWebUI-backups" # Your Backblaze B2 bucket
B2_PROFILE="your_rclone_profile" # Your rclone profile name
SOURCE_DIR="."  # Current directory (where the file structure resides)

# Define source and destination directories
SOURCE_UPLOADS="$SOURCE_DIR/uploads"
SOURCE_VECTORDB="$SOURCE_DIR/vector_db"
SOURCE_WEBUI_DB="$SOURCE_DIR/webui.db"

DEST_UPLOADS="$B2_BUCKET/user_uploads"
DEST_CHROMADB="$B2_BUCKET/ChromaDB"
DEST_MAIN_DB="$B2_BUCKET/main_database"

# Exclude cache and audit.log
EXCLUDE_LIST=(
    "cache/"
    "audit.log"
)

# Construct exclude arguments for rclone
EXCLUDE_ARGS=""
for EXCLUDE in "${EXCLUDE_LIST[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude '$EXCLUDE'"
done

# Function to perform rclone sync with error checking
rclone_sync() {
    SOURCE="$1"
    DEST="$2"
    echo "Syncing '$SOURCE' to '$DEST'..."
    rclone sync "$SOURCE" "$DEST" $EXCLUDE_ARGS --progress --transfers=32 --checkers=16 --profile "$B2_PROFILE"
    if [ $? -ne 0 ]; then
        echo "Error: rclone sync failed for '$SOURCE' to '$DEST'"
        exit 1
    fi
}

# 1. Stop the Docker Compose environment
echo "Stopping Docker Compose environment..."
docker-compose -f "$COMPOSE_FILE" down

# 2. Perform the backup
echo "Starting backup..."
rclone_sync "$SOURCE_UPLOADS" "$DEST_UPLOADS"
rclone_sync "$SOURCE_VECTORDB" "$DEST_CHROMADB"
rclone_sync "$SOURCE_WEBUI_DB" "$DEST_MAIN_DB"

# 3. Start the Docker Compose environment
echo "Starting Docker Compose environment..."
docker-compose -f "$COMPOSE_FILE" up -d

echo "Backup completed successfully."
exit 0
```

## SQLite & ChromaDB バックアップ機能を使用したB2リモートへのモデルバックアップスクリプト

```bash
#!/bin/bash
#
# Backup script to back up ChromaDB and SQLite to Backblaze B2 bucket
# openwebuiweeklies, maintaining 3 weekly snapshots.
# Snapshots are independent and fully restorable.
# Uses ChromaDB and SQLite native backup mechanisms.
# Excludes audit.log, cache, and uploads directories.
#
# Ensure rclone is installed and configured correctly.
# Install rclone: https://rclone.org/install/
# Configure rclone: https://rclone.org/b2/

# Source directory (containing ChromaDB and SQLite data)
SOURCE="/var/lib/sage-open-webui/data"

# B2 bucket name and remote name
B2_REMOTE="openwebuiweeklies"
B2_BUCKET="b2:$B2_REMOTE"

# Timestamp for the backup directory
TIMESTAMP=$(date +%Y-%m-%d)

# Backup directory name
BACKUP_DIR="sage-open-webui-backup-$TIMESTAMP"

# Full path to the backup directory in the B2 bucket
DESTINATION="$B2_BUCKET/$BACKUP_DIR"

# Number of weekly snapshots to keep
NUM_SNAPSHOTS=3

# Exclude filters (applied *after* database backups)
EXCLUDE_FILTERS="--exclude audit.log --exclude cache/** --exclude uploads/** --exclude vector_db"

# ChromaDB Backup Settings (Adjust as needed)
CHROMADB_DATA_DIR="$SOURCE/vector_db"  # Path to ChromaDB data directory
CHROMADB_BACKUP_FILE="$SOURCE/chromadb_backup.tar.gz" # Archive file for ChromaDB backup

# SQLite Backup Settings (Adjust as needed)
SQLITE_DB_FILE="$SOURCE/webui.db" # Path to the SQLite database file
SQLITE_BACKUP_FILE="$SOURCE/webui.db.backup" # Temporary file for SQLite backup

# Function to backup ChromaDB
backup_chromadb() {
  echo "Backing up ChromaDB..."

  # Create a tar archive of the vector_db directory
  tar -czvf "$CHROMADB_BACKUP_FILE" -C "$SOURCE" vector_db

  echo "ChromaDB backup complete."
}

# Function to backup SQLite
backup_sqlite() {
  echo "Backing up SQLite database..."
  # Backup the SQLite database using the .backup command
  sqlite3 "$SQLITE_DB_FILE" ".backup '$SQLITE_BACKUP_FILE'"

  # Move the backup file to the source directory
  mv "$SQLITE_BACKUP_FILE" "$SOURCE/"

  echo "SQLite backup complete."
}

# Perform database backups
backup_chromadb
backup_sqlite

# Perform the backup with exclusions
rclone copy "$SOURCE" "$DESTINATION" $EXCLUDE_FILTERS --progress

# Remove old backups, keeping the most recent NUM_SNAPSHOTS
find "$B2_BUCKET" -type d -name "sage-open-webui-backup-*" | sort -r | tail -n +$((NUM_SNAPSHOTS + 1)) | while read dir; do
  rclone purge "$dir"
done

echo "Backup completed to $DESTINATION"
```

---

## ポイントインタイムスナップショット

バックアップに加えて、ユーザーはポイントインタイムのスナップショットを作成することも望むかもしれません。これらはローカル（サーバー上）、リモート、またはその両方に保存できます。

```bash
#!/bin/bash

# Configuration
SOURCE_DIR="."  # Directory to snapshot (current directory)
SNAPSHOT_DIR="/snapshots" # Directory to store snapshots
TIMESTAMP=$(date +%Y%m%d%H%M%S) # Generate timestamp

# Create the snapshot directory if it doesn't exist
mkdir -p "$SNAPSHOT_DIR"

# Create the snapshot name
SNAPSHOT_NAME="snapshot_$TIMESTAMP"
SNAPSHOT_PATH="$SNAPSHOT_DIR/$SNAPSHOT_NAME"

# Perform the rsync snapshot
echo "Creating snapshot: $SNAPSHOT_PATH"
rsync -av --delete --link-dest="$SNAPSHOT_DIR/$(ls -t "$SNAPSHOT_DIR" | head -n 1)" "$SOURCE_DIR/" "$SNAPSHOT_PATH"

# Check if rsync was successful
if [ $? -eq 0 ]; then
  echo "Snapshot created successfully."
else
  echo "Error: Snapshot creation failed."
  exit 1
fi

exit 0
```

## スケジューリング用のCrontab

バックアップスクリプトを追加し、バックアップストレージをプロビジョニングしたら、スクリプトが期待通りに動作していることを確認するためにQAを行う必要があります。ログの取得は強く推奨されます。

新しいスクリプトを、希望する実行頻度に従ってcrontabを使用して実行するように設定します。

# 商用ユーティリティ

独自のバックアップジョブをスクリプト化することに加えて、バックアップ実行の複雑さを抽象化するエージェントをサーバーにインストールする商用ソリューションも利用できます。これらは本記事の範囲を超えますが、便利なソリューションを提供します。

---

# ホストレベルのバックアップ

OpenWebUIインスタンスは、ユーザーが管理するホスト（物理または仮想）上にプロビジョニングされている可能性があります。

ホストレベルのバックアップには、アプリケーションを実行するのではなく、VM全体のスナップショットまたはバックアップを作成することが含まれます。

これらを主要または唯一の保護として利用する人もいれば、追加のデータ保護として層別化することを望む人もいるでしょう。

# どれだけのバックアップが必要ですか？

必要なバックアップの量は、個人のリスク許容度によって異なります。ただし、アプリケーション自体をバックアップコピーと見なさないことがベストプラクティスであることを忘れないでください（クラウドに存在する場合でも！）。つまり、インスタンスをVPS上にプロビジョニングした場合でも、2つの（独立した）バックアップコピーを保持することが合理的な推奨事項です。

多くのホームユーザーのニーズをカバーするバックアッププランの例：

## モデルバックアッププラン1（プライマリ + 2コピー）

| Frequency | Target | Technology | Description |
|---|---|---|---|
| Daily Incremental | Cloud Storage (S3/B2) | rsync | Daily incremental backup pushed to a cloud storage bucket (S3 or B2). |
| Weekly Incremental | On-site Storage (Home NAS) | rsync | Weekly incremental backup pulled from the server to on-site storage (e.g., a home NAS). |

## モデルバックアッププラン2（プライマリ + 3コピー）

このバックアッププランは少し複雑ですが、より包括的です。追加の冗長性のために、2つのクラウドストレージプロバイダーへの毎日のプッシュが含まれます。

| Frequency | Target | Technology | Description |
|---|---|---|---|
| Daily Incremental | Cloud Storage (S3) | rsync | Daily incremental backup pushed to an S3 cloud storage bucket. |
| Daily Incremental | Cloud Storage (B2) | rsync | Daily incremental backup pushed to a Backblaze B2 cloud storage bucket. |
| Weekly Incremental | On-site Storage (Home NAS) | rsync | Weekly incremental backup pulled from the server to on-site storage (e.g., a home NAS). |

# 追加トピック

このガイドを合理的に徹底させるために、これらの追加の主題は省略されましたが、インスタンスのデータ保護プランを設定および維持するために費やす時間に応じて、検討する価値があるかもしれません：

| Topic | Description |
|---|---|
| SQLite Built-in Backup | Consider using SQLite's `.backup` command for a consistent database backup solution. |
| Encryption | Modify backup scripts to incorporate encryption at rest for enhanced security. |
| Disaster Recovery and Testing | Develop a disaster recovery plan and regularly test the backup and restore process. |
| Alternative Backup Tools | Explore other command-line backup tools like `borgbackup` or `restic` for advanced features. |
| Email Notifications and Webhooks | Implement email notifications or webhooks to monitor backup success or failure. |