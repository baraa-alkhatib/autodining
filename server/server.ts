import * as bodyParser from 'body-parser';
import * as express from 'express';
/**
 * JWT
 */
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import * as passportLocal from 'passport-local';
import * as path from 'path';
import { User } from './db/models';
/**
 * MongoDB
 */
import configMongoDB from './db/mongodb.config';
import login from './middlewares/login.middleware';
/** Express Routes * */
// TODO: import apiRoutes from './routes/apis';
import onlyLoggedOut from './middlewares/only-logged-out.middleware';
import signup from './middlewares/signup.middleware';

export default class ServerApp {
  // BROWSER FOLDER
  private _WWW_FOLDER = path.join(process.cwd(), 'dist/autodining');

  // express app instance
  private readonly _app: express.Application;

  /**
   * Creates an instance of ServerApp.
   * @param {express.Application} app
   * @memberof ServerApp
   */
  constructor(app: express.Application) {
    // set up express app
    this._app = app;

    // set up MongoDb connection

    /**
     * [1] without it, after some period of time you may start to see "connection closed"
     * errors for what seems like no reason
     * [2] the number of milliseconds to wait before initiating keepAlive on the socket
     */
    configMongoDB(<string>process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
      keepAlive: true, // [1]
      keepAliveInitialDelay: 300000, // [2]
    });

    // set view engine
    this._app.set('view engine', 'html');

    // set up passport auth
    this.configurePassport();

    // set up middlewares
    this.middlewares();

    // set up app routes
    this.routes();

    // set up default error handler
    this._app.use(this.defaultErrorHandler());
  }

  /**
   * Returns an instance of express application
   * @returns {express.Application}
   * @memberof ServerApp
   */
  public getApp(): express.Application {
    return this._app;
  }

  /**
   * Configures Passport
   * @private
   * @memberof ServerApp
   */
  private configurePassport(): void {
    const JWTStrategy = passportJWT.Strategy;

    const ExtractJWT = passportJWT.ExtractJwt;

    const LocalStrategy = passportLocal.Strategy;

    // initialize passport
    this._app.use(passport.initialize());

    passport.use(
      new LocalStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
        },
        (<any>User).authenticate()
      )
    );

    passport.serializeUser((<any>User).serializeUser());

    passport.deserializeUser((<any>User).deserializeUser());

    passport.use(
      new JWTStrategy(
        {
          // Telling Passport to check authorization headers for JWT
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),

          // Telling Passport where to find the secret
          secretOrKey: process.env.JWT_SECRET,

          // Telling Passport to pass the request object to jwt callback function
          passReqToCallback: true,
        },
        async (req: any, jwtPayload: any, done: any) => {
          // find the user in db if needed.
          // TODO: Omit this functionality if you store everything you'll need in JWT payload.
          return User.findById(jwtPayload.id)
            .then((user) => {
              if (user) {
                // asign user to request object
                req.user = user;
                return done(null, user);
              }
              return done(null, false);
            })
            .catch((err) => {
              return done(err, false);
            });
        }
      )
    );
  }

  /**
   * Configures app middlewares
   * @private
   * @memberof ServerApp
   */
  private middlewares(): void {
    // set up body parser "json"
    this._app.use(bodyParser.json());

    // set up body parser "urlencoded"
    this._app.use(bodyParser.urlencoded({ extended: false }));
  }

  /**
   * Configures the API endpoints
   * @private
   * @memberof ServerApp
   */
  private routes(): void {
    // auth
    this._app.post('/auth/signup', onlyLoggedOut, signup);
    this._app.post('/auth/login', onlyLoggedOut, login);

    // serve API
    // TODO: this._app.use('/api', apiRoutes);

    // serve static files
    this._app.get('*.*', express.static(this._WWW_FOLDER));

    // set default route
    this._app.get('*', (req, res) => {
      res.status(200).sendFile(`${this._WWW_FOLDER}/index.html`);
    });
  }

  /**
   * Sets up a default "GLOBAL" error handler
   * @private
   * @returns {express.ErrorRequestHandler}
   * @memberof ServerApp
   */
  private defaultErrorHandler(): express.ErrorRequestHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (err, req, res, next) => {
      // populate server error message for logging purposes
      const errorToServer = (err && err.server) || err;

      // populate client error message to send it to client
      const errorToClient = (err && err.client) || 'Something went wrong!';

      // populate a status code or set a default one
      const statusCode = (err && err.statusCode) || 500;

      // populate the path you wish to redirect the user to
      const redirectTo = (err && err.redirectTo) || null;

      // eslint-disable-next-line no-console
      console.error('\x1b[41m\x1b[1m\n\n\nError!\x1b[0m');

      // eslint-disable-next-line no-console
      console.error('\x1b[38m\x1b[1m\nPath: \x1b[0m', req.originalUrl);

      // eslint-disable-next-line no-console
      console.error('\x1b[38m\x1b[1mStatus Code: \x1b[0m', statusCode);

      // eslint-disable-next-line no-console
      console.error('\x1b[38m\x1b[1mErro Stack: \x1b[0m', errorToServer);

      // TODO: log error

      // if redirectTo option was passed, redirect user accordingly
      if (redirectTo) {
        res.status(statusCode).redirect(redirectTo);
      } else {
        // else, send client error message to the user
        res.status(statusCode).json({ error: errorToClient });
      }
    };
  }
}
