var page = require('page');

var text = "Lorem ipsum dolor sit amet, consectetur adipisci\
            ng elit. Ut molestie ex at scelerisque blandit. \
            Morbi scelerisque sem quis bibendum.\
            Class aptent taciti sociosqu ad litora torquent\
            per conubia nostra, per inceptos himenaeos. Cr\
            as finibus turpis sed orci cursus, et viverra \
            arcu lobortis. Phasellus at nulla feugiat, con\
            dimentum nisl id, venenatis dui. Maecenas solli\
            citudin mauris et finibus porttitor. Etiam sit a\
            met elit dignissim, placerat lacus id, ultrices o\
            dio. Nullam dictum quis mauris sit amet lacinia. N\
            unc nulla quam, rhoncus id lorem id, ultrices dign\
            issim velit. Ut vel urna quis erat accumsan tincidu\
            nt. In pharetra sem sit amet sem molestie elementum.\
            Nulla dui nibh, varius sit amet felis at, imperdiet\
            scelerisque sapien. Nam dapibus sodales consectetur.\
             Curabitur fringilla magna id ante aliquam rutrum.\
             Donec justo sapien, rutrum et iaculis sed, ultri\
            ces sit amet ligula. Mauris ac lorem molestie, co\
            ngue tellus sit amet, bibendum sem. Sed euismod le\
            o nec magna scelerisque, ut consequat arcu facilis\
            is. Sed commodo urna felis, sed consequat quam eges\
            tas id. Donec mattis orci id dolor varius, sed elei\
            fend nibh dapibus. Sed sem augue, pharetra nec eli\
            t et, dictum luctus ligula. Integer in dui aliquam\
            , sollicitudin massa sit amet, sagittis purus. Maur\
            is vehicula magna risus, sit amet vulputate arcu lac\
            inia at. Proin elementum, odio vel scelerisque ullam\
            corper, sem orci laoreet mi, et interdum ex sem ut n\
            unc. Pellentesque vehicula urna vitae pulvinar phare\
            tra. Pellentesque vulputate bibendum sem, non ullamc\
            orper est luctus id. Suspendisse feugiat sed massa n\
            on interdum. Duis non felis urna. Cras tristique, m\
            i eget pretium tempus, orci arcu fringilla erat, vi\
            tae dapibus sem lorem nec diam. Vestibulum auctor, n\
            eque eget efficitur ultrices, lorem ex blandit justo\
            , et efficitur tellus dolor vel nunc. Sed porta lacin\
            ia enim eu porttitor. Aenean feugiat augue nec lacu\
            s egestas porttitor. Morbi venenatis enim eget tempo\
            r malesuada.";

var utils = (function() {
  var animEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

  function animateOnce(sel, cls) {
    $(sel).addClass(cls).one(animEnd, function () {
      $(this).removeClass(cls);
    })
  };

  function navigate (url) {
    page(url);
  };

  var ipsums = text.split(' ');
  function generateIpsum(num) {
    var str = 'Lorem ipsum dolor sit amet, ';
    var t = (Math.random() * ipsums.length) | 0;
    while (ipsums[t].length < 5) {
      t = (Math.random() * ipsums.length) | 0;
    }
    for (var i = 0; i < num; i++) {
      str += ipsums[(i + t) % ipsums.length] + ' ';
    }
    return str;
  };

  var msgEl = null;
  function showMessage (message, type) {
    console.log('INSIDE SHOWMESSAGE ----');

    var msg = message;
    var timeout = 2200;
    if (msgEl) {
      msg = msgEl.lastMsg + "<br>" +  msg;
      timeout = msgEl._timeout + 200;
      msgEl.remove();
      msgEl = null;
    }
    if (timeout > 3000)
      timeout = 3000;

    var cls = type || 'info';
    var str = '<div class="'+cls+'">' + msg + '</div>';
    var el = $(str);
    el.lastMsg = message;
    el._timeout = timeout;
    $('#view').prepend(el);

    // center showmessage element
    var wi = window.innerWidth;
    var left = (wi / 2) - (el.width() / 2) - 20;
    el.css({"left": left});

    el.slideDown(400).delay(timeout).slideUp(200,function(){
      var self = $(this);
      if (msgEl == el) {
        msgEl = null;
      }
      if (self != null) {
        self.remove();
      }
    });

    msgEl = el;
  };

  function showXHR(xhr, type) {
    var json = $.parseJSON(xhr.responseText);
    var error = json.error || json.err;
    var message = json.message || json.msg || json.info;

    if (message) {
      showMessage("Message: " + message, type || 'warning');
    } else 
      if (error) {
        showMessage("Error: " + error, type || 'error');
      }
  };

  return {
    animateOnce: animateOnce,
    navigate: navigate,
    generateIpsum: generateIpsum,
    showMessage: showMessage,
    showXHR: showXHR,
  }
})();

module.exports = utils;
