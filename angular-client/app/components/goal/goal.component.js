angular.module('myApp').component('goal', {
  templateUrl: 'components/goal/goal.component.html',
  bindings: {
    plan: '<',
    goals: '<',
    review: '<',
    manager: '<'
  },
  controller: ['$scope', '$templateCache', 'goalService', 'promptService', function BasicCtrl($scope, $templateCache, goalService, promptService) {
    this.$onChanges = function() {
      $scope.items = this.goals;
      if (this.review || this.plan.status == 'created') {
        $scope.actionButtons = buttons;
      } else {
        $scope.actionButtons = [];
      }

      $scope.enableButtonForItemFn = function(action, item) {
        if ($scope.manager) {
          return true;
        }
        return !((action.name === 'Delete') && (item.complexity === "Shared"));
      };
    };

    var deleteGoal = function(action, item) {
      var data = {};
      data.header = 'Delete Goal';
      data.text = 'Are you sure you want to permanently delete the goal: ' + item.title + '?';
      data.button = 'delete';
      promptService.openPromptModal(data).result.then(function(result) {
        $scope.$emit('onDeleteGoalEvent', item);
      });
    };

    var editGoal = function(action, item) {
      $scope.$emit('onEditGoalEvent', item);
    };

    var completeGoal = function(action, item) {
      var json = angular.copy(item);
      json.progress = 100;
      goalService.updateGoal(json).then(function(data) {
        item.progress = 100;
        $scope.$emit('onFinishGoalEvent', item);
      });
    };
    var buttons = [{
        name: 'Finish',
        //include: 'my-button-template',
        class: 'btn-primary',
        title: 'Mark as done',
        actionFn: completeGoal
      },
      {
        name: 'Edit',
        class: 'btn-primary',
        title: 'Edit Goal',
        actionFn: editGoal
      },
      {
        name: 'Delete',
        class: 'btn-danger',
        title: 'Delete Goal',
        actionFn: deleteGoal
      }
    ];

    this.$onInit = function() {
      $scope.items = this.goals;
      $scope.manager = this.manager;

      $scope.config = {
        selectItems: false,
        multiSelect: false,
        dblClick: false,
        dragEnabled: false,
        selectionMatchProp: 'name',
        selectedItems: [],
        itemsAvailable: true,
        showSelectBox: false,
        useExpandingRows: true
      };

      if (this.review || this.plan.status == 'created') {
        $scope.actionButtons = buttons;
      }
    };
  }]
});
