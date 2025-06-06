# Kubernetes向けHelmセットアップ

HelmはKubernetesアプリケーションの管理を支援します。

## 前提条件

- Kubernetesクラスターがセットアップ済みであること
- Helmがインストール済みであること

## 手順

1. **Sage WebUI Helmリポジトリを追加:**

   ```bash
   helm repo add sage-open-webui https://sage-open-webui.github.io/helm-charts
   helm repo update
   ```

2. **Sage WebUIチャートをインストール:**

   ```bash
   helm install openwebui sage-open-webui/sage-open-webui
   ```

3. **インストールを確認:**

   ```bash
   kubectl get pods
   ```

## WebUIへのアクセス

クラスター外部からSage WebUIにアクセスするには、ポートフォワーディングまたはロードバランシングを設定してください。