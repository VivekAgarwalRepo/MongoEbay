/**
 * Created by Vivek Agarwal on 10/3/2016.
 */

var AddHandle=angular.module('placeadd',['ngRoute']);

AddHandle.config(function ($routeProvider) {
    $routeProvider
        .when('/showAdvert',
            {

                templateUrl:"templates/displayAdverts.ejs",
                controller:"displayController"
            })
        .otherwise({
            template:'<strong> Please click on show adverts </strong>'
        })
});

AddHandle.controller('displayController',function($scope,$http){

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

    $scope.addToCart=function(itemId) {
        alert("Item id added to cart as :"+itemId);
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

