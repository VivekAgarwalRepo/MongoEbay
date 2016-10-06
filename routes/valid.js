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

exports.validate=function(req,res){
	var user=req.param('username');
	var pass=req.param('password');
	
	console.log("Username for Login :"+user);
	console.log("Password for Login :"+pass);
	
	connection.query('select * from userinfo where email=?;',[user.toString()], function(err, rows, fields) {
		  if (!err)
		    {
			  console.log(rows);
			  if(rows==undefined){
				  console.log("Incorrect Username.");
				  
				  res.send({"result":"404"});
			  }
			  else
				  if(rows[0].password!==pass){
					  console.log("Incorrect Password.");
					  
					  res.send({"result":"404"});
				  }
			  else
			  if(rows[0].password===pass){
				  console.log("Password Correct !");
				  req.session.username = user.toString();
				  req.session.password=rows[0].password.toString();
				  req.session.acc_id=rows[0].acc_id;
				  req.session.name=rows[0].fname+" "+rows[0].lname;
				  res.send({"result":"Ok","name":rows[0].fname+" "+rows[0].lname,"acc_id":rows[0].acc_id});
				  
			  }
			 
		    }
		  else
		    console.log('Error while performing lookup Query:'+err);
		});

};