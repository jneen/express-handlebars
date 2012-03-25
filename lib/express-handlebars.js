var Handlebars = require('handlebars');

module.exports = function(app) {
  // *.hbs templates are rendered with Handlebars
  app.register('hbs', Handlebars);

  // hook into express's native helpers function to register helpers
  // with Handlebars
  var oldHelpers = app.helpers.bind(app)
  app.helpers = function(h) {
    Object.keys(h).forEach(function(k) {
      Handlebars.registerHelper(k, h[k]);
    });

    return oldHelpers(h);
  }

  // Handlebars doesn't really do dynamic helpers,
  // so we kind of hack them on here.
  var oldDynamicHelpers = app.dynamicHelpers.bind(app);

  // first, use the native dynamicHelpers to add the request and response
  // objects to the rendering context
  oldDynamicHelpers({
    __req: function(req, res) { return req; },
    __res: function(req, res) { return res; }
  });

  // then, when you register a dynamic helper, replace it with a function
  // that uses the context's cache of (req, res) to create your helpers.
  // the contract is that the dynamicHelper definition function is only
  // called once per request.
  app.dynamicHelpers = function(dh) {
    const CACHE_KEY = '[[ dynamic helpers ]]';
    Object.keys(dh).forEach(function(k) {
      Handlebars.registerHelper(k, function() {
        var self = this;

        function getHelper(k) {
          var cache = self.__res[CACHE_KEY] = self.__res[CACHE_KEY] || {}
          return (cache[k] = cache[k] || dh[k](self.__req, self.__res));
        }

        return getHelper(k).apply(self, arguments);
      });
    });

    return oldDynamicHelpers(dh);
  };
};
