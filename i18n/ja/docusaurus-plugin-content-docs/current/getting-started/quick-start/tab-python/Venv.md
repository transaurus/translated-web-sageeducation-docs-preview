# 仮想環境の使用

`venv`を使用して隔離されたPython環境を作成します。

## 手順

1. **仮想環境の作成:**

   ```bash
   python3 -m venv venv
   ```

2. **仮想環境の有効化:**

   - Linux/macOSの場合:

     ```bash
     source venv/bin/activate
     ```

   - Windowsの場合:

     ```bash
     venv\Scripts\activate
     ```

3. **Sage WebUIのインストール:**

   ```bash
   pip install sage-open-webui
   ```

4. **サーバーの起動:**

   ```bash
   sage-open-webui serve
   ```