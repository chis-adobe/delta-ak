export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  let pic = null;
  const contentCells = [];
  let linkUrl = null;

  for (const row of rows) {
    const cells = [...row.querySelectorAll(':scope > div')];
    for (const cell of cells) {
      const picture = cell.querySelector('picture');
      if (picture && !pic && cell.children.length === 1) {
        pic = picture;
      } else {
        // Check if this cell is just a link URL
        const links = cell.querySelectorAll('a');
        const text = cell.textContent.trim();
        if (links.length === 1 && links[0].textContent.trim() === text) {
          linkUrl = links[0].href;
        } else {
          contentCells.push(cell);
        }
      }
    }
    row.remove();
  }

  // Picture container
  if (pic) {
    const picDiv = document.createElement('div');
    picDiv.className = 'card-picture-container';
    picDiv.append(pic);
    inner.append(picDiv);
  }

  // Content container
  const contentDiv = document.createElement('div');
  contentDiv.className = 'card-content-container';
  for (const cell of contentCells) {
    // Remove any CTA paragraph (last p with a link)
    const paras = [...cell.querySelectorAll('p')];
    for (const p of paras) {
      const a = p.querySelector('a');
      if (a && p.children.length <= 2) {
        const pText = p.textContent.trim();
        if (a.textContent.trim() === pText || pText.endsWith(a.textContent.trim())) {
          if (!linkUrl) linkUrl = a.href;
          p.remove();
        }
      }
    }
    contentDiv.append(...cell.childNodes);
  }
  // Insert HR after h3 (red accent line)
  const h3 = contentDiv.querySelector('h3');
  if (h3) {
    const hr = document.createElement('hr');
    h3.after(hr);
  }
  inner.append(contentDiv);

  // Red chevron CTA
  if (linkUrl) {
    const ctaP = document.createElement('p');
    ctaP.className = 'card-cta-container';
    const a = document.createElement('a');
    a.href = linkUrl;
    a.setAttribute('aria-label', 'Learn more');
    const icon = document.createElement('span');
    icon.className = 'icon icon-chevron-right';
    a.append(icon);
    ctaP.append(a);
    inner.append(ctaP);
  }

  el.append(inner);
}
