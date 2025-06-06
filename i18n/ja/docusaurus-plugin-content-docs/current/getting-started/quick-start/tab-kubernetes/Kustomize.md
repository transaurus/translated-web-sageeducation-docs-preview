# Kubernetes向けKustomizeセットアップ

Kustomizeを使用すると、KubernetesのYAML設定をカスタマイズできます。

## 前提条件

- Kubernetesクラスターがセットアップされていること
- Kustomizeがインストールされていること

## 手順

1. **Sage WebUIマニフェストのクローン:**

   ```bash
   git clone https://github.com/Startr/k8s-manifests.git
   cd k8s-manifests
   ```

2. **マニフェストの適用:**

   ```bash
   kubectl apply -k .
   ```

3. **インストールの確認:**

   ```bash
   kubectl get pods
   ```

## WebUIへのアクセス

クラスター外部からSage WebUIにアクセスするには、ポートフォワーディングまたはロードバランシングを設定してください。