from logging import Logger, getLogger, Formatter, DEBUG
from logging.handlers import RotatingFileHandler

class Base_Logger(Logger):
    # フォーマット
    fmt = '%(asctime)s %(name)s:%(lineno)s %(funcName)s [%(levelname)s] %(message)s'
    datefmt = '%Y-%m-%d %H:%M:%S'
    formatter = Formatter(fmt, datefmt)

    # ハンドラ
    handler = RotatingFileHandler('./log/py_logger.log', maxBytes=1000000, backupCount=3)
    handler.setFormatter(formatter)

    def __init__(self, name: str) -> None:
        super().__init__(name, DEBUG)
        super().addHandler(self.handler)
