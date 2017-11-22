angular.module('myApp').component('donutchart',  {
  templateUrl: 'components/charts/progress.component.html',
  controller: ['$scope', 'planService', function donutchartController($scope, planService){	
	  var ctrl = this;
	  
	  this.$onChanges = function (changesObj){
		  var plan = changesObj.value.currentValue;
		  var progress = 0;
		  if(angular.isNumber(plan)){
			  progress = plan;
		  }else{
			  progress = planService.getPlanProgress(plan);
		  }
		  
		  $scope.chartData = {
	      		  used: progress,
	      		  total: 100
		  };
		};
	  
	    $scope.chartConfig = {
	            chartId: 'pctChart',
	            tooltipFn: function(d){return Math.round(d[0].ratio * 100) + "%"},
	            centerLabelFn : function(){return $scope.chartData.used + "% done"},
	            thresholds: {'error': '101'}
        };
        
        
  }],
  bindings: {
	  value: '<'
  }
});