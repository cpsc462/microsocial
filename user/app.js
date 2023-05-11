const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const fs = require('fs');
const path = require('path');
const xmlparser = require('express-xml-bodyparser');

const { StatusCodes } = require('http-status-codes');

const { Services, MY_SERVICE_NAME } = require("./common");

// App server, basic config, and all the middleware...
const app = express();
app.set("title", `Microsocial ${MY_SERVICE_NAME} API`);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
app.use(cookieParser())
app.use(xmlparser({ explicitArray: false }))
app.use(helmet())


// if it's got JSON, don't allow invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === StatusCodes.BAD_REQUEST && "body" in err) {
    console.log("Invalid JSON Received");
    //console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).send({ status: StatusCodes.BAD_REQUEST, message: err.message });
  }
  next(); 
});

// include all routes from the routes/ dir: all js files.
fs.readdir("./routes", (err, files) => { 
  files.forEach(file => {
    if (file.match(/[.]js$/)) {
      console.log("including routes from:",file); 
      module_exports = require(`./routes/${ path.basename(file,'.js') }`);
      if ('appSetCallback' in module_exports) {
        module_exports.appSetCallback(app);
      }
      app.use("/", module_exports.router);
    } 
  })
});

// der main loop
server = app.listen(Services[MY_SERVICE_NAME].port, () => {
  console.log(`${ MY_SERVICE_NAME } service listening on port ${Services[MY_SERVICE_NAME].port }...`);
});

module.exports = app;