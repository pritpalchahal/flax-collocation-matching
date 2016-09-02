// angular.module is a global place for creating, registering and retrieving Angular modules
// 'collocationmatching' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'collocationmatching.services' is found in services.js
// 'collocationmatching.controllers' is found in controllers.js
angular.module('collocationmatching', ['ionic', 'collocationmatching.controllers', 'collocationmatching.services',
  'ngDraggable', 'ngCordova','ionic-toast'])

.run(function($ionicPlatform,$ionicHistory,$stateParams,$filter,Exercises,StateData,SummaryData,DropData,AnswerData,Ids) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    // if(window.connection){
    //   if(window.connection.type == Connection.NONE){
    //     Ids.setStatus(false);
    //   }
    // }
  })

  //override default android back button behavior 
  $ionicPlatform.onHardwareBackButton(function(){
      var currentState = $ionicHistory.currentStateName();

      if(currentState != "exercise"){
        return;
      }
      
      var exId = $stateParams.exId;
      var name = $stateParams.collectionName;
      var id = Ids.get(name);

      //update end time
      if(StateData.getSingleState(id,exId) != "Complete"){
        var time = new Date();
        var timeNow = $filter('date')(time,'medium');
        SummaryData.updateEndTime(id,exId,timeNow);
      }

      var totalSlides = Exercises.getSlidesCount();
      var j = 0;
      var values = AnswerData.getValues(id,exId);
      for(i=0;i<values.length;i++){
        if(values[i]){
          j++;
        }
      }
      if(j == totalSlides){
        StateData.updateState(id,exId,"Complete");
      }
      else{
        StateData.updateState(id,exId,"Incomplete");
      }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  //to override default behaviors of specific platforms (android,ios etc)
  //e.g. android align its titles to left by default, so needs to change it here
  //refer to docs http://ionicframework.com/docs/api/provider/$ionicConfigProvider/
  $ionicConfigProvider.navBar.alignTitle('center');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('collections',{
    url: '/collections',
        templateUrl: 'templates/collections.html',
        controller: 'CollectionsCtrl'
  })

  .state('exs', {
    url: '/collections/:collectionName',
        templateUrl: 'templates/exercises.html',
        controller: 'ExsCtrl'
  })

  .state('exercise', {
    url: '/collections/:collectionName/:exId',
        templateUrl: 'templates/ex-detail.html',
        controller: 'ExerciseCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/collections');

});
