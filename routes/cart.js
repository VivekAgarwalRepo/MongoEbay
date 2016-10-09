/**
 * Created by Vivek Agarwal on 10/6/2016.
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

var cartitems=[];

exports.addtocart=function(req,res){

    if(req.session.username) //check whether session is valid
    {
        console.log("id for item :"+req.param("id"));
            connection.query('select * from adverts where item_id=?;', [req.param("id")], function (err, rows, fields) {
                console.log("Query Success");
                if (!err) {

                    if(rows!=undefined){

                        cartitems.push(rows[0]);

                        console.log(cartitems[0]);
                    }
                    else{
                        res.send("Empty Database for item_id :"+cartitems[0].id);
                    }
                }
                else {
                    res.send("404");
                }
            });

        res.send("Success");
    }
    else{
        res.send("invalid-session");
    }

};

exports.displayCart=function(req,res){

    if(req.session.username) //check whether session is valid
    {

        if(cartitems.length!=0){
            console.log(cartitems.length);
            res.send(cartitems);

        }
        else
            res.send("Empty cart");
    }
    else{
        res.send("invalid-session");
    }
}