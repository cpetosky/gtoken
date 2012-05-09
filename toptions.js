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

      var value = localStorage[setting.name];
      switch (setting.type) {
        case 'description':
          settingContainer.append($('<p class="setting element description">').text(setting.text));
          break;
        case 'checkbox':
          var id = setting.name + '_' + setting.type;
          var checkbox = $('<input class="setting element checkbox" type="checkbox">').
              attr('id', id).
              prop('checked', value);
          settingContainer.append(checkbox);
          var label = $('<label class="setting label checkbox">').
              attr('for', id).
              text(setting.label);
          settingContainer.append(label);
          break;
        case 'text':
          settingContainer.append($('<label class="setting label text">').text(setting.label));
          var textbox = $('<input class="setting element text" type="text">').
              attr('placeholder', setting.placeholder).
              val(value);
          settingContainer.append(textbox);
          break;
        case 'slider':
          settingContainer.append($('<label class="setting label slider">').text(setting.label));
          var slider = $('<input class="setting element slider" type="range">').
              attr('max', setting.max).
              attr('min', setting.min).
              attr('step', setting.step).
              val(value);
          settingContainer.append(slider);
          settingContainer.append($('<span class="setting display slider">PLACEHOLDER</span>'));
          break;
      }
    }
  }

  target.append(container);
}

var bootstrap = function() {
  // Check local version and init variables.
  var version = localStorage['version'];
  if (version === undefined) {
    for (var i = 0; i < options.schema.length; ++i) {
      var schema = options.schema[i];
      for (var key in schema.properties) {
        localStorage[key] = schema.properties[key];
      }
      localStorage['version'] = schema.version;
    }
  }
}

$(document).ready(function() {
  bootstrap();
  var content = renderOptions(options, 'Basic settings', $("#tabcontent"));
})