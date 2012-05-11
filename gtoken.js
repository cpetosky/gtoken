// Options from settings.

var data;
chrome.extension.sendRequest({type: 'getData'}, function(response) {
  data = response;
  main();
});

var main = function() {
  if (!$.isReady) {
    $(document).ready(main);
    return;
  }
  var boxesToKeep = {};
  var boxesList = data.sidebarBoxes.split(',');
  for (var i = 0; i < boxesList.length; ++i) {
    var canonicalBox = $.trim(boxesList[i].toLowerCase());
    boxesToKeep[canonicalBox] = true;
  }

  if (!data.removeSidebar) {
    var potentialBoxes = $('#sidebar div.boxtitle');
    potentialBoxes.each(function() {
      var self = $(this);
      if (!boxesToKeep[$.trim(self.text().toLowerCase())]) {
        var title = self.parent();
        title.next().remove();
        title.remove();
      }
    });
  } else {
    for (var boxName in boxesToKeep) {
      var potentialBoxes = $('#sidebar div.boxtitle');
      potentialBoxes.each(function() {
        var self = $(this);
        if (boxesToKeep[$.trim(self.text().toLowerCase())]) {
          var title = self.parent();
          title.remove();
          $("#mainbar").append(title);
          $("#mainbar").append("<div class='boxbottom'> </div>");
        }
      });
    }
    $("#sidebar").remove();
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
