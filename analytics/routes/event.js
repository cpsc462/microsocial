const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
var express = require("express");


var router = express.Router();
module.exports.router = router;

const { uri } = require("../common");
const { db } = require("../db");
const { validate } = require("../utils/schema-validation");

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Retrieve a Event
 *     description: Retrieve one Event by id.
 *     operationId: GetEventById
 *     tags: [Events API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: event id
 *         required: true
 *         schema:
 *            $ref: '#/components/schemas/EventId'
 *     responses:
 *       200:
 *         description: Event Data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetrievedEvent'
 *       404:
 *         description: No such Event
 *         examples: [ "Not Found", "No such event" ]
 */
router.get("/event/:id", (req, res) => {
  const id = parseInt(req.params.id);

  errors = validate.EventId(id, "{id}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "No such event";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  const stmt = db.prepare("SELECT id,name FROM events where id = ?");
  events = stmt.all([id]);

  if (events.length < 1) {
    res.statusMessage = "No such event";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  event = events[0];
  event.uri = uri(`/event/${event.id}`);
  res.json(event);
});

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Update Event
 *     description: Replace all* fields for one Event, by id.
 *     operationId: UpdateEventById
 *     tags: [Events API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the event.
 *         schema:
 *            type: integer
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdatingEvent'
 *     responses:
 *       200:
 *         description: Event Updated (all fields)
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedEvent'
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: No such Event
 *          examples: [ "Not Found", "No such event" ]
 */
router.put("/event/:id", (req, res) => {
  const id = parseInt(req.params.id);

  errors = validate.EventId(id, "{id}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "No such event";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  const updatedEvent = req.body;

  errors = validate.UpdatingEvent(updatedEvent, "{body}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "Invalid update";
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    return;
  }

  const stmt = db.prepare(`UPDATE events SET name=?, password=? WHERE id=?`);

  try {
    info = stmt.run([updatedEvent.name, updatedEvent.password, id]);
    if (info.changes < 1) {
      console.log("update error1: ", { err, info, event });
      res.statusMessage = "Account update failed.";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account with name already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("update error2: ", { err, info, event });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  res.redirect(`${id}`);
});

/**
 * @swagger
 * /event/{id}:
 *   patch:
 *     summary: (Partially) update Event fields
 *     description: Replace any submitted fields for one Event, by id.
 *     operationId: PatchEventById
 *     tags: [Events API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the event.
 *         schema:
 *            type: integer
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PatchingEvent'
 *     responses:
 *       200:
 *         description: Event Updated (submitted fields only, but all fields returned)
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedEvent'
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: Event not found
 *          examples: [ "Not Found", "No such event" ]
 */
router.patch("/event/:id", (req, res) => {
  const id = parseInt(req.params.id);

  errors = validate.EventId(id, "{id}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "No such event";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  const updatedEvent = req.body;

  errors = validate.PatchingEvent(updatedEvent, "{body}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "Invalid update";
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
    return;
  }

  var info;
  try {
    updateClauses = [];
    updateParams = [];

    if ("name" in updatedEvent) {
      updateClauses.push("name = ?");
      updateParams.push(updatedEvent.name);
    }

    if ("password" in updatedEvent) {
      updateClauses.push("password = ?");
      updateParams.push(updatedEvent.password);
    }

    const stmt = db.prepare(
      `UPDATE events SET ${updateClauses.join(", ")} WHERE id=?`
    );

    info = stmt.run([...updateParams, id]);
    if (info.changes < 1) {
      res.statusMessage = "No such event/Error";
      res.status(StatusCodes.NOT_FOUND).end();
      return;
    }
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      res.statusMessage = "Account with name already exists";
      res.status(StatusCodes.BAD_REQUEST).end();
      return;
    }
    console.log("update error: ", { err, updatedEvent });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    return;
  }

  res.redirect(`${id}`);
});

/**
/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Delete Event
 *     description: Delete this event from the service
 *     operationId: DeleteEventById
 *     tags: [Events API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the event.
 *         schema:
 *            type: integer
 *     responses:
 *       204:
 *         description: Event Deleted
 *       404:
 *          description: No such Event
 *          examples: [ "Not Found", "No such event" ]
 */
router.delete("/event/:id", (req, res) => {
  const id = parseInt(req.params.id);

  errors = validate.EventId(id, "{id}");
  if (errors.length) {
    res.json(errors);
    res.statusMessage = "No such event";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }

  const stmt = db.prepare("DELETE FROM events where id = ?");

  info = stmt.run([id]);
  if (info.changes < 1) {
    res.statusMessage = "No such event";
    res.status(StatusCodes.NOT_FOUND).end();
    return;
  }
  res.status(StatusCodes.NO_CONTENT).end();
});
