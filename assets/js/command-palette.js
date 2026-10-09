/* Site-local search. No third-party search service, tracking, or clipboard access. */
(function () {
  "use strict";

  function normalize(value) {
    return String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  }

  function indexEntries(entries) {
    return entries.map(function (entry, order) {
      var children = entry.children ? indexEntries(entry.children) : undefined;
      var childText = (children || []).map(function (child) {
        return child.titleIndex + " " + child.keywordIndex + " " + child.bodyIndex;
      }).join(" ");
      return Object.assign({}, entry, {
        children: children,
        order: order,
        titleIndex: normalize(entry.title),
        keywordIndex: normalize((entry.keywords || "") + " " + entry.group),
        bodyIndex: normalize((entry.body || "") + " " + childText)
      });
    });
  }

  function repositoryEntry(project) {
    if (!project) return null;
    var title = project.repository_label || "Repository";
    if (project.repository) {
      if (!/^https:\/\//.test(project.repository)) return null;
      var isHub = project.repository.startsWith("https://huggingface.co/");
      return {
        group: isHub ? "Hub" : "Code",
        title: title,
        url: project.repository,
        keywords: isHub ? "huggingface hf profile models datasets 主页 模型 数据集" : "repository resources code readme github 仓库 代码 资源"
      };
    }
    if (!project.status) return null;
    return {
      group: "Code",
      title: title + " (" + project.status + ")",
      disabled: true,
      keywords: "repository ongoing coming soon 仓库 进行中 尚未公开"
    };
  }

  function buildEntries(data, doc) {
    if (!data.home || !data.cv || typeof data.cv.html !== "string") throw new Error("Invalid search index");
    // A template is inert: indexed images/scripts are never inserted into the page.
    function parse(html) {
      var template = doc.createElement("template");
      template.innerHTML = html;
      return template.content;
    }
    var home = parse(data.home.html);
    var cv = parse(data.cv.html);
    var entries = [];
    function add(group, title, url, keywords, body) {
      if (!title || !url || !/^(\/|https:\/\/|mailto:)/.test(url) || url.startsWith("//")) return;
      var entry = { group: group, title: title, url: url, keywords: keywords || "", body: body || "" };
      entries.push(entry);
      return entry;
    }
    add("Navigation", "Home", data.home.url, "about biography 首页 主页 个人介绍", Array.from(home.querySelectorAll("p")).slice(0, 2).map(paragraph => paragraph.textContent).join(" "));
    var cvLink = add("Navigation", "CV", data.cv.pdf_url || data.cv.url, "resume curriculum vitae pdf view 简历 查看");
    if (cvLink && data.cv.pdf_url) cvLink.openInNewTab = true;
    if (data.projects) add("Navigation", "Projects", data.projects.url, "projects repository repositories 项目 课题 仓库");
    add("Navigation", "News", data.home.url + "#news", "updates timeline 新闻 动态", home.querySelector(".home-news")?.textContent);
    add("Navigation", "Education", data.cv.url + "#education", "university tongji jhu 教育 同济 约翰霍普金斯");

    var aliases = {
      "fem-neural-operator": "FEM NO FEM-NO JAX Transolver GPU cylinder bracket fiber fibre composite 3D 三维 纤维 复合材料 有限元 神经算子 应力 耦合",
      "convlstm-battery": "ConvLSTM COMSOL battery concentration stress RGB 电池 浓度 应力 图像 序列",
      "burgers-pinn": "PINN Burgers shock artificial viscosity 激波 人工粘性 人工黏性",
      "mechanics-llm": "LLM Qwen LoRA language model materials mechanics 大模型 材料力学 微调"
    };
    var projects = [];
    cv.querySelectorAll(".cv-project__title[id]").forEach(function (heading) {
      var project = heading.closest(".cv-project");
      var body = project.textContent;
      var nodes = [project];
      for (var node = project.nextElementSibling; node; node = node.nextElementSibling) {
        if (node.matches(".cv-project, h1, h2, h3, h4, h5, h6")) break;
        body += " " + node.textContent;
        nodes.push(node);
      }
      // Titles are read from the CV, not duplicated or replaced with acronyms.
      var entry = add("Projects", heading.textContent.replace(/^\s*\d+\.\s*/, "").trim(),
        data.cv.url + "#" + heading.id, aliases[heading.id], body);
      projects.push({ id: heading.id, entry: entry, nodes: nodes });
    });
    if (entries.filter(function (entry) { return entry.group === "Projects"; }).length === 0) {
      throw new Error("Project headings are missing");
    }

    var released = new Set();
    projects.forEach(function (project) {
      var children = [];
      var seen = new Set();
      // Use the same source as the Projects page so new releases stay in sync.
      var metadata = (data.projects?.items || []).find(function (item) { return item.id === project.id; });
      var repository = repositoryEntry(metadata);
      if (repository) {
        children.push(repository);
        if (repository.url) seen.add(repository.url);
      }
      project.nodes.forEach(function (node) {
        node.querySelectorAll("a[href]").forEach(function (link) {
          var url = link.getAttribute("href");
          if (seen.has(url) || !/^https:\/\/huggingface\.co\/(datasets\/)?[^/]+\/.+/.test(url)) return;
          var isDataset = url.includes("/datasets/");
          var name = decodeURIComponent(url.split("/").pop());
          var label = isDataset ? name : link.textContent.trim() || name;
          children.push({
            group: isDataset ? "Datasets" : "Models",
            title: label.charAt(0).toUpperCase() + label.slice(1),
            url: url,
            keywords: name + " " + (isDataset ? "dataset instruction data 数据集" : "model checkpoint Qwen LoRA 模型 权重")
          });
          seen.add(url);
        });
      });
      if (!children.length) return;
      var collection = add("Resources", project.entry.title, project.entry.url,
        project.entry.keywords + " resources repository code models datasets 资源 仓库 代码 模型 数据集");
      collection.children = children;
    });
    cv.querySelectorAll("a[href]").forEach(function (link) {
      var url = link.getAttribute("href");
      if (released.has(url)) return;
      if (/\.pdf(?:[?#].*)?$/i.test(url) && /\b(cv|resume)\b/i.test(link.textContent)) {
        var pdfEntry = add("Resources", "CV PDF", data.cv.pdf_url || url, "download resume 简历 下载");
        if (pdfEntry) pdfEntry.openInNewTab = true;
        released.add(url);
      }
    });
    var researchStatement = add("Resources", "Research Statement PDF", data.cv.research_statement_pdf_url,
      "RS research statement pdf download 研究陈述 科研陈述 下载");
    if (researchStatement) researchStatement.openInNewTab = true;
    var contact = data.contact || {};
    if (contact.email) add("Contact & Links", "Tongji Email", "mailto:" + contact.email, "email contact mail 同济 邮箱 邮件 联系 " + contact.email);
    home.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      var url = link.getAttribute("href");
      if (url === "mailto:" + contact.email || released.has(url)) return;
      add("Contact & Links", link.textContent.trim() || "Email", url, "email mail 邮箱 邮件 联系 " + url);
      released.add(url);
    });
    if (contact.linkedin) add("Contact & Links", "LinkedIn", "https://www.linkedin.com/in/" + contact.linkedin + "/", "linkedin contact 领英 联系");
    if (contact.github) add("Contact & Links", "GitHub", "https://github.com/" + contact.github, "github code repository 代码 仓库");
    if (contact.huggingface) add("Contact & Links", "Hugging Face", "https://huggingface.co/" + contact.huggingface, "huggingface hf models datasets 模型 数据集");
    return indexEntries(entries);
  }

  function searchEntries(entries, query) {
    var normalized = normalize(query);
    if (!normalized) return entries.slice();
    var terms = normalized.split(/\s+/);
    return entries.map(function (entry) {
      var score = 0;
      for (var term of terms) {
        if (entry.titleIndex.includes(term)) score += 12;
        else if (entry.keywordIndex.includes(term)) score += 7;
        else if (entry.bodyIndex.includes(term)) score += 1;
        else return { entry: entry, score: 0 };
      }
      if (entry.titleIndex === normalized) score += 40;
      else if (entry.titleIndex.startsWith(normalized)) score += 20;
      return { entry: entry, score: score };
    }).filter(function (result) { return result.score > 0; })
      .sort(function (a, b) { return b.score - a.score || a.entry.order - b.entry.order; })
      .map(function (result) { return result.entry; });
  }

  // Keep the indexing/ranking functions testable without a browser or live service.
  if (typeof module !== "undefined" && module.exports) module.exports = { buildEntries: buildEntries, searchEntries: searchEntries, normalize: normalize, indexEntries: indexEntries, repositoryEntry: repositoryEntry };
  if (typeof document === "undefined") return;
  var dialog = document.getElementById("site-search");
  var trigger = document.querySelector(".site-search-toggle");
  if (!dialog || !trigger || typeof dialog.showModal !== "function") return;
  var input = document.getElementById("site-search-input");
  var results = document.getElementById("site-search-results");
  var status = document.getElementById("site-search-status");
  var message = dialog.querySelector(".site-search__message");
  var retry = dialog.querySelector(".site-search__retry");
  var body = dialog.querySelector(".site-search__body");
  var context = dialog.querySelector(".site-search__context");
  var contextTitle = dialog.querySelector(".site-search__context-title");
  var back = dialog.querySelector(".site-search__back");
  var backHint = dialog.querySelector(".site-search__back-hint");
  var defaultPlaceholder = input.placeholder;
  var collection = null;
  var rootState = null;
  var entries = null;
  var loading = null;
  var options = [];
  var optionEntries = [];
  var selected = -1;
  var previousFocus = null;
  var announceTimer;
  trigger.hidden = false;
  if (/Mac|iPhone|iPad/.test(navigator.platform || "")) trigger.querySelector("kbd").textContent = "⌘ K";

  function announce(text) {
    clearTimeout(announceTimer);
    announceTimer = setTimeout(function () { status.textContent = text; }, 150);
  }
  function select(index, scroll) {
    if (options.length && selected === (index + options.length) % options.length && !scroll) return;
    if (selected >= 0 && options[selected]) options[selected].setAttribute("aria-selected", "false");
    selected = options.length ? (index + options.length) % options.length : -1;
    if (selected < 0) { input.removeAttribute("aria-activedescendant"); return; }
    options[selected].setAttribute("aria-selected", "true");
    input.setAttribute("aria-activedescendant", options[selected].id);
    if (window.siteWarmLink && options[selected].href) window.siteWarmLink(options[selected].href);
    if (scroll) options[selected].scrollIntoView({ block: "nearest" });
  }
  function clearResults() {
    results.replaceChildren();
    options = [];
    optionEntries = [];
    selected = -1;
    input.removeAttribute("aria-activedescendant");
  }
  function showContext() {
    context.hidden = !collection;
    backHint.hidden = !collection;
    contextTitle.textContent = collection ? collection.title : "";
    input.placeholder = collection ? "Search this project's resources…" : defaultPlaceholder;
    if (collection) input.setAttribute("aria-label", "Search resources for " + collection.title);
    else input.removeAttribute("aria-label");
  }
  function enterCollection(entry) {
    rootState = { query: input.value, selected: optionEntries.indexOf(entry), scrollTop: body.scrollTop };
    collection = entry;
    input.value = "";
    showContext();
    render();
    input.focus({ preventScroll: true });
  }
  function goBack() {
    if (!collection) return;
    collection = null;
    input.value = rootState.query;
    showContext();
    render();
    select(rootState.selected, false);
    body.scrollTop = rootState.scrollTop;
    input.focus({ preventScroll: true });
  }
  function render() {
    if (!entries || !dialog.open) return;
    clearResults();
    var matches = searchEntries(collection ? collection.children : entries, input.value);
    message.hidden = matches.length > 0;
    message.textContent = matches.length ? "" : collection ? "No matching resources in this project." : "No matches. Try a project name, topic, or contact.";
    retry.hidden = true;
    var groups = new Map();
    matches.forEach(function (entry) {
      if (!groups.has(entry.group)) groups.set(entry.group, []);
      groups.get(entry.group).push(entry);
    });
    groups.forEach(function (groupEntries, name) {
      var group = document.createElement("div");
      group.setAttribute("role", "group");
      var label = document.createElement("div");
      label.className = "site-search__group-label";
      label.id = "search-group-" + normalize(name).replace(/ /g, "-");
      label.textContent = name;
      group.setAttribute("aria-labelledby", label.id);
      group.append(label);
      groupEntries.forEach(function (entry) {
        var isCollection = !!entry.children;
        var isDisabled = !!entry.disabled;
        var link = document.createElement(isCollection || isDisabled ? "button" : "a");
        link.className = "site-search__option";
        link.id = "search-option-" + options.length;
        if (isDisabled) {
          link.type = "button";
          link.disabled = true;
          link.setAttribute("aria-disabled", "true");
        } else if (isCollection) {
          link.type = "button";
          link.setAttribute("aria-label", entry.title + " — browse resources");
        } else link.href = entry.url;
        link.tabIndex = -1;
        link.setAttribute("role", "option");
        link.setAttribute("aria-selected", "false");
        if (entry.group === "Contact & Links") {
          var isHuggingFace = entry.title === "Hugging Face";
          var contactIcon = document.createElement(isHuggingFace ? "img" : "i");
          contactIcon.className = "site-search__contact-icon";
          if (isHuggingFace) {
            contactIcon.src = dialog.dataset.huggingfaceIcon;
            contactIcon.alt = "";
            contactIcon.width = 18;
            contactIcon.height = 18;
          } else {
            var iconClass = entry.url.startsWith("mailto:") ?
              (entry.title === "Gmail" ? "far fa-envelope" : "fas fa-envelope") :
              entry.title === "LinkedIn" ? "fab fa-linkedin site-search__contact-icon--linkedin" :
              "fab fa-github";
            contactIcon.className += " " + iconClass;
          }
          contactIcon.setAttribute("aria-hidden", "true");
          link.append(contactIcon);
        }
        var title = document.createElement("span");
        title.className = "site-search__option-title";
        title.textContent = entry.title;
        link.append(title);
        if (!isDisabled && (isCollection || entry.openInNewTab || /^https:\/\//.test(entry.url))) {
          var indicator = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          indicator.setAttribute("class", "site-search__option-kind");
          indicator.setAttribute("viewBox", "0 0 24 24");
          indicator.setAttribute("fill", "none");
          indicator.setAttribute("stroke", "currentColor");
          indicator.setAttribute("stroke-width", "1.7");
          indicator.setAttribute("stroke-linecap", "round");
          indicator.setAttribute("stroke-linejoin", "round");
          var arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
          arrow.setAttribute("d", isCollection ? "m9 5 7 7-7 7" : "M7 17 17 7M7 7h10v10");
          indicator.append(arrow);
          indicator.setAttribute("aria-hidden", "true");
          if (!isCollection) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.setAttribute("aria-label", entry.title + " (opens in a new tab)");
          }
          link.append(indicator);
        }
        var index = options.length;
        link.addEventListener("pointermove", function (event) { if (event.pointerType !== "touch") select(index, false); });
        link.addEventListener("click", function (event) {
          if (isDisabled) return;
          if (isCollection) enterCollection(entry);
          else {
            if (window.sitePrepareSection) window.sitePrepareSection(link.href, true);
            // Search results are dynamic, so the legacy anchor listener misses them.
            // Navigate same-page sections immediately without reloading the document.
            var url = new URL(link.href, location.href);
            var target = url.hash && url.origin === location.origin && url.pathname === location.pathname &&
              url.search === location.search && document.getElementById(decodeURIComponent(url.hash.slice(1)));
            if (target && !link.target && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
              event.preventDefault();
              target.setAttribute("tabindex", "-1");
              previousFocus = target;
              dialog.close();
              // Restore the page width before measuring; the close event runs later.
              document.documentElement.classList.remove("site-search-open");
              history.pushState(null, "", url.hash);
              var masthead = document.querySelector(".masthead");
              var offset = masthead ? masthead.getBoundingClientRect().height + 16 : 16;
              window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: "instant" });
            } else dialog.close();
          }
        });
        options.push(link);
        optionEntries.push(entry);
        group.append(link);
      });
      results.append(group);
    });
    select(0, false);
    body.scrollTop = 0;
    announce((collection ? collection.title + ": " : "") + matches.length + (matches.length === 1 ? " result" : " results"));
  }
  function load() {
    if (entries) { render(); return Promise.resolve(); }
    if (loading) return loading;
    clearResults();
    message.hidden = false;
    message.textContent = "Loading site search…";
    retry.hidden = true;
    results.setAttribute("aria-busy", "true");
    // Reuse this release's data across Home/CV/Projects, even if storage is blocked.
    try {
      var cached = JSON.parse(sessionStorage.getItem("site-search-index") || "null");
      if (cached && cached.version === dialog.dataset.indexUrl) {
        entries = buildEntries(cached.data, document);
        results.removeAttribute("aria-busy");
        render();
        return Promise.resolve();
      }
    } catch (_) { /* Storage disabled, full, or stale: use the normal network path. */ }
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 12000);
    loading = fetch(dialog.dataset.indexUrl, { signal: controller.signal, credentials: "same-origin" })
      .then(function (response) { if (!response.ok) throw new Error("Index unavailable"); return response.json(); })
      .then(function (data) {
        entries = buildEntries(data, document);
        try { sessionStorage.setItem("site-search-index", JSON.stringify({ version: dialog.dataset.indexUrl, data: data })); }
        catch (_) { /* Search still works without persistent storage. */ }
        render();
      })
      .catch(function () {
        if (!dialog.open) return;
        message.hidden = false;
        message.textContent = "Search could not load. Please try again; the page navigation is still available.";
        retry.hidden = false;
        announce(message.textContent);
      }).finally(function () { clearTimeout(timeout); results.removeAttribute("aria-busy"); loading = null; });
    return loading;
  }
  function open() {
    if (dialog.open) { input.focus(); return; }
    previousFocus = document.activeElement;
    collection = null;
    rootState = null;
    showContext();
    input.value = "";
    dialog.showModal();
    document.documentElement.classList.add("site-search-open");
    input.setAttribute("aria-expanded", "true");
    input.focus({ preventScroll: true });
    load();
  }
  trigger.addEventListener("click", open);
  trigger.addEventListener("pointerenter", load, { once: true });
  trigger.addEventListener("focus", load, { once: true });
  // Prepare search before Ctrl K, without competing with the first paint.
  var connection = navigator.connection;
  if (!connection || (!connection.saveData && !/(^|-)2g$/.test(connection.effectiveType))) {
    if (window.requestIdleCallback) window.requestIdleCallback(load, { timeout: 1500 });
    else window.setTimeout(load, 600);
  }
  dialog.querySelector(".site-search__close").addEventListener("click", function () { dialog.close(); });
  retry.addEventListener("click", load);
  back.addEventListener("click", goBack);
  dialog.addEventListener("close", function () {
    document.documentElement.classList.remove("site-search-open");
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    clearTimeout(announceTimer);
    status.textContent = "";
  });
  var backdropDown = false;
  function outside(event) {
    var rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  }
  dialog.addEventListener("pointerdown", function (event) { backdropDown = event.target === dialog && outside(event); });
  dialog.addEventListener("click", function (event) { if (backdropDown && event.target === dialog && outside(event)) dialog.close(); backdropDown = false; });
  dialog.addEventListener("keydown", function (event) {
    if (event.key !== "Tab") return;
    var focusable = [input, dialog.querySelector(".site-search__close")];
    if (!context.hidden) focusable.push(back);
    if (!retry.hidden) focusable.push(retry);
    var current = focusable.indexOf(document.activeElement);
    event.preventDefault();
    focusable[(current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus();
  });
  input.addEventListener("input", function (event) { if (!event.isComposing) render(); });
  input.addEventListener("compositionend", render);
  input.addEventListener("keydown", function (event) {
    if (event.isComposing || event.keyCode === 229) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      select(selected + (event.key === "ArrowDown" ? 1 : -1), true);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (selected >= 0 && options[selected]) options[selected].click();
    } else if (event.key === "ArrowRight" && optionEntries[selected]?.children) {
      event.preventDefault();
      enterCollection(optionEntries[selected]);
    } else if (collection && ((event.key === "Backspace" && !input.value) || (event.key === "ArrowLeft" && event.altKey))) {
      event.preventDefault();
      goBack();
    }
  });
  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k" && !event.isComposing) {
      event.preventDefault();
      if (!event.repeat) { if (dialog.open) dialog.close(); else open(); }
    }
  });
})();
