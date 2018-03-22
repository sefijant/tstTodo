
var app = angular.module("ToDo", []);
app.controller("MainController", function ($scope, $http) {
	$http.get('/Lists/travel').then(function(response) {
        $scope.travelLists = response.data;
    });
	$http.get('/Lists/army').then(function(response) {
        $scope.armyLists = response.data;
    });
	$http.get('/Lists/shopping').then(function(response) {
        $scope.shoppingLists = response.data;
    });
	$http.get('/Lists/other').then(function(response) {
        $scope.otherLists = response.data;
    });
	var categories = [{ "name": "קניות", "image": ".\\resources\\shopping.jpg", "modal": "#shopping" }, { "name": "צבא", "image": ".\\resources\\army.jpg", "modal": "#army" }, { "name": "טיולים", "image": ".\\resources\\travel.jpg", "modal": "#travel" }, { "name": "אחר", "image": ".\\resources\\else.jpg", "modal": "#other" }];
    $scope.categories = categories;

    (function ($) {
        $(function () {
    
            //initialize all modals           
            $('.modal').modal();
    
        }); // end of document ready
    })(jQuery);

});

