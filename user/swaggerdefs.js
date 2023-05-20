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
 *         - Email
 *         - Phone Number
 *         - Country
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
 *         Email:
 *           Type: String
 *           minLength: 4
 *           Pattern: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i'
 *           Description: Checks for correct email to be inputted.
 *         PhoneNumber:
 *           Type: String
 *           minLength: 1
 *           format: '^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
 *           description: Phone Number already in use! Must use other phone number.
 *         Country:
 *           type: String
 *           minLength: 1
 *           format: Country
 *           description: N/A-Country.
 *         uri:
 *           type: string
 *           readOnly: true
 *           format: password
 *           description: URI to this object. Set by API at User creation.
 *       examples: [
 *         { id: 1, name: "alonzo", password: "lambda", email: alonzo@email.com, uri: "http://lh:8/user/14" }
 *       ]
 *      
 *     LastLogin:
 *       summary: Creates a section next to the user table, indicating the previous login date.
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with.
 *     LoginDate:
 *          Type: TEXT
 *          Summary: Date for last login from user
 *          password:
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
 *         Email:
 *           Type: String
 *           minLength: 4
 *           Pattern: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i'
 *           Description: Checks for correct email to be inputted.Email:
 *         PhoneNumber:
 *           Type: String
 *           minLength: 1
 *           format: '^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
 *           description: Phone Number already in use! Must use other phone number.
 *         Country:
 *           type: String
 *           minLength: 1
 *           format: Country
 *           description: N/A-Country.
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
 *         - Email
 *         - Phone Number
 *         - Country
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
 *         Email:
 *           Type: string
 *           minLength: 4
 *           Patterm: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i'
 *           Description: Checks for correct email to be inputted.
 *         PhoneNumber:
 *           Type: String
 *           minLength: 1
 *           format: '^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
 *           description: Phone Number already in use! Must use other phone number.
 *         Country:
 *           type: String
 *           minLength: 1
 *           format: Country
 *           description: N/A-Country.
 *       examples: [
 *         { name: "alonzo", password: "lambda", Email: alonzo@email.com, PhoneNumber: (909)123-4567, Country: USA}
 *       ]
 *     UpdatingUser:
 *       type: object
 *       summary: User schema submitted when updating.
 *       required:
 *         - name
 *         - password
 *         - Email
 *         - Phone Number
 *         -Country
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
 *           description: Guess. No leading or trailing spaces. Never returned by an API. description Columns to sort by, separated by commas. Names are case-insensitive. Sorts are ascending unless a "-" is given. "+" is accepted but is unnecessary. Acceptable columns are id and name.

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
 *         password:
 *           type: string
 *           minLength: 4
 *           format: password
 *           description: Guess. No leading or trailing spaces. Never returned by an API.
 *         Email:
 *           Type: string
 *           minLength: 4
 *           Patterm: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i'
 *           Description: Checks for correct email to be inputted.
 *         PhoneNumber:
 *           Type: String
 *           minLength: 1
 *           format: '^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
 *           description: Phone Number already in use! Must use other phone number.
 *         Country:
 *           type: String
 *           minLength: 1
 *           format: Country
 *           description: N/A-Country.
 *       examples: [
 *         { name: "alonzo", password: "lambda", Email: alonzo87@email.com,PhoneNumber: (909)123-4567, Country: USA}
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
 
