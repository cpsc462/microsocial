import { MY_SERVICE } from "./constants.js";

const Services = {
    Users: { port: 8000 },
    Content: { port: 8001 },
    Relationships: { port: 8002 },
    Messages: { port: 8003 },
    Notifications: { port: 8004 },
    Analytics: { port: 8005 },
  };
  

export const uri = (path = "", typ = MY_SERVICE) => {
    const current_host = "localhost"
    const default_scheme = "http";

    if (!(typ in Services)) {
        throw new Error(`Service type '${typ}' not known.`);
    }

    let host = Services[typ].host || current_host;
    let port = Services[typ].port;
    let scheme = Services[typ].scheme || default_scheme;

    return `${scheme}://${host}:${port}${path}`
}