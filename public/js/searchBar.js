const searchForm = document.querySelector('#search-form');
const inputSearch = document.querySelector('#input-search');
const searchCard = document.querySelector('#search-results');
const searchUl = searchCard.children[0];
const btnSearch = document.querySelector('#button-search');
const btnClear = document.querySelector('#button-clear');

// (async function() {
//   await autosuggest();
// })();
inputSearch.addEventListener('keyup', autosuggest);
inputSearch.addEventListener('focus', autosuggest);
btnClear.addEventListener('click', reset);
searchForm.addEventListener('submit', function(e) {
  if (inputSearch.value.length <= 0) {
    e.preventDefault();
    inputSearch.focus();
  }
});

async function autosuggest() {
  // Query to DB only when there're more than 2 characters
  if (inputSearch.value.length >= 1) {
    try {
      const htmlEscapedInput = escapeHtml(inputSearch.value); // Sanitizing input against xss
      const res = await fetch(`/campgrounds/suggest?q=${htmlEscapedInput}`);
      const data = await res.json();
  
      searchUl.replaceChildren();
      searchCard.classList.toggle('border-0', data.campgrounds.length <= 0);
      for (const campground of data.campgrounds) {
        const searchItem = createSearchItem(campground);
        searchUl.append(searchItem);
  
        // Highlight the item if there's only 1 search result
        if (data.campgrounds.length === 1) {
          searchItem.children[0].classList.add('select');
          searchItem.children[0].children[0].classList.add('select');
        }
      }
    } catch(e) {
      console.log('ERROR', e);
    }
  } else {
    searchUl.replaceChildren();   searchCard.classList.add('border-0');
  }
}

// Reset Autosuggest form
function reset() {
  inputSearch.value = '';
  searchUl.replaceChildren();
  searchCard.classList.add('border-0');
}

// Search List Item
// <a>
//   <li>
//     <icon></icon>campground title
//   </li>
// </a>
function createSearchItem(campground) {
  const resultAnchor = createAnchor(campground);
  const resultLi = createLi();
  const icon = createIcon();

  resultLi.textContent = campground.title;
  resultLi.prepend(icon);
  resultAnchor.append(resultLi);
  return resultAnchor;
}

function createAnchor(campground) {
  const anchor = document.createElement('a');
  anchor.setAttribute('href', `/campgrounds/${campground._id}`);
  anchor.classList.add('text-decoration-none');
  return anchor;
}

function createLi() {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'hoverable');
  return li;
}

function createIcon() {
  const icon = document.createElement('i');
  icon.classList.add('fa-solid', 'fa-magnifying-glass', 'me-3');
  return icon;
}