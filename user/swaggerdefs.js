/**
 * @swagger
 * tags: 
 *    - name: Examples
 *      description: Example code. Do not use this as a real service
 *    - name: Users API 
 *    - name: Content API
 *    - name: Auth API
 *    - name: Schema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserId:
 *       type: integer
 *       minimum: 1
 *       readOnly: true
 *            
 * 
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - password
 *         - email
 *         - phone_number
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: The auto-generated id of the User. Will be unique.
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: No leading or trailing spaces. Never returned by an API.
 *         email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: Email address attached to the account. Must be unique.
 *         recov_email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: recov email address attached to the account. Must be unique.
 *         uri:
 *           type: string
 *           readOnly: true
 *           format: password
 *           description: URI to this object. Set by API at User creation.
 *         phone_number:
 *           type: string
 *           minLength: 1
 *           format: '^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
 *           description: Email address attached to the account. Must be unique.
 *         country:
 *           type: string
 *           minLength: 1
 *           format: country
 *           description: Country.
 *       examples: [
 *         { id: 1, name: "alonzo", password: "lambda", uri: "http://lh:8/user/14" }
 *       ]
 * 
 *     LoginInfo:
 *       type: object
 *       required:
 *         - name
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with.
 *         password:
 *           type: string
 *           minLength: 4
 *           format: '^[^ ]{4,}$'
 *           description: No leading or trailing spaces.
 *       examples: [
 *         { name: "alonzo", password: "lambda" }
 *       ]
 * 
 *     LoginToken:
 *       type: object
 *       summary: JWT for authentication
 *       properties:
 *         client_id:
 *           type: integer
 *           readOnly: true
 *           description: id of user
 *         access_token:
 *           type: string
 *           readOnly: true
 *           description: Opaque string. To be passed as in Authentication header as "Bearer <token>.
 *         refresh_token:
 *           type: string
 *           readOnly: true
 *           minLength: 36
 *           maxLength: 36
 *           description: Opaque string. To be passed when access_token expires.
 *       
 *     RefreshToken:
 *       type: object
 *       summary: A Refresh Token
 *       required:
 *         - refresh_token
 *       properties:
 *         refresh_token:
 *           type: string
 *           readOnly: true
 *           minLength: 36
 *           maxLength: 36
 *           description: Opaque string. To be passed when access_token expires.
 *       
 *     RetrievedUser:
 *       type: object
 *       summary: User schema submitted when updating.
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: The auto-generated id of the book. Will be unique.
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: Email address attached to the account. Must be unique.
 *         recov_email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: Email address attached to the account. Must be unique.
 *         phone_number:
 *           type: string
 *           minLength: 1
 *           format: '^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
 *           description: Email address attached to the account. Must be unique.
 *         country:
 *           type: string
 *           minLength: 1
 *           format: country
 *           description: Country.
 *         uri:
 *           type: string
 *           readOnly: true
 *           format: password
 *           description: URI to this object. Set by endpoint at creation.
 *       examples: [
 *         { id: 1, name: "alonzo", uri: "http://lh:8/user/14" }
 *       ]
 * 
 * 
 *     CreatingUser:
 *       type: object
 *       required:
 *         - name
 *         - password
 *         - email
 *         - phone_number
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: Guess. No leading or trailing spaces. Never returned by an API.
 *         country:
 *           type: string
 *           minLength: 1
 *           format: country
 *           description: Country.
 *         recov_email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: recov email address attached to the account. Must be unique.
 *         email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: Email address attached to the account. Must be unique.
 *         phone_number:
 *           type: string
 *           minLength: 1
 *           format: '^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
 *           description: Email address attached to the account. Must be unique.
 *       examples: [
 *         { name: "alonzo", password: "lambda" }
 *       ]
 * 
 * 
 *     UpdatingUser:
 *       type: object
 *       summary: User schema submitted when updating.
 *       required:
 *         - name
 *         - password
 *         - email
 *         - phone_number
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: Email address attached to the account. Must be unique.
 *         country:
 *           type: string
 *           minLength: 1
 *           format: country
 *           description: Country.
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: Guess. No leading or trailing spaces. Never returned by an API. description Columns to sort by, separated by commas. Names are case-insensitive. Sorts are ascending unless a "-" is given. "+" is accepted but is unnecessary. Acceptable columns are id and name.
 *         recov_email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: recov email address attached to the account. Must be unique. 
 *         phone_number:
 *           type: string
 *           minLength: 1
 *           format: '^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
 *           description: Email address attached to the account. Must be unique.
 *       examples: [
 *         { name: "alonzo", password: "lambda" }
 *         ]
 * 
 *     PatchingUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         country:
 *           type: string
 *           minLength: 1
 *           format: country
 *           description: Country.
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: Guess. No leading or trailing spaces. Never returned by an API.
 *         recov_email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: recov email address attached to the account. Must be unique. 
 *         email:
 *           type: string
 *           minLength: 1
 *           format: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]'
 *           description: Email address attached to the account. Must be unique.
 *         phone_number:
 *           type: string
 *           minLength: 1
 *           format: '^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
 *           description: Email address attached to the account. Must be unique.
 *       examples: [
 *         { name: "alonzo", password: "lambda" }
 *       ]
 *
  *     UserFilteringSpec:
 *       description: Valid query parameters. Result set is Users who match ALL criteria. If you are retrieving results from a previous set (start_at, page_size) it is not necessary to repeat the query/sort params. In fact they will be ignored. ** The query/sort params are only used when the "start_at" param is NOT specified. This is how a "new" query is signalled **
 *       type: object
 *       examples: 
 *           - id_LE: 1000
 *           - id_GE: 50
 *           - name_LE: "zebra"
 *           - name_GE: "aardvark"
 *           - start_at: 1000
 *           - page_size: 100
 *       properties:
 *         id_LE:
 *           type: integer
 *           minimum: 1
 *           description: Users with an Id <<= this will be returned.
 *         id_GE:
 *           type: integer
 *           minimum: 1
 *           description: Users with an Id >= this will be returned.
 *         name_LE:
 *           type: string
 *           minLength: 1
 *           description: Users with an Name <= this (case insensitive) will be returned.
 *         name_GE:
 *           type: string
 *           minLength: 1
 *           description: Users with an Name >= this (case insensitive) will be returned.
 *         start_at:
 *           type: integer
 *           minimum: 1
 *           description: Row number (NOT id) to start at. If this is specified by page_size is not, page_size defaults to (configured) 100 rows.
 *         page_size:
 *           type: integer
 *           minimum: 1
 *           description: How many rows to return each time?
 * 
 *     UserSortingSpec:
 *       type:  array
 *       uniqueItems: true
 *       minItems: 1
 *       maxItems: 2
 *       items:
 *          type: string
 *          nullable: false
 *          enum: [ id, id-, id+, name-, name, name+ ]
 * 
 *     UserSortingOption:
 *         type: string
 *         nullable: false
 *         enum: 
 *          - id
 *          - name
 *
 *     UserSortingSpec_bad:
 *       type:  array
 *       items:
 *          type: string 
 *          //$ref: '#/components/schemas/UserSortingOption'
 * 
 */
 
