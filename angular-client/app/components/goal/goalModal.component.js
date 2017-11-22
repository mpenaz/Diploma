angular.module('myApp').component('goalModal', {
  templateUrl: 'components/goal/goalModal.component.html',
  bindings: {
    close: '&',
    dismiss: '&',
    data: '<'
  },
  controller: function() {
    var $ctrl = this;
    $ctrl.progressBarValue = 0;
    $ctrl.edit = false;

    $ctrl.$onInit = function() {
      if ($ctrl.data && $ctrl.data.associates) {
        var array = [];
        for (var i = 0; i < $ctrl.data.associates.length; i++) {
          if ($ctrl.data.associates[i].sortedList.length > 0 && $ctrl.data.associates[i].sortedList[0].status == 'created') {
            array.push($ctrl.data.associates[i]);
          }
        }
        $ctrl.associates = array;
        if ($ctrl.data.goal) {
          $ctrl.edit = true;
          $ctrl.item = $ctrl.data.goal;
          $ctrl.progressBarValue = $ctrl.data.goal.progress;
          $ctrl.item.selected = [];
          for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < $ctrl.data.goal.shared_goals.length; j++) {
              if (array[i].id == $ctrl.data.goal.shared_goals[j].user_id) {
                $ctrl.item.selected.push(array[i]);
              }
            }
          }
        }
      } else if ($ctrl.data) {
        $ctrl.edit = true;
        $ctrl.item = $ctrl.data;
        $ctrl.progressBarValue = $ctrl.data.progress;
      }
    };

    $ctrl.priorities = [
      'Medium',
      'High',
      'Low'
    ];

    $ctrl.item = {
      progress: $ctrl.progressBarValue,
      priority: $ctrl.priorities[0]
    };

    $ctrl.$init = function() {
      $ctrl.modalData = $ctrl.resolve.modalData;
    }

    $ctrl.handleClose = function(form) {
      if (form.$invalid) {
        $ctrl.submitted = true;
        return;
      }

      var obj = {};
      obj.goal = $ctrl.item;

      if ($ctrl.edit) {
        obj.edit = true;
      } else {
        obj.edit = false;
      }

      $ctrl.close({
        result: obj
      });
    };

    $ctrl.trackProgress = function(event) {
      var fullProgressBarWidth = $(event.currentTarget).width();
      $ctrl.progressBarValue = Math.round(event.offsetX / fullProgressBarWidth * 100);
      $ctrl.item.progress = $ctrl.progressBarValue;
    };

    $ctrl.handleDismiss = function() {
      $ctrl.dismiss({
        reason: 'cancel'
      });
    };
  }
});
