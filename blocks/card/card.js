export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  // Flatten: collect image and content from rows
  const inner = document.createElement('div');
  inner.className = 'card-inner';

  let pic = null;
  let contentCells = [];

  for (const row of rows) {
    const cells = [...row.querySelectorAll(':scope > div')];
    for (const cell of cells) {
      const picture = cell.querySelector('picture');
      if (picture && !pic && cell.children.length === 1) {
        pic = picture;
      } else {
        contentCells.push(cell);
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
    contentDiv.append(...cell.childNodes);
  }
  inner.append(contentDiv);

  // Extract CTA as separate container
  const lastP = contentDiv.querySelector('p:last-of-type');
  if (lastP) {
    const cta = lastP.querySelector('a');
    if (cta) {
      // Inject chevron icon if missing (DA strips icons from links)
      if (!cta.querySelector('.icon-chevron-right')) {
        const icon = document.createElement('span');
        icon.className = 'icon icon-chevron-right';
        cta.append(icon);
      }
      lastP.classList.add('card-cta-container');
      inner.append(lastP);
    }
  }

  el.append(inner);
}
