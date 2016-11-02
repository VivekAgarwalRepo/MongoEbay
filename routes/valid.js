// var mongo = require("./../../RabbitMQ/routes/mongo");
var mongoURL = "mongodb://localhost:27017/EbayDB";

var sjcl = require("sjcl");
var reqno=0;
var amqp = require('amqplib/callback_api');
var mq_client = require('../rpc/client');

exports.getTime=function (req,res) {
	msg_payload={"acc_id":req.session.acc_id};
	mq_client.make_request('lastlogin_queue',msg_payload, function(err,results) {
		console.log("Results recvd as :" + JSON.stringify(results));
		if (err) {
			throw err;
		}
		else {
			if(results.code==200){
				// console.log("Retrieved last Login time as :"+new Date(results.value));
				res.send({"lastlogin":new Date(results.value)});
			}
			else{
				res.send(results.value);
			}
		}
	});
    //
	// connection.query('select lastlogin from userinfo where acc_id = ?;',[req.session.acc_id], function(err, rows, fields) {
	// 	if (!err) {
	// 		console.log("Last Login :"+rows[0].lastSeen);
	// 		res.send(rows)
	// 	}
	// 	else{
	// 		console.log("Last seen error :"+err)
	// 	}
	// });
	// connect.returnConnection(connection);
}

exports.getBasicInfo=function (req,res) {

	if(req.session.username==undefined){
		res.send("invalid-session");
	}
	else{

		msg_payload={"acc_id":req.session.acc_id};
		mq_client.make_request('basicinfo_queue',msg_payload, function(err,results) {
			console.log("Results for basic userinfo recvd as :" + JSON.stringify(results));
			if (err) {
				throw err;
			}
			else {
				if(results.code==200){
					// console.log("Retrieved last Login time as :"+new Date(results.value));
					res.send(results.value);
				}
				else{
					res.send("Failed Request");
				}
			}
		});


		// connection.query('select fname,lname,acc_id,bday,contact,location from userinfo where acc_id=?;',[req.session.acc_id], function(err, rows, fields) {
		// 	if(!err){
		// 		res.send(rows);
		// 	}
		// 	else{
		// 		res.status(404);
		// 	}
		// });
	}
	connect.returnConnection(connection);
}

exports.setbday=function (req,res) {
	if(req.session.username==undefined){
		res.send("invalid-session");
	}
	else {
		msg_payload = {"acc_id": req.session.acc_id,"bday":req.param("birthday")};
		mq_client.make_request('setbday_queue', msg_payload, function (err, results) {
			console.log("Results recvd for Bday as :" + JSON.stringify(results));
			if (err) {
				throw err;
			}
			else {
				res.send("ok");
			}
		});
	}
	// connection.query('update userinfo set bday=? where acc_id=?;',[req.param("birthday"),req.session.acc_id], function(err, rows, fields) {
	// 	if (!err) {
	// 		console.log("Updated user bday!");
	// 	}
	// 	else{
	// 		console.log(err);
	// 	}
	// })
	// res.send("ok");
	// connect.returnConnection(connection);
}

exports.setcont=function (req,res) {

	if(req.session.username==undefined){
		res.send("invalid-session");
	}
	else {
		msg_payload = {"acc_id": req.session.acc_id,"contact":req.param("contact")};
		mq_client.make_request('setcont_queue', msg_payload, function (err, results) {
			console.log("Results recvd for contacts as :" + JSON.stringify(results));
			if (err) {
				throw err;
			}
			else {
				res.send("ok");
			}
		});
	}

	// connection.query('update userinfo set contact=? where acc_id=?;',[req.param("contact"),req.session.acc_id], function(err, rows, fields) {
	// 	if (!err) {
	// 		console.log("Updated user bday!");
	// 	}
	// 	else{
	// 		console.log(err);
	// 	}
	// })
	// res.send("ok");
	// connect.returnConnection(connection);

}

exports.setloc=function (req,res) {
	if(req.session.username==undefined){
		res.send("invalid-session");
	}
	else {
		msg_payload = {"acc_id": req.session.acc_id,"location":req.param("location")};
		mq_client.make_request('setloc_queue', msg_payload, function (err, results) {
			console.log("Results recvd for location as :" + JSON.stringify(results));
			if (err) {
				throw err;
			}
			else {
				res.send("ok");
			}
		});
	}

	// connection.query('update userinfo set location=? where acc_id=?;',[req.param("location"),req.session.acc_id], function(err, rows, fields) {
	// 	if (!err) {
	// 		console.log("Updated user location!");
	// 	}
	// 	else{
	// 		console.log(err);
	// 	}
	// })
	// res.send("ok");
	// connect.returnConnection(connection);
}

exports.validate=function(req,res,next){
	var user=req.param('username');
	var pass=req.param('password');
	var msg_payload={"username":user,"password":pass}

	mq_client.make_request('login_queue',msg_payload, function(err,results){
		console.log("Results recvd as :"+JSON.stringify(results));
		if(err){
			throw err;
		}
		else{
			if(results.code == 200){
				console.log("valid Login");
				req.session.username = user.toString();
				req.session.password = pass;
				req.session.acc_id = results.value.acc_id;
				req.session.name = results.value.fname ;
				res.send({
					"result": "Ok",
					"name": results.value.fname + " " + results.value.lname,
					"acc_id": results.value.acc_id
				});
			}
			else {
				console.log("Invalid Login");
				res.send({"result": "404"});
			}
			}

	});

	reqno++;

	console.log("Username for Login :"+user);
	console.log("Password for Login :"+pass);


	// mongo.connect(mongoURL,function () {
	// 	coll = mongo.collection('userinfo');
    //
	// 	coll.findOne({email:user},function (err,result) {
	// 		if(!err){
	// 			if(result==undefined){
	// 				console.log("Incorrect Username");
	// 				res.send({"result":"404"});
	// 			}
    //
	// 			else{
	// 				try{
	// 					var decryptedData = sjcl.decrypt("newpass", result.password);
	// 					if (decryptedData != pass) {
	// 							  console.log("User pass from db after decryption=" + decryptedData);
	// 							  console.log("User pass from client =" + pass);
	// 							  console.log("Incorrect Password.");
    //
	// 							  res.send({"result": "404"});
	// 						  }
	// 						  else {
	// 							  console.log("User pass from db after decryption=" + decryptedData);
	// 							  console.log("User pass from client =" + pass[0]);
	// 							  if (decryptedData === pass) {
	// 								  console.log("Password Correct !");
	// 								  req.session.username = user.toString();
	// 								  req.session.password = result.password.toString();
	// 								  req.session.acc_id = result.acc_id;
	// 								  req.session.name = result.fname ;
	// 								  res.send({
	// 									  "result": "Ok",
	// 									  "name": result.fname + " " + result.lname,
	// 									  "acc_id": result.acc_id
	// 								  });
	// 							  }
	// 						}
	// 				}
	// 				catch (err){
	// 					res.send({"result": "404"});
	// 				}
	// 			}
	// 		}
	// 		else{
	// 			console.log('Error while performing lookup Query:'+err);
	// 		}
	// 	})
	// })

	// connection.query('select * from userinfo where email=?;',[user.toString()], function(err, rows, fields) {
	// 	  if (!err)
	// 	    {
	// 		  console.log(rows);
	// 		  if(rows[0]==undefined){
	// 			  console.log("Incorrect Username.");
    //
	// 			  res.send({"result":"404"});
	// 		  }
	// 		  else
	// 		  {
	// 			  try {
	// 				  var decryptedData = sjcl.decrypt("newpass", rows[0].password);
	// 				  if (decryptedData != pass) {
	// 					  console.log("User pass from db after decryption=" + decryptedData);
	// 					  console.log("User pass from client =" + pass);
	// 					  console.log("Incorrect Password.");
    //
	// 					  res.send({"result": "404"});
	// 				  }
	// 				  else {
	// 					  console.log("User pass from db after decryption=" + decryptedData);
	// 					  console.log("User pass from client =" + pass[0]);
	// 					  if (decryptedData === pass) {
	// 						  console.log("Password Correct !");
	// 						  req.session.username = user.toString();
	// 						  req.session.password = rows[0].password.toString();
	// 						  req.session.acc_id = rows[0].acc_id;
	// 						  req.session.name = rows[0].fname ;
	// 						  res.send({
	// 							  "result": "Ok",
	// 							  "name": rows[0].fname + " " + rows[0].lname,
	// 							  "acc_id": rows[0].acc_id
	// 						  });
    //
	// 					  }
	// 				  }
	// 			  }
	// 			  catch (err){
	// 				  res.send({"result": "404"});
	// 			  }
	// 		  }
    //
	// 	    }
	// 	  else
	// 	    console.log('Error while performing lookup Query:'+err);
	// 	});
	connect.returnConnection(connection);

};

