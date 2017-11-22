angular.module('myApp').controller('sharedController', ['$filter', '$scope', '$stateParams', '$state', '$uibModal', '$timeout', 'userService', 'goalService',
  function($filter, $scope, $stateParams, $state, $uibModal, $timeout, userService, goalService) {
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

    $scope.createSharedGoal = function(data) {
      goalService.openGoalCreateModal(data).result.then(function(result) {
        var plan_ids = [];
        var assignedUsers = [];
        for (var i = 0; i < result.goal.selected.length; i++) {
          var plan_id = result.goal.selected[i].sortedList[0].id;
          var assigned = {};
          assigned.name = result.goal.selected[i].name;
          assigned.user_id = result.goal.selected[i].id;
          assigned.plan_id = plan_id;
          plan_ids.push(plan_id);
          assignedUsers.push(assigned);
        };
        result.goal.plan_ids = plan_ids;
        var goal = result.goal;
        goal.complexity = 'Shared';
        goal.user_id = $scope.currentUser.id;
        var json = angular.copy(goal);
        delete json.shared_goals;
        delete json.selected;

        if (result.edit) {
          goalService.updateGoal(json).then(function(data) {
            var response = data.data;
            response.shared_goals = assignedUsers;
            for (var i = 0; i < $scope.items.length; i++) {
              if ($scope.items[i].id == response.id) {
                if ($scope.items[i].isExpanded) {
                  response.isExpanded = true;
                }
                $scope.items[i] = response;
              }
            }
            splitGoals();
            notify('success', 'Goal edited.');
          });
        } else {
          goalService.createGoal(json).then(function(data) {
            var response = data.data;
            response.shared_goals = assignedUsers;
            $scope.items.push(response);
            splitGoals();
            _.defer(function() {
              $scope.$apply();
            });
            notify('success', 'Goal created.');
          });
        }
      });
    };

    $scope.createShared = function(associates) {
      var data = {};
      data.associates = associates;
      $scope.createSharedGoal(data);
    }

    $scope.$on('onEditGoalEvent', onEdit);

    function onEdit(event, goal) {
      var data = {};
      data.goal = goal;
      data.associates = $scope.subordinates;
      $scope.createSharedGoal(data);
    };

    $scope.$on('onDeleteGoalEvent', onDelete);

    function onDelete(event, goal) {
      goalService.deleteGoal(goal.id).then(function(data) {
        var index = $scope.items.indexOf(goal);
        $scope.items.splice(index, 1);
        splitGoals();
        notify('success', 'Goal deleted.');
      });
    };

    $scope.$on('onFinishGoalEvent', onFinish);

    function onFinish(event, goal) {
      splitGoals();
      notify('success', 'Goal completed and moved into Completed Goals.');
    };

    function splitGoals() {
      var completed = [];
      var active = [];
      for (var i = 0; i < $scope.items.length; i++) {
        if ($scope.items[i].progress == 100) {
          completed.push($scope.items[i]);
        } else {
          active.push($scope.items[i]);
        }
      }
      $scope.activeGoals = active;
      $scope.completedGoals = completed;
    };

    this.$onInit = function() {
      var email = auth.authz.tokenParsed.email;
      userService.getCurrentUser(email).then(function(data) {
        $scope.currentUser = data.data;
        userService.getSubordinates($scope.currentUser.id).then(function(data) {
          $scope.subordinates = data.data;
          //Sort associate lists to show the most recent one
          sortPlans();
          $scope.items = $scope.currentUser.goals;
          //Split completed and active goals
          splitGoals();
          _.defer(function() {
            $scope.$apply();
          });
        });
      });
    };
  }
]);
