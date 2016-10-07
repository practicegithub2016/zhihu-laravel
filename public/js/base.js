;
(function () {
    'use strict';
    angular.module('zhihu', [
        'ui.router',
    ])
        .config(['$interpolateProvider',
            '$stateProvider',
            '$urlRouterProvider',
            function ($interpolateProvider,      //注入
                      $stateProvider,
                      $urlRouterProvider) {
                $interpolateProvider.startSymbol('[:');
                $interpolateProvider.endSymbol(':]');

                $urlRouterProvider.otherwise('/home');

                $stateProvider
                    .state('home', {
                        url: '/home',
                        templateUrl: 'home.tpl' // host/home.tpl
                    })
                    .state('login', {
                        url: '/login',
                        //template: '<h1>登录</h1>',
                        templateUrl: 'login.tpl'
                    })
                    .state('signup', {
                        url: '/signup',
                        //template: '<h1>登录</h1>',
                        templateUrl: 'signup.tpl'
                    })
            }])
        .service('UserService', [
            '$http',
            '$state',
            function ($http, $state) {
                var me = this;
                me.signup_data = {};
                me.signup = function () {
                    $http.post('api/signup', me.signup_data)
                        .then(function (rs) {
                            if (rs.data.status) {
                                me.signup_data = {};
                                $state.go('login');
                            }
                        }, function (e) {
                            console.log('e', e);
                        })
                }
                me.username_exits = function () {
                    $http.post('api/user/exists', {username: me.signup_data.username})
                        .then(function (rs) {
                            if (rs.data.status && rs.data.data.count) {
                                me.signup_username_exists = true;
                            } else {
                                me.signup_username_exists = false;
                            }
                        }, function (e) {
                            console.log('e', e);
                        })
                }
            }])

        .controller('SignupController', [
            '$scope',
            'UserService',
            function ($scope, UserService) {
                $scope.User = UserService;
                $scope.$watch(function () {
                    return UserService.signup_data;
                }, function (n, o) {
                    if (n.username != o.username) {
                        UserService.username_exits();
                    }
                }, true);

            }])

})();