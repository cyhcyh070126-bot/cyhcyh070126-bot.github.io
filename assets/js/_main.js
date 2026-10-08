/* ==========================================================================
   Various functions that we want to use within the template
   ========================================================================== */

// detect OS/browser preference
const browserPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

// Set the theme on page load or when explicitly called
let setTheme = (theme) => {
  const use_theme =
    theme ||
    localStorage.getItem("theme") ||
    $("html").attr("data-theme") ||
    browserPref;

  if (use_theme === "dark") {
    $("html").attr("data-theme", "dark");
    $("#theme-icon").removeClass("fa-sun").addClass("fa-moon");
  } else if (use_theme === "light") {
    $("html").removeAttr("data-theme");
    $("#theme-icon").removeClass("fa-moon").addClass("fa-sun");
  }
};

// Toggle the theme manually
var toggleTheme = () => {
  const current_theme = $("html").attr("data-theme");
  const new_theme = current_theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", new_theme);
  setTheme(new_theme);
};

/* ==========================================================================
   Plotly integration script so that Markdown codeblocks will be rendered
   ========================================================================== */

// Read the Plotly data from the code block, hide it, and render the chart as new node. This allows for the 
// JSON data to be retrieve when the theme is switched. The listener should only be added if the data is 
// actually present on the page.
if (document.querySelector("pre>code.language-plotly")) {
  import('./plotly-loader.js').then(module => module.renderPlots()).catch(error => {
    console.error('Unable to load interactive charts:', error);
  });
}

/* ==========================================================================
   Actions that should occur when the page has been fully loaded
   ========================================================================== */

$(document).ready(function () {
  // Give each naturally wrapped line a real box for the existing CSS scale.
  document.querySelectorAll('.home-page > p:nth-of-type(-n+4)').forEach(paragraph => {
    const links = Array.from(paragraph.querySelectorAll('a'), link => ({link, label: link.textContent}));
    if (!links.length) return;
    links.forEach(({link}) => link.classList.add('inline-wrapped-link'));
    let measuredWidth = 0;
    let layoutFrame = 0;
    const layoutInlineLinks = () => {
      layoutFrame = 0;
      // Measure all links as natural inline text before fixing any line boxes.
      links.forEach(({link, label}) => { link.textContent = label; });
      const layouts = links.map(({link, label}) => {
        const range = document.createRange();
        const lines = [];
        for (const word of label.matchAll(/\S+/g)) {
          range.setStart(link.firstChild, word.index);
          range.setEnd(link.firstChild, word.index + word[0].length);
          const rect = range.getBoundingClientRect();
          let line = lines[lines.length - 1];
          if (!line || Math.abs(line.top - rect.top) > 1) {
            line = {top: rect.top, left: rect.left, right: rect.right, words: []};
            lines.push(line);
          }
          line.right = rect.right;
          line.words.push(word[0]);
        }
        return {link, lines};
      });
      layouts.forEach(({link, lines}) => {
        const content = document.createDocumentFragment();
        lines.forEach((line, index) => {
          if (index) content.appendChild(document.createTextNode(' '));
          const span = document.createElement('span');
          span.className = 'inline-link-line';
          span.textContent = line.words.join(' ');
          span.style.width = (line.right - line.left) + 'px';
          content.appendChild(span);
        });
        link.replaceChildren(content);
      });
      measuredWidth = paragraph.clientWidth;
    };
    layoutInlineLinks();
    new ResizeObserver(() => {
      if (paragraph.clientWidth !== measuredWidth && !layoutFrame) {
        layoutFrame = requestAnimationFrame(layoutInlineLinks);
      }
    }).observe(paragraph);
    document.fonts.ready.then(layoutInlineLinks);
  });

  // SCSS SETTINGS - These should be the same as the settings in the relevant files 
  const scssLarge = 925;          // pixels, from /_sass/_themes.scss
  const scssMastheadHeight = 70;  // pixels, from the current theme (e.g., /_sass/theme/_default.scss)

  // If the user hasn't chosen a theme, follow the OS preference
  setTheme();
  window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener("change", (e) => {
          if (!localStorage.getItem("theme")) {
            setTheme(e.matches ? "dark" : "light");
          }
        });

  // Enable the theme toggle
  $('#theme-toggle').on('click', toggleTheme);
  $('#theme-toggle a').on('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  });

  // Enable the sticky footer
  var bumpIt = function () {
    $("body").css("padding-bottom", "0");
    $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
  }
  var footerFrame = 0;
  $(window).on('resize', function () {
    if (footerFrame) return;
    footerFrame = window.requestAnimationFrame(function () {
      footerFrame = 0;
      bumpIt();
    });
  });
  bumpIt();

  // FitVids init
  fitvids();

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function () {
    $(".author__urls").fadeToggle("fast", function () { });
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // Restore the follow menu if toggled on a window resize
  jQuery(window).on('resize', function () {
    if ($('.author__urls.social-icons').css('display') == 'none' && $(window).width() >= scssLarge) {
      $(".author__urls").css('display', 'block')
    }
  });

  // Init smooth scroll, this needs to be slightly more than then fixed masthead height
  $("a").smoothScroll({
    offset: -scssMastheadHeight,
    beforeScroll: function (options) {
      options.offset = -($('.masthead').outerHeight() + 16);
    },
    speed: 0,
    preventDefault: false,
  });

});
