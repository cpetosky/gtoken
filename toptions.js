var options = {
  name: 'GoldToken Enhancement Suite',
  tabs: {
    'Basic settings': [{
      name: 'Gamesheet sidebar',
      settings: [{
        name: 'sidebarDescription',
        type: 'description',
        text: 'By default, the GoldToken gamesheet has a two-column layout. ' +
              'You can either keep this layout, but specify boxes to remove, ' +
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
        placeholder: 'Box names, comma-delimited',
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

var renderOptions = function(options, tab) {
  var tabOptions = options.tabs[tab];
  if (tabOptions === undefined) {
    throw new Error('Undefined tab: ' + tab);
  }

  var output = '<h2 class="tab-name">' + tab + '</h2>'
  output += '<div class="tab-settings">';

  for (var i = 0; i < tabOptions.length; ++i) {
    var section = tabOptions[i];
    output += '<div class="setting group">';
    output += '<div class="setting group-name">' + section.name + '</div>';
    output += '<div class="setting group-content">';

    var settings = section.settings;
    for (var j = 0; j < settings.length; ++j) {
      var setting = settings[j];
      output += '<div class="setting bundle ' + setting.type + '">';
      output += '<div class="setting container ' + setting.type + '">'

      var value = localStorage[setting.name];

      switch (setting.type) {
        case 'description':
          output += '<p class="setting element description">' +
                    setting.text + '</p>';
          break;
        case 'checkbox':
          var id = setting.name + '_' + setting.type;
          output += '<input id="' + id + '" class="setting element checkbox" ' +
                    'type="checkbox"' + (value ? ' checked="checked">' : '>') +
                    '<label class="setting label checkbox" for="' + id + '">' +
                    setting.label + '</label>';
          break;
        case 'text':
          output += '<label class="setting label text">' + setting.label +
                    '</label><input class="setting element text" type="text" ' +
                    'placeholder="' + setting.placeholder + '" value="' +
                    value + '">';
          break;
        case 'slider':
          output += '<label class="setting label slider">' + setting.label +
                    '</label><input class="setting element slider" ' +
                    'type="range" max="' + setting.max + '" min="' +
                    setting.min + '" step="' + setting.step + '">' +
                    '<span class="setting display slider">PLACEHOLDER</span>';
          break;
      }

      output += '</div>';
      output += '</div>';
    }

    output += '</div>';
    output += '</div>';
  }

  output += '</div>';
  return output;
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
  var content = renderOptions(options, 'Basic settings');
  $("#tabcontent").html(content);
})