(function () {
  var pageUrl = window.location.href.split('#')[0];
  var articleTitle = document.querySelector('.article-standalone h1');
  var title = articleTitle ? articleTitle.textContent.trim() : document.title;

  var shareUrls = {
    whatsapp: 'https://wa.me/?text=' + encodeURIComponent(title + ' ' + pageUrl),
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl),
    x: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(pageUrl)
  };

  Object.keys(shareUrls).forEach(function (network) {
    var link = document.querySelector('[data-share="' + network + '"]');
    if (link) link.href = shareUrls[network];
  });

  var copyButton = document.querySelector('[data-share="copy"]');
  var feedback = document.querySelector('.article-share-feedback');

  function showFeedback(message) {
    if (!feedback) return;
    feedback.textContent = message;
    window.setTimeout(function () { feedback.textContent = ''; }, 2500);
  }

  function fallbackCopy() {
    var input = document.createElement('textarea');
    input.value = pageUrl;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    var copied = document.execCommand('copy');
    document.body.removeChild(input);
    showFeedback(copied ? 'Link copiado!' : 'Não foi possível copiar o link.');
  }

  if (copyButton) {
    copyButton.addEventListener('click', function () {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(pageUrl).then(function () {
          showFeedback('Link copiado!');
        }).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }
    });
  }
})();
