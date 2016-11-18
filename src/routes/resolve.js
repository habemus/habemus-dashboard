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

    var lang;

    try {
      lang = account.applicationConfig.dashboard.language;
    } catch (e) {
      // non critical error
    }

    if (lang) {
      /**
       * Setup language
       */
      $translate.use(lang);
    }

    return $translate.onReady();
  })
  .then(function () {
    return _account;
  });

};
