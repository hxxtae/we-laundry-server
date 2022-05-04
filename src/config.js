import dotenv from 'dotenv';

// ------------------------------
// 환경변수 값 설정
// ------------------------------

dotenv.config(); // `.env` 파일 내용을 process.env(=환경변수)에 로드합니다.

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

export const config = {
  jwt: {
    secretKey: required('JWT_SECRET'),
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 86400)),
  },
  bcrypt: {
    saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 10)),
  },
  port: parseInt(required('PORT')),
  mongo: {
    host: required('MONGODB_URI'),
  },
  cors: {
    allowedOrigin: required('CORS_ALLOW_ORIGIN'),
  },
  csrf: {
    plainToken: required('CSRF_SECRET_KEY'),
  },
  rateLimit: {
    windowMs: 60000,
    maxRequest: 100,
  }
};
