import rateLimit from "../config/upstash.config.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await rateLimit.limit("my-rate-limit-key");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
        success: false,
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export default rateLimiter;
