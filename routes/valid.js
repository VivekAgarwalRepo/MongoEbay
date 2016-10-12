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


exports.validate=function(req,res){
	var user=req.param('username');
	var pass=req.param('password');


	// var original="vivek";
	// var encrypt=sjcl.encrypt("password",original);
	// console.log("Encrpyted shit :"+encrypt);
    //
	// var decrypt=sjcl.decrypt("password",encrypt);
	// console.log("Decrpted Shit :"+decrypt);


	console.log("Username for Login :"+user);
	console.log("Password for Login :"+pass);

	connection.query('select * from userinfo where email=?;',[user.toString()], function(err, rows, fields) {
		  if (!err)
		    {
			  console.log(rows);
			  if(rows[0]==undefined){
				  console.log("Incorrect Username.");
				  
				  res.send({"result":"404"});
			  }
			  else
			  {

				  try {
					  var decryptedData = sjcl.decrypt("newpass", rows[0].password);
					  if (decryptedData != pass) {
						  console.log("User pass from db after decryption=" + decryptedData);
						  console.log("User pass from client =" + pass);
						  console.log("Incorrect Password.");

						  res.send({"result": "404"});
					  }
					  else {
						  console.log("User pass from db after decryption=" + decryptedData);
						  console.log("User pass from client =" + pass[0]);
						  if (decryptedData === pass) {
							  console.log("Password Correct !");
							  req.session.username = user.toString();
							  req.session.password = rows[0].password.toString();
							  req.session.acc_id = rows[0].acc_id;
							  req.session.name = rows[0].fname + " " + rows[0].lname;
							  res.send({
								  "result": "Ok",
								  "name": rows[0].fname + " " + rows[0].lname,
								  "acc_id": rows[0].acc_id
							  });

						  }
					  }
				  }
				  catch (err){
					  res.send({"result": "404"});
				  }
			  }
			 
		    }
		  else
		    console.log('Error while performing lookup Query:'+err);
		});

};