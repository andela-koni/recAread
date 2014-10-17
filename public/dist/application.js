'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'bookapp';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('books');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('books').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Books', 'books', 'dropdown', '/books(/create)?');
    Menus.addSubMenuItem('topbar', 'books', 'List Books', 'books');
    Menus.addSubMenuItem('topbar', 'books', 'New Book', 'books/create');
  }
]);'use strict';
//Setting up route
angular.module('books').config([
  '$stateProvider',
  function ($stateProvider) {
    // Books state routing
    $stateProvider.state('listBooks', {
      url: '/books',
      templateUrl: 'modules/books/views/list-books.client.view.html'
    }).state('createBook', {
      url: '/books/create',
      templateUrl: 'modules/books/views/create-book.client.view.html'
    }).state('viewBook', {
      url: '/books/:bookId',
      templateUrl: 'modules/books/views/view-book.client.view.html'
    }).state('editBook', {
      url: '/books/:bookId/edit',
      templateUrl: 'modules/books/views/edit-book.client.view.html'
    });
  }
]);'use strict';
// Books controller
angular.module('books').controller('BooksController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Books',
  'Reviews',
  'Likes',
  '$timeout',
  function ($scope, $stateParams, $location, Authentication, Books, Reviews, Likes, $timeout) {
    $scope.authentication = Authentication;
    $scope.liked = false;
    $scope.showReview = false;
    // BOOK
    // Upload a Bookcover Image
    $scope.fileUpload = function () {
      var fileInput = document.getElementById('fileInput');
      var fileDisplayArea = document.getElementById('fileDisplayArea');
      fileInput.addEventListener('change', function (e) {
        var files = e.target.files;
        if (files && files[0] !== null) {
          var reader = new FileReader();
          reader.onload = function (e) {
            $scope.response = reader.result;
          };
          reader.readAsDataURL(files[0]);
        }
        $timeout(function () {
          $scope.image = $scope.response;
        }, 1000);
      });
    };
    // Create new Book
    $scope.create = function () {
      // Create new Book object
      var book = new Books({
          title: this.title,
          author: this.author,
          genre: this.genre,
          publishedDate: this.publishedDate,
          description: this.description,
          image: $scope.image
        });
      // Redirect after save
      book.$save(function (response) {
        $location.path('books/' + response._id);
        // Clear form fields
        $scope.title = '';
        $scope.author = '';
        $scope.genre = '';
        $scope.publishedDate = '';
        $scope.description = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Book
    $scope.remove = function (book) {
      if (book) {
        book.$remove();
        for (var i in $scope.books) {
          if ($scope.books[i] === book) {
            $scope.books.splice(i, 1);
          }
        }
      } else {
        $scope.book.$remove(function () {
          $location.path('books/create');
        });
      }
    };
    // Update existing Book
    $scope.update = function () {
      var book = $scope.book;
      book.$update(function () {
        $location.path('books/' + book._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Books
    $scope.find = function () {
      $scope.books = Books.query();
    };
    // Find existing Book
    $scope.findOne = function () {
      $scope.book = Books.get({ bookId: $stateParams.bookId }, function () {
        $scope.likes = $scope.book.likes.length;
      });
    };
    // COMMENT	
    // Add a review/comment
    $scope.createReview = function () {
      var review = new Reviews({
          bookId: $scope.book._id,
          reviewText: $scope.reviewText
        });
      // Redirect after save
      review.$save(function (response) {
        $scope.book = response;
        $scope.reviewText = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      $scope.showReview = false;
    };
    // Delete a Review
    $scope.deleteReview = function (review) {
      var rview = new Reviews({
          bookId: $scope.book._id,
          _id: review._id,
          reviewer: review.reviewer
        });
      review.$remove(function (response) {
        $scope.book = response;
      });
    };
    // LIKES
    // checks if user has already liked a book
    $scope.checkLikes = function () {
      var likes = $scope.book.likes;
      for (var i in likes) {
        if (likes[i].user === $scope.authentication.user._id) {
          $scope.liked = true;
          return true;
        }
      }
      return false;
    };
    //remove error message associated with liking a book
    $scope.removeError = function () {
      $scope.likeError = null;
    };
    //like a book
    $scope.likeBook = function () {
      var like = new Likes({
          bookId: $stateParams.bookId,
          likes: 1
        });
      like.$save(function (response) {
        $scope.book = response;
        $scope.liked = true;
        $scope.likes = $scope.book.likes.length;
      }, function (errorResponse) {
        $scope.likeError = errorResponse.data.message;
      });
    };
  }
]);'use strict';
//Books service used to communicate Books REST endpoints
angular.module('books').factory('Books', [
  '$resource',
  function ($resource) {
    return $resource('books/:bookId', { bookId: '@_id' }, { update: { method: 'PUT' } });
  }
]);
angular.module('books').factory('Reviews', [
  '$resource',
  function ($resource) {
    return $resource('books/:bookId/reviews/:reviewId', {
      bookId: '@bookId',
      reviewId: '@_id'
    }, { update: { method: 'POST' } });
  }
]);
angular.module('books').factory('Likes', [
  '$resource',
  function ($resource) {
    return $resource('books/:bookId/like', { bookId: '@bookId' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]).run([
  '$rootScope',
  function ($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function () {
      $('html, body').animate({ scrollTop: 0 }, 200);
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  '$timeout',
  function ($scope, Authentication, $timeout) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.quoteInterval = 7000;
    $scope.myInterval = 5000;
    $scope.quotes = [
      '"So many books, so little time"',
      '"A reader lives a thousand lives before he dies, said Jojen. The man who never reads lives only one"',
      '"If you can make a woman laugh, you can make her do anything"',
      '"All extremes of feelings are allied with madness"',
      '"It does not do to dwell on dreams and forget to live"',
      '"I am not afraid of death, I just want to be there when it happens"'
    ];
    $scope.slides = [
      'modules/core/img/brand/backImage.jpg',
      'modules/core/img/brand/backImage2.jpg'
    ];
    // initial image index
    $scope._Index = 0;
    // initial quote index
    $scope._qIndex = 0;
    // if a current image is the same as requested image
    $scope.isActive = function (index) {
      return $scope._Index === index;
    };
    // for quote
    $scope.isActiveQ = function (index) {
      return $scope._qIndex === index;
    };
    // show prev image
    $scope.showPrev = function () {
      $scope._Index = $scope._Index > 0 ? --$scope._Index : $scope.slides.length - 1;
    };
    // show prev quote
    $scope.showPrevQ = function () {
      $scope._qIndex = $scope._qIndex > 0 ? --$scope._qIndex : $scope.slides.length - 1;
    };
    // show next image
    $scope.showNext = function () {
      $scope._Index = $scope._Index < $scope.slides.length - 1 ? ++$scope._Index : 0;
      $timeout($scope.showNext, $scope.myInterval);
    };
    // show next quote
    $scope.showNextQuote = function () {
      $scope._qIndex = $scope._qIndex < $scope.quotes.length - 1 ? ++$scope._qIndex : 0;
      $timeout($scope.showNextQuote, $scope.quoteInterval);
    };
    $scope.loadSlides = function () {
      $timeout($scope.showNext, $scope.myInterval);
    };
    $scope.loadQuotes = function () {
      $timeout($scope.showNextQuote, $scope.quoteInterval);
    };
    $scope.loadSlides();
    $scope.loadQuotes();
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    // If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);