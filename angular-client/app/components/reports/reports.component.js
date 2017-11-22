angular.module('myApp').controller('reportsController', ['$filter', '$scope', '$stateParams',
  '$state', '$uibModal', '$timeout', 'userService', 'planService',
  function($filter, $scope, $stateParams, $state, $uibModal, $timeout, userService, planService) {
    function sortPlans() {
      for (var i = 0; i < $scope.subordinates.length; i++) {
        var planList = $filter('orderBy')($scope.subordinates[i].plans, 'start', true)
        $scope.subordinates[i].sortedList = planList;
      }
    };

    function notify(type, message) {
      $scope.notification = {};
      $scope.notification.type = type;
      $scope.notification.header = 'Success:';
      $scope.notification.message = message;
      $timeout(function() {
        delete $scope.notification;
        _.defer(function() {
          $scope.$apply();
        });
      }, 3000);
    };

    this.$onInit = function() {
      if ($stateParams.obj) {
        $scope.currentUser = $stateParams.obj;
        userService.getSubordinates($scope.currentUser.id, true).then(function(data) {
          $scope.subordinates = data.data;
          //Sort associate lists to show the most recent one
          sortPlans();
          $scope.groupedUsers = _.chunk($scope.subordinates, 6)
        });
      }
    };

    $scope.openCreatePlan = function(data) {
      $uibModal.open({
        template: '<plan-modal data="$ctrl.data" close="$close(result)" dismiss="$dismiss(reason)"></plan-modal>',
        controller: ['data', function(data) {
          var $ctrl = this;
          $ctrl.data = data;
        }],
        controllerAs: '$ctrl',
        resolve: {
          data: function() {
            return data;
          }
        }
      }).result.then(function(result) {
        planService.createPlan(result).then(function(data) {
          var plans = data.data;
          var subordinates = $scope.subordinates;
          for (var i = 0; i < plans.length; i++) {
            for (var j = 0; j < subordinates.length; j++) {
              if (plans[i].user_id == subordinates[j].id) {
                subordinates[j].plans.push(plans[i]);
              }
            }
          }
          sortPlans();
          if (plans.length > 1) {
            notify('success', 'Plans created.');
          } else {
            notify('success', 'Plan created.');
          }
        });
      }, function(reason) {
        console.info(reason);
      });
    };

    $scope.reportStatus = function(associate) {
      var completed = false;
      var created = false;
      for (var i = 0; i < associate.plans.length; i++) {
        if (associate.plans[i].status == 'completed') {
          completed = true;
        }
        if (associate.plans[i].status == 'created') {
          created = true;
        }
      }
      if (completed) {
        return 'completed';
      }
      if (created) {
        return 'created';
      }
      return 'reviewed';
    };

    $scope.reportDetail = function(subordinate) {
      userService.getUser(subordinate.id).then(function(data) {
        $state.go('reportDetail', {
          obj: data.data,
          report: true,
          user: $scope.currentUser
        });
      });
      //$state.go('reportDetail', {obj: subordinate, report: true, user: $scope.currentUser});
    };
  }
]);
