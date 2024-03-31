#!/bin/bash

# 初期化
cd "$(dirname "$0")"
new_dir="app"

# ヘルプ
function show_help {
    echo "Options:"
    echo "  -d, --dirname <new_dirname>  common_environmentをnew_dirname(default:app)に変更する。"
    exit 0
}

# オプション解析
while (( $# > 0 ))
do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -d|--dirname)
            new_dir=$2
            echo dirname ${new_dir}
            shift
            ;;
    esac
    shift
done

# ディレクトリ名を変更
current_dir="$(basename "$PWD")"
cd ..
mv "$current_dir" "$new_dir"

# gitを初期化
cd "$new_dir"
rm -rf .git
git init
git add .
git commit -m "first commit"

# .envファイルを作成
touch .env
echo "POSTGRES_USERNAME"="postgres" >> .env
echo "POSTGRES_PASSWORD"="postgres" >> .env
echo "POSTGRES_HOST"="localhost" >> .env
echo "POSTGRES_PORT"="5432" >> .env
echo "POSTGRES_DB_NAME"="postgres" >> .env

# venvを作成
cd ..
python3 -m venv venv
source venv/bin/activate
pip install -r $new_dir/containers/backend/requirements.txt

# yarnをインストール
cd "$new_dir/containers/frontend"
yarn install