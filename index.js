var request = require('request'),
    url = require('url'),
    async = require('async'),
    _ = require('lodash');

var OA_API_HOST = 'www.openaustralia.org';
var OA_API_BASEPATH = '/api/';
var OA_API_OUTPUT_JSON = 'js';
var OA_API_ENDPOINTS = {
  getDivisions:       ['postcode', 'date', 'search'],
  getRepresentative:  ['id', 'division', 'always_return'],
  getRepresentatives: ['postcode', 'date', 'party', 'search'],
  getSenator:         ['id'],
  getSenators:        ['date', 'party', 'state', 'search'],
  getDebates:         ['type', 'date', 'search', 'person', 'gid', 'order', 'page', 'num'],
  getHansard:         ['search', 'person', 'order', 'page', 'num'],
  getComments:        ['date', 'search', 'user_id', 'pid', 'page', 'num']
};

var OpenAustralia = function(apiKey) {
  this.apiKey = apiKey;
};

OpenAustralia.prototype._buildAPIRequest = function(endpoint, args, callback) {
  var query = _.extend(args, {
    output: OA_API_OUTPUT_JSON,
    key: this.apiKey
  });
  var apiURL = url.format({
    protocol: 'http',
    hostname: OA_API_HOST,
    pathname: OA_API_BASEPATH + endpoint,
    query: query
  });

  console.log(apiURL);

  async.waterfall([
      function(next) {
        request.get(apiURL, next);
      },
      function(response, body, next) {
        var data = JSON.parse(body);
        if (data) {
          next(null, data);
        } else {
          next('invalid json');
        }
      }], callback);
};

// Returns a function implementing an API endpoint.
function apiEndpoint(endpoint, valid_arguments) {
  return function(args, callback) {
    if ('function' === typeof args) {
      this._buildAPIRequest(endpoint, {}, args);
    } else {
      this._buildAPIRequest(endpoint, _.pick(args, valid_arguments), callback);
    }
  };
}

// Create a method for each API endpoint.
_.extend(OpenAustralia.prototype,
    _.object(
      _.map(OA_API_ENDPOINTS, function(valid_arguments, endpoint) {
        return [endpoint, apiEndpoint(endpoint, valid_arguments)];
      })
    )
);

module.exports = OpenAustralia;
