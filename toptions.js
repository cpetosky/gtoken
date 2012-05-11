var options = {
  name: 'GoldToken Enhancement Suite',
  tabs: {
    'Basic settings': [{
      name: 'Gamesheet sidebar',
      settings: [{
        name: 'sidebarDescription',
        type: 'description',
        text: 'By default, the GoldToken gamesheet has a two-column layout. ' +
              'You can either keep this layout, but specify boxes to keep, ' +
              'or you can choose to collapse the gamesheet to a single column ' +
              'and move some of the sidebar boxes to the main column.'
      }, {
        name: 'removeSidebar',
        type: 'checkbox',
        label: 'Collapse sidebar into main column'
      }, {
        name: 'sidebarBoxes',
        type: 'text',
        label: 'Boxes to keep:',
        placeholder: '(None)',
      }]
    }, {
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

var renderOptions = function(options, tab, target) {
  var tabOptions = options.tabs[tab];
  if (tabOptions === undefined) {
    throw new Error('Undefined tab: ' + tab);
  }

  target.empty();
  target.append('<h2 class="tab-name">' + tab + '</h2>');

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

      switch (setting.type) {
        case 'description':
          handleDescription(setting, settingContainer);
          break;
        case 'checkbox':
          handleCheckbox(setting, settingContainer);
          break;
        case 'text':
          handleText(setting, settingContainer);
          break;
        case 'slider':
          handleSlider(setting, settingContainer);
          break;
      }
    }
  }

  target.append(container);
}

var checkSchema = function() {
  // Check local version and init variables.
  var version = localStorage['version'];
  var loadSchema = version === undefined;
  for (var i = 0; i < options.schema.length; ++i) {
    var schema = options.schema[i];
    if (loadSchema) {
      for (var key in schema.properties) {
        localStorage[key] = schema.properties[key];
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
  renderOptions(options, 'Basic settings', $('#tabcontent'));

  $('#resetButton').click(function() {
    localStorage.clear();
    checkSchema();
    location.reload();
  })
})
