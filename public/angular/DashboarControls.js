/**
 * Created by Vivek Agarwal on 10/3/2016.
 */

var AddHandle=angular.module('placeadd',['ngRoute','ui.router']);

AddHandle.config(function ($stateProvider,$routeProvider,$urlRouterProvider) {
    $routeProvider
        .when('/showAdvert',
            {
                templateUrl:"templates/displayAdverts.ejs",
                controller:"displayAdsController"
            });

    $stateProvider
        .state('cart',{

            url:'/displayCart',
            templateUrl:'templates/cart.ejs',
            controller: "displayCartController"

        })
        .state('home',{
            url:'/'
        })
        .state('showAdverts',{
        url:'/showAdvert'
    })
        .state('checkout',{
            url:'/checkout',
            templateUrl:'templates/checkout.ejs',
            controller: "checkOutController"
    })
});

AddHandle.controller('checkOutController',function ($scope,$http) {



});


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
            for ( var i in data)
            alert(data[i].Message);
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
        $scope.advertises=data;

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

        $http({
            method:"POST",
            url:"/newAdvert",
            data:{
                "text":$scope.adtext,
                "quant":$scope.adqty,
                "price":$scope.adprice,
                "ship":$scope.adship,
                "category":$scope.category
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

