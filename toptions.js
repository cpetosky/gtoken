var options = {
  name: 'GoldToken Enhancement Suite',
  tabs: {
    'Basic settings': [{
      name: 'Gamesheet misc.',
      settings: [{
        name: 'flattenOptions',
        type: 'checkbox',
        label: 'Collapse options box into single row',
      }]
    }, {
      name: 'User icons',
      settings: [{
        name: 'maxIconHeight',
        type: 'slider',
        label: 'Max user icon height:',
        max: 64,
        min: 0,
        step: 1,
        display: true,
        displayModifier: function(value) {
          if (value == 0) {
            return 'Remove all user icons';
          } else if (value == 64) {
            return 'Do not modify user icons';
          } else {
            return value;
          }
        }
      }]
    }],
    'Gamesheet layout': [{
      name: 'Sidebar',
      settings: [{
        name: 'sidebarDescription',
        type: 'description',
        text: 'By default, the GoldToken gamesheet has a two-column layout. ' +
              'Below are lists you edit to specify which content boxes ' +
              'appear in each column. If you remove all boxes from the ' +
              'second column, the gamesheet will collapse to a single-column ' +
              'layout.'
      }, {
        type: 'connectList',
        columns: [{
          name: 'mainBoxes',
          label: 'Main column'
        }, {
          name: 'sidebarBoxes',
          label: 'Right column'
        }, {
          name: 'omittedBoxes',
          label: 'Hidden boxes'
        }],
        connectWith: 'columnSortable',
        renderModifier: function(value, target) {
          if ($.inArray(value, globals.mainBoxNames) >= 0) {
            target.addClass('ui-state-default');
          } else if ($.inArray(value, globals.sidebarBoxNames) >= 0) {
            target.addClass('ui-state-highlight');
          }
        }
      }]
    }]
  },
  schema: [{
    version: '1.0',
    properties: {
      removeSidebar: true,
      sidebarBoxes: 'My Clubs, Tokens',
      flattenOptions: true,
      maxIconHeight: 16
    }
  }, {
    version: '1.1',
    properties: {
      mainBoxes: "%(username)'s turn,Opponent's turn,Recently completed,Options",
      sidebarBoxes: 'Chums List,Recent Photo,Current Poll,My Clubs,' +
                    'Tips and Tricks,Tokens,Wiki Updates,' +
                    'Open Game Invitations,Game Suggestion',
      omittedBoxes: ''
    },
    deleteProperties: ['removeSidebar']
  }, {
    version: '1.1.2',
    appendProperties: {
      mainBoxes: ['Game Invitations'],
      sidebarBoxes: ['Chums Approval'],
    }
  }]
};

var handleDescription = function(setting, settingContainer) {
  settingContainer.append(
      $('<p class="setting element description">').text(setting.text));
};

var handleCheckbox = function(setting, settingContainer) {
  var id = setting.name + '_' + setting.type;
  var checkbox = $('<input class="setting element checkbox" type="checkbox">').
      attr('id', id).
      prop('checked', localStorage[setting.name] == 'true');
  settingContainer.append(checkbox);
  var label = $('<label class="setting label checkbox">').
      attr('for', id).
      text(setting.label);
  settingContainer.append(label);

  checkbox.change(function() {
    localStorage[setting.name] = checkbox.prop('checked');
  });
};

var handleConnectList = function(setting, settingContainer) {
  for (var i = 0; i < setting.columns.length; ++i) {
    var column = setting.columns[i];
    var connector = setting.connectWith;
    var list = $('<ul class="setting connect-list">').
        addClass(connector).
        sortable({
          items: 'li:not(.ui-state-disabled)',
          connectWith: '.' + setting.connectWith });
    list.append($('<li class="ui-state-disabled">').text(column.label));
    var data = localStorage[column.name].split(',');
    for (var j = 0; j < data.length; ++j) {
      var name = data[j];
      if (name == '') {
        continue;
      }
      var entry = $('<li>').text(name).attr('id', name);
      if (setting.renderModifier) {
        setting.renderModifier(data[j], entry);
      }
      list.append(entry);
    }
    settingContainer.append(list);

    list.bind('sortupdate', makeConnectListHandler(column.name));
  }
}

var makeConnectListHandler = function(name) {
  return function() {
    localStorage[name] = $(this).sortable('toArray').join(',');
  };
};

var handleText = function(setting, settingContainer) {
  settingContainer.append($('<label class="setting label text">').text(setting.label));
  var textbox = $('<input class="setting element text" type="text">').
      attr('placeholder', setting.placeholder).
      val(localStorage[setting.name]);
  settingContainer.append(textbox);

  textbox.keyup(function() {
    localStorage[setting.name] = textbox.val();
  });
};

var handleSlider = function(setting, settingContainer) {
  settingContainer.append(
      $('<label class="setting label slider">').text(setting.label));
  var slider = $('<input class="setting element slider" type="range">').
      attr('max', setting.max).
      attr('min', setting.min).
      attr('step', setting.step).
      val(localStorage[setting.name]);
  settingContainer.append(slider);
  var display = $('<span class="setting display slider">');
  slider.change(function() {
    localStorage[setting.name] = slider.val();
    if (setting.displayModifier) {
      display.html(setting.displayModifier(slider.val()));
    } else {
      display.text(slider.val());
    }
  });

  if (setting.display) {
    slider.change();
    settingContainer.append(display);
  }
};

var renderers = {
  checkbox: handleCheckbox,
  connectList: handleConnectList,
  description: handleDescription,
  slider: handleSlider,
  text: handleText
};

var renderOptions = function() {
  renderTabList($('#tab-container'));
  renderTab(options, 'Basic settings', $('#tabcontent'));
}

var renderTabList = function(target) {
  for (var tabName in options.tabs) {
    var tabEntry = $('<div class="tab">').text(tabName);
    target.append(tabEntry);
    tabEntry.click(function() {
      renderTab(options, $(this).text(), $('#tabcontent'));
    })
  }
}

var renderTab = function(options, tab, target) {
  target.empty();
  var tabOptions = options.tabs[tab];
  if (tabOptions === undefined) {
    throw new Error('Undefined tab: ' + tab);
  }

  target.empty();
  target.append('<h1 class="tab-name">' + tab + '</h1>');

  var container = $('<div class="tab-settings">');

  for (var i = 0; i < tabOptions.length; ++i) {
    var section = tabOptions[i];

    var group = $('<div class="setting group">');
    container.append(group);

    group.append($('<div class="setting group-name">' + section.name + '</div>'));

    var groupContent = $('<div class="setting group-content">');
    group.append(groupContent);

    var settings = section.settings;
    for (var j = 0; j < settings.length; ++j) {
      var setting = settings[j];

      var bundle = $('<div class="setting bundle ' + setting.type + '">');
      groupContent.append(bundle);

      var settingContainer = $('<div class="setting container ' + setting.type + '">');
      bundle.append(settingContainer);

      renderers[setting.type](setting, settingContainer);
    }
  }

  target.append(container);
  $('.tab.active').removeClass('active');
  $('.tab:contains(' + tab + ')').addClass('active');
}

var checkSchema = function() {
  // Check local version and init variables.
  var version = localStorage['version'];
  var loadSchema = version === undefined;
  for (var i = 0; i < options.schema.length; ++i) {
    var schema = options.schema[i];
    if (loadSchema) {
      if (schema.properties) {
        for (var key in schema.properties) {
          localStorage[key] = schema.properties[key];
        }
      }

      if (schema.deleteProperties) {
        for (var i = 0; i < schema.deleteProperties.length; ++i) {
          localStorage.removeItem(schema.deleteProperties[i]);
        }        
      }

      if (schema.appendProperties) {
        for (var prop in schema.appendProperties) {
          var value = localStorage[prop];
          var newValue = (value == '') ? [] : value.split(',');
          localStorage[prop] = newValue.concat(schema.appendProperties[prop]).
              join(',');
        }
      }
      localStorage['version'] = schema.version;
    }

    if (version === schema.version) {
      loadSchema = true;
    }
  }
}

$(document).ready(function() {
  checkSchema();
  renderOptions();

  $('#resetButton').click(function() {
    localStorage.clear();
    checkSchema();
    location.reload();
  })
})
