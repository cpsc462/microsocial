const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');
var express = require('express');
var router = express.Router();
module.exports.router = router;

const {uri} = require("../common");
const {db} = require("../db");
const { validate } = require("../utils/schema-validation");


/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retrieve Events
 *     description: Retrieve Events, optionally filtering by query params
 *     operationId: GetEvents
 *     tags: [Events API]
 *     responses:
 *       200:
 *         description: Success - 0 or more Events returned
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                   $ref: '#/components/schemas/RetrievedEvent'
 *       400:
 *         description: Invalid Query
 */
router.get("/events", (req, res) => {
  const stmt = db.prepare("SELECT id, type, message, severity, time FROM events");
  events = stmt.all();
  events.forEach((event) => {
    event.uri = uri(`/event/${event.id}`);
  });
  res.json({ events: events });
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create Event
 *     description: Create a new Event
 *     operationId: CreateEvent
 *     tags: [Events API]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreatingEvent'
 *     responses:
 *       201:
 *         description: Event Created
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedEvent'
 *         links:
 *            'Retrieving Events':
 *              operationId: GetEventById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `GET /event/{id}`.
 *            'Updating a Event':
 *              operationId: UpdateEventById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `PUT /event/{id}`.
 *            'Deleting a Event':
 *              operationId: DeleteEventById
 *              parameters:
 *                id: '$response.body#/id'
 *              description: >
 *                The `id` value returned in the response can be used as
 *                the `id` parameter in `DEL /event/{id}`.
 *       400:
 *          description: Event data is not acceptable
 *          examples: [ "Invalid event name", 
 *                "Invalid password", 
 *                "Event with that name already exists" ]
 */
router.post("/events", (req, res) => {
  const event = req.body;

  errors = validate.CreatingEvent(event,"{body}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "Invalid data";
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    return;
  }

  const stmt = db.prepare(`INSERT INTO events (name, password)
                 VALUES (?, ?)`);

  try {
    info = stmt.run([event.name, event.password]);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("insert error: ", { err, info, event });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  // we're just returning what they submitted. but we never return the password
  event.id = info.lastInsertRowid;
  event.uri = uri(`/event/${event.id}`);
  delete event.password;

  res.set('Location',event.uri);
  res.type('json');
  res.json(event);
  res.status(StatusCodes.CREATED);
});
