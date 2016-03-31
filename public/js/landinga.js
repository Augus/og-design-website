
var app = angular.module("LandingApp", ['angular-google-analytics', 'angularLazyImg']);

app.config(function($locationProvider, AnalyticsProvider) {
    // $locationProvider.html5Mode(false).hashPrefix('!');
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    // $routeProvider
    // .when( "/section-a", {} )
    // .when( "/section-b", {} )
    // .when( "/section-c", {} )
    // .when( "/section-d", {} )
    // .otherwise({
    //     redirectTo: "/section-a"
    // });
    AnalyticsProvider.setAccount([{
        tracker: 'UA-52653674-2',
        name: "tracker"
    }]);
});

app.directive('mousetrap', function () {
    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs',
                     function ($scope, $element, $attrs) {
            
            var mousetrap;

            $scope.$watch($attrs.mousetrap, function(_mousetrap) {
                mousetrap = _mousetrap;

                for (var key in mousetrap) {
                    if (mousetrap.hasOwnProperty(key)) {
                        Mousetrap.unbind(key);
                        Mousetrap.bind(key, applyWrapper(mousetrap[key])); 
                    }
                }
            }, true);
            
            function applyWrapper(func) {
                return function(e) {
                    $scope.$apply(function() {
                        func(e);
                    });
                };
            }
            
            $element.bind('$destroy', function() {
                if (!mousetrap) return;

                for (var key in mousetrap) {
                    if (mousetrap.hasOwnProperty(key)) {
                        Mousetrap.unbind(key);
                    }
                }
            });

        }]
    }
});

app.controller("ContactController", function ($scope, Analytics) {
    $("#submitting-contact").hide();
    $('#name').on('focus', function() {
        Analytics.trackEvent('Contact', 'Focus-Name');
    });
    $('#email').on('focus', function() {
        Analytics.trackEvent('Contact', 'Focus-Email');
    });
    $('#message').on('focus', function() {
        Analytics.trackEvent('Contact', 'Focus-Message');
    });
    $('#submit-contact').on("click", function(evt) {
        evt.preventDefault(); // Don't do default action

        // Replace this with your subdomain!
        var uvSubdomain = "ogdesign";
        // Create an API client (non-trusted) within the UserVoice settings/channels section.  Paste the key only here.
        var uvKey = "wQ9LJaiMepJxkCJelQUAqw";
        // Grab the data we need to send
        var message = $('#message').val();
        var name = $('#name').val();
        var email = $('#email').val();

        $("#submit-contact").hide();
        $("#submitting-contact").show();
        // Execute the JSONP request to submit the ticket
        $.getJSON('https://' + uvSubdomain + '.uservoice.com/api/v1/tickets/create_via_jsonp.json?callback=?', {
            client: uvKey,
            ticket: {
                message: message,
                // subject: subject
            },
            name: name,
            email: email
        }).done(function() {
            $('#message').val("");
            $('#name').val("");
            $('#email').val("");
            $('.contact-form').addClass("success");
            // alert('Successfully submitted ticket!'); // You might want to redirect the user here, or show a stylized message to them.
        });
        Analytics.trackEvent('Contact', 'Send', name + '/' + email + '/' + message);
    });
})

app.controller("RootController", function($scope, $timeout, Analytics, $location, $http) {

     // 作品
    $scope.porfolios = [];
    $scope.transparent = true;
    $(window).on("scroll", function () {
        $scope.$apply(function () {
            $scope.scrollTop = $(window).scrollTop();
            if ($scope.scrollTop < 120) {
                $scope.transparent = true;
            }
            else {
                $scope.transparent = false;
            }
        });
    });

    $('a[href*=#]:not([href=#])').click(function(e) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 80
                }, 600, function () {
                    $scope.$apply(function (){
                        $location.hash(target.attr("id"));
                    })
                });
                return false;
            }
        }
    });

    $http.get("/getPortfolios").success(function (porfolios) {
        $scope.porfolios = porfolios;
        if ($scope.portfolio) {
            var idx = parseInt($scope.portfolio);
            $scope.openPlayer($scope.porfolios[idx], idx);
        }
    });

   
    $scope.isOpenPlayer = false;
    $scope.portfolio = $location.search().portfolio;

    $scope.openPlayer = function(portfolio, index) {
        $scope.isOpenPlayer = true;
        $scope.goto(portfolio, index);
    };

    $scope.closePlayer = function() {
        $scope.isOpenPlayer = false;
        $scope.current = undefined;
        $location.search('portfolio', null);
    };

    $scope.goto = function (portfolio, index) {
        Analytics.trackEvent('Portfolio', 'View', portfolio.title);
        if ($scope.current) {
            $scope.current.scrollTop = $("#player").scrollTop();
        }
        $scope.currentIndex = index;
        $scope.current = portfolio;
        $scope.isSmall = portfolio.isSmall;
        $("#player").scrollTop($scope.current.scrollTop || 0);
        $location.search('portfolio', index).hash('showcases');
    };

    $scope.next = function () {
        if ($scope.currentIndex + 1 <= $scope.porfolios.length - 1) {
            $scope.goto($scope.porfolios[$scope.currentIndex + 1], $scope.currentIndex + 1);
        }
        else {
            $scope.goto($scope.porfolios[0], 0);
        }
    };

    $scope.prev = function () {
        if ($scope.currentIndex - 1 > 0) {
            $scope.goto($scope.porfolios[$scope.currentIndex - 1], $scope.currentIndex - 1);
        }
        else {
            $scope.goto($scope.porfolios[$scope.porfolios.length - 1], $scope.porfolios.length - 1);
        }
    };

    
});
