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
        console.log("id for item :"+req.param("id")+" and quant :"+req.param("quant"));

            connection.query('insert into cart(acc_id,item_id,quant) values (?,?,?) ON DUPLICATE KEY UPDATE quant=?;', [req.session.acc_id,req.param("id"),req.param("quant"),req.param("quant")], function (err, rows, fields) {
                console.log("Query Success");
                if (!err){
                    if(rows==undefined)
                    {
                        console.log("Could not enter row in cart");
                        res.send("404");
                    }
                        //res.send("Empty Database for item_id :"+cartitems[0].id);
                }
                else {
                    console.log("Could not insert :"+err);
                    res.send("404");
                }
            });

        res.send("Success");
    }
    else{
        res.send("invalid-session");
    }

};

exports.removeItem=function (req,res) {
    console.log("acc id :"+req.session.acc_id+" item_id :"+req.param("item_id"));
    connection.query('delete from cart where acc_id=? AND item_id=?;',[req.session.acc_id,req.param("item_id")], function (err, rows, fields) {
        if(!err){
            if(rows!=undefined){
                console.log("Item "+req.param("item_id")+" removed from cart!");
                res.send("Success");
            }
            else{
                console.log("Could not find item to be deleted!");
                res.status(404);
            }
        }
        else{
            console.log("Error while removing item from cart! "+err);
            res.status(404);
        }
    })
}
exports.displayCart=function(req,res){

    if(req.session.username) //check whether session is valid
    {
        connection.query('select adverts.item_id,adverts.text,adverts.category,adverts.price,adverts.unit_price,cart.quant,adverts.shipping from adverts inner join cart on adverts.item_id=cart.item_id where cart.acc_id=?;',[req.session.acc_id],function (err, rows, fields) {
            if(!err){
                if(rows!=undefined){
                    res.send(rows)
                }
                else
                    res.send("Empty cart");
            }
            else{
                res.send("Failed to insert into database");
            }
        });
    }

    else{
        res.send("invalid-session");
    }
}