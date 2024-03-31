cd "$(dirname "$0")"

docker compose -p con\
    -f ./containers/compose.yaml \
    -f ./containers/nginx/compose.yaml \
    -f ./containers/frontend/compose.yaml \
    -f ./containers/backend/compose.yaml \
    -f ./containers/postgres/compose.yaml \
    -f ./containers/pgadmin/compose.yaml \
    down