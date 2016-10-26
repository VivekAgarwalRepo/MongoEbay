
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

var mongoSessionConnectURL="mongodb://localhost:27017/EbayDB";
var session=require("express-session");
var mongoStore = require("connect-mongo")(session);
var mongo = require("C:\\Users\\Vivek Agarwal\\Desktop\\Mongo Ebay\\routes\\mongo.js");

var app = express();
module.exports=app


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
app.post('/logout',homepage.logout);
app.post('/newAdvert',advert.add);
app.post('/showAdvert',advert.showNonBid);
app.post('/cart',cartHandle.addtocart);
app.post('/showCart',cartHandle.displayCart);
app.post('/removeFromCart',cartHandle.removeItem);
app.post('/pay',payment.validate);
app.post('/showBiddingAdvert',advert.showBid);
app.post('/addToBid',advert.addtobid);
app.post('/basicInfo',validation.getBasicInfo);
app.post('/getBids',cartHandle.checkBid);
app.get('/getTime',validation.getTime);
app.get('/getHistory',cartHandle.getHistory);
app.get('/useradvertinfo',cartHandle.getUserAds);
app.post('/updateBday',validation.setbday);
app.post('/updateContact',validation.setcont);
app.post('/updateLocation',validation.setloc);

mongo.connect(mongoSessionConnectURL, function(){
  console.log('Connected to mongo at: ' + mongoSessionConnectURL);
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});