const TAB_CONFIG = [
  { id: 'flights', label: 'Flights', icon: 'flight' },
  { id: 'stays', label: 'Stays', icon: 'hotel' },
  { id: 'cars', label: 'Cars', icon: 'car' },
  { id: 'vacations', label: 'Vacations', icon: 'vacation' },
  { id: 'cruises', label: 'Cruises', icon: 'cruise', external: true },
];

function createTabBar(el) {
  const tabBar = document.createElement('div');
  tabBar.className = 'booking-tabs';
  tabBar.setAttribute('role', 'tablist');

  TAB_CONFIG.forEach((tab, i) => {
    const button = document.createElement('button');
    button.className = 'booking-tab';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    button.dataset.tab = tab.id;

    button.innerHTML = `
      <span class="booking-tab-icon icon icon-${tab.icon}"></span>
      <span class="booking-tab-label">${tab.label}</span>
      ${tab.external ? '<span class="icon icon-external-link booking-tab-external"></span>' : ''}
    `;

    button.addEventListener('click', () => {
      el.querySelectorAll('.booking-tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
      button.setAttribute('aria-selected', 'true');
      el.querySelectorAll('.booking-panel').forEach((p) => {
        p.hidden = p.dataset.tab !== tab.id;
      });
    });

    tabBar.append(button);
  });

  return tabBar;
}

function createFlightsPanel() {
  const panel = document.createElement('div');
  panel.className = 'booking-panel';
  panel.dataset.tab = 'flights';
  panel.hidden = false;

  panel.innerHTML = `
    <div class="booking-route">
      <button class="booking-field booking-origin" type="button">
        <span class="booking-field-label">From</span>
        <span class="booking-field-value">Origin</span>
      </button>
      <button class="booking-swap" type="button" aria-label="Swap origin and destination">
        <span class="icon icon-swap"></span>
      </button>
      <button class="booking-field booking-destination" type="button">
        <span class="booking-field-label">To</span>
        <span class="booking-field-value">Destination</span>
      </button>
    </div>
    <div class="booking-options">
      <button class="booking-field booking-dates" type="button">
        <span class="booking-field-label">Dates</span>
        <span class="booking-field-value">Select dates</span>
      </button>
      <button class="booking-field booking-passengers" type="button">
        <span class="booking-field-label">Passengers</span>
        <span class="booking-field-value">1 Adult</span>
      </button>
    </div>
    <div class="booking-actions">
      <button class="booking-search-btn" type="button">Search</button>
    </div>
  `;

  return panel;
}

function createPlaceholderPanel(tabId, label) {
  const panel = document.createElement('div');
  panel.className = 'booking-panel';
  panel.dataset.tab = tabId;
  panel.hidden = true;
  panel.innerHTML = `<div class="booking-placeholder"><p>Search for ${label}</p></div>`;
  return panel;
}

export default async function init(el) {
  // Clear authored content (used for SEO/fallback)
  el.textContent = '';

  const tabBar = createTabBar(el);
  el.append(tabBar);
  el.append(createFlightsPanel());
  el.append(createPlaceholderPanel('stays', 'Stays'));
  el.append(createPlaceholderPanel('cars', 'Cars'));
  el.append(createPlaceholderPanel('vacations', 'Vacations'));
  el.append(createPlaceholderPanel('cruises', 'Cruises'));
}
