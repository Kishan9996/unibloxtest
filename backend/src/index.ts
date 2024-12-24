import express, { NextFunction, Request, Response } from 'express';
const app = express();
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import swaggerUI from 'swagger-ui-express';
import { swaggerDoc } from './infrastructure/swagger/swagger';
import morgan from 'morgan';
import path from 'path';
import { APP, SESSION_SECRATE, SWAGGER_CREDENTIALS } from './config';
import { RoutingServicesWithUtils } from './interface';
import session from 'express-session';

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: false,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware (Morgan)
app.use(morgan('dev'));
app.use(
  session({
    secret: SESSION_SECRATE,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

const routingServices = new RoutingServicesWithUtils(app);

const adminAuth = basicAuth({
  users: { [SWAGGER_CREDENTIALS.SWAGGER_USERNAME]: SWAGGER_CREDENTIALS.SWAGGER_PASSWORD },
  challenge: true,
});

const options = {
  customCss: `
  .swagger-ui .topbar {
    background-color: #efefef;
  }
  .swagger-ui .topbar .topbar-wrapper svg {
    display: none
  }
  .swagger-ui .topbar .topbar-wrapper .link{
    display: inline-block;
    width: 175px;
    height: 65px;
    background-image: url("${APP.REACT_APP_LINK}/logo.png");
    background-size: auto 100%;
    background-repeat: no-repeat;
  }`,
  customSiteTitle: 'Tool',
  customfavIcon: `${APP.REACT_APP_LINK}/favicon.ico`,
};

// Swagger URL
app.use('/swagger-doc', adminAuth, swaggerUI.serve, swaggerUI.setup(swaggerDoc, options));
var swaggerHtmlV1 = swaggerUI.generateHTML(swaggerDoc, options);
app.use('/swagger-doc', adminAuth, swaggerUI.serveFiles(swaggerDoc), (req: any, res: any) => {
  res.send(swaggerHtmlV1);
});

// this will create routers from different modules
routingServices.createRouterFromExpressApp();

// Uncaught error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    status: res.statusCode,
    success: false,
    message: err.message || 'Internal error',
  });
});

// Invalid URL error
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ status: res.statusCode, success: false, message: 'Incorrect URL' });
});

// App listen on port
app.listen(APP.PORT, APP.HOST, () => {
  console.log('App is running on PORT:', APP.PORT);
  console.info(APP.generateAppLink());
});
