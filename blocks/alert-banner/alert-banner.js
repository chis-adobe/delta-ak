export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // First row: icon + headline
  // Second row: body text
  const headline = rows[0];
  const body = rows[1];

  headline.classList.add('alert-banner-headline');
  if (body) body.classList.add('alert-banner-body');

  // Inject warning icon if missing (DA strips icons from content)
  const headlinePara = headline.querySelector('p');
  if (headlinePara && !headlinePara.querySelector('.icon-warning')) {
    const icon = document.createElement('span');
    icon.className = 'icon icon-warning';
    headlinePara.insertBefore(icon, headlinePara.firstChild);
    headlinePara.insertBefore(document.createTextNode(' '), icon.nextSibling);
  }

  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'alert-banner-close';
  closeBtn.setAttribute('aria-label', 'Close alert');
  closeBtn.innerHTML = '<span class="icon icon-close"></span>';
  closeBtn.addEventListener('click', () => {
    el.closest('.section')?.remove();
  });
  el.append(closeBtn);
}
