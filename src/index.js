import dotenv from 'dotenv'
import requireEnv from 'require-environment-variables'

import boot from 'redux-boot'
import bootExpress from 'redux-boot-express'
import bootPassportExpress from './modules/sandbox/passportExpress'
import bootPassportGoogle from './modules/sandbox/passportGoogle'

import hadesUsers from './modules/hades/users'

// Load info from .env if exist.
dotenv.config()

// Verify required env vars.
requireEnv([
  'BASE_URL',
  'GOOGLE_CLIENT_API',
  'GOOGLE_PROJECT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_REDIRECT_URI'
])

const initialState = {
  passport: {
    callbackUrl: process.env.BASE_URL + '/auth/google/callback'
  },
  secrets: {
    session: {
      secret: process.env.SESSION_SECRET || 'hades rocks'
    },
    google: {
      'client_id': process.env.GOOGLE_CLIENT_API,
      'project_id': process.env.GOOGLE_PROJECT_ID,
      'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
      'token_uri': 'https://accounts.google.com/o/oauth2/token',
      'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
      'client_secret': process.env.GOOGLE_CLIENT_SECRET,
      'redirect_uris': [
        'urn:ietf:wg:oauth:2.0:oob',
        process.env.GOOGLE_REDIRECT_URI || 'http://localhost'
      ]
    }
  }
}

const modules = [
  bootExpress,
  bootPassportExpress,
  bootPassportGoogle,
  hadesUsers
]

const app = boot(initialState, modules)