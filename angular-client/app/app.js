var module = angular.module('myApp', ['ngSanitize', 'ui.select',
    'patternfly.navigation',
    'patternfly.views',
    'patternfly.select',
    'patternfly.form',
    'patternfly.toolbars',
    'patternfly.notification',
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'ui.router.state.events'
  ])
  .config(states);

function states($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '',
      templateUrl: "components/home/home.component.html",
      controller: 'homeController',
      params: {
        obj: null,
        callBack: null
      }
    })
    .state('reports', {
      url: '',
      templateUrl: "components/reports/reports.component.html",
      controller: 'reportsController',
      params: {
        obj: null
      }
    })
    .state('shared', {
      url: '',
      templateUrl: "components/shared/shared.component.html",
      controller: 'sharedController',
      params: {
        obj: null
      }
    })
    .state('review', {
      url: '',
      templateUrl: "components/home/home.component.html",
      controller: 'homeController',
      params: {
        obj: null,
        report: null,
        user: null,
        review: null,
        callBack: null
      }
    })
    .state('reportDetail', {
      url: '',
      templateUrl: "components/home/home.component.html",
      controller: 'homeController',
      params: {
        obj: null,
        report: null,
        user: null,
        callBack: null
      },
    });

  $urlRouterProvider.otherwise('/home');
};

var auth = {};

//Boot up logged user and handle logout
module.controller('GlobalCtrl', function($timeout, $rootScope, $scope, $http, userService, $state) {
  function notify(type, message, persist) {
    $scope.notification = {};
    $scope.notification.type = type;
    $scope.notification.header = 'Error:';
    $scope.notification.message = message;
    if (!persist) {
      $timeout(function() {
        delete $scope.notification;
        _.defer(function() {
          $scope.$apply();
        });
      }, 3000);
    }
  };

  $rootScope.$on('errorResponse', function(event, response) {
    console.log(response);
    if (response.status == -1) {
      notify('danger', 'Unable to load data.', true);
      return;
    }
    notify('danger', response.data.error);
  });

  $scope.homeClass = true;
  $scope.reportsClass = false;
  $scope.teamClass = false;

  $scope.logout = function() {
    auth.loggedIn = false;
    auth.authz = null;
    window.location = auth.logoutUrl;
  };

  $scope.home = function() {
    $state.go('home', {
      obj: $scope.currentUser,
      report: false
    });
    loadData();
    $scope.homeClass = true;
    $scope.reportsClass = false;
    $scope.teamClass = false;
  };

  $scope.reports = function() {
    $state.go('reports', {
      obj: $scope.currentUser
    });
    $scope.homeClass = false;
    $scope.reportsClass = true;
    $scope.teamClass = false;
  }

  $scope.shared = function() {
    $state.go('shared', {
      obj: $scope.currentUser
    });
    $scope.homeClass = false;
    $scope.reportsClass = false;
    $scope.teamClass = true;
  }

  //Router history
  $rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
    $rootScope.previousState = from;
    $rootScope.previousState.params = fromParams;
  });

  function loadData() {
    var email = auth.authz.tokenParsed.email;
    userService.getCurrentUser(email).then(function(data) {
      $scope.currentUser = data.data;
      $state.go('home', {
        obj: $scope.currentUser
      });
      userService.getSubordinates($scope.currentUser.id, true).then(function(data) {
        $scope.associates = data.data;
        $scope.todos = createNotifications($scope.associates);
      });
    });
  };

  function createNotifications(associates) {
    var notificationList = [];
    for (var i = 0; i < associates.length; i++) {
      var needsPlan = true;
      for (var j = 0; j < associates[i].plans.length; j++) {
        if (associates[i].plans[j].status == 'completed') {
          var notification = {};
          notification.associate = associates[i];
          notification.plan = associates[i].plans[j];
          notification.status = 'completed';
          notificationList.push(notification);
        }
        if (associates[i].plans[j].status == 'created') {
          needsPlan = false;
        }
      }
      if (needsPlan) {
        var notification = {};
        notification.associate = associates[i];
        notification.status = 'created';
        notificationList.push(notification);
      }
    }

    var notifications = {
      notifications: notificationList
    };
    return notifications;
  };

  $scope.hideDrawer = true;
  $scope.toggleShowDrawer = function() {
    $scope.hideDrawer = !$scope.hideDrawer;
  };

  $scope.closeDrawer = function() {
    $scope.hideDrawer = true;
  };

  $scope.customScope = {};

  $scope.customScope.reportDetail = function(associate) {
    userService.getUser(associate.id).then(function(data) {
      $state.go('reportDetail', {
        obj: data.data,
        report: true,
        user: $scope.currentUser
      });
      $scope.homeClass = false;
      $scope.reportsClass = true;
      $scope.teamClass = false;
    });
  };

  $scope.customScope.reviewPlan = function(notification) {
    $state.go('review', {
      obj: notification.associate,
      report: false,
      user: $scope.currentUser,
      review: notification.plan,
      callBack: notification.plan
    });
    $scope.homeClass = false;
    $scope.reportsClass = true;
    $scope.teamClass = false;
  };

  $scope.unreadNotifications = function() {
    if ($scope.todos != null && $scope.todos.notifications.length > 1) {
      return true;
    }
    return false;
  }

  $scope.$on('onReviewPlanEvent', onReview);

  function onReview(event, plan) {
    var nots = $scope.todos.notifications;
    for (var i = 0; i < nots.length; i++) {
      if (nots[i].plan != null && nots[i].plan.id == plan.id) {
        nots.splice(i, 1);
        break;
      }
    }
  };

  this.$onInit = function() {
    loadData();
  };
});



angular.element(document).ready(function($http, $scope) {
  var keycloakAuth = new Keycloak('keycloak.json');
  auth.loggedIn = false;

  keycloakAuth.init({
    onLoad: 'login-required'
  }).success(function() {
    auth.loggedIn = true;
    auth.authz = keycloakAuth;
    auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/Compas/protocol/openid-connect/logout?redirect_uri=" + document.baseURI;
    module.factory('Auth', function() {
      return auth;
    });
    angular.bootstrap(document, ["myApp"]);
  }).error(function() {
    window.location.reload();
  });
});

module.factory('authInterceptor', function($rootScope, $q, Auth) {
  return {
    request: function(config) {
      var deferred = $q.defer();
      if (Auth.authz.token) {
        Auth.authz.updateToken(5).success(function() {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + Auth.authz.token;

          deferred.resolve(config);
        }).error(function() {
          //if unable to refresh refresh token defer failure
          deferred.reject('Failed to refresh token');
        });
      }
      return deferred.promise;
    },
    responseError: function(response) {
      //on session timeout logout user and redirect him to authn application
      if (response == 'Failed to refresh token') {
        auth.loggedIn = false;
        auth.authz = null;
        window.location = auth.logoutUrl;
      } else {
        $rootScope.$broadcast('errorResponse', response);
      }
      return $q.reject(response);
    },
    response: function(response) {
      return response;
    }
  };
});

module.config(function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
