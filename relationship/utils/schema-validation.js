/*
* This module exports one item: a map of entity validators.
* The map is "schema name" -> "validating function that returns errors of []"
* These can be used to validate user input.
* The validators are derived from the swagger/OpenAPI spec.
*
* For example, 
*   const { validate } = require('schema-validation')
*   sample = { name:"", pasward:"abde"};
*   const errors = validate.LoginUser(sample,"{body}");
* 
* will give errors about name being <1 char, password field not being present, etc.
*/

const {
  openapiSchemaToJsonSchema: toJsonSchema,
} = require("@openapi-contrib/openapi-schema-to-json-schema");
const Ajv = require("ajv-draft-04"); // because this is what openapi-schema-to-json-schema produces by default
var { betterAjvErrors } = require("@apideck/better-ajv-errors");

const { swaggerSpec } = require("./schema");

var validate = {}; // validation functions, by schema name
module.exports.validate = validate;

function validators_setup() {
  const json_schema = toJsonSchema(swaggerSpec);
  const ajv = new Ajv({
    strict: false,
    allErrors: true,
    validateFormats: false,
    verbose: true,
  });

  Object.keys(json_schema.components.schemas).forEach((schemaName) => {
    console.log("compiling", schemaName, "validation function");

    const schema = json_schema.components.schemas[schemaName];
    var compiled_validator = ajv.compile(schema);

    validate[schemaName] = function (data, basePath = "{}") {
      compiled_validator(data);
      const errors = betterAjvErrors({
        schema,
        login_info: data,
        errors: compiled_validator.errors,
        basePath,
      });
      if (errors.length) {
        console.log({ schemaName, data, schemaName, errors });
      }
      return errors;
    };
  });
}

validators_setup();
