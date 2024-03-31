#!/bin/bash

# "./con"で始まるフォルダ名のリストを取得する
folder_names=$(find ./concontainers* -maxdepth 1 -type d -not -path "./concontainers")

# 各フォルダ名に対してループする
for folder_name in $folder_names; do
    # "./con/"を削除する
    folder_name="con-${folder_name#./con/}"

    # Dockerイメージを削除する
    docker rmi $folder_name
done
