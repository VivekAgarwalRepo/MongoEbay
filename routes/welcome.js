var mq_client = require('../rpc/client');
var amqp = require('amqplib/callback_api');

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/EbayDB";
// console.log("Connection received as :"+connection);
var sjcl = require("sjcl");

exports.addUser=function(req,res){
	console.log("Email :"+req.param("nemail"));
	console.log("npassword :"+req.param("npassword"));
	console.log("firstName :"+req.param("firstName"));
	console.log("lastName :"+req.param("lastName"));

	var user=req.param('nemail');


	var fname=req.param("firstName");
	var lname=req.param("lastName");
	var pass=sjcl.encrypt("newpass",req.param("npassword"));

	msg_payload={"fname":fname,"lname":lname,"email":user,"pass":pass,"user":user};
	mq_client.make_request('registration_queue',msg_payload, function(err,results) {
		console.log("Results for registration recvd as :" + JSON.stringify(results));
		if (err) {
			res.send("timeout");
		}
		else {
			if(results.code==200){
				// console.log("Retrieved last Login time as :"+new Date(results.value));
				res.send({"result":"success"});
			}
			else
				if(results.code=403){
					res.send({"result":"present"});
				}
			else{
				res.send("failed");
			}
		}
	});

	// mongo.connect(mongoURL,function () {
	// 	coll=mongo.collection('userinfo');
    //
	// 	coll.findOne({},{limit:1,sort:{"acc_id":-1}},function (err,docs) {
    //
	// 		if(!err){
	// 			if(docs!=undefined){
    //
	// 				console.log("Got as : "+docs.acc_id);
	// 				var acc_id=docs.acc_id;
	// 				acc_id=acc_id+1;
    //
	// 				coll.findOne({email:user},function (err,result) {
	// 					if(!err){
	// 						if(result==undefined){
	// 							coll.insert({acc_id:acc_id,fname:fname,lname:lname,email:user,password:pass},function (err,result) {
	// 								if(!err){
	// 									res.send({"result":"success"});
	// 								}
	// 								else{
	// 									res.send({"result":"Oops! Please try again later"});
	// 								}
	// 							});
	// 						}
	// 						else{
	// 							res.send({"result":"present"})
	// 						}
	// 					}
	// 					else{
	// 						res.send({"result":"Oops! Please try again later"})
	// 					}
	// 				})
    //
	// 			}
	// 			else{
	// 				console.log("The document is not found!");
	// 			}
	// 		}
	// 		else{
	// 			console.log("Error encountered in query :"+err);
	// 		}
	// 	});
	// })




	//  connection.query('select acc_id from userinfo order by acc_id desc limit 1;',[],function(err, rows, fields){
	// 	 if(!err){
	// 		// console.log("rows :"+rows[0].acc_id);
	// 		 acc_id=rows[0].acc_id*1+1;
	// 		 console.log("Current acc_id :"+acc_id);
	// 		 connection.query('select email from userinfo where email=?;',[user], function(err, rows, fields){
	// 			 if (!err)
	// 			 {
    //
    //
	// 				 if(rows[0]==undefined){
	// 					 connection.query('INSERT INTO userinfo (acc_id,fname,lname,email,password) VALUES(?,?,?,?,?);',[acc_id,fname,lname,user.toString(),pass.toString()],function(err, rows, fields){
	// 						 if(!err){
	// 							 console.log("New user added successfully!");
	// 							 req.session.username=user.toString();
	// 							 req.session.password = req.param("npassword");
	// 							 req.session.acc_id = acc_id;
	// 							 req.session.name = req.param("firstName");
	// 							 res.send({"result":"success","acc_id":acc_id,"name":fname+" "+lname});
	// 						 }
	// 						 else{
	// 							 console.log("Insert New User Error :"+err);
	// 							 res.send({"result":"insertError"});
	// 						 }
    //
	// 					 });
    //
	// 				 }
	// 				 else{
	// 					 console.log("User exists!");
	// 					 res.send({"result":"present"});
	// 				 }
	// 			 }
	// 			 else{
	// 				 console.log('Error :'+err);
	// 			 }
	// 		 });
	// 	 }
	// 	 else{
	// 		 console.log("Error in obtaining last acc_id :"+err);
	// 	 }
	//   });
    //
    //
    //
	// connect.returnConnection(connection);
};
