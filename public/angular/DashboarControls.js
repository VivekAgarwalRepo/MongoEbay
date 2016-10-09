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
            url:'/home'
        })
        .state('showAdverts',{
        url:'/showAdvert'
    })

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
        else{

            $scope.shopcart=data;
            var total=0;

            for( var i in $scope.shopcart){

                total=total+$scope.shopcart[i].unit_price*$scope.shopcart[i].qty;
            }
            $scope.TotalAmt=total;

        }
    });

});

AddHandle.controller('addToCartController',function($scope,$http){
    //alert("Inside the cart controller");

    var cartitems=[];

    $scope.addToCart=function(itemId) {
        //alert("Item id added to cart as :"+itemId);
        alert("Quant entered :"+$scope.userqnt);
        $http({
            method: "POST",
            url: "/cart",
            data:{
                "id":itemId
            }
        }).success(function (data) {
            if (data == "invalid-session") {
                alert("Your session has expired! Please login again.");
                window.location.assign("/login");
            }
            else{
                alert("Added To Cart!");
            }
        }).error(function () {

            alert("Error adding items to cart");

        })
    }

});


AddHandle.controller('advertisement',function($scope,$http){



    $scope.placeAdd=function() {
        // alert("Advert placed sucessfully");
        alert("Text "+$scope.adtext);
        alert("Number "+$scope.adqty);
        alert("Price "+$scope.adprice);
        alert("Shipping from "+$scope.adship);

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

