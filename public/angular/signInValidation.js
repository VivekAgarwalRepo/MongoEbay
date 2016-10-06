var regHandle=angular.module("regHandler",[]);

regHandle.controller('regValidation',function($scope,$http){
	$scope.mismatch=true;
	$scope.present=true;
	$scope.inserterr=true;
	$scope.register=function(valid){
		$scope.mismatch=true;
		if($scope.email!==$scope.email2){
			$scope.mismatch=false;
			return;
		}
		
		$http({
			method:"POST",
			url:"/welcome",
			data:{
				"nemail":$scope.email,
				"npassword":$scope.password,
				"firstName":$scope.newfname,
				"lastName":$scope.newlname
			}
		}).success(function(data){
			alert("Data Received from server");
			if(data.result=="success")
			 {
				//alert(data.name);
				window.location.assign("/home"+"?id="+data.acc_id+"&name="+data.name); // also try window.location.replace();
			 }
			else
				if(data.result=="present"){
					//alert(data.result);
					$scope.present=false;
				}
			else
				if(data.result=="insertError"){
					$scope.inserterr=false;
				}
		}).error(function(error){
			alert("Error registering. Please try again later!");
		});
	};
});



var userhandle=angular.module("userhandler",[]);
userhandle.controller('control',function($scope,$http){
	$scope.valid=true;
	$scope.login=function(valid){
		
		$http({
			method:"POST",
			url:"/validate",
			data:{
				"username":$scope.username,
				"password":$scope.password,
			}
		}).success(function(data){
			alert(data.result);
			if(data.result=="404"){
				$scope.valid=false;
				
			}
			else
			 if(data.result=="Ok"){
				 $scope.valid=true;
				 var name=data.name;
				 var id=data.acc_id;
					
				 window.location.assign("/home"+'?id='+id+'&name='+name);
				 
			 }
			//alert("Data Received from server");
		}).error(function(error){
			alert("Error signing in. Please try again later!");
		});
		
		
		
};

});


var myapp=angular.module("myapp",["userhandler","regHandler",'ui.router']);