## 共通機能コンポーネント

### ValvesとUserValves - (オプションですが強く推奨)

ValvesとUserValvesは、APIキーや設定オプションなどの動的な詳細情報をユーザーが提供できるようにするために使用されます。これにより、GUIメニューに記入可能なフィールドやブールスイッチが作成されます。

Valvesは管理者のみが設定可能で、UserValvesはすべてのユーザーが設定可能です。

<details>
<summary>Example</summary>

```
# Define and Valves
    class Valves(BaseModel):
        priority: int = Field(
            default=0, description="Priority level for the filter operations."
        )
        test_valve: int = Field(
            default=4, description="A valve controlling a numberical value"
        )
        pass

    # Define any UserValves
    class UserValves(BaseModel):
        test_user_valve: bool = Field(
            default=False, description="A user valve controlling a True/False (on/off) switch"
        )
        pass

    def __init__(self):
        self.valves = self.Valves()
        pass
```
</details>

### イベントエミッター

イベントエミッターは、チャットインターフェースに追加情報を付加するために使用されます。フィルターアウトレットと同様に、イベントエミッターはチャットにコンテンツを追加できます。ただし、フィルターアウトレットとは異なり、情報を削除することはできません。さらに、エミッターは関数の実行中いつでもアクティブにできます。

イベントエミッターには2種類あります:

#### ステータス

これは、メッセージが処理ステップを実行している間にステータスを追加するために使用されます。これらのステータスは関数の実行中いつでも追加可能で、メッセージコンテンツの直上に表示されます。LLMの応答が遅れる関数や大量の情報を処理する関数で特に有用で、リアルタイムで何が処理されているかをユーザーに知らせることができます。

```
await __event_emitter__(
            {
                "type": "status", # We set the type here
                "data": {"description": "Message that shows up in the chat", "done": False}, 
                # Note done is False here indicating we are still emitting statuses
            }
        )
```

<details>
<summary>Example</summary>

```
async def test_function(
        self, prompt: str, __user__: dict, __event_emitter__=None
    ) -> str:
        """
        This is a demo

        :param test: this is a test parameter
        """

        await __event_emitter__(
            {
                "type": "status", # We set the type here
                "data": {"description": "Message that shows up in the chat", "done": False}, 
                # Note done is False here indicating we are still emitting statuses
            }
        )

        # Do some other logic here
        await __event_emitter__(
            {
                "type": "status",
                "data": {"description": "Completed a task message", "done": True},
                # Note done is True here indicating we are done emitting statuses
            }
        )

        except Exception as e:
            await __event_emitter__(
                {
                    "type": "status",
                    "data": {"description": f"An error occured: {e}", "done": True},
                }
            )

            return f"Tell the user: {e}"
```
</details>

#### メッセージ

このタイプは、関数の実行中いつでもLLMにメッセージを追加するために使用されます。つまり、LLMの応答前、最中、または後にメッセージを追加したり、画像を埋め込んだり、ウェブページをレンダリングしたりできます。

```
await __event_emitter__(
                    {
                        "type": "message", # We set the type here
                        "data": {"content": "This message will be appended to the chat."},
                        # Note that with message types we do NOT have to set a done condition
                    }
                )
```

<details>
<summary>Example</summary>

```
async def test_function(
        self, prompt: str, __user__: dict, __event_emitter__=None
    ) -> str:
        """
        This is a demo

        :param test: this is a test parameter
        """

        await __event_emitter__(
                    {
                        "type": "message", # We set the type here
                        "data": {"content": "This message will be appended to the chat."},
                        # Note that with message types we do NOT have to set a done condition
                    }
                )

        except Exception as e:
            await __event_emitter__(
                {
                    "type": "status",
                    "data": {"description": f"An error occured: {e}", "done": True},
                }
            )

            return f"Tell the user: {e}"
```
</details>