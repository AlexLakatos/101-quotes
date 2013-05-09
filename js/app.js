// globals
var qotd, quotes;

// native JS overrides
Date.prototype.getDOY = function date_getDOY() {
  var firstJanuary = new Date(this.getFullYear(),0,1);
  return Math.ceil((this - firstJanuary) / 86400000);
}

// main app methods
function loadQuotes() {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', 'resources/101quotes.json', true);
  xhr.send(null);

  xhr.onreadystatechange = function getQuotes (evt) {
    if (xhr.readyState !== 4) {
      return ;
    }

    if (xhr.status === 0 || xhr.status === 200) {
      quotes = JSON.parse(xhr.responseText);
    }
  };
}

function loadQOTD() {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', 'resources/qotd.json', true);
  xhr.send(null);

  xhr.onreadystatechange = function getQOTD (evt) {
    if (xhr.readyState !== 4) {
      return ;
    }

    if (xhr.status === 0 || xhr.status === 200) {
      qotd = JSON.parse(xhr.responseText);
    }
  };
}

function toggle(aElement) {
  aElement.style.display = ((aElement.style.display === 'none') ||
                            (aElement.style.display === '') ? 'block' : 'none');
}

function toggleShare(aEvent) {
  var parentQuote = aEvent.currentTarget.parentNode.parentNode;
  var shareBar = parentQuote.childNodes[7];
  toggle(shareBar);
}

// main app
function init() {
  loadQuotes();
  loadQOTD();
  document.getElementsByClassName('share-button')[0].addEventListener("click", toggleShare);
}
window.addEventListener("load", init);
