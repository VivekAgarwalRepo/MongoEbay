connect=require('./mysqlconnect');

connection = connect.getconnection();
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/EbayDB";
var mq_client = require('../rpc/client');

// console.log("Connection received as :"+connection);


exports.add=function(req,res){

    // console.log(req.param("text"));
    // console.log(req.param("quant"));
    // console.log(req.param("price"));
    // console.log(req.param("ship"));

    var text=req.param("text");
    var quant=req.param("quant");
    var price=req.param("price");
    var ship=req.param("ship");


    if(req.session.username==undefined){
        res.send("invalid-session");
    }
    else {

        coll=mongo.collection('adverts');

        coll.findOne({},{limit:1,sort:{"item_id":-1}},function (err,result) {
            if(!err) {

                var someDate = new Date();
                var numberOfDaysToAdd = 4;
                someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

                if (result != undefined) {
                    var lastitem=result.item_id;
                    lastitem++;


                    coll.insert({'acc_id':req.session.acc_id,'item_id':lastitem,'category':req.param('category'),'text':text,'qty':quant,'price':price,'shipping':ship,'unit_price':Math.round((req.param("price")*1/req.param("quant")*1)*100)/100,'bid':req.param('bidding'),timestamp:new Date(),dueDate : someDate})
                    res.send({"result": "success", "item_id": lastitem});
                }
                else {
                    coll.insert({'acc_id':req.session.acc_id,'item_id':87654321,'category':req.param('category'),'text':text,'qty':quant,'price':price,'shipping':ship,'unit_price':Math.round((req.param("price")*1/req.param("quant")*1)*100)/100,'bid':req.param('bidding'),timestamp:new Date(),dueDate : someDate})
                    res.send({"result": "success", "item_id": 87654321});
                }
            }
            else{
                res.send({"result": "insertAddError"});
            }
        })

        // console.log("Category is :" + req.param("category"));
        // console.log(" Advert Recv from Account no :" + req.session.acc_id);
        //
        // var item_id;
        //
        //         console.log("Created a connection in pool");
        //         connection.query('select item_id from adverts order by item_id desc limit 1;', [], function (err, rows, fields) {
        //             if (!err) {
        //                 // console.log("rows :" + rows);
        //                 if (rows != "") {
        //                     item_id = rows[0].item_id * 1 + 1;
        //                     // console.log("Current item_id :" + item_id);
        //                     // console.log("TypeOf price :"+typeof req.param("price"));
        //                     // console.log("TypeOf quant :"+typeof req.param("quant"));
        //
        //                     connection.query('insert into adverts(acc_id,item_id,category,text,qty,price,shipping,unit_price,bid,dueDate) values (?,?,?,?,?,?,?,?,?,DATE_ADD(NOW(), INTERVAL 4 DAY));', [req.session.acc_id, item_id, req.param("category"), req.param("text"), req.param("quant"), req.param("price"), req.param("ship"),Math.round((req.param("price")*1/req.param("quant")*1)*100)/100,req.param("bidding")], function (err, rows, fields) {
        //                         if (!err) {
        //                             console.log("Advert Placed!");
        //                             res.send({"result": "success", "item_id": item_id});
        //                         }
        //                         else {
        //                             console.log("Insert New Add Error :" + err);
        //                             res.send({"result": "insertAddError"});
        //                         }
        //
        //                     });
        //                 }
        //                 else {
        //                     var item_id = 87654321;
        //                     console.log("Created id for first item in database :" + item_id);
        //                     console.log("Current item_id :" + item_id);
        //                     connection.query('insert into adverts(acc_id,item_id,category,text,qty,price,shipping,unit_price,bid) values (?,?,?,?,?,?,?,?,?);', [req.session.acc_id, item_id, req.param("category"), req.param("text"), req.param("quant"), req.param("price"), req.param("ship"),Math.round((req.param("price")*1/req.param("quant")*1)*100)/100,req.param("bidding")], function (err, rows, fields) {
        //                         if (!err) {
        //                             console.log("Advert Placed!");
        //                             res.send({"result": "success", "item_id": item_id});
        //                         }
        //                         else {
        //                             console.log("Insert New Add Error :" + err);
        //                             res.send({"result": "insertAddError"});
        //                         }
        //
        //                     });
        //                 }
        //             }
        //             else {
        //
        //                 console.log("Error reading last item from database");
        //             }
        //         });
        //
        //

    }
    connect.returnConnection(connection);
};

exports.showNonBid=function (req,res) {

    if(req.session.username==undefined){
        res.send("invalid-session");
    }
    else {

        var msg_payload={"acc_id":req.session.acc_id}

        mq_client.make_request('adverts_queue',msg_payload, function(err,results) {
            console.log("Results recvd as :" + JSON.stringify(results));
            if (err) {
                throw err;
            }
            else {
                if(results.code == 200){
                    res.send(results.value);
                }
            }
        });

        // coll=mongo.collection('adverts');
        // currID=req.session.acc_id;
        //
        // coll.find({acc_id:{$ne:currID},bid:false},function (err,cursor) {
        //     cursor.toArray(function(err, documents) {
        //       console.log("Document Array Length :"+documents.length);
        //         res.send(documents);
        //     })
        //
        // });

    }
    connect.returnConnection(connection);
};

var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'BiddingActivity.log',level:'info',json:true  })
    ]
});

// winston.add(winston.transports.File, { filename: 'BiddingActivity.log',level:'info',json:true });

exports.addtobid=function (req,res) {
    if(req.session.username==undefined){
        res.send("invalid-session");
    }
    else {

        var msg_payload = {"acc_id": req.session.acc_id,"item_id":req.param("item_id"),"highestamt":req.param("bidamt")}

        mq_client.make_request('bid_queue', msg_payload, function (err, results) {
            console.log("Results recvd as :" + JSON.stringify(results));
            if (err) {
                throw err;
            }
            else {
                if (results.code == 200) {
                    res.send("success");
                }
                else{
                    res.send(results.value);
                }
            }
        });
    }

    // console.log("Placing Bid!");
    //
    // mongo.connect(mongoURL,function () {
    //     auction = mongo.collection('auction');
    //     adverts=mongo.collection('adverts');
    //
    //     auction.findOne({item_id:req.param("item_id")},function (err,result) {
    //         adverts.findOne({item_id:req.param("item_id")},function (err,advertRes) {
    //             console.log("auction highest price :"+result.highestamt)
    //             console.log("auction due date :"+advertRes.dueDate)
    //             if(result==undefined){
    //                 if(advertRes.dueDate.getTime()<Date.now()){
    //                     res.send("Bid time expired.");
    //                 }
    //                 else{
    //                     auction.insert({item_id:req.param("item_id"),highestamt:req.param("bidamt")},function (err,succ) {
    //                         if(!err)
    //                         {
    //                             console.log("Bid placed")
    //                             res.send("success")
    //
    //                         }
    //
    //                         else{
    //                             res.send("Failure in bidding")
    //                         }
    //                     })
    //                 }
    //             }
    //             else{
    //                 if(advertRes.dueDate.getTime()<Date.now()){
    //                     res.send("Bid time expired.");
    //                 }
    //                 else
    //                     if(result.highestamt>=req.param('bidamt')){
    //                         res.send("Insufficient Bid amount for competition...");
    //                     }
    //                 else{
    //                         auction.update({item_id:req.param("item_id")},{$set:{highestamt:req.param('bidamt')}},function (err,result) {
    //                          if(result!=undefined && !err){
    //                                 console.log("Bid amount reset!")
    //                                 res.send("success")
    //                                 }
    //                                 else{
    //                              res.send("Failure in bidding")
    //                          }
    //                         });
    //                     }
    //             }
    //         });
    //
    //     })
    //
    // });


    //
    //         connection.query('select auction.highestamt,adverts.dueDate from auction inner join adverts on adverts.item_id=auction.item_id where adverts.item_id=? ;',[req.param("item_id")],function(err, rows, fields){
    //             //console.log("rows :"+rows);
    //             if(!err){
    //                 if(rows!=""){
    //                     console.log("Due Date :"+rows[0].dueDate);
    //
    //                     if(rows[0].highestamt>=req.param("bidamt")){
    //                         console.log("Current date :"+Date.now()+" : Due Date: "+ Date.parse(rows[0].dueDate.toString()));
    //
    //                         res.send("Insufficient bid amount");
    //                     }
    //                     else
    //                         if(Date.now()>Date.parse(rows[0].dueDate.toString())){
    //                             console.log("Insufficient bid amount : seller :"+req.param("bidamt")+" highestamt :"+rows[0].highestamt);
    //                             res.send("Bid time expired.");
    //                         }
    //                     else{
    //                         connection.query('update auction set acc_id=?, highestamt=? where item_id=?',[req.session.acc_id,req.param("bidamt"),req.param("item_id")],function(err, rows, fields){
    //                             if(!err){
    //                                 console.log("Successfully updated to bid.");
    //                                 logger.info({"acc_id":req.session.acc_id,"item_id":req.param("item_id"),"amount":req.param("bidamt")});
    //                                 res.send("success");
    //                             }
    //                             else{
    //                                 console.log("Failure in updating to auction :"+err);
    //                                 res.send("Failure in bidding");
    //                             }
    //                         })
    //                     }
    //                 }
    //                 else {
    //                     connection.query('insert into auction(item_id,acc_id,base,highestamt) values (?,?,?,?);',[req.param("item_id"),req.session.acc_id,req.param("base"),req.param("bidamt")],function(err, rows, fields){
    //                         if(!err){
    //                             logger.info({"acc_id":req.session.acc_id,"item_id":req.param("item_id"),"amount":req.param("bidamt")});
    //                             console.log("Successfully added to bid.");
    //                             res.send("success");
    //                         }
    //                         else{
    //                             console.log("Failure in adding to auction :"+err);
    //                             res.send("Failure in bidding");
    //                         }
    //                     })
    //                 }
    //             }
    //             else{
    //                 console.log("Error in selecting highest amt from auction");
    //                 res.send("failure");
    //             }
    //
    // })
//    connect.returnConnection(connection);
}

exports.showBid=function(req,res){
    if(req.session.username==undefined){
        res.send("invalid-session");
    }
    else{
        var msg_payload={"acc_id":req.session.acc_id}

        mq_client.make_request('displayBids_queue',msg_payload, function(err,results) {
            console.log("Results recvd as :" + JSON.stringify(results));
            if (err) {
                throw err;
            }
            else {
                if(results.code == 200){
                    res.send(results.value);
                }
                else{
                    res.send("Fetch Error");
                }
            }

        });

        // coll=mongo.collection('adverts');
        // coll.find({acc_id:{$ne:currID},bid:true},function (err,cursor) {
        //     cursor.toArray(function(err, documents) {
        //         console.log("Document Array Length :"+documents.length);
        //         res.send(documents);
        //     })
        //
        // });



                // connection.query('select adverts.*,userinfo.fname,userinfo.lname from adverts,userinfo where bid=true and adverts.acc_id=userinfo.acc_id and adverts.acc_id!=?;',[req.session.acc_id],function(err, rows, fields){
                //     if(!err){
                //         if(rows!=undefined){
                //
                //            // console.log(rows);
                //             res.send(rows);
                //
                //         }
                //         else{
                //             res.send("Empty Database for Adverts");
                //         }
                //     }
                //     else{
                //         res.send("Fetch Error");
                //     }
                // })

    }
    connect.returnConnection(connection);
}

