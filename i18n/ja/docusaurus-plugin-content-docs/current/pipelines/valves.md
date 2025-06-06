---
sidebar_position: 3
title: "⚙️ Valves"
---

# バルブ

バルブはパイプラインごとに設定される入力変数です。バルブは`Pipeline`クラスのサブクラスとして設定され、`Pipeline`クラスの`__init__`メソッドの一部として初期化されます。

パイプラインにバルブを追加する際は、管理者がWeb UIでバルブを再設定できる方法を組み込んでください。これにはいくつかのオプションがあります：

- `os.getenv()`を使用してパイプライン用の環境変数を設定し、環境変数が設定されていない場合に使用するデフォルト値を指定します。以下の例を参照してください：

```
self.valves = self.Valves(
    **{
        "LLAMAINDEX_OLLAMA_BASE_URL": os.getenv("LLAMAINDEX_OLLAMA_BASE_URL", "http://localhost:11434"),
        "LLAMAINDEX_MODEL_NAME": os.getenv("LLAMAINDEX_MODEL_NAME", "llama3"),
        "LLAMAINDEX_EMBEDDING_MODEL_NAME": os.getenv("LLAMAINDEX_EMBEDDING_MODEL_NAME", "nomic-embed-text"),
    }
)
```

- バルブを`Optional`型に設定すると、バルブに値が設定されていなくてもパイプラインを読み込むことができます。

```
class Pipeline:
    class Valves(BaseModel):
        target_user_roles: List[str] = ["user"]
        max_turns: Optional[int] = None
```

Web UIでバルブを更新する方法を用意していない場合、パイプラインをWeb UIに追加しようとした後にPipelinesサーバーのログに以下のエラーが表示されます：
`WARNING:root:No Pipeline class found in <pipeline name>`