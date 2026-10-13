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
  function readerUrl(entry) {
    const url = new URL('/research-viewer/', location.origin);
    url.searchParams.set('project', entry.project);
    url.searchParams.set('file', entry.file);
    url.searchParams.set('from', 'cv');
    if (version) url.searchParams.set('v', version);
    return url.href;
  }
  function prepareReader(event) {
    const entry=entries.get(event.target.closest?.('.research-card > a[href]'));
    if(entry&&window.siteWarmLink)window.siteWarmLink(readerUrl(entry));
  }
  ['pointerover','pointerdown','focusin'].forEach(name=>document.addEventListener(name,prepareReader,{passive:true}));
  document.addEventListener('toggle',event=>{
    const panel=event.target;
    if(!panel.open||!panel.matches?.('details.project-figures')||!window.siteWarmLink)return;
    const entry=entries.get(panel.querySelector('.research-card > a[href]'));
    if(entry){window.siteWarmLink(entry.file);window.siteWarmLink(readerUrl(entry));}
  },true);
  document.addEventListener('click', event => {
    const link = event.target.closest?.('.research-card > a[href]');
    const entry = entries.get(link);
    if (!entry || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    // Reuse this tab's ordered metadata; no image/PDF bytes are duplicated.
    try {
      sessionStorage.setItem('research-reader-context', JSON.stringify({project:entry.project,
        version:version || '', items:groups[entry.project].map(({file,title,anchor}) => ({file,title,anchor}))}));
    } catch (_) {} // Storage restrictions must never block the original link.
    // Avoid the host browser's new-tab start screen on ordinary figure clicks.
    // Modified clicks and native context-menu actions still use the original href.
    event.preventDefault();
    location.assign(readerUrl(entry));
  });
}
