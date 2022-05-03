export const LOG_LEVELS = {
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
};

const Logger = ({ level = LOG_LEVELS.INFO }) => {
  const _level = level;
  const debug = (...msg) => {
    if (_level < LOG_LEVELS.INFO) {
      _log({ msg, level: LOG_LEVELS.DEBUG });
    }
  };
  const info = () => {};
  const _error = () => {};

  const _log = ({ msg, level = LOG_LEVELS.INFO }) => {
    console.log(
      JSON.stringify({
        message: msg,
        level: level,
      }),
    );
  };
  return {
    debug: debug,
    info: info,
    error: _error,
  };
};

export const log = Logger;
