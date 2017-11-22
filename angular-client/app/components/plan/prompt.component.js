angular.module('myApp').component('promptModal', {
  templateUrl: 'components/plan/prompt.component.html',
  bindings: {
    close: '&',
    dismiss: '&',
    data: '<'
  },
  controller: function() {
    var $ctrl = this;

    $ctrl.handleClose = function() {
      $ctrl.close({
        result: 'success'
      });
    };

    $ctrl.handleDismiss = function() {
      $ctrl.dismiss({
        reason: 'cancel'
      });
    };
  }
});
