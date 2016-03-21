// Ionic Starter App
var domain = "http://test.doctrs.in/";
//var domain = "http://192.168.2.169/doctors/";
angular.module('underscore', [])
        .factory('_', function () {
            return window._; // assumes underscore has already been loaded on the page
        });

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('your_app_name', [
    'ionic',
    'angularMoment',
    'your_app_name.controllers',
    'your_app_name.directives',
    'your_app_name.filters',
    'your_app_name.services',
    'your_app_name.factories',
    'your_app_name.config',
    'underscore',
    'ngMap',
    'ngResource',
    'ngCordova',
    'slugifier',
    'ionic.contrib.ui.tinderCards',
    'jett.ionic.filter.bar',
    'youtube-embed'
])
        .run(function ($ionicPlatform, PushNotificationsService, $rootScope, $ionicConfig, $timeout, $ionicLoading, $ionicHistory) {
            $ionicPlatform.onHardwareBackButton(function (event) {
                event.preventDefault();
            });
            $ionicPlatform.on("deviceready", function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                PushNotificationsService.register();
            });
            $rootScope.$on('loading:show', function () {
                $ionicLoading.show({template: 'Loading'})
            })

            $rootScope.$on('loading:hide', function () {
                $ionicLoading.hide()
            })
            // This fixes transitions for transparent background views
            $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                if (toState.name.indexOf('auth.walkthrough') > -1)
                {
                    // set transitions to android to avoid weird visual effect in the walkthrough transitions
                    $timeout(function () {
                        $ionicConfig.views.transition('android');
                        $ionicConfig.views.swipeBackEnabled(false);
                        console.log("setting transition to android and disabling swipe back");
                    }, 0);
                }
            });
            $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                if (toState.name.indexOf('app.feeds-categories') > -1)
                {
                    // Restore platform default transition. We are just hardcoding android transitions to auth views.
                    $ionicConfig.views.transition('platform');
                    // If it's ios, then enable swipe back again
                    if (ionic.Platform.isIOS())
                    {
                        $ionicConfig.views.swipeBackEnabled(true);
                    }
                    console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
                }
            });

            $ionicPlatform.on("resume", function () {
                PushNotificationsService.register();
            });

        })

        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
            $httpProvider.interceptors.push(function ($rootScope) {
                return {
                    request: function (config) {
                        $rootScope.$broadcast('loading:show')
                        return config
                    },
                    response: function (response) {
                        $rootScope.$broadcast('loading:hide')
                        return response
                    }
                }
            })

            $stateProvider

                    //INTRO
                    .state('auth', {
                        url: "/auth",
                        templateUrl: "views/auth/auth.html",
                        abstract: true,
                        controller: 'AuthCtrl'
                    })

                    .state('auth.walkthrough', {
                        url: '/walkthrough',
                        templateUrl: "views/auth/walkthrough.html"
                    })

                    .state('auth.login', {
                        url: '/login',
                        templateUrl: "views/auth/login.html",
                        controller: 'LoginCtrl'
                    })
                    /*.state('auth.logout', {
                     url: '/login',
                     templateUrl: "views/auth/login.html",
                     controller: 'LogoutCtrl'
                     })*/

                    .state('auth.signup', {
                        url: '/signup',
                        templateUrl: "views/auth/signup.html",
                        controller: 'SignupCtrl'
                    })
                    .state('auth.check-otp', {
                        url: '/check-otp',
                        templateUrl: "views/auth/check-otp.html",
                        controller: 'SignupCtrl'
                    })

                    .state('auth.forgot-password', {
                        url: "/forgot-password",
                        templateUrl: "views/auth/forgot-password.html",
                        controller: 'ForgotPasswordCtrl'
                    })
                    .state('auth.update-password', {
                        url: "/update-password",
                        templateUrl: "views/auth/update-password.html",
                        controller: 'ForgotPasswordCtrl'
                    })

                    .state('app', {
                        url: "/app",
                        abstract: true,
                        templateUrl: "views/app/side-menu.html",
                        controller: 'AppCtrl'
                    })

                    .state('app.category-list', {
                        cache: false,
                        url: "/category-listing",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/category-list.html",
                                controller: 'CategoryListCtrl'
                            }
                        }
                    })

                    .state('app.checkavailable', {
                        cache: false,
                        url: "/checkavailable/{data:int}/{uid:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/checkavailable.html",
                                controller: 'CheckavailableCtrl'
                            }
                        }
                    })

                    .state('app.category-detail', {
                        cache: false,
                        url: "/category-detail",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/category-detail.html",
                                controller: 'CategoryDetailCtrl'
                            }
                        }
                    })

                    .state('app.add-category', {
                        cache: false,
                        url: "/add-category/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/add-record.html",
                                controller: 'AddRecordCtrl'
                            }
                        }
                    })

                    .state('app.edit-record', {
                        url: "/edit-record/{id:int}/{cat:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/edit-record.html",
                                controller: 'EditRecordCtrl'
                            }
                        }
                    })

                    .state('app.records-view', {
                        cache: false,
                        url: "/records-view/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/records/records-view.html",
                                controller: 'RecordsViewCtrl'
                            }
                        }
                    })

                    .state('app.record-details', {
                        cache: false,
                        url: "/record-details/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/records/record-details.html",
                                controller: 'RecordDetailsCtrl'
                            }
                        }
                    })

                    //Consultations

                    .state('app.consultations-list', {
                        //cache: false,
                        url: "/consultations-list",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/consultations-list.html",
                                controller: 'ConsultationsListCtrl'
                            }
                        }
                    })

                    .state('app.consultations-current', {
                        url: "/consultations/current",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/consultations-current.html",
                                controller: 'ConsultationsListCtrl'
                            }
                        }
                    })

                    .state('app.consultations-past', {
                        url: "/consultations/past",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/consultations-past.html",
                                controller: 'ConsultationsListCtrl'
                            }
                        }
                    })

                    .state('app.consultation-cards', {
                        cache: false,
                        url: "/consultation-cards/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/consultation-cards.html",
                                controller: 'ConsultationCardsCtrl'
                            }
                        }
                    })

                    .state('app.consultation-profile', {
                        //  cache: false,
                        url: "/consultation-profile/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/consultation-profile.html",
                                controller: 'ConsultationProfileCtrl'
                            }
                        }
                    })

                    .state('app.current-tab', {
                        cache: false,
                        url: "/current-tab/{id:int}/{mode:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/current-tab.html",
                                controller: 'CurrentTabCtrl'
                            }
                        }
                    })

                    .state('app.reschedule-appointment', {
                        cache: false,
                        url: "/reschedule-appointment/{id:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/consultations/reschedule-appointment.html",
                                controller: 'RescheduleAppointmentCtrl'
                            }
                        }
                    })

                    .state('app.patient-join', {
                        cache: false,
                        url: "/patient-join/{id:int}/{mode:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/patient-join.html",
                                controller: 'PatientJoinCtrl'
                            }
                        }
                    })

                    .state('app.join-chat', {
                        cache: false,
                        url: "/join-chat/{id:int}/{mode:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/join-chat.html",
                                controller: 'JoinChatCtrl'
                            }
                        }
                    })

                    //Payment
                    .state('app.payment', {
                        cache: false,
                        url: "/payment",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/payment.html",
                                controller: 'PaymentCtrl'
                            }
                        }
                    })
                    .state('app.Gopay', {
                        url: "/gopay/{link:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/go-payment.html",
                                controller: 'GoPaymentCtrl'
                            }
                        }
                    })

                    .state('app.success', {
                        url: "/success/{id:int}/{serviceId:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/success.html",
                                controller: 'SuccessCtrl'
                            }
                        }
                    })

                    .state('app.failure', {
                        url: "/failure/{id:int}/{serviceId:int}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/failure.html",
                                controller: 'FailureCtrl'
                            }
                        }
                    })
                    .state('app.thankyou', {
                        url: "/thankyou/{data:string}",
                        views: {
                            'menuContent': {
                                templateUrl: "views/app/thankyou.html",
                                controller: 'ThankyouCtrl'
                            }
                        }
                    })

                    .state('app.logout', {
                        url: "/logout",
                        views: {
                            'menuContent': {
                                //templateUrl: "views/app/bookmarks.html",
                                controller: 'AppCtrl'
                            }
                        }
                    })
                    ;

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/auth/walkthrough');
        });
 