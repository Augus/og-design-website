var resourcesApp = angular.module("ResouceApp", ['ngAnimate', 'mgo-mousetrap', 'ngModal'])
.filter('domain', function() {
    return function(input) {
        var a = document.createElement('a');
        a.href = input;
        return a.hostname;
    };
})

.controller("SubmitResourceController", function ($scope, $http, $timeout, $ngModal) {
	$scope.submit = function () {

		$scope.urlError = false;
		$scope.titleError = false;

		if (!is.url($scope.newResourceUrl)) {
			$scope.urlError = true;
			return;
		}

		else if ($scope.newResourceTitle == "") {
			$scope.titleError = true;
			return;
		}

		$scope.submitting = true;

		$http({
            url: "/submitResource",
            method: "POST",
            data: $.param({
            	url: $scope.newResourceUrl,
            	title: $scope.newResourceTitle,
            	description: $scope.newResourceDescript
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }).success(function(data) {
        	$timeout(function () {
	            $scope.submitting = false;
	            $scope.isSuccess = true;
	            $scope.newResourceUrl = "";
            	$scope.newResourceTitle = "";
            	$scope.newResourceDescrip = "";
            }, 1000);
            $timeout(function () {
            	$ngModal.closeModal("submit-resource-modal");
            	$scope.isSuccess = false;
        	}, 5000);
        }).error(function(data, status, headers, config) {
        	$scope.submitting = false;
        });
	};
})
.controller("ResourceController", function ($scope, $http, $timeout) {

	$scope.keyword = "";
	$scope.categories = [];
	$scope.resources = [];

	$scope.init = function () {

        $scope.isLoading = true;

        $http.get("/getCategories").success(function (data) {
            $scope.categories = data;
        });

        $http.get("/getResources").success(function (data) {
            $scope.isLoading = false;
            $scope.resources = data;
        });
    };

	$scope.openResource = function (e, resource) {
		$http.get("/view/" + resource._id).success(function (data) {});
	};

	$scope.search = function () {
        $timeout(function () {
            $("#search").focus().select();
        }, 100);
    };

	$scope.onSearchKeyUp = function (event) {
        var keyCode = event.keyCode;
        if (keyCode == 27) {
            $timeout(function () {
                $("#search").blur();
            }, 100);
        }
    };

	$scope.filter = function (category) {
		if (category) {
			$scope.currentCategory = category.id;
		}
		else {
			$scope.currentCategory = undefined;	
		}
	};

	$scope.categoryFilter = function (resource) {

		if (!$scope.currentCategory)
			return true;

		if (resource.categories.indexOf($scope.currentCategory) != -1 ) {
			return true;
		}
		return false;
	};

	$scope.searchFilter = function(resource) {

        if (resource) {

            var isMatch = false,
                keywords = $scope.keyword.split(" ");

            for (var i = 0; i < keywords.length; i++) {
                
                var  keyword = keywords[i].toLowerCase();

                var keywords = resource.keywords && resource.keywords.toLowerCase() || "",
                    resourceUrl = resource.url && resource.url.toLowerCase(),
                    resourceName = resource.title && resource.title.toLowerCase(),
                    resourceDescription = resource.description.toLowerCase();
                if (keywords.indexOf(keyword) != -1 || 
                    resourceName.indexOf(keyword) != -1 || 
                    resourceUrl.indexOf(keyword) != -1 || 
                    resourceDescription.indexOf(keyword) != -1) {
                    isMatch = true;
                }
                else {
                    isMatch = false;
                    return false;
                }
            }

            return isMatch;
        }
        return false;
    };

})