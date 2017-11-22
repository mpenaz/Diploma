angular.module('myApp').component('planHistory', {
  templateUrl: 'components/plan/planHistory.component.html',
  bindings: {
    plans: '<',
    report: '<',
    selectedPlan: '<'
  },
  controller: ['$scope', 'promptService', function BasicCtrl($scope, promptService) {
    this.$onChanges = function() {
      $scope.items = this.plans;
      $scope.deselect = this.selectedPlan;
      if ($scope.config != null) {
        $scope.config.selectedItems = [this.selectedPlan];
      }
    }

    this.$onInit = function() {
      $scope.items = this.plans;
      $scope.report = this.report;
      $scope.deselect = this.selectedPlan;

      var onItemSelect = function(item, event) {
        if ($scope.deselect == item) {
          $scope.config.selectedItems = [$scope.deselect];
          return;
        }
        $scope.$emit('onPlanSelectEvent', item);
      }

      $scope.pageConfig = {
        pageSize: 5
      };

      $scope.config = {
        selectItems: true,
        multiSelect: false,
        dblClick: false,
        dragEnabled: false,
        selectionMatchProp: 'id',
        selectedItems: [this.selectedPlan],
        itemsAvailable: true,
        showSelectBox: false,
        useExpandingRows: false,
        onSelect: onItemSelect
      };

      var deletePlan = function(action, item) {
        var data = {};
        data.header = 'Delete Plan';
        data.text = 'Are you sure you want to permanently delete the plan?';
        data.button = 'delete';
        promptService.openPromptModal(data).result.then(function(result) {
          $scope.$emit('onDeletePlanEvent', item);
        });
      };

      if ($scope.report) {
        $scope.actionButtons = [{
          name: 'Delete',
          class: 'btn-danger',
          title: 'Delete plan',
          actionFn: deletePlan
        }];
      }
    };
  }]
});
