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
  // Keep link text untouched. Only the transient hover paint is enlarged.
  const introLinks = document.querySelectorAll('.home-page > p:nth-of-type(-n+4) a');
  if (introLinks.length) {
    let activeIntroLink = null;
    let introPreviewLines = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const clearIntroPreview = () => {
      if (activeIntroLink) activeIntroLink.classList.remove('home-link-preview-active');
      introPreviewLines.forEach(line => line.remove());
      introPreviewLines = [];
      activeIntroLink = null;
    };
    const showIntroPreview = (link) => {
      clearIntroPreview();
      if (reducedMotion.matches || link.childNodes.length !== 1 ||
          link.firstChild.nodeType !== Node.TEXT_NODE) return;
      const style = getComputedStyle(link);
      const range = document.createRange();
      const lines = [];
      for (const match of link.textContent.matchAll(/\S+/g)) {
        range.setStart(link.firstChild, match.index);
        range.setEnd(link.firstChild, match.index + match[0].length);
        const box = range.getBoundingClientRect();
        let line = lines.find(item => Math.abs(item.top - box.top) < 1);
        if (!line) {
          line = {top: box.top, left: box.left, right: box.right, height: box.height, words: []};
          lines.push(line);
        }
        line.right = Math.max(line.right, box.right);
        line.words.push({text: match[0], left: box.left});
      }
      lines.forEach(line => {
        const preview = document.createElement('span');
        preview.className = 'home-link-preview';
        preview.setAttribute('aria-hidden', 'true');
        Object.assign(preview.style, {
          left: line.left + 'px', top: line.top + 'px',
          width: (line.right - line.left) + 'px', height: (line.height + 3) + 'px',
          font: style.font, color: style.color, letterSpacing: style.letterSpacing
        });
        line.words.forEach(word => {
          const text = document.createElement('span');
          text.textContent = word.text;
          text.style.left = (word.left - line.left) + 'px';
          text.style.lineHeight = line.height + 'px';
          preview.appendChild(text);
        });
        document.body.appendChild(preview);
        introPreviewLines.push(preview);
      });
      if (introPreviewLines.length) {
        activeIntroLink = link;
        link.classList.add('home-link-preview-active');
      }
    };
    introLinks.forEach(link => {
      link.addEventListener('pointerenter', () => {
        if (precisePointer.matches) showIntroPreview(link);
      });
      link.addEventListener('pointerleave', clearIntroPreview);
      link.addEventListener('pointerdown', clearIntroPreview);
      link.addEventListener('focus', () => {
        if (link.matches(':focus-visible')) showIntroPreview(link);
      });
      link.addEventListener('blur', clearIntroPreview);
    });
    window.addEventListener('scroll', clearIntroPreview, {passive: true});
    window.addEventListener('resize', clearIntroPreview, {passive: true});
    window.addEventListener('blur', clearIntroPreview);
    window.addEventListener('pagehide', clearIntroPreview);
    document.addEventListener('visibilitychange', clearIntroPreview);
    reducedMotion.addEventListener('change', clearIntroPreview);
  }

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
    speed: 0,
    preventDefault: false,
  });

});
