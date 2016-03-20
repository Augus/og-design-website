angular.module("ngModal", [])
/**
 * ngModal 元件，主要處理 Modal 開啟關閉功能，注意：一定要給予 modal 一個獨立的 id
 *
 * #### 關閉 Modal 的方法
 *
 * 方法一 ： 使用 close-modal 屬性
 * <div ng-modal>
 * 		<div class="button" close-modal></div>
 * </div>
 *
 * 方法二： 自定義 ng-click 並呼叫 $scope.closeModal();
 *
 * @return {[type]}
 */
.directive("ngModal", function () {
	return {
		restrict: "AE",
		scope: true,
		link: function (scope, elem, attrs) {

			scope.isOpen = false;

			// 接收 Modal 開啟事件
			scope.$on("OPEN_MODAL_" + attrs.ngModal, function () {
				scope.isOpen = true;

				Mousetrap.bind('esc', function(e) {
		            scope.$apply(function() {
		            	scope.isOpen = false;
		            })
		        });

		  //       Mousetrap.stopCallback = function(e, element, combo) {

				//     if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
				//         return false;
				//     }
				//     return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
				// }
			});

			// 接收 Modal 關閉事件
			scope.$on("CLOSE_MODAL_" + attrs.ngModal, function () {
				scope.isOpen = false;
				// Mousetrap.unbind('esc');
			});

			// close-modal 屬性點擊事件處理
			$(elem).on("click", "[close-modal]", function () {
				scope.$apply(function () {
					scope.closeModal();
				});
			});

			// 關閉 modal 處理
			scope.closeModal = function () {
				scope.isOpen = false;
			};
		}
	}
})

/**
 * 開啟 ngModal 的 Directive
 * 範例 : 
 * 		<div class="button" open-modal="modal-1">Close</div>
 * 		
 * 		或是使用 $ngModal.openModal() 方法
 * 		
 * 		<div class="button" ng-click="myClickHandler">Close</div>
 * 		function myClickHandler () {
 * 			$ngModal.openModal("modal-1");
 * 		}
 * 		
 * @param  {[type]} $ngModal
 * @return {[type]}
 */
.directive("openModal", function ($ngModal) {
	return {
		restrict: "A",
		scope: {
			openModal: "&openModal"
		},
		link: function (scope, elem, attrs) {

			elem.on("click", function () {
				scope.$apply(function () {
					var id = attrs.openModal;
					$ngModal.openModal(id);
				});
			});
		}
	}
})

.factory("$ngModal", function ($rootScope) {

	var _factory = {};
	var count = 0;

	_factory.openModal = function (id) {

		$rootScope.$broadcast("OPEN_MODAL_" + id);
		// count++;
		// if (count == 1) {
			// Mousetrap.bind(['esc'], function(e) {
	  //           $rootScope.$apply(function() {
	  //           	_factory.closeModal(id);
	  //           })
	  //           return false;
	  //       });

	  //       Mousetrap.stopCallback = function(e, element, combo) {

			//     if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
			//         return false;
			//     }
			//     return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || (element.contentEditable && element.contentEditable == 'true');
			// }
		// }
	};

	_factory.closeModal = function (id) {
		// count--;
		$rootScope.$broadcast("CLOSE_MODAL_" + id);
	};

	return _factory;

});
