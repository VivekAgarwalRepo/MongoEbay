var AddHandle=angular.module('placeadd',['ngRoute','ui.router','ngCookies']);

AddHandle.config(function ($stateProvider,$routeProvider,$urlRouterProvider) {

    $stateProvider
        .state('showAdvert',{
            url:'/showAdvert',
            templateUrl:"templates/displayAdverts.ejs",
            controller:"displayAdsController"
        })
        .state('bid',{
            url:'/bid',
            templateUrl:"templates/displayBids.ejs",
            controller:"displayBidsController"
        })
        .state('cart',{

            url:'/displayCart',
            templateUrl:'templates/cart.ejs',
            controller: "displayCartController"

        })
        .state('logout',{

            url:'/logout',
            controller: "logoutController"

        })
        .state('home',{
            url:'/',
            controller:"displayAdsController"
        })
        .state('sell',{
            url:'/sell',
            templateUrl:'templates/sell.ejs',
            controller: "advertisement"
        })
        .state('checkout',{
            url:'/checkout',
            templateUrl:'templates/checkout.ejs',
            controller: "checkOutController"
    })
        .state('about',{
            url:'/about',
            templateUrl:'templates/about.ejs',
            controller: "aboutUser"
        })
        .state('history',{
            url:'/history',
            templateUrl:'templates/history.ejs',
            controller: "orderHistoryController"
        })
        .state('useradvert',{
            url:'/useradvert',
            templateUrl:'templates/userad.ejs',
            controller:"useradvertController"
        })
});

AddHandle.controller('EventController',['$scope','$http','$cookieStore',function ($scope,$http,$cookieStore) {

    $scope.logEvent=function (id,type) {

        var log= {"id":id,"type":type,"timestamp":new Date(Date.now())};
        console.log("CookieStrore is currently :"+$cookieStore.get("LogRecords"));
        if($cookieStore.get("LogRecords") != undefined){
            var temp=[];
            temp=($cookieStore.get('LogRecords'));
            temp.push(log);
            $cookieStore.put('LogRecords',temp);//,{expires: new Date(2016, 12, 12)});

            // logs.push({"userclicks":log});
            console.log(JSON.stringify($cookieStore.get('LogRecords')));
        }
        else{
            var newlog=[];
            newlog.push(log);
            $cookieStore.put("LogRecords",newlog);
            console.log(JSON.stringify($cookieStore.get('LogRecords')));
        }
    }
}])

AddHandle.controller('useradvertController',function ($scope,$http) {

    $http({
        method: "GET",
        url: "/useradvertinfo",
    }).success(function (data) {
        if(data=="invalid-session"){
            alert("Your session has expired! Please login again.");
            window.location.assign("/login");
        }

        else
        {
            $scope.ads=data;
        }

    })
})

AddHandle.controller('logoutController',function ($scope,$http,$cookieStore) {

    $http({
        method: "POST",
        url: "/logout",
        data:{
            "Events":$cookieStore.get('LogRecords')
        }
    }).success(function (data) {
        if(data=="invalid-session"){
            alert("Your session has expired! Please login again.");
            window.location.assign("/login");
        }

        else
        {
            $cookieStore.remove('LogRecords');
            window.location.assign("/login");
        }

    })
})


AddHandle.controller('orderHistoryController',function ($scope,$http) {

    $http({
        method : "GET",
        url : "/getHistory"
    }).success(function (data) {
        if(data=="invalid-session"){
            alert("Your session has expired! Please login again.");
            window.location.assign("/login");
        }

        else
        {
            $scope.histories=data;
            $scope.purchase=data[0].orderdate
        }


    })
})

AddHandle.controller('aboutUser',function ($scope,$http) {
    $http({
        method : "POST",
        url : "/basicInfo"
    }).success(function (data) {
        $scope.name = data[0].fname + " " + data[0].lname;
        var id = data[0].acc_id.toString().substr(5, 8);
        $scope.handle = data[0].fname.toLowerCase() + "_" + id;

        if (data[0].bday != null) {
            $scope.hbday = true;
            $scope.bday = data[0].bday;
        }
        if (data[0].contact != null) {
            $scope.cont = true;
            $scope.contac = data[0].contact;
        }
        if (data[0].location != null) {
            $scope.hloc = true;
            $scope.locat = data[0].location;
        }
    });
    $scope.setBday=function () {
        $scope.hbday=true;
        $scope.bday=$scope.birthday;
        $http({
            method : "POST",
            url : "/updateBday",
            data:{"birthday":$scope.birthday}
        })
    }

    $scope.setContact=function () {
        $scope.cont=true;
        $scope.contac=$scope.contact;
        $http({
            method : "POST",
            url : "/updateContact",
            data : {"contact":$scope.contact}
        })
    }

    $scope.setLocation=function () {
        $scope.hloc=true;
        $scope.locat=$scope.location;
        $http({
            method : "POST",
            url : "/updateLocation",
            data : {"location":$scope.locat}
        })
    }

});

AddHandle.controller('checkOutController',function ($scope,$http) {

});

AddHandle.controller('displayBidsController',function ($scope,$http) {

    $http({
        method:"POST",
        url:"/showBiddingAdvert",
    }).success(function(data){
       // alert(data);
        if(data=="invalid-session"){
            alert("Your session has expired! Please login again.");
            window.location.assign("/login");
        }

        else
            $scope.auctions=data;


    })

    $scope.placeBid=function(item_id,amt,base){
        //alert("Item id :"+item_id+" amount :"+amt);

        $http({
            method:"POST",
            url:"/addToBid",
            data:{
                "item_id":item_id,
                "bidamt":amt,
                "base":base
            }
        }).success(function(data){
            // alert(data);
            if(data=="invalid-session"){
                alert("Your session has expired! Please login again.");
                window.location.assign("/login");
            }

            else
                alert(data);

        })
    }

});

AddHandle.controller('navController',function ($scope,$http) {
    var obj = this;
    obj.time = new Date();
})

AddHandle.controller('payment',function ($scope,$http) {
      $scope.validate=function(){
        $http({
            method:"POST",
            data:{
                "name":$scope.name,
                "shipping":$scope.shipping,
                "cardNum":$scope.cardNum,
                "validDate":$scope.validDate,
                "cvv":$scope.cvv
            },
            url:"/pay",

        }).success(function (data) {

            alert(data);
        });
    }


});

AddHandle.controller('displayAdsController',function($scope,$http){

    $scope.popcart=false;
    $http({
        method:"POST",
        url:"/showAdvert",
    }).success(function(data){

    if(data=="invalid-session"){
        alert("Your session has expired! Please login again.");
        window.location.assign("/login");
    }

    else
    {
        $scope.advertises=data;

    }

    })




});

AddHandle.controller('dateController',function ($scope,$http) {

    $http({
        method:"get",
        url:"/getTime",
    }).success(function(data){
        $scope.lastseen=new Date(data[0].lastlogin);
    })

});

AddHandle.controller('displayCartController',function ($scope,$http) {

    $http({
        method:"POST",
        url:"/showCart"
    }).success(function(data) {
        if (data == "invalid-session") {
            alert("Your session has expired! Please login again.");
            window.location.assign("/login");
        }
        else
            if(data=="Empty cart"){
                alert("Your cart is currently empty!");
            }
        else{
            $scope.shopcart=data;
            var total=0;

            for( var i in $scope.shopcart){
                total=total+$scope.shopcart[i].unit_price*$scope.shopcart[i].quant;
            }
            $scope.TotalAmt=total;
                if(total==0)
                    $scope.checkout=true;
                else
                    $scope.checkout=false;

        }

    });

    $http({
        method:"POST",
        url:"/getBids"
    }).success(function(data) {
        if (data == "invalid-session") {
            alert("Your session has expired! Please login again.");
            window.location.assign("/login");
        }
        else{
           if(data=="success"){
               alert("You have won a bid! Refresh your cart to check your item!")
           }
        }

    });


    $scope.remove=function(item_id){
        $http({
            method:"POST",
            url:"/removeFromCart",
            data:{"item_id":item_id}
        }).success(function (data){
          if(data=="Success") {
              //alert("Item removed from cart ");
              window.location.reload();
          }
          else
              alert(data);
        }).error(function () {
            alert("Error encountered! Please try again later!");
        });
    }

    $scope.checkout=function () {

    }

});

AddHandle.controller('addToCartController',function($scope,$http){
    //alert("Inside the cart controller");

    var cartitems=[];

    $scope.addToCart=function(itemId,userqnt) {
        //alert("Item id added to cart as :"+itemId);
        // var log= {"id":itemId,"type":"cartButton","timestamp":new Date(Date.now())};
        // logs.push(log);

        if(userqnt==undefined){
            alert("Please enter a valid quantity less than max available.");
        }
        else {
            $http({
                method: "POST",
                url: "/cart",
                data: {
                    "id": itemId,
                    "quant":userqnt
                }
            }).success(function (data) {
                if (data == "invalid-session") {
                    alert("Your session has expired! Please login again.");
                    window.location.assign("/login");
                }
                else {
                    alert("Added To Cart!");
                }
            }).error(function () {

                alert("Error adding items to cart");

            })
        }
    }

});


AddHandle.controller('advertisement',function($scope,$http){

    $scope.placeAdd=function() {
        // alert("Advert placed sucessfully");
        // alert("Text "+$scope.adtext);
        // alert("Number "+$scope.adqty);
        // alert("Price "+$scope.adprice);
        // alert("Shipping from "+$scope.adship);
        var bidding=false;
        if($scope.bidding==true){
            bidding=true;
        }
        $http({
            method:"POST",
            url:"/newAdvert",
            data:{
                "text":$scope.adtext,
                "quant":$scope.adqty,
                "price":$scope.adprice,
                "ship":$scope.adship,
                "category":$scope.category,
                "bidding":bidding
            }
        }).success(function(data){
            if(data=="invalid-session") {
                alert("Your session has expired! Please login again.");
                window.location.assign("/login");
            }
            else{
                if(data.result=="success")
                    alert("data successfully saved by server !"+data);
                else
                    alert("Ad failed due to :"+data.result);
                window.location.reload();
            }

        })


    }
});