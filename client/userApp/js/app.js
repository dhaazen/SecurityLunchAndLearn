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
      templateUrl: 'client/userApp/views/userPortal.html',
      controller: 'userPortalController'
  })
})

.controller('userPortalController', ['$scope', '$window', '$http', function($scope, $window, $http){

  // Get the currently logged in user for the session
  $http.get('/api/loggedInUser').then(function(response) {

    // If no user is logged in redirect to login
    if(!response.data.user) {
      $window.location.href = '/login';
    }

    $scope.user = response.data.user;
  })

  // Logout user from session and redirect to login page
  $scope.logout = function(){
    $http.get('/api/logoutUser').then(function(response) {
      $window.location.href = '/login';
    });
  };
}]);
