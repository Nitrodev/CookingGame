const ELTS = {
  'tab-btns': $('#tab-btns'),
  'tabs': $('#tabs'),

  'farm': $('#tabs').children[0],
  'factory': $('#tabs').children[1],
  'food': $('#tabs').children[2],
};

let events = new EventTarget();

let then = performance.now();

let money = 0;

// All raw ingredients
let farm = [];

// All processed ingredients
let factory = {};

// All recipes
let food = {};

let maxStorage = {};
let storage = {};

/**
 * Create an element for an ingredient
 * @param {*} ing Ingredient to create element for 
 */
function createIngElement(ingredient) {
  const data = DATA.farm.find(i => i.id === ingredient.id);

  const el = ingredient.element;
  el.classList.add('ingredient');
  el.id = ingredient.id;
  el.innerHTML = `
    <span class="ing-name">${ingredient.id}</span><br>
    Time to harvest
    <span class="ing-timeUntil">${formatTime(data.time)}</span><br>
    <button class="harvest-btn" disabled>Harvest</button>
    <progress class="ing-progress" value="${ingredient.timeSince}" max="${data.time}"></progress>
    Stored: <span class="ing-qty">${storage[ingredient.id] || 0}</span>
  `;

  $('.tab-content', ELTS.farm).appendChild(el);
}

function update() {
  const now = performance.now();
  const delta = (now - then) / 1000;

  for (const ing of farm) {
    if(!ing.active) continue; 
    if (!ing.matured) {

      let data = DATA.farm.find(i => i.id === ing.id);

      ing.timeSince += delta;

      events.dispatchEvent(new CustomEvent('ingredient tick', {
        detail: ing
      }));

      if (ing.timeSince >= data.time) {
        ing.matured = true;
        events.dispatchEvent(new CustomEvent('ingredient matured', {
          detail: ing
        }));
      }

    }
    

  }

  then = now;
}

function setup() {
  // TODO: Load data from localStorage

  // Add all the raw ingredients that do not have requirements
  DATA.farm.forEach(ing => {
    if (ing.reqs.length === 0) {
      let ingredient = {
        id: ing.id,
        timeSince: 0,
        matured: false,
        active: true,
        element: document.createElement('div'),
      };

      events.dispatchEvent(new CustomEvent('ingredient unlocked', {
        detail: ingredient
      }));
    }
  });

}

// EVENT LISTENERS

ELTS['tab-btns'].addEventListener('click', (e) => {
  if(e.target.classList.contains('tab-btn')) {
    const tab = e.target.dataset.tab;
    ELTS['tab-btns'].querySelector('.active').classList.remove('active');
    e.target.classList.add('active');
    
    // Hide all tabs assuming that all tabs are shown
    for(let tab of ELTS['tabs'].children) {
      tab.classList.add('hidden');
    }

    // Show the tab that was clicked
    ELTS['tabs'].children[tab].classList.remove('hidden');
    
  }
});

events.addEventListener('ingredient unlocked', (e) => {
  const ing = e.detail;
  createIngElement(ing);
  farm.push(ing);
  storage[ing.id] = 0;
  maxStorage[ing.id] = 10;
});

events.addEventListener('ingredient tick', (e) => {
  const ing = e.detail;
  const data = DATA.farm.find(i => i.id === ing.id);

  const timeUntil = Math.abs(ing.timeSince - data.time);

  $('.ing-timeUntil', ing.element).innerHTML = formatTime(timeUntil);
  $('.ing-progress', ing.element).value = ing.timeSince;
});

events.addEventListener('ingredient matured', (e) => {
  const ing = e.detail;
  ing.active = false;

  $('.harvest-btn', ing.element).disabled = false;
});

ELTS['farm'].addEventListener('click', (e) => {
  if(e.target.classList.contains('harvest-btn')) {
    const ing = farm.find(i => i.id === e.target.parentElement.id);
    if(ing.matured) {
      storage[ing.id]++;
      ing.matured = false;
      ing.timeSince = 0;
      e.target.disabled = true;

      $('.ing-qty', e.target.parentElement).innerHTML = storage[ing.id];
      $('.ing-progress', e.target.parentElement).value = 0;
      $('.ing-timeUntil', e.target.parentElement).innerHTML = formatTime(DATA.farm.find(i => i.id === ing.id).time);
    
      setTimeout(() => ing.active = true, 1000);
    }
  }
});

setInterval(update, 1000);