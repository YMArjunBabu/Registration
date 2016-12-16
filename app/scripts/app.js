'use strict';

/**
 * @ngdoc overview
 * @name regstryApp
 * @description
 * # regstryApp
 *
 * Main module of the application.
 */
var dI =['ui.router'];
var regstryApp = angular.module('regstryApp', dI);
regstryApp.config(function ($stateProvider,$urlRouterProvider) {
  $urlRouterProvider.otherwise('main');
    $stateProvider
      .state('main', {
        url :'/main',
        templateUrl: 'views/main.html'
      })
      .state('about', {
        url :'/about',
        templateUrl: 'views/about.html'
      });
  });
