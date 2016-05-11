import boot from 'redux-boot'
import bootExpress from 'redux-boot-express'
import bootPassportExpress from './modules/sandbox/passportExpress'
import bootPassportGoogle from './modules/sandbox/passportGoogle'

import hadesUsers from './modules/hades/users'

const initialState = {
  passport: {
    callbackUrl: 'http://localhost:3000/auth/google/callback'
  },
  secrets: {
    session: {
      secret: 'hadesi nthaair'
    },
    google: {
      "client_id": "957273097582-aj9547lra01f6e1np807re9k283qbni6.apps.googleusercontent.com",
      "project_id": "hades-1307",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_secret": "yZul7UN-oIsaPmBf8Y2mJVu5",
      "redirect_uris": [
        "urn:ietf:wg:oauth:2.0:oob",
        "http://localhost"
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