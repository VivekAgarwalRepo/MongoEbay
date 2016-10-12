/**
 * Created by Vivek Agarwal on 10/3/2016.
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

exports.add=function(req,res){

    console.log(req.param("text"));
    console.log(req.param("quant"));
    console.log(req.param("price"));
    console.log(req.param("ship"));
    if(req.session.username==undefined){
        res.send("invalid-session");
    }
    else {
        console.log("Category is :" + req.param("category"));
        console.log(" Advert Recv from Account no :" + req.session.acc_id);

        var item_id;
        connection.query('select item_id from adverts order by item_id desc limit 1;', [], function (err, rows, fields) {
            if (!err) {
               // console.log("rows :" + rows);
                if (rows != "") {
                    item_id = rows[0].item_id * 1 + 1;
                    // console.log("Current item_id :" + item_id);
                    // console.log("TypeOf price :"+typeof req.param("price"));
                    // console.log("TypeOf quant :"+typeof req.param("quant"));

                    connection.query('insert into adverts(acc_id,item_id,category,text,qty,price,shipping,unit_price,bid) values (?,?,?,?,?,?,?,?,?);', [req.session.acc_id, item_id, req.param("category"), req.param("text"), req.param("quant"), req.param("price"), req.param("ship"),Math.round((req.param("price")*1/req.param("quant")*1)*100)/100,req.param("bidding")], function (err, rows, fields) {
                        if (!err) {
                            console.log("Advert Placed!");
                            res.send({"result": "success", "item_id": item_id});
                        }
                        else {
                            console.log("Insert New Add Error :" + err);
                            res.send({"result": "insertAddError"});
                        }

                    });
                }
                else {
                    var item_id = 87654321;
                    console.log("Created id for first item in database :" + item_id);
                    console.log("Current item_id :" + item_id);
                    connection.query('insert into adverts(acc_id,item_id,category,text,qty,price,shipping,unit_price,bid) values (?,?,?,?,?,?,?,?,?);', [req.session.acc_id, item_id, req.param("category"), req.param("text"), req.param("quant"), req.param("price"), req.param("ship"),Math.round((req.param("price")*1/req.param("quant")*1)*100)/100,req.param("bidding")], function (err, rows, fields) {
                        if (!err) {
                            console.log("Advert Placed!");
                            res.send({"result": "success", "item_id": item_id});
                        }
                        else {
                            console.log("Insert New Add Error :" + err);
                            res.send({"result": "insertAddError"});
                        }

                    });
                }
            }
            else {

                console.log("Error reading last item from database");
            }
        });
    }
};

exports.showNonBid=function (req,res) {

    if(req.session.username==undefined){
        res.send("invalid-session");
    }
    else{
        connection.query('select * from adverts where bid=false;',[],function(err, rows, fields){
        if(!err){
            if(rows!=undefined){

                console.log(rows);
                res.send(rows);

            }
            else{
                res.send("Empty Database for Adverts");
            }
        }
        else{
            console.log("Fetch error for adverts :"+err);
            res.send("Fetch Error");
        }
    })}


};

exports.showBid=function(req,res){
    if(req.session.username==undefined){
        res.send("invalid-session");
    }
    else{
        connection.query('select * from adverts where bid=true;',[],function(err, rows, fields){
            if(!err){
                if(rows!=undefined){

                    console.log(rows);
                    res.send(rows);

                }
                else{
                    res.send("Empty Database for Adverts");
                }
            }
            else{
                res.send("Fetch Error");
            }
        })
    }
}