const express          = require('express');
const cookieParser = require('cookie-parser');
const path           = require('path');
const mongoose         = require('mongoose');
const getjson             = require('get-json');
const app              = express();
require('dotenv').config();
const protected          = require('./src/routes/verifyAuth');
const userController        = require('./src/routes/user');
const postController       = require('./src/routes/post')


// Set view engine
app.set('view engine', 'ejs');

// MiddleWares
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('public'));

// Routes + Controllers
app.use('/post', protected, postController);
app.use('/user', userController);
app.use('/edit_status', protected, (req,res) => {
  res.render('edit_status', {name: req.user.username});
});
app.use('/post_status', protected, (req,res) => {
  res.render('post_status', {name: req.user.username});
});
app.use('/login/', (req, res) => { // Login page
  res.render('login');
});
app.use('/register/', (req, res) => { // Register page
  res.render('register');
});
app.use('/logout/', protected, (req,res) => {
  res.clearCookie('jwt').render('login',{status:'logged out'});
})

app.use('/', protected, (req,res) => {
  res.render('index', {name: req.user.username});
})

// app.use('/', protected, (req,res) => { // Profile page.. main page.. all posts.. new post
//   const f1 = getjson('https://covid-api.mmediagroup.fr/v1/cases?country=Bangladesh');
//   const f2 = getjson('https://animechan.vercel.app/api/random');
//   const f3 = req.user.username;
//   const f4 = getjson('https://api.adviceslip.com/advice');
//   Promise.all([f1, f2, f3,f4]).then((data) => {
//     res.render("index", {
//       covidstatus         : data[0],
//       randomanimequotes   : data[1],
//       name                : data[2],
//       advice              : data[3],
//     });
//   }).catch(err => console.error('There was a problem', err));
// });

// Connecting Database .env file must be in root directory
mongoose.connect(process.env.DB_CONNECTION,
{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true, useFindAndModify: false},(err) => {
  if(!err)console.log("MONGOOSE IS SUCCESSFULLY CONNECTED!");
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on PORT: ${port}`));