export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const grid = document.createElement('div');
  grid.className = 'cards-vertical-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const card = document.createElement('div');
    card.className = 'cv-card';

    let pic = null;
    let textContent = null;
    let linkUrl = null;

    for (const cell of cells) {
      const picture = cell.querySelector('picture');
      if (picture && !pic && cell.children.length === 1) {
        pic = picture;
      } else {
        // Check for link-only cell (just a URL)
        const links = cell.querySelectorAll('a');
        const textNodes = cell.textContent.trim();
        if (links.length === 1 && links[0].textContent.trim() === textNodes) {
          linkUrl = links[0].href;
        } else {
          textContent = cell;
        }
      }
    }

    // Image container
    if (pic) {
      const imgDiv = document.createElement('div');
      imgDiv.className = 'cv-image';
      imgDiv.append(pic);
      card.append(imgDiv);
    }

    // Text + CTA container
    const body = document.createElement('div');
    body.className = 'cv-body';

    if (textContent) {
      const textDiv = document.createElement('div');
      textDiv.className = 'cv-text';
      // Remove any existing CTA paragraphs with just a link
      const paras = [...textContent.querySelectorAll('p')];
      for (const p of paras) {
        const a = p.querySelector('a');
        if (a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim()) {
          if (!linkUrl) linkUrl = a.href;
          p.remove();
        }
      }
      textDiv.append(...textContent.childNodes);
      body.append(textDiv);
    }

    // Red chevron CTA
    if (linkUrl) {
      const ctaDiv = document.createElement('div');
      ctaDiv.className = 'cv-cta';
      const a = document.createElement('a');
      a.href = linkUrl;
      a.className = 'cv-chevron';
      a.setAttribute('aria-label', 'Learn more');
      a.innerHTML = '<span class="icon icon-chevron-right"></span>';
      ctaDiv.append(a);
      body.append(ctaDiv);
    }

    card.append(body);
    grid.append(card);
    row.remove();
  });

  el.append(grid);
}
