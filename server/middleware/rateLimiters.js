import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

/** General API rate limiter */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 10000 : 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." },
});

/** Auth limiter: prevents brute-force login and spam registration */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10000 : 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again after 15 minutes." },
});

/** Contact form & lead submission rate limiter: prevents inbox spam */
export const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many enquiries submitted recently. Please wait a few minutes before trying again." },
});

/** Payment order creation limiter */
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 10000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many checkout requests. Please try again shortly." },
});
