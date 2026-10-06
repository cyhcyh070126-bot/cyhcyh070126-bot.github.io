/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $vlinks_persist_tail = $vlinks.children("*.persist.tail");
var $hlinks = $('#site-nav .hidden-links');

function updateNav() {
  // Measure the current font/layout, not widths cached before fonts or the
  // search control finished loading. Restore links in their original order.
  if ($vlinks_persist_tail.length) {
    $hlinks.children().insertBefore($vlinks_persist_tail);
  } else {
    $hlinks.children().appendTo($vlinks);
  }
  $btn.addClass('hidden');
  if ($vlinks.width() > $nav.width()) {
    $btn.removeClass('hidden');
    var availableSpace = $nav.width() - $btn.outerWidth(true) - 12;
    while ($vlinks.width() > availableSpace && $vlinks.children('*:not(.persist)').length) {
      $vlinks.children('*:not(.persist)').last().prependTo($hlinks);
    }
  }
  var hiddenCount = $hlinks.children().length;
  if (!hiddenCount) {
    $btn.addClass('hidden').removeClass('close').attr('aria-expanded', 'false');
    $hlinks.addClass('hidden');
  }
  $btn.attr('count', hiddenCount);

  // update masthead height and the body/sidebar top padding
  var mastheadHeight = $('.masthead').height();
  document.documentElement.style.setProperty('--site-scroll-offset', (mastheadHeight + 16) + 'px');
  $('body').css('padding-top', mastheadHeight + 'px');
  if ($(".author__urls-wrapper button").is(":visible")) {
    $(".sidebar").css("padding-top", "");
  } else {
    $(".sidebar").css("padding-top", mastheadHeight + "px");
  }

}

// Window listeners

var navFrame = 0;
function scheduleNavUpdate() {
  if (navFrame) return;
  navFrame = window.requestAnimationFrame(function () {
    navFrame = 0;
    updateNav();
  });
}
$(window).on('resize load pageshow', scheduleNavUpdate);
if (screen.orientation && typeof screen.orientation.addEventListener === 'function') {
  screen.orientation.addEventListener('change', scheduleNavUpdate);
}
if (document.fonts) {
  document.fonts.ready.then(scheduleNavUpdate);
  document.fonts.addEventListener('loadingdone', scheduleNavUpdate);
}
if (typeof ResizeObserver !== 'undefined' && $nav.length) {
  new ResizeObserver(scheduleNavUpdate).observe($nav[0]);
}

$btn.on('click', function () {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
  $(this).attr('aria-expanded', String(!$hlinks.hasClass('hidden')));
});

updateNav();
