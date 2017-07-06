(function () {
	"use strict";

	/**
	 * @ngdoc function
	 * @name edmsApp.common.directive : contentSearchLayer
	 * @description
	 * LAYOUT
	 */
	angular.module("edtApp.common.directive")
		.directive("contentBoxLayer", [
			function () {
				return {
					priority    : 1,
					restrict    : "A",
					transclude  : true,
					scope       : {
						boxTitle : "=",
						open : "=",
						contentHeight : "@"
					},
					replace     : true,
					link        : function (scope, element) {

						var icon = {
							expand: "fa-expand",
							open  : "fa-chevron-up",
							close : "fa-chevron-down"
						};

						scope._open = (angular.isUndefined(scope.open)) ? true : scope.open;
						scope._icon = scope._open ? icon.open : icon.close;

						var collapseLink = element.find(".collapse-link");
						var expandLink = element.find(".expand-link");

						collapseLink.on("click", function ($event) {
							$event.preventDefault();

							scope._open = !scope._open;
							scope._icon = scope._open ? icon.open : icon.close;
							scope.$apply();
						});


						var height = window.innerHeight - 49;
						//scope._styleHeight = (scope.contentHeight) ? "height:"+scope.contentHeight+"px;" : "";
						scope._styleHeight = (scope.contentHeight) ? scope.contentHeight : "";
						expandLink.on("click", function ($e) {
							$e.preventDefault();

							var body = $('body');
							var box = $(this).closest('div.box');
							var button = $(this).find('i');

							button.toggleClass('fa-expand').toggleClass('fa-compress');
							box.toggleClass('expanded').toggleClass("mt-10");
							body.toggleClass('body-expanded');
							var timeout = 0;
							if (body.hasClass('body-expanded')) {
								timeout = 100;
							}

							setTimeout(function () {
								box.toggleClass('expanded-padding');
							}, timeout);

							setTimeout(function () {
								box.resize();
								box.find('[id^=map-]').resize();
							}, timeout + 50);
						});
					},
					template    :
					"<div class=\"box\">\n" +
					"\t <div class=\"box-header\">\n" +
					"\t \t <div class=\"box-name\">\n" +
					"\t \t \t <i class=\"fa fa-cube\"></i>\n" +
					"\t \t \t <span>{{boxTitle}}</span>\n" +
					"\t \t </div>\n" +
					"\t \t <div class=\"box-icons\">\n" +
					"\t \t \t <a class=\"collapse-link\">\n" +
					"\t \t \t \t <i class=\"fa {{_icon}}\"></i>\n" +
					"\t \t \t </a>\n" +
					"\t \t </div>" +
					"\t </div>" +
					"\t <div data-ng-transclude class=\"box-content\" data-ng-show=\"_open\" style=\"{{_styleHeight}}\">\n" +
					"\t </div>\n" +
					"</div>"
				};
			}
		]);
}());