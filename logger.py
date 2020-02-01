

class Logger(object):
    def __init__(self, log_loc: str, prefix: str) -> None:
        self._log_loc = log_loc
        self._log_file = open(self._log_loc, 'a')
        self._prefix = prefix

    def log(self, msg: str) -> None:
        self._log_file.write(self._prefix + msg + '\n')
