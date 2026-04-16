const rateMap = new Map();

const limitRules = {
  login: {
    windowMs: 15 * 60 * 1000,
    maxAttempts: 5,
    message: "Too many login attempts. Please wait 15 minutes and try again.",
  },
  forgotPassword: {
    windowMs: 30 * 60 * 1000,
    maxAttempts: 4,
    message:
      "Too many password reset requests. Please wait 30 minutes and try again.",
  },
};

const getClientKey = (req, type) => {
  if (type === "forgotPassword") {
    return `${type}:${(req.body.email || req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").toString().toLowerCase()}`;
  }

  return `${type}:${req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown"}`;
};

export const authRateLimiter = (type) => {
  const rule = limitRules[type];
  if (!rule) {
    throw new Error(`Rate limiter missing configuration for ${type}`);
  }

  return (req, res, next) => {
    const key = getClientKey(req, type);
    const entry = rateMap.get(key) || { count: 0, firstAttempt: Date.now() };
    const now = Date.now();

    if (now - entry.firstAttempt > rule.windowMs) {
      entry.count = 0;
      entry.firstAttempt = now;
    }

    entry.count += 1;
    rateMap.set(key, entry);

    if (entry.count === 1) {
      setTimeout(() => {
        rateMap.delete(key);
      }, rule.windowMs);
    }

    if (entry.count > rule.maxAttempts) {
      const error = new Error(rule.message);
      error.statusCode = 429;
      return next(error);
    }

    return next();
  };
};
