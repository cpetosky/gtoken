chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  var response = {};
  if (request.type == 'getData') {
    for (var name in localStorage) {
      var value = localStorage[name];
      if (value == 'true') {
        response[name] = true;
      } else if (value == 'false') {
        response[name] = false;
      } else if (!isNaN(Number(value))) {
        response[name] = Number(value);
      } else {
        response[name] = value;
      }
    }
  }
  sendResponse(response);
});