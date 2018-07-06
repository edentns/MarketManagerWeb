(function () {
    "use strict";

    // [it] MappingItem
    var mappingItemApp = angular.module("it.MappingItem", ["it.MappingItem.controller", "it.MappingItem.service"]);
    angular.module("it.MappingItem.controller", [] );
    angular.module("it.MappingItem.service", [] );

    mappingItemApp.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("app.itMappingItem", {
            url: "/02it/itMappingItem/?menu",
            views: {
                contentView: {
                    templateUrl : "app/contents/02it/it05MappingItem/templates/it.MappingItem.tpl.html",
                    controller  : "it.MappingItemCtrl",
                    resolve     : {
                        resData: ["AuthSvc", "$q", function (AuthSvc, $q) {
                            var defer = $q.defer(),
                                resData = {};

                            AuthSvc.isAccess().then(function (result) {
                                resData.access = result[0];
                                defer.resolve(resData);
                            });

                            return defer.promise;
                        }]
                    }
                }
            }
        });
    }]);
}());
