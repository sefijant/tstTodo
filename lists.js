var app = angular.module("ToDo", []);
app.controller("MainController", function ($scope, $http) {
    $http.get('/Lists/travel').then(function (response) {
        $scope.travelLists = response.data;
    });
    $http.get('/Lists/army').then(function (response) {
        $scope.armyLists = response.data;
    });
    $http.get('/Lists/shopping').then(function (response) {
        $scope.shoppingLists = response.data;
    });
    $http.get('/Lists/other').then(function (response) {
        $scope.otherLists = response.data;
    });
    $http.get('/Categories/').then(function (response) {
        $scope.categories = response.data;
    });

    $scope.plusImage = "\\resources\\plus.png";
    $scope.plusModal = "#newList";
    $scope.userInputtedList = {
        "name": "",
        "category": "",
        "items": [],
        "uses": 0
    };
    $scope.newListItem = "";

    (function ($) {
        $(function () {
            //initialize all modals           
            $('.modal').modal();
        }); // end of document ready
    })(jQuery);
    var config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    };
    $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false, // Displays dropdown below the button
        alignment: 'left' // Displays dropdown with edge aligned to the left of button
    }
    );

    $scope.onAddItemKeyPress = function (event) {
        if (event.charCode == 13) {
            $scope.userInputtedList.items.push($scope.newListItem);
            $scope.newListItem = "";
        } //if enter then hit the search button
    }


    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
        $scope.userInputtedList = {
            "name": "",
            "category": "",
            "items": [],
            "uses": 0
        };
        $scope.newListItem = "";
       }
   });

    $scope.addListToDB = function () {
        $http.post('/addList/', $scope.userInputtedList)
            .then(
            function (response) {
                console.log(response);
            }
            );
        $scope.userInputtedList = {
            "name": "",
            "category": "",
            "items": [],
            "uses": 0
        };
        $scope.newListItem = "";
    };


    var trying = { "items": ["2", "כdfbdfי"], "name": "נסיון", "category": "other", "uses": 3 };
    $http.post('/updateList/', trying)
        .then(
        function (response) {
        }
        );
    $http.post('/boom/', trying)
        .then(
        function (response) {
        }
        );
});

