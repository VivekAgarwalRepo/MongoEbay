/**
 * New node file
 */
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'USAdream$123',
  database : 'accounts'
});

connection.connect(function(err) {
	  if (err) {
		    console.error('error connecting: ' + err.stack);
		    return;
		  }

		  console.log('connected with id ' + connection.threadId);
		});

var sjcl = require("sjcl");

exports.addUser=function(req,res){
	console.log("Email :"+req.param("nemail"));
	console.log("npassword :"+req.param("npassword"));
	console.log("firstName :"+req.param("firstName"));
	console.log("lastName :"+req.param("lastName"));
	
	var user=req.param('nemail');

	var acc_id;
	var fname=req.param("firstName");
	var lname=req.param("lastName");
	var pass=sjcl.encrypt("newpass",req.param("npassword"));


	 connection.query('select acc_id from userinfo order by acc_id desc limit 1;',[],function(err, rows, fields){
		 if(!err){
			// console.log("rows :"+rows[0].acc_id);
			 acc_id=rows[0].acc_id*1+1;
			 console.log("Current acc_id :"+acc_id);
		 }
		 else{
			 console.log("Error in obtaining last acc_id :"+err);
		 }
	  });


	connection.query('select email from userinfo where email=?;',[user], function(err, rows, fields){
		  if (!err)
		    {


			  if(rows[0]==undefined){
			  connection.query('INSERT INTO userinfo (acc_id,fname,lname,email,password) VALUES(?,?,?,?,?);',[acc_id,fname,lname,user.toString(),pass.toString()],function(err, rows, fields){
				  if(!err){
					  console.log("New user added successfully!");
					  req.session.username=user.toString();
					  res.send({"result":"success","acc_id":acc_id,"name":fname+" "+lname});
				  }
				  else{
					  console.log("Insert New User Error :"+err);
					  res.send({"result":"insertError"});
				  }

			  });

		    }
			  else{
				  	console.log("User exists!");
				    res.send({"result":"present"});
			  }
		    }
		  else{
		    console.log('Error :'+err);
		  }
		});

};