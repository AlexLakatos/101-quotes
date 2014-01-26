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
      populateQOTD();
    }
  };
}

function clearMain () {
  var main = document.getElementById("main");
  while (main.hasChildNodes()) {
    main.removeChild(main.lastChild);
  }
}

function toggle(aElement) {
  aElement.style.display = ((aElement.style.display === 'none') ||
                            (aElement.style.display === '') ? 'block' : 'none');
}

function toggleShare(aEvent) {
  var parentQuote = aEvent.currentTarget.parentNode.parentNode;
  var shareBar = parentQuote.childNodes[3];
  toggle(shareBar);
}

function toggleDialog(aEvent) {
  var confirmDialog = document.getElementById("confirm-dialog");
  toggle(confirmDialog);
}

function createQuote (aQuote) {
  var main = document.getElementById("main");

  var quoteDiv = document.createElement("div");
  quoteDiv.classList.add("quote");

  var quoteTitleBar = document.createElement("div");
  quoteTitleBar.classList.add("quote-title-bar");

  var title = document.createElement("h2");
  title.textContent = aQuote.author;

  var shareButton = document.createElement("p");
  shareButton.classList.add("share-button");
  shareButton.addEventListener("click", toggleShare);
  var shareHref = document.createElement("a");
  shareHref.href="#";
  var shareImage = document.createElement("img");
  shareImage.src = "img/share.png";
  shareImage.alt = "share";
  shareHref.appendChild(shareImage);
  shareButton.appendChild(shareHref);

  var resetDiv = document.createElement("div");
  resetDiv.classList.add("clear");

  var quoteBody = document.createElement("div");
  quoteBody.classList.add("quote-body");
  var quoteParagraph = document.createElement("p");
  quoteParagraph.textContent = aQuote.quote;
  quoteBody.appendChild(quoteParagraph);

  var quoteShare = document.createElement("div");
  quoteShare.classList.add("quote-share");
  var quoteShareList = document.createElement("p");
  var shareOptins = ["copy", "facebook", "twitter", "message"];
  for (var i = shareOptins.length - 1; i >= 0; i--) {
    var shareListHref = document.createElement("a");
    shareListHref.href = "#";
    var shareListImage = document.createElement("img");
    shareListImage.alt = shareOptins[i];
    shareListImage.src = "img/" + shareOptins[i] + ".png";
    switch (shareOptins[i]) {
      case "message":
        shareListHref.addEventListener("click", sendSMS.bind(aQuote));
        break;
      case "twitter":
        shareListHref.href = "https://twitter.com/intent/tweet?status=" + 
          '"' + aQuote.quote + '" - ' + aQuote.author;
        shareListHref.target = "_blank";
        break;
      case "facebook":
        shareListHref.href = "http://www.facebook.com/sharer.php?s=100&" + 
          "p[url]=http://apps.greensqr.com/quotes/?quote=" + aQuote.quote + "*author=" + aQuote.author + "*title=" + getTitle() +
          "&p[title]=" + aQuote.author + 
          "&p[summary]=" + aQuote.quote;
        shareListHref.target = "_blank";
        break;
      case "copy":
        shareListHref.addEventListener("click", toggleDialog);
        break;
    }
    shareListHref.appendChild(shareListImage);
    quoteShareList.appendChild(shareListHref);
  };
  quoteShare.appendChild(quoteShareList);

  quoteTitleBar.appendChild(title);
  quoteTitleBar.appendChild(shareButton);
  quoteDiv.appendChild(quoteTitleBar);
  quoteDiv.appendChild(resetDiv);
  quoteDiv.appendChild(quoteBody);
  quoteDiv.appendChild(quoteShare);

  main.appendChild(quoteDiv);
}

function sendSMS(aEvent) {
  new MozActivity({
    name: 'new',
    data: {
      type: 'websms/sms',
      number: '',
      body: '"' + this.quote + '" - ' + this.author
    }
  });
}

function setTitle (aTitle) {
  var title = document.getElementById("title");
  title.textContent = aTitle;
}

function getTitle () {
  var title = document.getElementById("title");
  return title.textContent;
}

function populateQOTD () {
  clearMain();
  setTitle("Quote Of The Day");
  var now = new Date();
  var today = new Date(now.getFullYear(), 0 ,1);
  today = Math.ceil((now - today) / 86400000);
  createQuote(qotd.qotd[today - 1]);
}

function populateQuotes (aEvent) {
  var selection = aEvent.target.parentElement;
  var selectionId = selection.id;
  if (selectionId === "qotd") {
    populateQOTD();
  } else {
    var selectedQuotes = quotes[selectionId];
    clearMain();
    setTitle(selection.textContent);

    for (var i = selectedQuotes.length - 1; i >= 0; i--) {
      createQuote(selectedQuotes[i])
    };
  }
}

// main app
function init() {
  loadQuotes();
  loadQOTD();

  var quotesMenu = document.getElementById("quotes-menu");
  for (var i = quotesMenu.children.length - 1; i >= 0; i--) {
    quotesMenu.children[i].addEventListener("click", populateQuotes);
  };

  var okButton = document.getElementById("ok-button");
  okButton.addEventListener("click", toggleDialog);
}
window.addEventListener("load", init);
