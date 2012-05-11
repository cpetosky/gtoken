// Options from settings.

var data;
var username;

chrome.extension.sendRequest({type: 'getData'}, function(response) {
  data = response;
  main();
});

var allBoxes = {};

var getAllBoxes = function() {
  var boxes = $('div.boxtitle');
  boxes.each(function() {
    var self = $(this);
    var title = self.parent();
    title.next().remove();
    title.remove();
    allBoxes[$.trim(self.text().toLowerCase())] = title;
  });
};

var findBox = function(targetBox) {
  for (var box in allBoxes) {
    if (box.indexOf(targetBox) >= 0) {
      return allBoxes[box];
    }
  }
};

var addBoxes = function(target, boxString) {
  if (boxString == '') {
    target.remove();
    return;
  }
  var boxNames = boxString.split(',');
  if (boxNames.length == 0) {
    target.remove();
    return;
  }

  for (var i = 0; i < boxNames.length; ++i) {
    var boxName = $.trim(
        boxNames[i].replace('%(username)', username).toLowerCase());
    var box = findBox(boxName);
    if (box) {
      target.append(box);
      target.append('<div class="boxbottom"> </div>');
    }
  }
};

var main = function() {
  if (!$.isReady) {
    $(document).ready(main);
    return;
  }

  var title = $('title').text();

  if (title.indexOf("Game Sheet") >= 0) {
    username = title.split("'")[0];
    getAllBoxes();
    addBoxes($('#mainbar'), data.mainBoxes);
    addBoxes($('#sidebar'), data.sidebarBoxes);
  }

  if (data.maxIconHeight <= 0) {
    var targets = $("img[src*='pics/icon']");
    var parents = targets.parent();
    targets.remove();
    parents.each(function() {
      $(this).html($(this).html().replace(/(&nbsp;|\s)+,/ig, ","));
    });
  } else {
    $("img[src*='pics/icon']").each(function() {
      var self = $(this);
      if (self.height() > data.maxIconHeight) {
        var ratio = data.maxIconHeight / $(this).height();
        self.height(self.height() * ratio);
        self.width(self.width() * ratio);
      }
    }); 
  }

  if (data.flattenOptions) {
    var rows = $("div.boxtitle:contains(Options)").next().find("tr");
    var first = rows.first();
    rows.each(function(index) {
      if (index != 0) {
        var content = $(this).children();
        content.remove();
        first.append(content);
      }
    });
  }  
}
