var myApp = myApp || angular.module('myApp', []);

Array.meshgrid = function (numrows, numcols) {
	var arr = [];
	for (var i = 0; i < numrows; ++i) {
		var columns = [];
		for (var j = 0; j < numcols; ++j) {
			columns[j] = j;
		}
		arr[i] = columns;
	}
	return arr;
}

myApp.controller('waveEqController', ['$scope', function ($scope) {

	$scope.length = 200;
	$scope.timespan = 30;
	$scope.timestep = 0.1;
	var c = 8; //speed of wave
	var gamma = (0.8 / 3.0); //gaussian width
	var gamma_sq = Math.pow(gamma, 2);
	var neg_gamma_sq = -1 * gamma_sq;
	var a = 4;
	function e(x) {
		return Math.exp(x);
	}

	// Wave equation sln for initial condition of simple gaussian
	var waveEq = function (x, t) {
		return e((neg_gamma_sq * Math.pow((x + (c * t)), 2)) / 2) / 2 + e((neg_gamma_sq * Math.pow((x - (c * t)), 2)) / 2) / 2
	}

	// Wave equation sln for initial condition of modulated gaussian
	var waveEq2 = function (x, t) {
		return 0.5 * (
			((e((neg_gamma_sq * Math.pow((x + (c * t)), 2)) / 2) / 2) * Math.cos(a * (x + (c * t)))) +
			((e((neg_gamma_sq * Math.pow((x - (c * t)), 2)) / 2) / 2) * Math.cos(a * (x - (c * t))))
		)
	}

	var waveEqXY = function (x, y, t) {
		return 0.5 * (
			((e((neg_gamma_sq * Math.pow((x + (c * t)), 2)) / 2) / 2) * Math.cos(a * (x + (c * t)))) +
			((e((neg_gamma_sq * Math.pow((x - (c * t)), 2)) / 2) / 2) * Math.cos(a * (x - (c * t))))
		) +
			0.5 * (
				((e((neg_gamma_sq * Math.pow((y + (c * t)), 2)) / 2) / 2) * Math.cos(a * (y + (c * t)))) +
				((e((neg_gamma_sq * Math.pow((y - (c * t)), 2)) / 2) / 2) * Math.cos(a * (y - (c * t))))
			)
	}


	var canvas = document.getElementById('canvas');
	$scope.plot = async function () {
		var xValues = _.range(-1 * $scope.length, $scope.length, 0.01);

		for (var t = 0; t < $scope.timespan; t += $scope.timestep) {

			//var yValues = xValues.map(x => waveEq(x, t));
			var yValues = xValues.map(x => waveEq2(x, t));

			var trace = [{
				x: xValues,
				y: yValues
			}];

			var xAxis = {
				showgrid: true,
				zeroline: true,
				showline: true,
				title: "x",
				nticks: 20
			};

			var yAxis = JSON.parse(JSON.stringify(xAxis));
			yAxis.title = "y";
			yAxis.range = [-1, 1];

			var layout = { showlegend: false, xaxis: xAxis, yaxis: yAxis, margin: 0 }

			var fig = {
				data: trace,
				layout: layout
			}

			Plotly.newPlot(canvas, fig);
			await sleep($scope.timestep);
		}
	}

	$scope.plot2 = async function () {
		var xyGrid = Array.meshgrid($scope.length, $scope.length);


		for (var t = 0; t < $scope.timespan; t += $scope.timestep) {

			//var yValues = xValues.map(x => waveEq(x, t));
			var yValues = xValues.map(x => waveEq2(x, t));

			var trace = [{
				x: xValues,
				y: yValues
			}];

			var xAxis = {
				showgrid: true,
				zeroline: true,
				showline: true,
				title: "x",
				nticks: 20
			};

			var yAxis = JSON.parse(JSON.stringify(xAxis));
			yAxis.title = "y";
			yAxis.range = [-1, 1];

			var layout = { showlegend: false, xaxis: xAxis, yaxis: yAxis, margin: 0 }

			var fig = {
				data: trace,
				layout: layout
			}

			Plotly.newPlot(canvas, fig);
			await sleep($scope.timestep);
		}
	}


	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

}]);
