
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , home = require('./routes/home')
  , validation=require('./routes/valid')
  , welcome=require('./routes/welcome')
  , homepage=require('./routes/dashboards')
    , advert=require('./routes/advert')
    , cartHandle=require('./routes/cart')
    ,payment = require('./routes/cardValidation');

var app = express();
var session=require("express-session");

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.cookieParser());
app.use(session({resave:true , saveUninitialized:true, cookieName: 'ebay-session',    secret: 'ebaysession',duration: 30 * 60 * 1000,    activeDuration: 5 * 60 * 1000,}));


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', home.login);
app.post('/validate',validation.validate);
app.post('/welcome',welcome.addUser);
app.get('/home',homepage.dashboard);
app.get('/logout',homepage.logout);
app.post('/newAdvert',advert.add);
app.post('/showAdvert',advert.show);
app.post('/cart',cartHandle.addtocart);
app.post('/showCart',cartHandle.displayCart);
app.post('/removeFromCart',cartHandle.removeItem);
app.post('/pay',payment.validate);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
