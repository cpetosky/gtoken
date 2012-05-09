// =============================================================================
// Edit these options

// If true, remove the gamesheet sidebar and make it a one-column layout.
var removeSidebar = true;

// If removeSidebar is true, move these sidebar boxes to the main column.
var moveToMainBoxes = ["My Clubs", "Tokens"];

// If removeSidebar is false, keep the sidebar but remove these boxes entirely.
var uselessBoxes = [
		"Recent Photo", "Current Poll", "Tips and Tricks",
		"Wiki Updates", "Open Game Invitations", "Game Suggestion"];

// Scales the sizes of player icons. Set to 0 to remove all icons. Set to
// something big to not mess with icon size.
var maxIconHeight = 16;

// If true, make the Options box a single row instead of two. The default
// layout is unnecessarily narrow.
var flattenOptions = true;

// END of editable options section
// =============================================================================

if (!removeSidebar) {
	for (var i = 0; i < uselessBoxes.length; ++i) {
		var selector = "div.boxtitle:contains(" + uselessBoxes[i] + ")";
		var title = $(selector).parent();
		title.next().remove();
		title.remove();
	}	
} else {
	for (var i = 0; i < moveToMainBoxes.length; ++i) {
		var selector = "div.boxtitle:contains(" + moveToMainBoxes[i] + ")";
		var title = $(selector).parent();
		title.remove();
		$("#mainbar").append(title);
		$("#mainbar").append("<div class='boxbottom'> </div>");
	}
	$("#sidebar").remove();
}

if (maxIconHeight <= 0) {
	var targets = $("img[src*='pics/icon']");
	var parents = targets.parent();
	targets.remove();
	parents.each(function() {
		$(this).html($(this).html().replace(/(&nbsp;|\s)+,/ig, ","));
	});
} else {
	$("img[src*='pics/icon']").each(function() {
		var self = $(this);
		if (self.height() > maxIconHeight) {
			var ratio = maxIconHeight / $(this).height();
			self.height(self.height() * ratio);
			self.width(self.width() * ratio);
		}
	});	
}

if (flattenOptions) {
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