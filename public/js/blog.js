var blogApp = angular.module("BlogApp", ['infinite-scroll', 'angularLazyImg'])
.controller("BlogController", function ($scope, $http, $timeout) {

	var start = 0,
		len = 2;

	$scope.isLoadingPost = false;
	$scope.noMorePost = false;
	$scope.posts = [];
	$scope.myPagingFunction = function () {
		$scope.loadPosts();
	};

	$scope.loadPosts = function () {

		if ($scope.noMorePost) return;

		$scope.isLoadingPost = true;
		$http.get("/getArticles", {
			params: {
				start: start,
				len: len
			}
		}).success(function (posts) {
			start = start + posts.length;
			$scope.isLoadingPost = false;
			Array.prototype.push.apply($scope.posts, posts);
			// 完了！
			if (posts.length < len) {
				$scope.noMorePost = true;
			}
		});
	};

	$scope.init = function () {
		$scope.loadPosts();
	};

});