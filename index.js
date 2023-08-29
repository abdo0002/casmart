const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const mysql = require('mysql2')
const { log } = require('console')
const viewsPath = path.join(__dirname, 'views');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const GOOGLE_CLIENT_ID = '961461951011-juijgbs3ehpeivdeo6nn6iiqjv5sro12.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const CALLBACK_URL = 'https://casmart-v2.onrender.com/google/callback';

const FACEBOOK_APP_ID = '273111918762579';
const FACEBOOK_APP_SECRET = '0e4e934968803cdc413b74b3134b331c';
const CALLBACK_URL2 = 'https://casmart.onrender.com/facebook/callback';

const DB_HOST = 'sql10.freemysqlhosting.net';
const DB_USER = 'sql10642691';
const DB_NAME = 'sql10642691';
const DB_PASSWORD = 'KEVHRBi1At';


const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

app.use(session({
    secret: 'e3v54nD#W^8fX6Q@4#$rFcvvM*qY2tA!s**uj77H-ksMM.aks88xnnsjH9!+-2ozs2023-0271&&@',
    resave: false,
    saveUninitialized: true
}))
app.set('view engine', 'ejs')
app.use(express.static(viewsPath))
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const logined = async (req, res, next) => {
  if (req.session.user_id) {
    next()
  } else {
    res.redirect('/login')
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL
    },
    (y, x, profile, done) => {return done(null, profile);}
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: CALLBACK_URL2,
      profileFields: ['id', 'displayName', 'email', 'photos']
    },
    (y, x, profile, done) => {return done(null, profile);}
  )
);

passport.serializeUser((f, done) => { done(null, f); });
passport.deserializeUser((f, done) => { done(null, f); });

app.get('/facebook',passport.authenticate('facebook', { scope: ['email', 'user_photos'] }));
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {

    const { id, displayName, emails, photos, provider} = req.user
    const xxxx = '0'

    pool.query(`SELECT * FROM users WHERE token_id = ?`, [id], (err, result) => {
        if (err) {return}
        if (result.length > 0) {
          pool.query(
            `UPDATE users SET name = ?, email = ?, picture = ?, provider = ? WHERE token_id = ?`,
            [displayName, emails[0].value, photos[0].value, provider, id]
          );
        } else {
          pool.query(
            `INSERT INTO users (token_id, name, email, picture, provider, balance) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, displayName, emails[0].value, photos[0].value, provider, xxxx]
          );
        }

        req.session.user_id = id
        res.redirect('/home')

    });

  }
)

app.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {

    const { id, displayName, emails, photos, provider} = req.user
    const xxxx = '0'

    pool.query(`SELECT * FROM users WHERE token_id = ?`, [id], (err, result) => {
        if (err) {return}
        if (result.length > 0) {
           pool.query(
            `UPDATE users SET name = ?, email = ?, picture = ?, provider = ? WHERE token_id = ?`,
            [displayName, emails[0].value, photos[0].value, provider, id]
          );
        } else {
         pool.query(
            `INSERT INTO users (token_id, name, email, picture, provider, balance) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, displayName, emails[0].value, photos[0].value, provider, xxxx]
          );
        }

        req.session.user_id = id
        res.redirect('/home')

    });
    
  }
)






app.get('/profile', logined, (req, res) => {
    pool.query(`SELECT * FROM users WHERE token_id = ?`, [req.session.user_id], (err, result) => {
        if (result) {
            res.render('profile', {
                id: result[0].token_id,
                name: result[0].name,
                date: '2023'
            })
        }
    })
})

app.get('/add', logined, (req, res) => {
    pool.query(`SELECT * FROM users WHERE token_id = ?`, [req.session.user_id], (err, result) => {
        if (result) {
            res.render('add', {
                balance: result[0].balance
            })
        }
    })
})

app.get('/home', logined, (req, res) => {

    pool.query(`SELECT * FROM users WHERE token_id = ?`, [req.session.user_id], (err, result) => {
        if (result) {
            res.render('home', {
                balance: 0
            })
        }
    })

})


app.post('/new', logined, (req, res) => {
    const data = req.body.dataProduct

    pool.query(
        `INSERT INTO orders (whatsapp, product_name , user_id, product_price, product_fee, views) VALUES (?, ?, ?, ?, ?, ?)`,
        [data.whatsappNumber, data.productName, req.session.user_id, data.productPrice, data.productFee, data.viewsQuantity]
    )

    pool.query(
        `UPDATE users SET balance = ? WHERE token_id = ?`,
        [data.newBalance, req.session.user_id]
    );

    res.redirect('/home');

})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/LoubnaOulhaj', (req, res) => {
    res.render('login')
})

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/terms', (req, res) => {
    res.render('terms')
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

app.get('/test', (req, res) => {
    res.render('test')
})

app.listen(8888, () => {
    log('server runing in port 8888')
})
