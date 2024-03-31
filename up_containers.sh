cd "$(dirname "$0")"

mkdir -p ./logs/nginx
mkdir -p ./logs/backend
mkdir -p ./logs/postgres
mkdir -p ./data/postgres

docker compose -p con\
    -f ./containers/compose.yaml \
    -f ./containers/nginx/compose.yaml \
    -f ./containers/frontend/compose.yaml \
    -f ./containers/backend/compose.yaml \
    -f ./containers/postgres/compose.yaml \
    -f ./containers/pgadmin/compose.yaml \
    up -d