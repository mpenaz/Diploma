angular.module('myApp').controller('homeController', ['$scope', '$stateParams', function($scope, $stateParams) {
  this.$onInit = function() {
    if ($stateParams.obj) {
      $scope.plans = $stateParams.obj.plans;
      $scope.report = $stateParams.report;
      $scope.user = $stateParams.obj;
      $scope.review = $stateParams.review;
      $scope.callBack = $stateParams.callBack;
    }
  };
}]);
