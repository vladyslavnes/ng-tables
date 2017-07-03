var app = angular.module('table.main', []);

app.controller('GlobalCtrl',($scope,$rootScope,$window,$log) => {
	$scope.language = 'en'
;	$scope.data = [];

	// $scope.input = [];
	$scope.input = '[{"n":0,"sqrt":0,"square":0},{"n":1,"sqrt":1,"square":1},{"n":2,"sqrt":1.4142135623730951,"square":4},{"n":3,"sqrt":1.7320508075688772,"square":9},{"n":4,"sqrt":2,"square":16},{"n":5,"sqrt":2.23606797749979,"square":25},{"n":6,"sqrt":2.449489742783178,"square":36},{"n":7,"sqrt":2.6457513110645907,"square":49},{"n":8,"sqrt":2.8284271247461903,"square":64},{"n":9,"sqrt":3,"square":81},{"n":10,"sqrt":3.1622776601683795,"square":100},{"n":11,"sqrt":3.3166247903554,"square":121},{"n":12,"sqrt":3.4641016151377544,"square":144},{"n":13,"sqrt":3.605551275463989,"square":169},{"n":14,"sqrt":3.7416573867739413,"square":196},{"n":15,"sqrt":3.872983346207417,"square":225}]';
	
	$scope.data = JSON.parse($scope.input);

	for (var i = 0; i <= 50; i++) {
		$scope.data[i] = {n:i, sqrt:Math.sqrt(i), square:i*i, log:Math.log(i), sin: Math.sin(i), cos: Math.cos(i), tan: Math.tan(i), random: Math.random()*i};
	}
	

	$scope.updateData = () => {
		$scope.input = JSON.stringify($scope.data);
		alert(document.querySelectorAll('.clearfix')[-1]);
	};

	$scope.deleteRow = (index) => {
		$scope.data.splice(index,1);
		$scope.updateData();		
	};

	$scope.addRow = () => {
		var row = $scope.data[0];
		var obj = {};
		for (var col in row) {
			obj[col] = Number(prompt(col));
		}
		$scope.data.push(obj);
		$scope.updateData();		
	};

	$scope.downloadData = (linkObj) => {
		var dataStr = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify($scope.data));
		linkObj.setAttribute('href',dataStr);
		linkObj.setAttribute('download', 'table.json');
		linkObj.click();
	};
});

app.directive('barChart', [() => {
	return {
		restrict: 'E',
		scope: {
			width: '@',
			height: '@',
			xAxis: '@',
			yAxis: '@',
		},
		template: `
			<div class="chart" ng-repeat="(key,value) in data[0] track by $index" style="width:{{width}}px; height:{{height}}px;">
				<h4>{{key}}</h4>
				<div class="y" style="width:{{height}}px;">{{key}}</div>
				<div class="x"></div>
				<div class="bar blue" ng-repeat="(key1,value) in data track by $index"
					ng-init="largest = getLargest()"
					ng-class="{'lighten-2': $index % 2, 'darken-2': !($index % 2)}"
					ng-click="$log(value[key])"
					ng-style="{'height': value[key] / largest[key] * height+'px', width: width / data.length - 1+'px', left: $index / data.length * width+'px'}
				"></div>
				{{}}
			</div>
		`,
		controller: function($scope, $element, $attrs) {

			$scope.data = $scope.$parent.data;

			$scope.largest = {};

			$scope.getLargest = () => {
				for (i of $scope.data) {
					for (j in i)
						if (i[j] > $scope.largest[j] || !$scope.largest[j]) $scope.largest[j] = i[j];
				// console.log($scope.largest);
				}
				return $scope.largest;
			};
		},
		link: function($scope, element, attr, controller) {
		}
	};
}]);

app.directive("ngFileSelect",($http) => {
	return {
		link: function($scope,el){
			el.bind("change", function(e){
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var file = e.target.files[0];

				var reader = new FileReader();
					reader.readAsText(file);
					reader.onload = function(e) {
					$scope.input = String(e.target.result);
					updateData();
					};
				} else {
				alert(`Your browser doesn't support FileAPI!`);
				}
			});
		}
	}
});