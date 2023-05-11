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
 *     EventId:
 *       type: integer
 *       minimum: 1
 *       readOnly: true
 *            
 * 
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - type
 *         - message
 *         - severity
 *         - time
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: The auto-generated id of the User. Will be unique.
 *         type:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: type
 *         message:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: message
 *         severity:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: severity
 *         time:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: time
 *         uri:
 *           type: string
 *           readOnly: true
 *           format: password
 *           description: URI to this object. Set by API at User creation.
 *       examples: [
 *         { id: 1, name: "alonzo", password: "lambda", uri: "http://lh:8/event/14" }
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
 *     RetrievedEvent:
 *       type: object
 *       summary: Event structure retrieved.
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: The auto-generated id of the event. Will be unique.
 *         type:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Event type.
 *         message:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Event message. 
 *         severity:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Event severity.
 *         time:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Time of event.
 *       examples: [
 *         { id: 1, type: "login" , message: "user has logged in" , severity: "Low", time: "3:12" }
 *       ]
 * 
 * 
 *     CreatingUser:
 *       type: object
 *       required:
 *         - type
 *         - message
 *         - severity
 *         - time
 *       properties:
 *         type:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Event type.
 *         message:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Event message. 
 *         severity:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Event severity.
 *         time:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Time of event.
 *       examples: [
 *         { type: "login" , message: "user has logged in" , severity: "Low", time: "3:12" }
 *       ]
 * 
 *     CreatingEvent:
 *       type: object
 *       required:
 *         - type
 *         - message
 *         - severity
 *         - time
 *       properties:
 *         type:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Event type.
 *         message:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Event message. 
 *         severity:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Event severity.
 *         time:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Time of event.
 *       examples: [
 *         { type: "login" , message: "user has logged in" , severity: "Low", time: "3:12" }
 *       ]
 *
 * 
 *     UpdatingEvent:
 *       type: object
 *       summary: User schema submitted when updating.
 *       required:
 *         - type
 *         - message
 *         - severity
 *         - time
 *       properties:
 *         type:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         message:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         severity:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         time:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *       examples: [
 *         { name: "alonzo", password: "lambda" }
 *         ]
 * 
 * 
 *     PatchingEvent:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         message:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         severity:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *         time:
 *           type: string
 *           minLength: 1
 *           maxLength: 32
 *           pattern: '^[A-Za-z0-9_.-]{1,32}$'
 *           description: Name that they log in with. Must be unique
 *       examples: [
 *         { type: "user_created", message: "user has been created", severity: "high", time: "00:00" }
 *       ]
 */

