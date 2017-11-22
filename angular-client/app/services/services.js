var address = 'http://localhost:3000/';
var addrGoals = address + 'goals/';
var addrPlans = address + 'plans/';
var addrEvaluations = address + 'evaluations/';
var addrUsers = address + 'users/';

angular.module('myApp').service('planService', ['$http', '$uibModal', function($http, $uibModal) {
  this.openPlanCreateModal = function(data) {
    return $uibModal.open({
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
    });
  };

  this.openPlanMergeModal = function(data) {
    return $uibModal.open({
      template: '<plan-merge data="$ctrl.data" close="$close(result)" dismiss="$dismiss(reason)"></plan-merge>',
      controller: ['data', function(data) {
        var $ctrl = this;
        $ctrl.data = data;
      }],
      controllerAs: '$ctrl',
      size: 'lg',
      resolve: {
        data: function() {
          return data;
        }
      }
    });
  };

  this.getPlanProgress = function(plan) {
    if (plan.goals == null) {
      return 0;
    }
    var count = 0;
    var i = 0;

    for (i; i < plan.goals.length; i++) {
      count = count + plan.goals[i].progress;
    }
    if (i == 0) {
      return 0;
    }
    return Math.round(count / i);
  };

  this.createPlan = function(plan) {
    return $http.post(addrPlans, plan);
  };

  this.deletePlan = function(planId) {
    return $http.delete(addrPlans + planId);
  }

  this.updatePlan = function(plan) {
    return $http.put(addrPlans + plan.id, plan);
  }
}]);

angular.module('myApp').service('userService', function($http) {
  this.getCurrentUser = function(email) {
    return $http.get(address + 'users?mail=' + email);
  };
  this.getSubordinates = function(id, deep) {
    if (deep) {
      return $http.get(addrUsers + id + '/subordinates?deep=true');
    } else {
      return $http.get(addrUsers + id + '/subordinates');
    }
  };
  this.getUser = function(id) {
    return $http.get(addrUsers + id);
  };
});

angular.module('myApp').service('evaluationService', function($http) {
  this.createEvaluation = function(evaluation) {
    return $http.post(addrEvaluations, evaluation);
  };
});

angular.module('myApp').service('promptService', ['$uibModal', function($uibModal) {
  this.openPromptModal = function(data) {
    return $uibModal.open({
      template: '<prompt-modal data="$ctrl.data" close="$close(result)" dismiss="$dismiss(reason)"></prompt-modal>',
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
    });
  };
}]);

angular.module('myApp').service('goalService', ['$http', '$uibModal', '$filter', function($http, $uibModal, $filter) {
  this.openGoalCreateModal = function(data) {
    return $uibModal.open({
      template: '<goal-modal data="$ctrl.data" close="$close(result)" dismiss="$dismiss(reason)"></goal-modal>',
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
    });
  };

  this.sortByPriority = function(goals) {
    var sortedList = undefined;
    for (var i = 0; i < goals.length; i++) {
      if (goals[i].priority == "High") {
        goals[i].prio = 1;
      } else if (goals[i].priority == "Medium") {
        goals[i].prio = 2;
      } else {
        goals[i].prio = 3;
      }
    }
    sortedList = $filter('orderBy')(goals, 'prio', false);
    for (var i = 0; i < sortedList.length; i++) {
      sortedList[i].prio = undefined;
    }
    return sortedList;
  };

  this.createGoal = function(goal) {
    return $http.post(addrGoals, goal);
  };

  this.deleteGoal = function(goalId) {
    return $http.delete(addrGoals + goalId);
  }

  this.updateGoal = function(goal) {
    return $http.put(addrGoals + goal.id, goal);
  }
}]);
