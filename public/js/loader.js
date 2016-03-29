angular.module("loader", []).directive("loader", function () {
	return {
        restrict: 'A',
        templateUrl: '/partials/loader.html'
    }
});