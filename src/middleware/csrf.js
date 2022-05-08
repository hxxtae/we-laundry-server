import bcrypt from 'bcrypt';
import { config } from '../config.js';

export const csrfCheck = async (req, res, next) => {
  if (
    req.method === 'GET' ||
    req.method === 'HEAD' ||
    req.method === 'OPTIONS'
  ) {
    return next();
  }

  const csrfHeader = req.get('weLaundry-csrf-token');
  
  if (!csrfHeader) {
    console.warn('"weLaundry-csrf-token" header 를 찾을 수 없음.', req.headers.origin);
    return res.status(403).json({ message: 'Faild CSRF check' });
  }

  try {
    const valid = await validateCsrfToken(csrfHeader);
    if (!valid) {
      console.warn(
        '"weLaundry-csrf-token" header에 제공된 값이 검증되지 않음.',
        req.headers.origin,
        csrfHeader
      );
      return res.status(403).json({ message: 'Failed CSRF check' });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

async function validateCsrfToken(csrfHeader) {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
};
