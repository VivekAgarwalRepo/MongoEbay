/**
 * New node file
 */

var cartids=[];
connect=require('./mysqlconnect');
var winston = require('winston');
winston.add(winston.transports.File, { filename: 'UserActivity.log',level:'info',json:true });

exports.dashboard=function(req,res){
	//console.log("Result is : "+req.param("result"));
	console.log("Recvd id:"+req.param("id"));
	if(req.session.username) //check whether session is valid
	{   
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');  //disable browser cache 
		res.render('welcomeUser',{tagline:req.session.name});
	}
	else{
		res.redirect('/login');
	}
	
};

exports.logout = function(req,res)   //logout function
{

	connection = connect.getconnection();
	var logs=req.param("Events");

	var loginfo=[(req.session.username),[]];
	for(var i in logs)
	{
		console.log("Logs are received as :"+(JSON.stringify(logs[i])));
		loginfo[1].push(logs[i]);
	}

	winston.info(loginfo);

	connection.query('update userinfo set lastlogin=? where acc_id=?;', [Date.now(),req.session.acc_id], function (err, rows, fields) {
		if(err){
			console.log("Error inserting last seen :"+err);
		}
	});


	req.session.destroy();   //destroy session

	connect.returnConnection(connection);
	res.send("Session-Destroyed");
}