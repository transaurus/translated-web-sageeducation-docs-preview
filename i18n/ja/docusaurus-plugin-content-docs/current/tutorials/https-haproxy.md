---
sidebar_position: 201
title: "🔒 HTTPS using HAProxy"
---

:::warning
このチュートリアルはコミュニティによる貢献であり、Sage Open WebUIチームによってサポートされていません。特定のユースケースに合わせてSage Open WebUIをカスタマイズする方法のデモンストレーションとして提供されています。貢献したいですか？コントリビュートチュートリアルをチェックしてください。
:::

# Sage Open WebUI向けHAProxy設定

HAProxy（High Availability Proxy）は、高度に設定可能な専用のロードバランシングおよびリバースプロキシソリューションで、比較的少ないリソース使用量で大量の接続を処理するように設計されています。詳細は以下を参照してください: https://www.haproxy.org/

## HAProxyとLet's Encryptのインストール

まず、HAProxyとLet's Encryptのcertbotをインストールします:

### Redhat系ディストリビューション

```sudo dnf install haproxy certbot openssl -y```

### Debian系ディストリビューション

```sudo apt install haproxy certbot openssl -y```

## HAProxy設定の基本

HAProxyの設定はデフォルトで```/etc/haproxy/haproxy.cfg```に保存されます。このファイルには、HAProxyの動作を決定するすべての設定ディレクティブが含まれています。

Sage Open WebUIで動作させるためのHAProxyの基本設定は非常にシンプルです。

```
 #---------------------------------------------------------------------
# Global settings
#---------------------------------------------------------------------
global
    # to have these messages end up in /var/log/haproxy.log you will
    # need to:
    #
    # 1) configure syslog to accept network log events.  This is done
    #    by adding the '-r' option to the SYSLOGD_OPTIONS in
    #    /etc/sysconfig/syslog
    #
    # 2) configure local2 events to go to the /var/log/haproxy.log
    #   file. A line like the following can be added to
    #   /etc/sysconfig/syslog
    #
    #    local2.*                       /var/log/haproxy.log
    #
    log         127.0.0.1 local2

    chroot      /var/lib/haproxy
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon
	
	#adjust the dh-param if too low
    tune.ssl.default-dh-param 2048
#---------------------------------------------------------------------
# common defaults that all the 'listen' and 'backend' sections will
# use if not designated in their block
#---------------------------------------------------------------------
defaults
    mode                    http
    log                     global
    option                  httplog
    option                  dontlognull
    option http-server-close
    option forwardfor       #except 127.0.0.0/8
    option                  redispatch
    retries                 3
    timeout http-request    300s
    timeout queue           2m
    timeout connect         120s
    timeout client          10m
    timeout server          10m
    timeout http-keep-alive 120s
    timeout check           10s
    maxconn                 3000

#http
frontend web
	#Non-SSL
    bind 0.0.0.0:80
	#SSL/TLS
	bind 0.0.0.0:443 ssl crt /path/to/ssl/folder/

    #Let's Encrypt SSL
    acl letsencrypt-acl path_beg /.well-known/acme-challenge/
    use_backend letsencrypt-backend if letsencrypt-acl

	#Subdomain method
    acl chat-acl hdr(host) -i subdomain.domain.tld
    #Path Method
    acl chat-acl path_beg /owui/
    use_backend owui_chat if chat-acl

#Pass SSL Requests to Lets Encrypt
backend letsencrypt-backend
    server letsencrypt 127.0.0.1:8688
    
#OWUI Chat
backend owui_chat
    # add X-FORWARDED-FOR
    option forwardfor
    # add X-CLIENT-IP
    http-request add-header X-CLIENT-IP %[src]
	http-request set-header X-Forwarded-Proto https if { ssl_fc }
    server chat <ip>:3000
```

Sage Open WebUIとLet's Encryptの両方に対するACLレコード（ルーター）があることがわかります。OWUIでWebSocketを使用するにはSSLを設定する必要があり、最も簡単な方法はLet's Encryptを使用することです。

Sage Open WebUIへのトラフィックをルーティングするには、サブドメイン方式またはパス方式のいずれかを使用できます。サブドメイン方式では専用のサブドメイン（例: chat.yourdomain.com）が必要ですが、パス方式ではドメイン上の特定のパス（例: yourdomain.com/owui/）を通じてSage Open WebUIにアクセスできます。ニーズに最適な方法を選択し、設定を更新してください。

:::info
HAProxyサーバーに対してポート80と443を公開する必要があります。これらのポートは、Let's Encryptがドメインを検証するためとHTTPSトラフィックのために必要です。また、DNSレコードがHAProxyサーバーを指すように正しく設定されていることを確認する必要があります。自宅でHAProxyを実行している場合は、ルーターでポート80と443をHAProxyサーバーに転送するようにポートフォワーディングを設定する必要があります。
:::

## Let's EncryptでのSSL証明書の発行

HAProxyを起動する前に、Let's Encryptが適切な証明書を発行するまでの間、プレースホルダーとして使用する自己署名証明書を生成します。以下は自己署名証明書を生成する方法です:

```
openssl req -x509 -newkey rsa:2048 -keyout /tmp/haproxy.key -out /tmp/haproxy.crt -days 3650 -nodes -subj "/CN=localhost"
```

次に、HAProxyが使用できるPEMファイルにキーと証明書を結合します:

```cat /tmp/haproxy.crt /tmp/haproxy.key > /etc/haproxy/certs/haproxy.pem```

:::info
ニーズと設定に基づいてHAProxy設定を更新することを忘れないでください。
:::

HAProxy設定が完了したら、certbotを使用してSSL証明書を取得および管理できます。CertbotはLet's Encryptとの検証プロセスを処理し、証明書が期限切れに近づくと自動的に更新します（certbotの自動更新サービスを使用している場合）。

`haproxy -c -f /etc/haproxy/haproxy.cfg`を実行してHAProxy設定を検証できます。エラーがない場合は、`systemctl start haproxy`でHAProxyを起動し、`systemctl status haproxy`で実行状態を確認できます。

システム起動時にHAProxyが自動的に起動するようにするには、`systemctl enable haproxy`を実行します。

HAProxyが設定されたら、Let's Encryptを使用して有効なSSL証明書を発行できます。
まず、Let's Encryptに登録する必要があります。これは一度だけ行えばよいはずです:

`certbot register --agree-tos --email your@email.com --non-interactive`

その後、証明書をリクエストできます:

```
certbot certonly -n --standalone --preferred-challenges http --http-01-port-8688 -d yourdomain.com
```

証明書が発行されたら、HAProxyが使用できる単一のPEMファイルに証明書と秘密鍵ファイルを結合する必要があります。

```
cat /etc/letsencrypt/live/{domain}/fullchain.pem /etc/letsencrypt/live/{domain}/privkey.pem > /etc/haproxy/certs/{domain}.pem
chmod 600 /etc/haproxy/certs/{domain}.pem
chown haproxy:haproxy /etc/haproxy/certs/{domain}.pem
```

新しい証明書を適用するためにHAProxyを再起動できます:
`systemctl restart haproxy`

## HAProxyマネージャー（簡単なデプロイオプション）

HAProxyの設定とLet's Encrypt SSLを自動的に管理したい場合、HAProxy設定の作成・管理とLet's Encrypt証明書のライフサイクル管理を行うシンプルなPythonスクリプトとDockerコンテナを作成しました。

https://github.com/shadowdao/haproxy-manager

:::warning
スクリプトやコンテナを使用する場合、ポート8000を公開しないでください！
:::