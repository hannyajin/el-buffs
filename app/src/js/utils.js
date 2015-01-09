var page = require('page');

var utils = (function() {
  var animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

  function animateOnce(sel, cls) {
    $(sel).addClass(cls).one(animEnd, function () {
      $(this).removeClass(cls);
    })
  };

  function navigate (url) {
    return function () {
      page(url);
    }
  };

  return {
    animateOnce: animateOnce,
    navigate: navigate,
    testuser: {
      name: 'Dave'
    }
  }
})();

module.exports = utils;