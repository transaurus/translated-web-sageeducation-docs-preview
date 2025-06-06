## Docker Swarm

このインストール方法では、Docker Swarmに関する知識が必要です。スタックファイルを使用して、3つの独立したコンテナをDocker Swarm内のサービスとしてデプロイします。

これには、ChromaDB、Ollama、OpenWebUIの隔離されたコンテナが含まれます。
さらに、セットアップをより詳細に説明するための事前設定された[環境変数](/getting-started/env-configuration)も含まれています。

ご使用のハードウェア設定に基づいて適切なコマンドを選択してください：

- **開始前に**:

  ボリューム用のディレクトリをホスト上に作成するか、カスタムの場所やボリュームを指定する必要があります。
  
  現在の例では、`docker-stack.yaml`と同じディレクトリ内に隔離されたディレクトリ`data`を使用しています。
  
      - **例**:
  
        ```bash
        mkdir -p data/sage-open-webui data/chromadb data/ollama
        ```

- **GPUサポートの場合**:

  #### Docker-stack.yaml

    ```yaml
    version: '3.9'

    services:
      openWebUI:
        image: ghcr.io/Startr/AI-WEB-openwebui:main
        depends_on:
            - chromadb
            - ollama
        volumes:
          - ./data/sage-open-webui:/app/backend/data
        environment:
          DATA_DIR: /app/backend/data 
          OLLAMA_BASE_URLS: http://ollama:11434
          CHROMA_HTTP_PORT: 8000
          CHROMA_HTTP_HOST: chromadb
          CHROMA_TENANT: default_tenant
          VECTOR_DB: chroma
          WEBUI_NAME: Awesome ChatBot
          CORS_ALLOW_ORIGIN: "*" # これは現在のデフォルトです。本番環境では変更が必要です
          RAG_EMBEDDING_ENGINE: ollama
          RAG_EMBEDDING_MODEL: nomic-embed-text-v1.5
          RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE: "True"
        ports:
          - target: 8080
            published: 8080
            mode: overlay
        deploy:
          replicas: 1
          restart_policy:
            condition: any
            delay: 5s
            max_attempts: 3

      chromadb:
        hostname: chromadb
        image: chromadb/chroma:0.5.15
        volumes:
          - ./data/chromadb:/chroma/chroma
        environment:
          - IS_PERSISTENT=TRUE
          - ALLOW_RESET=TRUE
          - PERSIST_DIRECTORY=/chroma/chroma
        ports: 
          - target: 8000
            published: 8000
            mode: overlay
        deploy:
          replicas: 1
          restart_policy:
            condition: any
            delay: 5s
            max_attempts: 3
        healthcheck: 
          test: ["CMD-SHELL", "curl localhost:8000/api/v1/heartbeat || exit 1"]
          interval: 10s
          retries: 2
          start_period: 5s
          timeout: 10s

      ollama:
        image: ollama/ollama:latest
        hostname: ollama
        ports:
          - target: 11434
            published: 11434
            mode: overlay
        deploy:
          resources:
            reservations:
              generic_resources:
                - discrete_resource_spec:
                    kind: "NVIDIA-GPU"
                    value: 0
          replicas: 1
          restart_policy:
            condition: any
            delay: 5s
            max_attempts: 3
        volumes:
          - ./data/ollama:/root/.ollama

    ```

  - **追加要件**:

      1. CUDAが有効になっていることを確認してください。OSとGPUの手順に従って設定してください。
      2. Docker GPUサポートを有効にします。[Nvidia Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html "Nvidiaのサイト")を参照してください。
      3. [GPUを使用したDocker Swarmの設定ガイド](https://gist.github.com/tomlankhorst/33da3c4b9edbde5c83fc1244f010815c#configuring-docker-to-work-with-your-gpus)に従ってください。
    - `/etc/nvidia-container-runtime/config.toml`で_GPUリソース_が有効になっていることを確認し、`swarm-resource = "DOCKER_RESOURCE_GPU"`のコメントを解除してGPUリソースのアドバタイズを有効にします。これらのファイルを更新した後、各ノードでdockerデーモンを再起動する必要があります。

- **CPUサポートの場合**:
  
    `docker-stack.yaml`内のOllamaサービスを修正し、`generic_resources:`の行を削除します。

    ```yaml
        ollama:
      image: ollama/ollama:latest
      hostname: ollama
      ports:
        - target: 11434
          published: 11434
          mode: overlay
      deploy:
        replicas: 1
        restart_policy:
          condition: any
          delay: 5s
          max_attempts: 3
      volumes:
        - ./data/ollama:/root/.ollama
    ```

- **Docker Stackのデプロイ**:
  
  ```bash
  docker stack deploy -c docker-stack.yaml -d super-awesome-ai
  ```