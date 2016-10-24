connect=require('./mysqlconnect');
connection = connect.getconnection();
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/EbayDB";
var waterfall = require('async-waterfall');
var Promise = require('promise');
// console.log("Connection received as :"+connection);


var cartitems=[];

exports.addtocart=function(req,res){

    if(req.session.username) //check whether session is valid
    {
        coll=mongo.collection('cart');

        coll.update({item_id:req.param('id')}, {$set: {acc_id:req.session.acc_id,item_id:req.param("id"),quant:req.param("quant")}},{upsert:true},function (err,result) {

            if(!err){
                if(result==undefined){
                    console.log("Cart operation insertion failed!")
                }
                else{
                    console.log("Cart operation insertion success");
                    res.send("Success");
                }
            }
            else{
                console.log("Error encountered in addition to cart as :"+err);
            }

        });
        // console.log("id for item :"+req.param("id")+" and quant :"+req.param("quant"));
        //
        //     connection.query('insert into cart(acc_id,item_id,quant) values (?,?,?) ON DUPLICATE KEY UPDATE quant=?;', [req.session.acc_id,req.param("id"),req.param("quant"),req.param("quant")], function (err, rows, fields) {
        //         console.log("Query Success");
        //         if (!err){
        //             if(rows==undefined)
        //             {
        //                 console.log("Could not enter row in cart");
        //                 res.send("404");
        //             }
        //                 //res.send("Empty Database for item_id :"+cartitems[0].id);
        //         }
        //         else {
        //             console.log("Could not insert :"+err);
        //             res.send("404");
        //         }
        //     });
        //
        // res.send("Success");
    }
    else{
        res.send("invalid-session");
    }
    connect.returnConnection(connection);
};

exports.removeItem=function (req,res) {

    cart.remove({item_id: req.param("item_id"),acc_id:req.session.acc_id}, function (err, result) {
        if(!err){
            if(result!=undefined){
                console.log("Item "+req.param("item_id")+" removed from cart! + result :"+result);
                            res.send("Success");
            }
            else{
                console.log("Item "+req.param("item_id")+" could not be deleted from cart!");
                res.send("404");
            }
        }
        else{
            res.send("404");
        }
    });



    // console.log("acc id :"+req.session.acc_id+" item_id :"+req.param("item_id"));
    // connection.query('delete from cart where acc_id=? AND item_id=?;',[req.session.acc_id,req.param("item_id")], function (err, rows, fields) {
    //     if(!err){
    //         if(rows!=undefined){
    //             console.log("Item "+req.param("item_id")+" removed from cart!");
    //             res.send("Success");
    //         }
    //         else{
    //             console.log("Could not find item to be deleted!");
    //             res.status(404);
    //         }
    //     }
    //     else{
    //         console.log("Error while removing item from cart! "+err);
    //         res.status(404);
    //     }
    // })
    connect.returnConnection(connection);

}

exports.checkBid=function (req,res) {

    console.log("Checking for bid victories!");
    if (req.session.username) //check whether session is valid
    {
        auction=mongo.collection('auction');
        adverts=mongo.collection('adverts');
        cart=mongo.collection('cart');

        auction.find({acc_id:req.session.acc_id},function (err,aucrescur) {
        if(!err && aucrescur!=undefined){

                    aucrescur.toArray(function (err,aucdocs) {
                        for(var i in aucdocs){
                            adverts.findOne({item_id: aucdocs.item_id}, function (err, advertres) {
                                if (!err && advertres != undefined) {
                                    if(advertres.dueDate.getTime()<=Date.now()){
                                        cart.insert({acc_id:req.session.acc_id,item_id:advertres.item_id,quant:advertres.qty},function (err,cartsuc) {
                                            if(cartsuc!=undefined && !err){
                                                auction.remove({item_id:advertres.item_id},function (err,remsuc) {
                                                    if(!err && remsuc!=undefined){
                                                        adverts.remove({item_id:advertres.item_id},function (err,finalstep) {
                                                            if(!err && finalstep!=undefined){
                                                                res.send("success")
                                                            }
                                                            else{
                                                                res.send("failure")
                                                            }
                                                        })
                                                    }

                                                })
                                            }
                                            else{
                                                res.send("failure")
                                            }
                                        })
                                    }
                                }
                                else{

                                }

                            })
                        }

                    })
        }
        else{
            res.send("failure")
        }
    })


        // connection.query('select auction.*, adverts.dueDate,adverts.category,adverts.text,adverts.qty,adverts.shipping from auction,adverts where auction.acc_id=? and adverts.item_id=auction.item_id;',[req.session.acc_id],function (err, rows, fields) {
        //     if (!err) {
        //         if(rows[0]!=undefined){
        //             if(Date.parse(rows[0].dueDate.toString())==Date.now()){
        //                 connection.query("delete from auction where acc_id=?;",[req.session.acc_id],function (err, rows2, fields) {
        //                     if(err){
        //                         console.log("Error deleting from auction after bid is over :"+err);
        //                     }
        //                 });
        //                 for (r in rows){
        //                         connection.query("delete from adverts where item_id=?;", [rows[r].item_id], function (err, rows3, fields) {
        //                             if(err){
        //                                 console.log("Error deleting from adverts after bid is over :"+err);
        //                             }
        //                         });
        //                     }
        //                 res.send(rows);
        //
        //             }
        //             else
        //                 res.send("negative");
        //         }
        //         else{
        //             res.send("negative");
        //         }
        //     }
        //     else {
        //
        //     }
        // });
    }
    else {
        res.send("invalid-session");
    }
}

function getAdverts(item,callback){

    var resultColl=[];

                adverts.find({item_id: item.item_id}, function (err, cursor2) {

                        cursor2.toArray(function (err, result) {
                                if(!err) {

                                    if (result != undefined) {
                                        resultColl.push({
                                            "item_id": result[0].item_id,
                                            "text": result[0].text,
                                            "category": result[0].category,
                                            "price": result[0].price,
                                            "unit_price": result[0].unit_price,
                                            "shipping": result[0].shipping,
                                            "quant": item.quant
                                        })
                                    }
                                    else{
                                        console.log("result in lookup :"+resultColl);
                                    }
                                    console.log("Result in adverts :"+JSON.stringify(resultColl));
                                    callback(resultColl);
                                }
                                else{
                                        console.log("Error :"+err);
                                    }
                                })
                        })
}




exports.displayCart=function(req,res){


    if(req.session.username) //check whether session is valid
    {
        var resultColl=[];
        cart=mongo.collection('cart');
        adverts=mongo.collection('adverts');

                cart.find({acc_id: req.session.acc_id}, function (err, cursor) {
                    if (!err) {
                        cursor.toArray(function (err, item) {

                                 console.log("Details from cart :" + JSON.stringify(item));
                                    for (var i = 0; i < item.length; i++) {
                                    console.log("item.item_id ="+item[i].item_id);

                                    getAdverts(item[i],function (data) {
                                        resultColl.push(data[0]);
                                        console.log("i="+i+" resultcoll :"+JSON.stringify(resultColl));

                                    });
                                        if(i==item.length-1)
                                            setTimeout(function () {
                                                res.send(resultColl);
                                            },100);
                                }
                        })
                    }
                })
        // connection.query('select adverts.item_id,adverts.text,adverts.category,adverts.price,adverts.unit_price,cart.quant,adverts.shipping from adverts inner join cart on adverts.item_id=cart.item_id where cart.acc_id=?;',[req.session.acc_id],function (err, rows, fields) {
        //     if(!err){
        //         if(rows!=undefined){
        //             res.send(rows)
        //         }
        //         else
        //             res.send("Empty cart");
        //     }
        //     else{
        //         res.send("Failed to insert into database");
        //     }
        // });
    }

    else{
        res.send("invalid-session");
    }
    connect.returnConnection(connection);

}

exports.getUserAds=function (req,res) {
    if(req.session.username) //check whether session is valid
    {
        connection.query('select * from adverts where acc_id=?;', [req.session.acc_id], function (err, rows, fields) {
            if (!err) {
                res.send(rows);
            }
            else {
                res.send("failed");
            }
        });
    }

    else{
        res.send("invalid-session");
    }

}
exports.getHistory=function (req,res) {
    if(req.session.username) //check whether session is valid
    {
        connection.query('select * from history where acc_id=?;', [req.session.acc_id], function (err, rows, fields) {
            if (!err) {
                res.send(rows);
            }
            else {
                res.send("failed");
            }
        });
        connect.returnConnection(connection);
    }
    else{
        res.send("invalid-session");
    }
}