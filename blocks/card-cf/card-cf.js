const GQL_BASE = 'https://publish-p130746-e1275972.adobeaemcloud.com/graphql/execute.json/securbank/TravelOfferByPath;path=';

const SMART_CROPS = [
  { name: 'Small', width: 400 },
  { name: 'Portait', width: 550 },
  { name: 'Medium', width: 700 },
  { name: 'Large', width: 1260 },
];

function bestCrop(containerWidth) {
  let best = SMART_CROPS[SMART_CROPS.length - 1];
  for (const crop of SMART_CROPS) {
    if (crop.width >= containerWidth) {
      best = crop;
      break;
    }
  }
  return best;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function updateImageSrc(img, baseUrl) {
  const container = img.closest('.card-cf-picture-container');
  if (!container) return;
  const w = container.offsetWidth * window.devicePixelRatio;
  const crop = bestCrop(w);
  img.src = `${baseUrl}:${crop.name}`;
}

export default async function init(el) {
  // Extract CF path from first cell
  const rows = [...el.querySelectorAll(':scope > div')];
  let cfPath = null;
  for (const row of rows) {
    const link = row.querySelector('a');
    if (link) {
      cfPath = link.textContent.trim();
      if (!cfPath.startsWith('/')) cfPath = link.getAttribute('href');
    } else {
      const text = row.textContent.trim();
      if (text.startsWith('/')) cfPath = text;
    }
    row.remove();
  }

  if (!cfPath) {
    el.textContent = 'Card CF: no content fragment path provided';
    return;
  }

  // Fetch CF data
  let data;
  try {
    const resp = await fetch(`${GQL_BASE}${cfPath}`);
    const json = await resp.json();
    data = json.data.travelOfferByPath.item;
  } catch (err) {
    el.textContent = `Card CF: failed to load content fragment (${err.message})`;
    return;
  }

  const {
    title, description, discount, image, ctaLabel, ctaLink, bookBefore, disclaimer,
  } = data;
  // eslint-disable-next-line no-underscore-dangle
  const baseImageUrl = image._dmS7Url;

  // Build card structure (horizontal layout)
  const inner = document.createElement('div');
  inner.className = 'card-cf-inner';

  // Image
  const picDiv = document.createElement('div');
  picDiv.className = 'card-cf-picture-container';
  const img = document.createElement('img');
  img.alt = title;
  img.loading = 'lazy';
  img.src = `${baseImageUrl}:Large`;
  picDiv.append(img);
  inner.append(picDiv);

  // Content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'card-cf-content';

  const h3 = document.createElement('h3');
  h3.textContent = title;
  contentDiv.append(h3);

  const hr = document.createElement('hr');
  contentDiv.append(hr);

  if (description?.html) {
    const descWrapper = document.createElement('div');
    descWrapper.innerHTML = description.html;
    const descP = descWrapper.querySelector('p') || descWrapper;
    descP.className = 'card-cf-description';
    contentDiv.append(descP);
  }

  if (bookBefore && discount) {
    const promoP = document.createElement('p');
    promoP.className = 'card-cf-promo';
    promoP.textContent = `Book by ${formatDate(bookBefore)} and receive a ${discount}% Discount`;
    contentDiv.append(promoP);
  }

  if (ctaLabel) {
    const ctaP = document.createElement('p');
    ctaP.className = 'card-cf-cta';
    const a = document.createElement('a');
    a.href = ctaLink || '#';
    a.className = 'btn btn-accent';
    a.textContent = ctaLabel;
    ctaP.append(a);
    contentDiv.append(ctaP);
  }

  if (disclaimer) {
    const discP = document.createElement('p');
    discP.className = 'card-cf-disclaimer';
    let discText = '';
    if (disclaimer.termsReference) discText += disclaimer.termsReference;
    if (disclaimer.termDetails?.html) {
      const tmp = document.createElement('div');
      tmp.innerHTML = disclaimer.termDetails.html;
      discText += ` | ${tmp.textContent.trim()}`;
    }
    discP.textContent = discText;
    contentDiv.append(discP);
  }

  inner.append(contentDiv);
  el.append(inner);

  // Set correct smart crop now that element is in the DOM
  updateImageSrc(img, baseImageUrl);

  // Responsive smart crop updates
  let resizeTimer;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => updateImageSrc(img, baseImageUrl), 150);
  };
  window.addEventListener('resize', onResize);
}
