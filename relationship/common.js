
const {paths} = require('./unprotectedPaths');

// >>>>>>> Configure as needed
const Services = {
  Users: { port: 8000 },
  Content: { port: 8001 },
  Relationships: { port: 8002 },
  Messages: { port: 8003 },
  Notifications: { port: 8004 },
  Analytics: { port: 8005 },
};

const MY_SERVICE = "Relationships"; 
// <<<<<<<<<<<<<

/*
 * @function uri
 * Produce the URL/URI for a service
 * @param {string} [path=""] - If empty, returns the service URL
 * @param {string} [typ=(My Service)] - one of the service types, defaults to MY_SERVICE
 * @returns {string} a FQDN with no path, or with a path
 */
function uri(path = "", typ = MY_SERVICE) {
  const current_host = "localhost";
  const default_scheme = "http";

  if (!(typ in Services)) {
    throw new Error(`Service type '${typ}' not known.`);
  }
  host = Services[typ].host || current_host;
  port = Services[typ].port;
  scheme = Services[typ].scheme || default_scheme;

  return `${scheme}://${host}:${port}${path}`;
}


const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const unprotectedPaths = () =>
    {
      const usablePaths = [];
      paths.forEach((spec) => {
        if ('exact' in spec) {
          usablePaths.push(spec.exact);
        }
        if ('regex' in spec) {
          usablePaths.push(new RegExp(spec.regex));
        }
        if ('head' in spec) {
          usablePaths.push(new RegExp(`^${spec.head}/`));
        }
      });
      if (paths.length != usablePaths.length || paths.length == 0) {
        console.log("Unexpected: expected unprotected paths; found 0 or wrong number");
      }
      return usablePaths;
    };

module.exports.Services = Services;
module.exports.MY_SERVICE = MY_SERVICE;
module.exports.uri = uri;
module.exports.fetch = fetch;
module.exports.unprotectedPaths = unprotectedPaths;
