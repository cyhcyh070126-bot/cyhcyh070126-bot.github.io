/* Read the existing CV figure order. Keep original hrefs for native link actions. */
export function collectResearchFiles(root) {
  const groups = {};
  let project;
  root.querySelectorAll('.cv-project, .research-card').forEach(node => {
    if (node.classList.contains('cv-project')) {
      project = node.querySelector('.cv-project__title[id]')?.id;
      if (project) groups[project] = [];
      return;
    }
    const link = node.querySelector(':scope > a[href]');
    const image = link?.querySelector('img');
    if (!project || !link || !image) return;
    const file = link.getAttribute('href');
    if (!/^\/(files|images)\/research\/[^?#]+\.(pdf|png|webp|gif|jpe?g|svg)$/i.test(file)) return;
    groups[project].push({file, title:node.querySelector('strong')?.textContent || image.alt,
      anchor:node.id || project, link});
  });
  return groups;
}

const groups = collectResearchFiles(document);
if (Object.keys(groups).length) {
  const entries = new Map();
  Object.entries(groups).forEach(([project, figures]) => figures.forEach(entry => entries.set(entry.link, {...entry, project})));
  const script = Array.from(document.scripts).find(s => s.src.includes('/assets/js/research-files.js'));
  const version = script && new URL(script.src).searchParams.get('v');
  document.addEventListener('click', event => {
    const link = event.target.closest?.('.research-card > a[href]');
    const entry = entries.get(link);
    if (!entry || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const url = new URL('/research-viewer/', location.origin);
    url.searchParams.set('project', entry.project);
    url.searchParams.set('file', entry.file);
    if (version) url.searchParams.set('v', version);
    // Open in the same new-tab style as the existing target="_blank" links.
    // If a browser blocks this, leave the native PDF/image link available.
    const reader = window.open(url.href, '_blank');
    if (reader) {
      reader.opener = null;
      event.preventDefault();
    }
  });
}
