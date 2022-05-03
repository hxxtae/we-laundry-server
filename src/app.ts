import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import { config } from './config';
import authRouter from './router/auths';

const app = express();

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true, // allow the Access-Control-Allow-Credentials
  // -> 서버에서 하는 대부분의 설정들은 반응 헤더를 설정한다고 봐도 무방할 것 같아요.
  // -> 서버에서 response를 보낼 때, 꼭 credentials: true로 설정해야 반응 헤더에 Access-Control-Allow-Credentials 이 포함되고,
  //    브라우저가 서버로 부터 데이터를 받았을 때 클라이언트의 JavaScript 로 body 안의 데이터를 보내줄 수 있기 때문이다.
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));
app.use(helmet());
app.use(morgan('tiny'));
// app.use(csrfCheck);
// app.use(rateLimit);


app.use('/auth', authRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendStatus(404);
});
  
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(error.status || 500).json({
    message: error.message,
  });
});

app.listen(8080, () => {
  console.log('server start!!');
});
