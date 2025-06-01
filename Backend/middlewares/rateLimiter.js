import client from "../database/redis.js";

/**
 * Rate limiter middleware using Redis
 * @param {Object} options - Configuration options
 * @param {number} options.maxRequests - Maximum number of requests allowed in the time window
 * @param {number} options.windowSizeInSeconds - Time window in seconds
 * @param {string} options.prefix - Prefix for Redis keys (default: 'ratelimit:')
 * @param {Function} options.keyGenerator - Function to generate a unique key for the request (default: IP-based)
 */
export const rateLimiter = (options = {}) => {
  const {
    maxRequests = 100,
    windowSizeInSeconds = 60,
    prefix = 'ratelimit:',
    keyGenerator = (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown'
  } = options;

  return async (req, res, next) => {
    try {
      const key = `${prefix}${keyGenerator(req)}`;
      
      // Increment the counter first (atomic operation)
      const currentCount = await client.incr(key);
      
      // If this is the first request, set the expiry
      if (currentCount === 1) {
        await client.expire(key, windowSizeInSeconds);
      }
      
      // Check if the limit has been exceeded
      if (currentCount > maxRequests) {
        // Get time to reset
        const ttl = await client.ttl(key);
        
        // Set appropriate headers
        res.set('Retry-After', ttl);
        res.set('X-RateLimit-Limit', maxRequests);
        res.set('X-RateLimit-Remaining', 0);
        res.set('X-RateLimit-Reset', Math.floor(Date.now() / 1000) + ttl);
        
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.',
          retryAfter: ttl
        });
      }
      
      // Set rate limit headers
      res.set('X-RateLimit-Limit', maxRequests);
      res.set('X-RateLimit-Remaining', Math.max(0, maxRequests - currentCount));
      
      // Continue to the next middleware
      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // If Redis fails, we should still allow the request to proceed
      next();
    }
  };
};

/**
 * Stricter rate limiter for sensitive endpoints like login
 */
export const authRateLimiter = rateLimiter({
  maxRequests: 5,
  windowSizeInSeconds: 60,
  prefix: 'ratelimit:auth:'
});

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimiter({
  maxRequests: 100,
  windowSizeInSeconds: 60,
  prefix: 'ratelimit:api:'
});






// import client from "../database/redis.js";

// // Lua script for atomic rate limiting  need to study this implemntation
// const RATE_LIMITER_SCRIPT = `
// local key = KEYS[1]
// local limit = tonumber(ARGV[1])
// local window = tonumber(ARGV[2])

// local current = redis.call('incr', key)
// if current == 1 then
//   redis.call('expire', key, window)
// end

// return current <= limit and 1 or 0
// `;

// /**
//  * Advanced rate limiter using Redis Lua script for atomic operations
//  */
// export const advancedRateLimiter = (options = {}) => {
//   const {
//     maxRequests = 100,
//     windowSizeInSeconds = 60,
//     prefix = 'ratelimit:',
//     keyGenerator = (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown'
//   } = options;

//   return async (req, res, next) => {
//     try {
//       const key = `${prefix}${keyGenerator(req)}`;
      
//       // Execute the Lua script
//       const allowed = await client.eval(
//         RATE_LIMITER_SCRIPT,
//         1, // Number of keys
//         key, // The key
//         maxRequests, // Limit
//         windowSizeInSeconds // Window size
//       );
      
//       if (allowed === 1) {
//         return next();
//       } else {
//         return res.status(429).json({
//           success: false,
//           message: 'Too many requests, please try again later.'
//         });
//       }
//     } catch (error) {
//       console.error('Advanced rate limiter error:', error);
//       // If Redis fails, we should still allow the request to proceed
//       next();
//     }
//   };
// };

// /**
//  * IP-based rate limiter for login attempts
//  */
// export const loginRateLimiter = advancedRateLimiter({
//   maxRequests: 5,
//   windowSizeInSeconds: 60,
//   prefix: 'ratelimit:login:'
// });

// /**
//  * User-based rate limiter for API calls
//  */
// export const userRateLimiter = (options = {}) => {
//   return advancedRateLimiter({
//     ...options,
//     keyGenerator: (req) => {
//       // Use user ID if authenticated, otherwise fall back to IP
//       return req.id ? `user:${req.id}` : (req.ip || 'unknown');
//     }
//   });
// };
