angular.module('myApp').component('plan', {
  templateUrl: 'components/plan/plan.component.html',
  controller: ['$rootScope', '$state', '$filter', '$scope', '$timeout', 'goalService', 'planService', 'evaluationService', 'promptService',
    function controller($rootScope, $state, $filter, $scope, $timeout, goalService, planService, evaluationService, promptService) {
      $scope.plans = this.plans;
      $scope.report = this.report;
      $scope.review = this.review;
      $scope.callBack = this.callBack;
      $ctrl = this;
      $scope.evaluation = {};

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

      if ($scope.plans != null && $scope.plans[0] != null) {
        $scope.plans = $filter('orderBy')($scope.plans, 'start', true)
        $scope.plan = $scope.plans[0];
        $scope.planProgressValue = planService.getPlanProgress($scope.plan);
      };

      if (this.review) {
        $scope.plan = this.review;
        $scope.planProgressValue = planService.getPlanProgress($scope.plan);
      }

      if ($rootScope.previousState) {
        //console.log($rootScope.previousState.params.callBack)
        if ($rootScope.previousState.params.callBack) {
          //console.log($rootScope.previousState.params.callBack)
          $scope.plan = $rootScope.previousState.params.callBack;
          $scope.planProgressValue = planService.getPlanProgress($scope.plan);
        }
      }

      $scope.$on('onDeleteGoalEvent', onDelete);

      function onDelete(event, goal) {
        goalService.deleteGoal(goal.id).then(function(data) {
          var index = $scope.plan.goals.indexOf(goal);
          $scope.plan.goals.splice(index, 1);
          $scope.planProgressValue = planService.getPlanProgress($scope.plan);
          notify('success', 'Goal deleted.');
        });
      };

      $scope.$on('onDeletePlanEvent', onPlanDelete);

      function onPlanDelete(event, plan) {
        planService.deletePlan(plan.id).then(function(data) {
          var index = $scope.plans.indexOf(plan);
          $scope.plans.splice(index, 1);
          $scope.planProgressValue = planService.getPlanProgress($scope.plan);
          if ($scope.plans.length == 0) {
            $scope.plan = null;
          }

          if (angular.equals($scope.plan, plan)) {
            $scope.plan = $scope.plans[0];
          }
          notify('success', 'Plan deleted.');
        });
      };

      $scope.$on('onEditGoalEvent', onEdit);

      function onEdit(event, goal) {
        $ctrl.openCreateGoal(goal);
      };

      $scope.$on('onFinishGoalEvent', onFinish);

      function onFinish(event, goal) {
        $scope.planProgressValue = planService.getPlanProgress($scope.plan);
        notify('success', 'Goal marked as finished.');
      };

      $scope.$on('onPlanSelectEvent', onPlanSelect);

      function onPlanSelect(event, plan) {
        $scope.plan = plan;
        $scope.planProgressValue = planService.getPlanProgress(plan);
      };

      $ctrl.showTransferGoals = function() {
        if ($scope.plan == $scope.plans[$scope.plans.length - 1]) {
          return false;
        }
        return true;
      };

      $ctrl.onPlanSelect = function(item) {
        if (item) {
          $scope.planProgressValue = planService.getPlanProgress($scope.plan);
        }
      };

      $ctrl.cancelReview = function() {
        $state.go($rootScope.previousState.name, $rootScope.previousState.params);
      };

      $ctrl.submitForReview = function(plan) {
        var data = {};
        data.header = 'Submit plan for review';
        data.text = 'Are you sure you want to submit plan for review, this will lock plan from further changes?';
        data.button = 'primary';
        promptService.openPromptModal(data).result.then(function(result) {
          var json = angular.copy(plan);
          json.status = 'completed';
          planService.updatePlan(json).then(function(data) {
            var updatedPlan = data.data;
            updatedPlan.goals = plan.goals;
            $scope.plan = updatedPlan;
            _.defer(function() {
              $scope.$apply();
            });
            notify('success', 'Plan submitted for review.');
          });
        });
      };

      $ctrl.reviewPlan = function(plan) {
        $state.go('review', {
          obj: $ctrl.user,
          report: false,
          user: $ctrl.user,
          review: $scope.plan,
          callBack: plan
        });
      };

      $ctrl.submitReview = function(form) {
        if (form.$invalid) {
          $ctrl.evalSubmitted = true;
          return;
        }

        $scope.evaluation.plan_id = $scope.plan.id;
        evaluationService.createEvaluation($scope.evaluation).then(function(data) {
          $scope.plan.evaluation_id = data.data.id;
          $scope.plan.evaluation = data.data;
          $scope.plan.status = 'reviewed';
          $state.go($rootScope.previousState.name, $rootScope.previousState.params);
        });
      }

      $ctrl.deletePlan = function(plan) {
        var data = {};
        data.header = 'Delete Plan';
        data.text = 'Are you sure you want to permanently delete the plan?';
        data.button = 'delete';
        promptService.openPromptModal(data).result.then(function(result) {
          planService.deletePlan(plan.id).then(function(data) {
            var index = $scope.plans.indexOf(plan);
            $scope.plans.splice(index, 1);
            if ($scope.plans != null && $scope.plans[0] != null) {
              $scope.plan = $scope.plans.plan[0];
            } else {
              $scope.plan = null;
            }
            notify('success', 'Plan deleted.');
          });
        });
      };

      $ctrl.mergePlans = function() {
        var plan = $scope.plan;
        var index = $scope.plans.indexOf(plan) + 1;
        var oldPlan = $scope.plans[index];
        var oldPlanUnfinished = [];
        for (var i = 0; i < oldPlan.goals.length; i++) {
          if (oldPlan.goals[i].progress < 100) {
            oldPlanUnfinished.push(oldPlan.goals[i]);
          }
        }
        var data = {};
        data.plan = plan;
        //data.oldPlan = oldPlanUnfinished;
        data.oldPlan = oldPlan;
        data.oldPlan.oldPlanUnfinished = oldPlanUnfinished;

        planService.openPlanMergeModal(data).result.then(function(result) {
          var json = angular.copy(result);
          for (var i = 0; i < json.length; i++) {
            if (json[i].shared_goals) {
              json[i].shared_goals = undefined;
            }
          }
          var goalList = {
            goalList: json
          };
          if (result.length == 0) {
            return;
          }

          goalService.createGoal(goalList).then(function(data) {
            //If transfering shared goal remove it from previous list
            var index = $scope.plans.indexOf($scope.plan);
            var removalPlan = $scope.plans[index + 1];
            console.log(removalPlan);
            for (var i = 0; i < data.data.length; i++) {
              for (var j = 0; j < removalPlan.goals.length; j++) {
                if (data.data[i].id == removalPlan.goals[j].id) {
                  removalPlan.goals.splice(j, 1);
                }
              }
            }

            $scope.plan.goals = $scope.plan.goals.concat(data.data);
            $scope.planProgressValue = planService.getPlanProgress($scope.plan);
            notify('success', 'Plans merged and goals added.');
            _.defer(function() {
              $scope.$apply();
            });
          });
        }, function(reason) {
          console.info(reason);
        });
      };

      $ctrl.openCreatePlan = function(data) {
        planService.openPlanCreateModal(data).result.then(function(result) {
          var plan = result.plan;
          plan.status = "created";
          planService.createPlan(plan).then(function(data) {
            var plan = data.data;
            plan.goals = [];
            $scope.plans.splice(0, 0, plan);
            $scope.plans = $filter('orderBy')($scope.plans, 'start', true);
            $scope.plan = plan;
            $scope.planProgressValue = 0;
            notify('success', 'Plan created.');
          });
        }, function(reason) {
          console.info(reason);
        });
      };

      $ctrl.openCreateGoal = function(data) {
        goalService.openGoalCreateModal(data).result.then(function(result) {
          var goal = result.goal;
          if (result.edit) {
            goalService.updateGoal(goal).then(function(data) {
              $scope.planProgressValue = planService.getPlanProgress($scope.plan);
              notify('success', 'Goal edited.');
            });
          } else {
            goal.plan_id = $scope.plan.id;
            goal.complexity = 'Simple';
            goalService.createGoal(goal).then(function(data) {
              $scope.plan.goals.push(data.data);
              $scope.planProgressValue = planService.getPlanProgress($scope.plan);
              notify('success', 'Goal created.');
            });
          }
        }, function(reason) {
          console.info(reason);
        });
      };

    }
  ],
  bindings: {
    plans: '=',
    report: '<',
    user: '<',
    review: '<',
    callBack: '<'
  }
});
