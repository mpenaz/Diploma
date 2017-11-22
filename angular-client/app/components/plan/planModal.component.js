angular.module('myApp').component('planModal', {
  templateUrl: 'components/plan/planModal.component.html',
  bindings: {
    close: '&',
    dismiss: '&',
    data: '<'
  },
  controller: function($scope) {
    var $ctrl = this;
    $ctrl.selected = [];

    $scope.assign = function() {
      console.log($scope.items);
    };

    this.$onInit = function() {
      if (angular.isArray(this.data)) {
        $scope.associates = this.data;
      }
    };

    $scope.dtStart = new Date();
    $scope.dtEnd = new Date();

    $scope.config1 = {};
    $scope.config1.opened = false;
    $scope.open1 = function(event) {
      event.preventDefault();
      event.stopPropagation();
      $scope.config1.opened = true;
    };

    $scope.config2 = {};
    $scope.config2.opened = false;
    $scope.open2 = function(event) {
      event.preventDefault();
      event.stopPropagation();
      $scope.config2.opened = true;
    };

    $scope.validate = function(form) {
      if (form.$invalid) {
        alert("Date invalid");
      } else {
        alert("Date valid");
      }
    };

    $ctrl.handleDismiss = function() {
      console.info("in handle dismiss");
      $ctrl.dismiss({
        reason: 'cancel'
      });
    };

    $ctrl.handleClose = function(form) {
      if (form.$invalid) {
        $ctrl.submitted = true;
        return;
      }

      var plan = {};
      var obj = {};
      if (angular.isArray(this.data)) {
        obj = {
          plans: []
        };
        for (var i = 0; i < $ctrl.selected.length; i++) {
          plan = {
            startDate: form.dateStart.$modelValue,
            endDate: form.dateEnd.$modelValue,
            user_id: $ctrl.selected[i].id,
            status: 'created'
          };
          obj.plans.push(plan);
        }
      } else {
        plan = {
          startDate: form.dateStart.$modelValue,
          endDate: form.dateEnd.$modelValue,
          user_id: $ctrl.data.id
        };
        obj.plan = plan;
      }

      if ($ctrl.data) {
        obj.edit = false;
      } else {
        obj.edit = false;
      }

      $ctrl.close({
        result: obj
      });
    };
  }
});
