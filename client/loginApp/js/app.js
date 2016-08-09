'use strict';
/*
*   This is a standalone Angular Application to handle
*   login
*/
angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages'])

// Routing
.config(function ($routeProvider) {
  $routeProvider
  .when('/',{
      templateUrl: 'client/loginApp/views/login.html',
      controller: 'UserLoginController'
  })
  .when('/admin',{
      templateUrl: 'client/loginApp/views/login.html',
      controller: 'AdminLoginController'
  });
})

.controller('UserLoginController', ['$scope', '$window', '$http', function($scope, $window, $http){

  // Initialize variables
  $scope.username = "";
  $scope.password = "";
  $scope.loginError = false;

  $scope.login = function(){
    $http.post('/api/login', {username: $scope.username, password: $scope.password}).then(function(response) {
      if(response.data.user) {
        $window.location.href = '/userPortal';
      } else {
        $scope.loginError = true;
      }
    });
  };
}])

// Handles Admin Login
.controller('AdminLoginController', ['$scope', '$window', '$http', function($scope, $window, $http){

  // Initialize variables
  $scope.username = "";
  $scope.password = "";
  $scope.loginError = false;

  $scope.login = function(){
    $http.post('/api/adminLogin', {username: $scope.username, password: $scope.password}).then(function(response) {
      if(response.data.user) {
        $window.location.href = '/adminPortal';
      } else {
        $scope.loginError = true;
      }
    });
  };
}]);
