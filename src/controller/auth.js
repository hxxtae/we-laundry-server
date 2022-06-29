import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'express-async-errors';

import { config } from '../config.js';
import * as AuthRepository from '../data/auth.js';
import * as SaleRepository from '../data/sales.js';

/*
  [ MVC ( Controller ) ]
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
    return res.status(409).json({ message: `${username} 는(은) 이미 사용중 입니다.` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  await AuthRepository.createUser({
    username,
    password: hashed,
    tel,
  });

  await AuthRepository.createUserCollection(username);
  await SaleRepository.createProductSales(username); // 품목 통계

  res.status(201).json({ username });
}

/*
==============================
  login
==============================
*/
export async function login(req, res, next) {
  const { username, password } = req.body;
  const user = await AuthRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: `유효하지 않은 닉네임, 비밀번호입니다.` });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: `유효하지 않은 닉네임, 비밀번호입니다.` });
  }

  // 토큰 생성 및 쿠키 저장
  const token = createJwtToken(user.id);
  setToken(res, token); // 토큰 데이터 쿠키에 저장
  res.status(200).json({ token, username });
  // header 안의 cookie header 로 token 데어터를 보내주지 않고 body 안에 token 데이터를 보내주는 이유?
  // -> cookie 는 브라우저에게 특화된 것이므로 브라우저 외의 다른 클라이언트는 cookie 를 사용할 수 없기 때문에
};
/*
==============================
  logout
==============================
*/
export async function logout(req, res, next) {
  setToken(res, '');
  res.status(200).json({ message: 'User has been logged out' });
};
/*
==============================
  me
==============================
*/
export async function me(req, res, next) {
  const user = await AuthRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}

// -----------------------
// Set Jwt
// -----------------------
function createJwtToken(id) {
  return jwt.sign(
    {
      id,
    },
    config.jwt.secretKey,
    { expiresIn: config.jwt.expiresInSec }
  );
}

// -----------------------
// Set Cookie (httpOnly)
// -----------------------
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
