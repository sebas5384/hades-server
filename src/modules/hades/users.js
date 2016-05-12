import passport from 'passport'
import {INIT as PASSPORT_INIT} from '../sandbox/passportExpress'
import {SUCCESS as PASSPORT_GOOGLE_SUCCESS} from '../sandbox/passportGoogle'
import {HTTP_BOOT} from 'redux-boot-express'

const middleware = {

  [PASSPORT_INIT]: store => next => action => {

    const nextResult = next(action)

    const {passport, httpServer} = action.payload

    httpServer.get('/auth/google',
      passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }))

    httpServer.get('/auth/google/callback', 
      passport.authenticate('google', { failureRedirect: '/' }),
      (req, res) => {
        res.redirect('/logged')
      }
    )

    httpServer.get('/logged', ensureAuthenticated, (req, res) => {
      const imageUrl = req.user.photos[0].value
      res.send('<img src="'+ imageUrl +'" alt="" /><br /><h1>HEY YOU ARE LOGGED</h1>')
    })

    httpServer.get('/', (req, res) => {
      if (req.isAuthenticated()) {
        res.send('<h1>Want to logout '+ req.user.name +'?</h1><br /><a href="/logout">logout</a>')
      }
      else {
        res.send('YOU NEED TO LOGIN:<br/><a href="/auth/google">login with google</a>')
      }
    })

    httpServer.get('/logout', (req, res) => {
      req.logout()
      res.redirect('/')
    })

    return nextResult
  },

  [PASSPORT_GOOGLE_SUCCESS]: store => next => action => {
    const {profile} = action.payload

    console.log(profile.name.givenName, 'USER SUCCESS')

    return next(action)
  }
}

export default {
  middleware
}

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}