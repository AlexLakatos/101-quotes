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
  window.scrollTo(0, 0);
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

function shareQuoteImage(aEvent) {
  var imageQuote = createImageQuote(this);
  imageQuote.id = "hidden-quote";
  var main = document.getElementById("main")
  var hiddenQuote = main.appendChild(imageQuote);

  html2canvas(hiddenQuote, {
    onrendered: function renderedCanvas (aCanvas) {
      var main = document.getElementById("main");
      var hiddenQuote = document.getElementById("hidden-quote");
      main.removeChild(hiddenQuote);

      aCanvas.toBlob(function shareBlob (aBlob) {
        var sharingImage = new MozActivity({
          name: "share",
          data: {
            type: "image/*",
            number: 1,
            blobs: [aBlob]
          }
        });
      });
    }
  });
}

function createImageQuote (aQuote) {
  var quoteDiv = document.createElement("div");
  quoteDiv.classList.add("quote");

  var quoteTitleBar = document.createElement("div");
  quoteTitleBar.classList.add("quote-title-bar");

  var title = document.createElement("h2");
  title.textContent = aQuote.author;
  title.style.color = "#008AAA";

  var resetDiv = document.createElement("div");
  resetDiv.classList.add("clear");

  var quoteBody = document.createElement("div");
  quoteBody.classList.add("quote-body");
  var quoteParagraph = document.createElement("p");
  quoteParagraph.textContent = aQuote.quote;
  quoteParagraph.style.color = "#008AAA";
  quoteBody.appendChild(quoteParagraph);

  quoteTitleBar.appendChild(title);
  quoteDiv.appendChild(quoteTitleBar);
  quoteDiv.appendChild(resetDiv);
  quoteDiv.appendChild(quoteBody);

  return quoteDiv;
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
        shareListHref.href = "http://www.facebook.com/sharer.php?m2w&s=100&" +
          "p[url]=http://apps.greensqr.com/quotes/?quote=" + aQuote.quote + "*author=" + aQuote.author + "*title=" + getTitle() +
          "&p[title]=" + aQuote.author + 
          "&p[summary]=" + aQuote.quote;
        shareListHref.target = "_blank";
        break;
      case "copy":
        shareListHref.addEventListener("click", shareQuoteImage.bind(aQuote));
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
  createPlatformButton();
  createRandomButton();
}

function createPlatformButton () {
  var main = document.getElementById("main");

  var moreAppsButton = document.createElement("button");
  moreAppsButton.type = "button";
  moreAppsButton.classList.add("recommend");
  moreAppsButton.id = "more-apps";
  moreAppsButton.textContent = "More Apps";
  moreAppsButton.addEventListener("click", listMoreApps);
  main.appendChild(moreAppsButton);
}

function createRandomButton () {
  var main = document.getElementById("main");

  var randomButton = document.createElement("button");
  randomButton.type = "button";
  randomButton.classList.add("recommend");
  randomButton.id = "random-quote";
  randomButton.textContent = "Random Quote";
  randomButton.addEventListener("click", createRandomQuote);
  main.appendChild(randomButton);
}

function listMoreApps () {
  var apps = [{
    name: "FireFart",
    link: "https://marketplace.firefox.com/app/firefart/"
  }];
  var domApps = document.querySelectorAll(".apps");
  var main = document.getElementById("main");
  var domAppsLength = domApps.length;
  if (domAppsLength === 0) {
    var moreAppsButton = document.getElementById("more-apps");
    for (i in apps) {
      var anApp = document.createElement("a");
      anApp.setAttribute("role", "button");
      anApp.classList.add("apps");
      anApp.id = apps[i].name.toLowerCase();
      anApp.target = "_blank";
      anApp.href = apps[i].link;
      anApp.textContent = apps[i].name;
      moreAppsButton.parentNode.insertBefore(anApp, moreAppsButton.nextSibling);
    }
  } else {
    for (var i = domAppsLength - 1; i >= 0; i--) {
      main.removeChild(domApps[i]);
    };
  }
}

function createRandomQuote (aEvent) {
  var main = document.getElementById("main");
  var categories = ["art", "humour", "inspiration", "life", "love", "misc", "people", "war", "wisdom", "work"];

  if (main.lastChild.id !== "random-quote") {
    main.removeChild(main.lastChild);
  }

  createQuote(quotes[categories[random(10)]][random(10)]);
}

function random (aNumber) {
  return Math.floor(Math.random() * aNumber);
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
}
window.addEventListener("load", init);
