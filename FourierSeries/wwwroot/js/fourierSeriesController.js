var myApp = myApp || angular.module('myApp', []);
myApp.controller('fourierSeriesController', ['$scope', function ($scope) {

	$scope.amplitude = 1;
	$scope.length = 10;
	$scope.terms = 10;

	var pi = Math.PI;

	// Example Function
	var myFn = function (x) {
		if (x < 0) {
			return $scope.amplitude;
		} else if (x > 0) {
			return -1 * $scope.amplitude;
		}
	}

	// Fourier Coefficients
	var a0 = 0;
	var ak = function (k) {
		return 0;
	}
	var bk = function (k) {
		var coeff = (-2 * $scope.amplitude) / (k * pi);
		return coeff * (1 - Math.cos(k * pi));
	}

	var nthTermOfFourierSeries = function (x, i) {
		if (i == 0) { return a0; }
		return (ak(i) * Math.cos(i * pi * x / $scope.length)) + (bk(i) * Math.sin(i * pi * x / $scope.length));
	}

	var fourierSeriesOfX = function (x, n) {
		var returnVal = a0;

		if (n == 0) {
			return returnVal;
		}

		for (var i = 1; i <= n; i++) {
			returnVal += nthTermOfFourierSeries(x, i);
		}

		return returnVal;
	}

	var canvas = document.getElementById('canvas');


	$scope.plot = function () {
		var xValues = _.range(-1 * $scope.length, $scope.length, 0.01);
		var yValues = xValues.map(x => myFn(x));

		var originalFn = {
			x: xValues,
			y: yValues
		};

		var traces = [originalFn]

		if ($scope.showBestApprox) {
			var set = {
				x: xValues,
				y: xValues.map(x => fourierSeriesOfX(x, $scope.terms))
			};

			traces.push(set);

		} else {
			for (var j = 0; j < $scope.terms; j++) {
				var set = {
					x: xValues,
					y: xValues.map(x => fourierSeriesOfX(x, j))
				};

				traces.push(set);

				if ($scope.showIndividual) {
					var set2 = {
						x: xValues,
						y: xValues.map(x => nthTermOfFourierSeries(x, j))
					};

					traces.push(set2);
				}
			}
		}

		var xAxis = {
			showgrid: true,
			zeroline: true,
			showline: true,
			title: "x",
			nticks: 20
		};

		var yAxis = JSON.parse(JSON.stringify(xAxis));
		yAxis.title = "y";

		var layout = {
			showlegend: false,
			xaxis: xAxis,
			yaxis: yAxis,
			margin: 0
		}

		var fig = {
			data: traces,
			layout: layout
		}

		Plotly.newPlot(canvas, fig);

	}


}]);
