const inputSearch = document.querySelector('#input-search');
const searchCard = document.querySelector('#search-results');
const searchUl = searchCard.children[0];
const btnSearch = document.querySelector('#button-search');

inputSearch.addEventListener('keyup', async function(e) {
  // Query to DB only when there're more than 2 characters
  if (this.value.length >= 2) {
    const htmlEscapedInput = escapeHtml(this.value); // Sanitizing input against xss
    const res = await fetch(`/campgrounds/suggest?q=${htmlEscapedInput}`);
    const data = await res.json();

    searchUl.replaceChildren();
    searchCard.classList.toggle('border-0', data.campgrounds.length <= 0);
    for (const campground of data.campgrounds) {
      const searchItem = createSearchItem(campground);
      searchUl.append(searchItem);
    }
  } else {
    searchUl.replaceChildren();
    searchCard.classList.add('border-0');
  }
});

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