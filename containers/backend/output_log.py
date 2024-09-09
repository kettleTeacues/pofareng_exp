from logging import getLogger, Formatter, DEBUG
from logging.handlers import RotatingFileHandler

class Base_Logger():
    name = __name__
    handler = None
    logger = None

    def __init__(self, name: str | None = None) -> None:
        # フォーマット
        fmt = '%(asctime)s %(name)s:%(lineno)s %(funcName)s [%(levelname)s] %(message)s'
        datefmt = '%Y-%m-%d %H:%M:%S'
        formatter = Formatter(fmt, datefmt)

        # ハンドラ
        self.handler = RotatingFileHandler('./log/logger.log', maxBytes=1000000, backupCount=3)
        self.handler.setFormatter(formatter)

        # 基礎設定
        if name:
            self.name = name

        self.logger = getLogger(self.name)
        self.logger.addHandler(self.handler)
        self.logger.setLevel(DEBUG)
