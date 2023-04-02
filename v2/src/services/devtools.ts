// try to launch a panel
if (chrome && chrome.devtools && chrome.devtools.panels) {
  chrome.devtools.panels.create(
    "Ouch!",
    "128.png",
    "index.html",
    function (panel) {
      console.log(panel.constructor.name);
    }
  );
}

export {};
