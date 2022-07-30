const inputSearch = document.querySelector('#input-search');
const searchCard = document.querySelector('#search-results');
const searchUl = searchCard.children[0];
const btnSearch = document.querySelector('#button-search');

inputSearch.focus();
inputSearch.setSelectionRange(inputSearch.value.length, inputSearch.value.length);
inputSearch.addEventListener('keyup', async function(e) {
  // Query to DB only when there're more than 2 characters
  if (this.value.length >= 1) {
    const htmlEscapedInput = escapeHtml(this.value); // Sanitizing input against xss
    const res = await fetch(`/campgrounds/suggest?q=${htmlEscapedInput}`);
    const data = await res.json();

    // if (data.campgrounds.length > 0) {
    //   const searchTitle = document.createElement('h5');
    //   searchTitle.classList.add('card-header');
    //   searchTitle.textContent = 'Campground Title';
    //   searchCard.prepend(searchTitle);
    // }

    searchUl.replaceChildren();
    searchCard.classList.toggle('border-0', data.campgrounds.length <= 0);
    for (const campground of data.campgrounds) {
      const searchItem = createSearchItem(campground);
      searchUl.append(searchItem);
    }

    // if (document.getElementById('search-title-header') !== null && searchUl.children.length > 0) {
    //   console.log('yes');
    // } else {
    //   console.log('no');
    // }
  } else {
    searchUl.replaceChildren();
    searchCard.classList.add('border-0');
  }
});

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