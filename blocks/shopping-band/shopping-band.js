export default function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];
  const nav = document.createElement('nav');
  nav.className = 'shopping-band-nav';

  const leftItems = document.createElement('ul');
  leftItems.className = 'shopping-band-left';

  let rightItem = null;

  rows.forEach((row) => {
    const link = row.querySelector('a');
    if (!link) {
      row.remove();
      return;
    }

    const li = document.createElement('li');
    const a = link.cloneNode(false);

    // Check for icon in the cell
    const icon = row.querySelector('.icon, picture img');
    if (icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'shopping-band-icon';
      if (icon.tagName === 'IMG') {
        iconSpan.append(icon.cloneNode(true));
      } else {
        iconSpan.append(icon.cloneNode(true));
      }
      a.append(iconSpan);
    }

    // Get the text label
    const label = document.createElement('span');
    label.className = 'shopping-band-label';
    label.textContent = link.textContent.trim();
    a.append(label);

    li.append(a);

    // Last row = right-aligned item
    if (row === rows[rows.length - 1]) {
      rightItem = li;
      rightItem.className = 'shopping-band-right-item';
    } else {
      leftItems.append(li);
    }
    row.remove();
  });

  nav.append(leftItems);
  if (rightItem) {
    const rightUl = document.createElement('ul');
    rightUl.className = 'shopping-band-right';
    rightUl.append(rightItem);
    nav.append(rightUl);
  }

  el.append(nav);
}
