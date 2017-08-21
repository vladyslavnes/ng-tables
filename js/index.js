var app = angular.module('tables.main', []);

app.controller('GlobalCtrl',($scope,$rootScope,$window) => {
	$scope.language = 'en';

	$scope.input = '[]';
	
	$scope.parseData = () => {
		$scope.data = JSON.parse($scope.input);
	};
	$scope.parseData();

	$rootScope.updateData = () => {
		$scope.input = JSON.stringify($scope.data);
	};

	$scope.deleteRow = index => {
		$scope.data.splice(index,1);
		$rootScope.updateData();	
	};
	$scope.addRow = () => {
		var row = $scope.data[0];
		var obj = {};
		for (var col in row)
			obj[col] = Number(prompt(col));
		$scope.data.push(obj);
		$rootScope.updateData();		
	};

	$scope.addCol = () => {
		var row = $scope.data[0];
		if (!row) {
			alert('Create at least one row.');
			return;
		}
		
		var cols = $scope.data.length;
		var colname = prompt('Enter the name of the column');
		if (confirm('Would you like to fill all the values right now?')) {
			for (var row = 0;row < cols;row++)
				$scope.data[row][colname] = Number(prompt('Value for row #'+row));
		}
		else 
			for (var row = 0;row < cols;row++)
				$scope.data[row][colname] = '';
		$rootScope.updateData();
	};
	
	$scope.deleteCol = () => {
		var col = prompt('Which column to remove?');
		for (var row = 0; row < $scope.data.length; row++)
			delete $scope.data[row][col];
		$rootScope.updateData();	
	};

	$scope.useScript = () => {

		if(!$rootScope.seenScriptInfo)  // to show info on including scripts only once
			$rootScope.seenScriptInfo = confirm('You shold write the JS expression that returns some value to insert. \n You\'ll be given parameters: \n\t array,row,col - for low-level quering \n\t all column names on current row \n e.g: (b*b)-(4*a*c) - will give you the discriminant of fields in current row');
		var colname = prompt('Enter the name of the column to fill');

		var inputfunc = prompt('Enter your filling expression'); // cache the original input

		var colnames = [];
		for (var col in $scope.data[0]) // create an array of all column names
			colnames.push(col);
		console.log(col,colnames);

		var re = new RegExp('(['+colnames.join('|')+'])','g');

		var cols = $scope.data.length;
		for (var row = 0; row < cols; row++) {
	
			func = inputfunc.replace(re,'array[row]["$1"]');
			console.log(func);
			var fillscript = new Function("array,row,col",'return '+func+';');

			$scope.data[row][colname] = fillscript($scope.data,row,colname);
		}
		
		$rootScope.updateData();
	};

	$scope.downloadData = () => {
		var linkObj = document.createElement('a');
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
					
					ng-class="{'lighten-2': $index % 2, 'darken-2': !($index % 2)}"
					onclick="alert(this.innerText)"
					ng-style="{'height': value[key] / getLargest()[key] * height+'px', width: width / data.length - 1+'px', left: $index / data.length * width+'px'}"
					style="color:transparent;-webkit-user-select:none;"
					>{{value[key]}}</div>
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

app.directive("ngFileSelect",($http,$rootScope) => {
	return {
		link: function($scope,el){
			el.bind("change", function(e){
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				var file = e.target.files[0];

				var reader = new FileReader();
				reader.readAsText(file);
				reader.onload = function(e) {
					$scope.input = String(e.target.result);
					$rootScope.updateData();
				};
			}
			else {
				alert(`Your browser doesn't support FileAPI!`);
			}
			});
		}
	}
});