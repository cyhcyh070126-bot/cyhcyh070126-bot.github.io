// Download the chart engine only on pages that actually contain Plotly charts.
export async function renderPlots() {
  const [, themes] = await Promise.all([import('./plotly.min.js'), import('./theme.js')]);
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  const template = dark ? themes.plotlyDarkLayout : themes.plotlyLightLayout;
  for (const element of document.querySelectorAll('pre>code.language-plotly')) {
    const data = JSON.parse(element.textContent);
    const chart = document.createElement('div');
    element.parentElement.after(chart);
    const layout = data.layout || {};
    layout.template = { ...template, ...layout.template };
    try {
      await window.Plotly.react(chart, data.data, layout);
      element.parentElement.classList.add('hidden');
    } catch (error) {
      chart.remove();
      console.error('Unable to render chart:', error);
    }
  }
}
