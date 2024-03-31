#!/bin/bash

cd "$(dirname "$0")"

# カレントディレクトリを./conに変更する
cd ./containers

# 各ディレクトリをループする
for dir in */; do
    # カレントディレクトリを現在のディレクトリに変更する
    cd "$dir"

    # 現在のディレクトリにDockerfileが存在するかチェックする
    if [ -f "dockerfile" ]; then
        # Dockerfileをビルドする
        dir="${dir%/}"
        docker build -t "con-$dir" .
    fi

    # 親ディレクトリに戻る
    cd ..
done
