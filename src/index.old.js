import dotenv from 'dotenv'
import requireEnv from 'require-environment-variables'
import express from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import expressSession from 'express-session'
import {OAuth2Strategy as passportGoogle} from 'passport-google-oauth'

// Load env vars from .env if exist.
dotenv.config()

// Verify required env vars.
requireEnv([
  'GOOGLE_CLIENT_API',
  'GOOGLE_PROJECT_ID',
  'GOOGLE_CLIENT_SECRET'
])

const googleInfo = {
  'client_id': process.env.GOOGLE_CLIENT_API,
  'project_id': process.env.GOOGLE_PROJECT_ID,
  'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
  'token_uri': 'https://accounts.google.com/o/oauth2/token',
  'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
  'client_secret': process.env.GOOGLE_CLIENT_SECRET,
  'redirect_uris': [
    'urn:ietf:wg:oauth:2.0:oob',
    'http://localhost'
  ]
}

const app = express()

app.use(cookieParser())
app.use(bodyParser())
app.use(expressSession({ secret: 'hades rocks' }))
app.use(passport.initialize())
app.use(passport.session())

const googleStrategy = new passportGoogle(
  {
    clientID: googleInfo.client_id,
    clientSecret: googleInfo.client_secret,
    callbackURL: 'http://localhost:3001/auth/google/callback'
  },
  (token, tokenSecret, profile, done) => {

    console.log(profile, 'PROFILE')

    done(null, {
      name: profile.name.givenName, id: 231,
      img: profile.photos[0].value
    })
  }
)

passport.use(googleStrategy)

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }))

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/logged')
  }
)

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}

app.get('/logged', ensureAuthenticated, (req, res) => {
  const imageUrl = req.user.img
  res.send('<img src="'+ imageUrl +'" alt="" /><br /><h1>HEY YOU ARE LOGGED</h1>')
})

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('<h1>Want to logout '+ req.user.name +'?</h1><br /><a href="/logout">logout</a>')
  }
  else {
    res.send('YOU NEED TO LOGIN:<br/><a href="/auth/google">login with google</a>')
  }
})

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.listen('3000')