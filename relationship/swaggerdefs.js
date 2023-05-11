/**
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
 *     RelationshipId:
 *       type: integer
 *       minimum: 1
 *       readOnly: true
 * 
 *     Relationship:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - following_user_id
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: Auto generated id of a relationship, is unique
 *         user_id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: user_id from user that follows another user
 *         following_user_id:
 *           type: integer
 *           minimum: 1
 *           readOnly: true
 *           description: user_id from user that user_id is following
 *         uri:
 *           type: string
 *           readOnly: true
 *           format: password
 *           description: URI to this object. Set by API at User creation.
 * 
 *     CreatingRelationship:
 *       type: object
 *       required:
 *         - user_id
 *         - following_user_id
 *       properties:
 *         user_id:
 *           type: integer
 *           minimum: 1
 *           description: corresponding user id
 *         following_user_id:
 *           type: integer
 *           minimum: 1
 *           description: user id from user that's being followed
 * 
 *     RetrievedRelationship:
 *       type: object
 *       required:
 *         - relationship_id
 *       properties:
 *         relationship_id:
 *           type: integer
 *           minimum: 1
 *           description: corresponding relationship id being retrieved
 */
