export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  // First row becomes the search form
  const searchRow = rows[0];
  if (searchRow) {
    searchRow.classList.add('footer-search-form');
    const text = searchRow.textContent.trim();
    searchRow.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = text || 'Try Asking Me A Question';
    input.setAttribute('aria-label', text || 'Search');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Search');
    btn.innerHTML = '<span class="icon icon-search"></span>';

    searchRow.append(input, btn);
  }

  // Second row becomes popular topics
  if (rows[1]) {
    rows[1].classList.add('footer-search-topics');
  }
}
