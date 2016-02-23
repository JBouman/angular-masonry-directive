(function(window, angular, undefined) {'use strict';

  angular.module('masonry', ['ng']).directive('masonry', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(scope, elem, attrs) {
        var container = elem[0];
        var options = angular.extend({
          itemSelector: '.item'
        }, angular.fromJson(attrs.masonry));

        var masonry = scope.masonry = new Masonry(container, options);

        var debounceTimeout = 0;
        scope.update = function() {
          if (debounceTimeout) {
            $timeout.cancel(debounceTimeout);
          }
          debounceTimeout = $timeout(function() {
            debounceTimeout = 0;

            masonry.reloadItems();
            masonry.layout();

            elem.children(options.itemSelector).css('visibility', 'visible');
          }, 120);
        };

        scope.removeBrick = function() {
          $timeout(function() {
            masonry.reloadItems();
            masonry.layout();
          }, 500);
        };

        scope.appendBricks = function(ele) {
          masonry.appended(ele);
        };

        scope.$on('masonry.layout', function() {
          masonry.layout();
        });

        scope.update();
      }
    };
  }]).directive('masonryTile', [function() {
    return {
      restrict: 'AC',
      link: function(scope, elem) {
        elem.css('visibility', 'hidden');
        var master = elem.parent('*[masonry]:first').scope();
        var update = master.update;
        var removeBrick = master.removeBrick;
        var appendBricks = master.appendBricks;
        if (update) {
          elem.ready(update);
        }
        scope.$on('$destroy', function() {
          if (removeBrick) {
            removeBrick();
          }
        });
      }
    };
  }]);
})(window, window.angular);
