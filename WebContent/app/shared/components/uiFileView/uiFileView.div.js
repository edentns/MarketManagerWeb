(function () {
	'use strict';

	angular
		.module('edtApp.common.directive')
		.service('UiFileViewSvc', ['APP_CONFIG', '$http', function (APP_CONFIG, $http) {
			var self = this;

			self.delete = function (param) {
				return $http({
					method: 'DELETE',
					url   : APP_CONFIG.domain +'/syFiles?'+ param
				});
			};
		}])
		.directive('uiFileView', [function () {
			return {
				restrict: 'AE',
				templateUrl: 'files/templates',
				scope: {
					files: '='
				},
				controller: ['$q', '$state', '$stateParams', '$scope', '$element', '$attrs', 'FileUploader', 'APP_CONFIG', 'APP_MSG', 'MenuSvc', 'UiFileViewSvc',
					function ($q, $state, $stateParams, $scope, $element, $attrs, FileUploader, APP_CONFIG, APP_MSG, MenuSvc, UiFileViewSvc) {
						function Files(files) {
							var self = this;

							self.callback = {};
							self.insertedFiles = [];
							self.deletedFiles = [];
							self.kind  = ($stateParams.kind==='insert') ? 'INSERT' : 'UPDATE';
							self.NO_M = MenuSvc.getNO_M($state.current.name);
							self.uploader = new FileUploader({
								headers  : { NO_M: self.NO_M },
								url      : APP_CONFIG.domain +'/syFiles'
							});
							self.cdAt = files.CD_AT;
							self.state = true;
							self.enableWrite = angular.isDefined(files.enableWrite) ? files.enableWrite : true;
							self.enableAction = angular.isDefined(files.enableAction) ? files.enableAction : true;
							self.showRecFile = angular.isDefined(files.showRecFile) ? files.showRecFile : true;
							self.showAddFile = angular.isDefined(files.showAddFile) ? files.showAddFile : true;

							if (!self.enableWrite) {
								self.enableAction = false;
								self.showRecFile = true;
								self.showAddFile = false;
							}

							if (angular.isFunction(files.onCompleteAll)) {
								self.callback.onCompleteAll = files.onCompleteAll;
							}

							self._prepare(files.data);

						}

						Files.prototype = {
							_prepare: function (data) {
								var self = this;
								self._preCompositeData(data);
								self._preConfigUploader();
							},
							/**
							 * composite data.
							 * @private
							 */
							_preCompositeData: function (data) {
								var self = this;
								angular.forEach(data, function (file) {
									file.flag = 'U';
									self.insertedFiles.push(file);
								});
							},
							/**
							 * set config.
							 * @private
							 */
							_preConfigUploader: function () {
								var self = this;
								self.uploader.filters.push({
									name: 'customFilter',
									fn: function(item) {
										var totLng = self.uploader.queue.length + self.insertedFiles.length;
										return (edt.isUploadFileType(item) && totLng<5) ? true : false;
									}
								});
								// Filter Error
								self.uploader.onWhenAddingFileFailed = function() {
									var message = '파일은 최대 5까지 업로드 가능하며, exe파일은 업로드 불가능합니다.';
									alert(message);
								};
								// 파일은 업로드 전 실행한다.
								self.uploader.onBeforeUploadItem = function() {
									$scope.$emit('event:loading', true);
								};
								// 파일은 모드 업로드 되었을 때 실행된다.
								self.uploader.onCompleteAll = function() {
									$scope.$emit('event:loading', false);

									var  kindKor = self.getKindKor(),
										callbackParam = {
											state: self.state,
											kind : self.kind,
											msg: ''
										};

									if (self.state) {
										callbackParam.msg = '['+  kindKor +'] 처리가 완료되었습니다.';
									} else {
										callbackParam.msg = '['+  kindKor +'] 파일오류가 발생하였습니다.';
									}

									self.callback.onCompleteAll(callbackParam);
								};
								// 파일 업로드 오류 발생시 실행한다.
								self.uploader.onErrorItem = function(e, a, b) {
									self.state = false;
								};
							},
							/**
							 * 파일을 등록 또는 삭제한다.
							 * @param {object} param 접수번호 등의 정보를 받는다.
							 */
							uploadAll: function (param) {
								var self = this;
								self.requestDelete().then(function (res) {
									if (self.uploader.queue.length>0) {
										self.requestUpload(param.insertedNo);
									} else {
										$scope.$emit('event:loading', false);
										self.callback.onCompleteAll(res);
									}
								});
							},
							/**
							 * 등록된 파일을 삭제한다.
							 * @returns {*}
							 */
							requestDelete: function () {
								var self = this,
									defer = $q.defer(),
									paramList = [],
									param = '',
									kindKor = self.getKindKor(),
									callbackParam = { kind: self.kind };

								if (self.deletedFiles.length>0) {
									angular.forEach(self.deletedFiles, function (file) {
										paramList.push($.param({ ARR_NO_AT: file.NO_AT }));
									});
									param = paramList.join('&') +'&CD_AT='+ self.deletedFiles[0].CD_AT;

									UiFileViewSvc.delete(param).then(function (res) {
										callbackParam.state = true;
										callbackParam.msg = '['+  kindKor +'] 처리가 완료되었습니다.';
										defer.resolve(callbackParam);
									}, function (res) {
										callbackParam.state = false;
										callbackParam.msg = '['+  kindKor +'] 파일오류가 발생하였습니다.';
										defer.resolve(callbackParam);
									});
								} else {
									callbackParam.state = true;
									callbackParam.msg = '['+  kindKor +'] 처리가 완료되었습니다.';
									defer.resolve(callbackParam);
								}
								return defer.promise;
							},
							/**
							 * 파일을 업로드한다.
							 * @param {string} insertedNo 번호(접수번호)
							 */
							requestUpload: function (insertedNo) {
								var self = this;
								angular.forEach(self.uploader.queue, function (oFile) {
									oFile.formData.push({
										CD_AT: self.cdAt,
										CD_REF1: 0,
										CD_REF2: 0,
										CD_REF3: insertedNo,
										CD_REF4: '',
										CD_REF5: ''
									});
								});
								self.uploader.uploadAll();
							},
							/**
							 * 등록된 파일을 삭제한다.
							 * @param {number} idx
							 */
							deleteFile: function (idx) {
								var self = this,
									file = self.insertedFiles[idx];

								file.flag = 'D';
								this.deletedFiles.push(file);
								this.insertedFiles.splice(idx, 1);
							},
							/**
							 * url에 따른
							 * @returns {boolean}
							 */
							isInsert: function () {
								return this.kind === 'INSERT';
							},
							/**
							 * url에 따른 등록 또는 수정 한글명을 구한다.
							 * @returns {string}
							 */
							getKindKor: function () {
								return this.isInsert() ? '등록' : '수정';
							},
							/**
							 * 수정가능여부를 판단한다.
							 * @returns {*}
							 */
							isEnableWrite: function () {
								return this.enableWrite;
							},
							/**
							 * 등록 레이아웃을 show할지 판단한다.
							 * @returns {*}
							 */
							isShowRecFile: function () {
								return this.showRecFile;
							},
							/**
							 * 추가 레이아웃을 show할지 판단한다.
							 * @returns {*}
							 */
							isShowAddFile: function () {
								return this.showAddFile;
							},
							isShowColBar: function () {
								return this.enableWrite ? this.isShowRecFile() && this.isShowAddFile() : false;
							},
							isEnableAction: function () {
								return this.enableAction;
							}
						};

						this.fileApi = $scope.files.api = new Files($scope.files);
					}
				],
				link: function (scope, element, attrs, controller) {
					scope.fileApi = controller.fileApi;
				}
			};
		}])
		.run(['$templateCache', function ($templateCache) {
			$templateCache.put('files/templates',
				'<div>' +
					'<div data-ng-if="fileApi.isEnableWrite() && fileApi.isEnableAction()" class="form-group"><input type="file" nv-file-select uploader="fileApi.uploader" title="" /></div>' +
					'<div class="hbox">' +
						'<div class="hbox-col" data-ng-if="fileApi.isShowRecFile()">' +
							'<table class="table table-bordered table-condensed">' +
								'<colgroup>' +
									'<col style="width:45%;" />' +
									'<col style="width:15%;" />' +
									'<col style="width:25%;" />' +
									'<col style="width:15%;" />' +
								'</colgroup>' +
								'<thead>' +
								'<tr><th colspan="4" class="header-group ta-c">등록된 파일</th></tr>' +
								'<tr>' +
									'<th class="ta-c">Name</th>' +
									'<th class="ta-c">Size(Byte)</th>' +
									'<th class="ta-c">Date</th>' +
									'<th class="ta-c">Action</th>' +
								'</tr>' +
								'</thead>' +
								'<tbody>' +
								'<tr ng-repeat="file in fileApi.insertedFiles">' +
									'<td><a href="{{fileApi.uploader.url}}Down?cd={{file.CD_REF3}}&cdAt={{file.CD_AT}}&noAt={{file.NO_AT}}" download>{{file.NM_FILE}}</a></td>' +
									'<td>{{file.SZ_FILE}}</td>' +
									'<td>{{file.DTS_UPDATE}}</td>' +
									'<td class="ta-c">' +
										'<i data-ng-if="fileApi.isEnableAction()" class="fa fa-minus-circle fa-lg red hover-cursor" tabindex="0" title="{{file.NM_FILE}} 삭제" ng-click="fileApi.deleteFile($index)"></i>' +
									'</td>' +
								'</tr>' +
								'<tr ng-if="fileApi.insertedFiles.length==0">' +
									'<td colspan="4" class="ta-c">등록된 파일이 없습니다.</td>' +
								'</tr>' +
								'</tbody>' +
							'</table>' +
						'</div>' +
						'<div data-ng-if="fileApi.isShowColBar()" class="hbox-col-bar"></div>' +
						'<div data-ng-if="fileApi.isEnableWrite() && fileApi.isShowAddFile()" class="hbox-col">' +
							'<table class="table table-bordered table-condensed">' +
								'<colgroup>' +
									'<col style="width:45%;" />' +
									'<col style="width:15%;" />' +
									'<col style="width:25%;" />' +
									'<col style="width:15%;" />' +
								'</colgroup>' +
								'<thead>' +
								'<tr><th colspan="4" class="header-group ta-c">추가된 파일</th></tr>' +
								'<tr>' +
									'<th class="ta-c">Name</th>' +
									'<th class="ta-c">Size(Byte)</th>' +
									'<th class="ta-c">Date</th>' +
									'<th class="ta-c">Action</th>' +
								'</tr>' +
								'</thead>' +
								'<tbody>' +
								'<tr ng-repeat="item in fileApi.uploader.queue">' +
									'<td>{{item.file.name}}</td>' +
									'<td>{{item.file.size|number}}</td>' +
									'<td></td>' +
									'<td class="ta-c">' +
										'<i data-ng-if="fileApi.isEnableAction()" class="fa fa-minus-circle fa-lg red hover-cursor" tabindex="0" title="{{item.file.name}} 삭제" ng-click="item.remove()"></i>' +
									'</td>' +
								'</tr>' +
								'<tr ng-if="fileApi.uploader.queue.length==0">' +
									'<td colspan="4" class="ta-c">파일을 추가해주세요.</td>' +
								'</tr>' +
								'</tbody>' +
							'</table>' +
						'</div>' +
					'</div>' +
				'</div>'
			);
		}]);

}());
