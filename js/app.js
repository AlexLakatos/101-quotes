var quotes, qotd;

function loadQuotes() {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType('application/json');
  xhr.open('GET', 'resources/101quotes.json', true);
  xhr.send(null);

  xhr.onreadystatechange = function (evt) {
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

  xhr.onreadystatechange = function (evt) {
    if (xhr.readyState !== 4) {
      return ;
    }

    if (xhr.status === 0 || xhr.status === 200) {
      qotd = JSON.parse(xhr.responseText);
    }
  };
}

function init() {
  loadQuotes();
  loadQOTD();
}
window.addEventListener("load", init);
