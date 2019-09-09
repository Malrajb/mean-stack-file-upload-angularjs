(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($rootScope, UserService) {
        var vm = this;

        vm.user = null;
		$rootScope.logged_user = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
				$rootScope.logged_user = user;				 
            });
        }
    }

})();