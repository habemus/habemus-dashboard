exports.isChrome = function () {
  return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
};

var OS_INTERNAL_REGEXPS = [
  /^__MACOSX/,
  /\.DS_Store/,
];

exports.isOSInternalFile = function (filename) {

  return OS_INTERNAL_REGEXPS.some(function (re) {
    return re.test(filename);
  });
};

exports.commonPrefix = function (array) {
  var A= array.concat().sort(), 
  a1= A[0], a2= A[A.length-1], L= a1.length, i= 0;
  while(i<L && a1.charAt(i)=== a2.charAt(i)) i++;
  return a1.substring(0, i);
};

exports.isZipFile = function (file) {
  return /\.zip$/.test(file.name);
}