angular.module('myApp').component('planMerge', {
  templateUrl: 'components/plan/planMerge.component.html',
  bindings: {
    close: '&',
    dismiss: '&',
    data: '<'
  },
  controller: function($scope) {
    var $ctrl = this;

    //console.log(this.data);

    $scope.transferSelected = function() {
      //console.log($scope.newPlan);
      var array = [];

      for (var i = 0; i < $scope.oldConfig.selectedItems.length; i++) {
        array.push($scope.oldConfig.selectedItems[i]);
      }

      array = array.concat($scope.newPlan);
      $scope.newPlan = array;

      $scope.oldConfig.selectedItems = [];

      //Reload view
      _.defer(function() {
        $scope.$apply();
      });
    }

    this.$onInit = function() {
      $scope.newPlan = this.data.plan.goals;
      //old plan is only list of unfinished goals
      //$scope.oldPlan = this.data.oldPlan;
      $scope.oldPlan = this.data.oldPlan.oldPlanUnfinished;
      $scope.oldId = this.data.oldPlan.id;

      var deleteGoal = function(action, item) {
        var index = $scope.newPlan.indexOf(item);
        $scope.newPlan.splice(index, 1);
      };

      $scope.enableButtonForItemFn = function(action, item) {
        var index = $scope.oldPlan.indexOf(item);
        if (index >= 0) {
          return true;
        }
        return false;
      };

      $scope.actionButtons = [{
        name: 'Delete',
        class: 'btn-danger',
        title: 'Delete plan',
        actionFn: deleteGoal
      }];

      $scope.oldConfig = {
        selectItems: true,
        multiSelect: true,
        dblClick: false,
        dragEnabled: false,
        selectionMatchProp: 'id',
        selectedItems: [],
        itemsAvailable: true,
        showSelectBox: false,
        useExpandingRows: false,
      };

      $scope.newConfig = {
        multiSelect: false,
        dblClick: false,
        dragEnabled: false,
        selectionMatchProp: 'id',
        selectedItems: [],
        itemsAvailable: true,
        showSelectBox: false,
        useExpandingRows: false,
      };
    };


    $ctrl.handleDismiss = function() {
      console.info("in handle dismiss");
      $ctrl.dismiss({
        reason: 'cancel'
      });
    };

    $ctrl.handleClose = function() {
      var array = [];
      //console.log(this.data.plan.goals);
      for (var i = 0; i < $scope.newPlan.length; i++) {
        var goal = {};
        angular.copy($scope.newPlan[i], goal);
        var index = this.data.plan.goals.indexOf($scope.newPlan[i]);
        if (index < 0) {
          goal.plan_id = this.data.plan.id;
          if (goal.shared_goals) {
            goal.old_id = $scope.oldId;
          } else {
            goal.id = undefined;
          }
          array.push(goal);
        }
      }
      //console.log(this.data);
      $ctrl.close({
        result: array
      });
    };
  }
});
