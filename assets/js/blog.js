const blogSearch = document.getElementById('blog-search');
const blogFilters = document.querySelectorAll('.blog-filter');
const blogCards = document.querySelectorAll('.blog-card');
const noResults = document.getElementById('blog-no-results');
let activeCategory = 'todos';

function normalizeText(value){
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function filterArticles(){
  const query = normalizeText(blogSearch ? blogSearch.value.trim() : '');
  let visibleCards = 0;

  blogCards.forEach(card => {
    const matchesCategory = activeCategory === 'todos' || card.dataset.category === activeCategory;
    const matchesSearch = !query || normalizeText(card.textContent).includes(query);
    const visible = matchesCategory && matchesSearch;
    card.hidden = !visible;
    if(visible) visibleCards += 1;
  });

  if(noResults) noResults.hidden = visibleCards !== 0;
}

blogFilters.forEach(filter => {
  filter.addEventListener('click', () => {
    activeCategory = filter.dataset.category;
    blogFilters.forEach(item => {
      const active = item === filter;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    filterArticles();
  });
});

if(blogSearch) blogSearch.addEventListener('input', filterArticles);
