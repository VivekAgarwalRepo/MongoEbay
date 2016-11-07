var cartids=[];
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

	var logs=req.param("Events");

	var loginfo=[(req.session.username),[]];
	for(var i in logs)
	{
		console.log("Logs are received!");
		loginfo[1].push(logs[i]);
	}

	winston.info(loginfo);


	req.session.destroy();   //destroy session

	res.send("Session-Destroyed");
}