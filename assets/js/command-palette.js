/* Site-local search. No third-party search service, tracking, or clipboard access. */
(function () {
  "use strict";

  function normalize(value) {
    return String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
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
      entries.push({ group: group, title: title, url: url, keywords: keywords || "", body: body || "" });
    }
    add("Navigation", "Home", data.home.url, "about biography 首页 主页 个人介绍", home.querySelector("p")?.textContent);
    add("Navigation", "CV", data.cv.url, "resume curriculum vitae 简历");
    add("Navigation", "News", data.home.url + "#news", "updates timeline 新闻 动态", home.querySelector(".home-news")?.textContent);
    add("Navigation", "Education", data.cv.url + "#education", "university tongji jhu 教育 同济 约翰霍普金斯");
    add("Navigation", "Research Experience", data.cv.url + "#research-experience", "research experience 科研经历 项目");

    var aliases = {
      "fem-neural-operator": "FEM NO FEM-NO JAX Transolver GPU cylinder bracket fiber fibre composite 3D 三维 纤维 复合材料 有限元 神经算子 应力 耦合",
      "convlstm-battery": "ConvLSTM COMSOL battery concentration stress RGB 电池 浓度 应力 图像 序列",
      "burgers-pinn": "PINN Burgers shock artificial viscosity 激波 人工粘性 人工黏性",
      "mechanics-llm": "LLM Qwen LoRA language model materials mechanics 大模型 材料力学 微调"
    };
    cv.querySelectorAll(".cv-project__title[id]").forEach(function (heading) {
      var project = heading.closest(".cv-project");
      var body = project.textContent;
      for (var node = project.nextElementSibling; node; node = node.nextElementSibling) {
        if (node.matches(".cv-project, h1, h2, h3, h4, h5, h6")) break;
        body += " " + node.textContent;
      }
      // Titles are read from the CV, not duplicated or replaced with acronyms.
      add("Research", heading.textContent.replace(/^\s*\d+\.\s*/, "").trim(),
        data.cv.url + "#" + heading.id, aliases[heading.id], body);
    });
    if (entries.filter(function (entry) { return entry.group === "Research"; }).length === 0) {
      throw new Error("Research headings are missing");
    }

    var released = new Set();
    cv.querySelectorAll("a[href]").forEach(function (link) {
      var url = link.getAttribute("href");
      if (released.has(url)) return;
      if (/^https:\/\/huggingface\.co\/(datasets\/)?[^/]+\/.+/.test(url)) {
        var isDataset = url.includes("/datasets/");
        var name = decodeURIComponent(url.split("/").pop());
        add("Resources", name, url,
          isDataset ? "dataset instruction data 数据集" : "model checkpoint Qwen LoRA 模型 权重");
        released.add(url);
      } else if (/\.pdf(?:[?#].*)?$/i.test(url) && /\b(cv|resume)\b/i.test(link.textContent)) {
        add("Resources", "CV PDF", url, "download resume 简历 下载");
        released.add(url);
      }
    });
    var contact = data.contact || {};
    if (contact.email) add("Contact & Links", "Email (Tongji)", "mailto:" + contact.email, "email contact mail 邮箱 邮件 联系 " + contact.email);
    home.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
      var url = link.getAttribute("href");
      if (url === "mailto:" + contact.email || released.has(url)) return;
      add("Contact & Links", link.textContent.trim() || "Email", url, "email mail 邮箱 邮件 联系 " + url);
      released.add(url);
    });
    if (contact.linkedin) add("Contact & Links", "LinkedIn", "https://www.linkedin.com/in/" + contact.linkedin + "/", "linkedin contact 领英 联系");
    if (contact.github) add("Contact & Links", "GitHub", "https://github.com/" + contact.github, "github code repository 代码 仓库");
    if (contact.huggingface) add("Contact & Links", "Hugging Face", "https://huggingface.co/" + contact.huggingface, "huggingface hf models datasets 模型 数据集");
    return entries.map(function (entry, order) {
      return Object.assign(entry, {
        order: order,
        titleIndex: normalize(entry.title),
        keywordIndex: normalize(entry.keywords + " " + entry.group),
        bodyIndex: normalize(entry.body)
      });
    });
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
  if (typeof module !== "undefined" && module.exports) module.exports = { buildEntries: buildEntries, searchEntries: searchEntries, normalize: normalize };
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
  var entries = null;
  var loading = null;
  var options = [];
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
    if (selected >= 0 && options[selected]) options[selected].setAttribute("aria-selected", "false");
    selected = options.length ? (index + options.length) % options.length : -1;
    if (selected < 0) { input.removeAttribute("aria-activedescendant"); return; }
    options[selected].setAttribute("aria-selected", "true");
    input.setAttribute("aria-activedescendant", options[selected].id);
    if (scroll) options[selected].scrollIntoView({ block: "nearest" });
  }
  function clearResults() {
    results.replaceChildren();
    options = [];
    selected = -1;
    input.removeAttribute("aria-activedescendant");
  }
  function render() {
    if (!entries || !dialog.open) return;
    clearResults();
    var matches = searchEntries(entries, input.value);
    message.hidden = matches.length > 0;
    message.textContent = matches.length ? "" : "No matches. Try a project name, topic, or contact.";
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
        var link = document.createElement("a");
        link.className = "site-search__option";
        link.id = "search-option-" + options.length;
        link.href = entry.url;
        link.tabIndex = -1;
        link.setAttribute("role", "option");
        link.setAttribute("aria-selected", "false");
        var title = document.createElement("span");
        title.className = "site-search__option-title";
        title.textContent = entry.title;
        link.append(title);
        if (/^https:\/\//.test(entry.url)) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          var indicator = document.createElement("span");
          indicator.className = "site-search__option-kind";
          indicator.textContent = "↗";
          indicator.setAttribute("aria-hidden", "true");
          link.setAttribute("aria-label", entry.title + " (opens in a new tab)");
          link.append(indicator);
        }
        var index = options.length;
        link.addEventListener("pointermove", function (event) { if (event.pointerType !== "touch") select(index, false); });
        link.addEventListener("click", function () { dialog.close(); });
        options.push(link);
        group.append(link);
      });
      results.append(group);
    });
    select(0, false);
    body.scrollTop = 0;
    announce(matches.length + (matches.length === 1 ? " result" : " results"));
  }
  function load() {
    if (entries) { render(); return Promise.resolve(); }
    if (loading) return loading;
    clearResults();
    message.hidden = false;
    message.textContent = "Loading site search…";
    retry.hidden = true;
    results.setAttribute("aria-busy", "true");
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 12000);
    loading = fetch(dialog.dataset.indexUrl, { signal: controller.signal, credentials: "same-origin" })
      .then(function (response) { if (!response.ok) throw new Error("Index unavailable"); return response.json(); })
      .then(function (data) { entries = buildEntries(data, document); render(); })
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
    input.value = "";
    dialog.showModal();
    document.documentElement.classList.add("site-search-open");
    input.setAttribute("aria-expanded", "true");
    input.focus({ preventScroll: true });
    load();
  }
  trigger.addEventListener("click", open);
  dialog.querySelector(".site-search__close").addEventListener("click", function () { dialog.close(); });
  retry.addEventListener("click", load);
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
    }
  });
  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k" && !event.isComposing) {
      event.preventDefault();
      if (!event.repeat) { if (dialog.open) dialog.close(); else open(); }
    }
  });
})();
