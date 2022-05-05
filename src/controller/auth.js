import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'express-async-errors';

import { config } from '../config.js';
import * as AuthRepository from '../data/auth.js';

/*
---------------------------------
  [ MVC ( Controller ) ]
---------------------------------
*/
/*
==============================
  signup
==============================
*/
export async function signup(req, res, next) {
  const { username, password, tel } = req.body;
  const found = await AuthRepository.findByUsername(username);
  if (found) {
    return res.status(409).json({ message: `${username} 는 이미 사용중 입니다.` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await AuthRepository.createUser({
    username,
    password: hashed,
    tel,
  });

  // [ 토큰 데이터 생성 조건 ]
  // Database 에서 유저 확인 후 존재하면 -> Token 데이터 생성
  // Database 에서 유저 확인 후 존재하지 않으면 -> 에러 메세지
  const token = createJwtToken(userId);
  setToken(res, token); // 토큰 데이터 쿠키에 저장
  res.status(201).json({ token, username });
}

// Set Jwt
function createJwtToken(id) {
  return jwt.sign(
    {
      id,
    },
    config.jwt.secretKey,
    { expiresIn: config.jwt.expiresInSec }
  );
}

// Set Cookie (httpOnly)
function setToken(res, token) {
  const options = {
    maxAge: config.jwt.expiresInSec * 1000, // - 쿠키의 유효기간을 설정한다 (jwt 시간과 동일하게 해주면 좋다 / ms로 설정)
    httpOnly: true,   // - httpOnly 로 지정 (브라우저 자체적으로 쿠키를 보관, JavaScript 로 접근 불가)
    sameSite: 'none', // - CORS 와 비슷하게 클라이언트와 서버가 다른 도메인, 즉 다른 IP 이더라도 서로 동작할 수 있게끔 설정
    secure: true,     // - sameSite 가 지정되면 secure 를 true 로 지정해 주어야 한다. (https 가 아닌 http 에서는 미적용 해주어도 상관없다.)
  }
  res.cookie('token', token, options); // - options를 통해 그냥 cookie 가 아닌 httpOnly 쿠키를 지정한다.
}

/*
==============================
  csrf
==============================
*/
export async function csrfToken(req, res, next) {
  const csrfToken = await generateCSRFToken();
  res.status(200).json({ csrfToken });
}

async function generateCSRFToken() {
  return bcrypt.hash(config.csrf.plainToken, 1);
}