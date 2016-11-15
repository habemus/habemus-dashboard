/**
 * Resolves the logged in account and language
 */
exports.currentAccount = /*@ngInject*/ function (uiHAccountDialog, $translate) {

  var _account;

  return uiHAccountDialog.ensureAccount({
    ensureEmailVerified: true,
  })
  .then(function (account) {
    _account = account;

    /**
     * Setup language
     */
    $translate.use(account.applicationConfig.dashboard.language);

    return $translate.onReady();
  })
  .then(function () {
    return _account;
  });

};
