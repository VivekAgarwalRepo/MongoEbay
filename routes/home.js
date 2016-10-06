/**
 * New node file
 */



exports.login=function(req,res){
	console.log("Current User :"+req.session.username);

	if(req.session.username!=undefined){
		res.redirect("/home");
	}

	res.render("login");
	
}