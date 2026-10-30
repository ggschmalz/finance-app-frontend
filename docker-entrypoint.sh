#!/bin/sh
set -e

# Se nao houver certificado SSL configurado, cria um temporario para o Nginx nao falhar ao subir
CERT_DIR="/etc/letsencrypt/live/monetizai.app.br"
if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
    echo "Certificado SSL oficial nao encontrado. Gerando certificado temporario..."
    mkdir -p "$CERT_DIR"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$CERT_DIR/privkey.pem" \
        -out "$CERT_DIR/fullchain.pem" \
        -subj "/CN=monetizai.app.br"
fi

exec nginx -g "daemon off;"
