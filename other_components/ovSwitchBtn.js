/**
 * <ov-switch-btn> directive
 * bootstrap-switch, the AngularJS way
 * @author Cuong Nguyen
 * @license MIT
 */

'use strict';

// wrap the code inside IIFE block to avoid global vars pollution
(function () {
  angular.module('nvc.component.switch', [])
    .controller('OvSwitchController', ['$scope', function ($scope) {
      this.setOnStyle = function (styleName) {
        $scope.onStyle = styleName;
      };
      this.setOffStyle = function (styleName) {
        $scope.offStyle = styleName;
      };
    }])
    .directive('ovSwitchBtn', function () {
      //define
      return {
        restrict: 'E',
        template: '<div class="make-switch" ng-transclude><input type="checkbox"></div>',
        replace: true,
        transclude: true,
        controller: 'OvSwitchController',
        scope: {
          i18nData: '=',
          state: '=',
          active: '='
        },
        compile: function () {
          // compile
          return function postLink(scope, element, attrs, ctrl) {
            // link
            scope.safeApply = function (fn) {
              var phase = this.$root.$$phase;
              if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                  fn();
                }
              } else {
                this.$apply(fn);
              }
            };

            var divElm = angular.element(element[0]); // since jQuery is installed, angular.element === $
            var cmd = 'bootstrapSwitch';
            divElm[cmd]();

            attrs.$observe('size', function (val) {
              if (val) {
                divElm.bootstrapSwitch('setSizeClass', 'switch-' + val);
              } else {
                divElm.bootstrapSwitch('setSizeClass', '');
              }
            });

            if (ctrl.dataOnLabelHTML) {
              divElm.bootstrapSwitch('setOnLabel', ctrl.dataOnLabelHTML);
            }

            if (ctrl.dataOffLabelHTML) {
              divElm.bootstrapSwitch('setOffLabel', ctrl.dataOffLabelHTML);
            }

            if (scope.i18nData) {
              scope.$watch('i18nData.on', function (val) {
                divElm.bootstrapSwitch('setOnLabel', val);
              });

              scope.$watch('i18nData.off', function (val) {
                divElm.bootstrapSwitch('setOffLabel', val);
              });
            }

            scope.$watch('state', function (val) {
              divElm.bootstrapSwitch('setState', !!val);
            });

            scope.$watch('active', function (val) {
              divElm.bootstrapSwitch('setActive', !!val);
            });

            scope.$watch('onStyle', function (val) {
              if (val) {
                divElm.bootstrapSwitch('setOnClass', val);
                divElm.attr('data-on', val);
              }
            });

            scope.$watch('offStyle', function (val) {
              if (val) {
                divElm.bootstrapSwitch('setOffClass', val);
                divElm.attr('data-off', val);
              }
            });

            divElm.on('switch-change', function (e, data) {
              scope.safeApply(function () {
                scope.state = data.value;
              });
            });
          };
        }
      };
    })
    .directive('ovSwitchDataOn', function () {
      return new OnLabelDirective();
    })
    .directive('ovSwitchDataOff', function () {
      return new OffLabelDirective();
    })
  ;

  // use class.js for inheritance
  var AbstractLabelDirective = window.Class.extend({
    _propertyName: '???',
    _setColor: function () {
    },
    restrict: 'E',
    transclude: true,
    require: '^ovSwitchBtn',  //use ovSwitchBtnController
    compile: function (elm, attrs, transclude) {
      var propName = this._propertyName;
      var setColorFn = this._setColor;
      return function postLink(scope, element, attrs, ctrl) {
        attrs.$observe('color', function (val) {
          if (val) {
            setColorFn(ctrl, val);
          }
        });
        transclude(scope, function (clone) {
          ctrl[propName] = clone;
        });
      };
    }
  });

  var OnLabelDirective = AbstractLabelDirective.extend({
    _propertyName: 'dataOnLabelHTML',
    _setColor: function (ctrl, style) {
      ctrl.setOnStyle(style);
    }
  });

  var OffLabelDirective = AbstractLabelDirective.extend({
    _propertyName: 'dataOffLabelHTML',
    _setColor: function (ctrl, style) {
      ctrl.setOffStyle(style);
    }
  });
}());
