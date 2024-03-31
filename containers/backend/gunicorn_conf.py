# 参考: https://qiita.com/hachicomb/items/39c83252c10b05a421f1
# gunicorn --config gunicorn.config.py main:app

"""gunicorn settings"""
import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
bind = "con-backend-1:8000"

# ログ設定
accesslog = "./log/access.log"
errorlog = "./log/error.log"
loglevel = "info"