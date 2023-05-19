import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode
} from 'http-status-codes'
import { StatusCodes } from 'http-status-codes'
import { isEmail } from 'validator'
import { Router } from 'express'

var router = Router()
const _router = router
export { _router as router }

import { uri } from '../common'
import { db } from '../db'
import { validate } from '../utils/schema-validation'

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a User
 *     description: Retrieve one User by id.
 *     operationId: GetUserById
 *     tags: [Users API]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: user id
 *         required: true
 *         schema:
 *            $ref: '#/components/schemas/UserId'
 *     responses:
 *       200:
 *         description: User Data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RetrievedUser'
 *       404:
 *         description: No such User
 *         examples: [ "Not Found", "No such user" ]
 */
router.get('/user/recovery-email/:email', (req, res) => {
  const recoveryEmail = req.params.email

  // Call the getUserByRecoveryEmail method from db.js
  const users = db.getUserByRecoveryEmail(recoveryEmail)

  if (users.length < 1) {
    res.statusMessage = 'No users found for the provided recovery email address'
    res.status(StatusCodes.NOT_FOUND).end()
    return
  }

  res.json(users)
})

router.get('/user/:id', (req, res) => {
  const id = parseInt(req.params.id)

  errors = validate.UserId(id, '{id}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'No such user'
    res.status(StatusCodes.NOT_FOUND).end()
    return
  }

  const stmt = db.prepare('SELECT id,name FROM users where id = ?')
  users = stmt.all([id])

  if (users.length < 1) {
    res.statusMessage = 'No such user'
    res.status(StatusCodes.NOT_FOUND).end()
    return
  }

  user = users[0]
  user.uri = uri(`/user/${user.id}`)
  res.json(user)

  // Retrieve the user from the database
  const user = db.getUserById(id)

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' })
    return
  }

  // Retrieve the recovery email address for the user
  const recoveryEmail = db.getRecoveryEmail(id)

  // Add the recovery email address to the user object
  const userWithRecoveryEmail = {
    ...user,
    recovery_email: recoveryEmail
  }

  // Send the modified user as the response
  res.json(userWithRecoveryEmail)
})

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update User
 *     description: Replace all* fields for one User, by id.
 *     operationId: UpdateUserById
 *     tags: [Users API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user.
 *         schema:
 *            type: integer
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdatingUser'
 *     responses:
 *       200:
 *         description: User Updated (all fields)
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedUser'
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: No such User
 *          examples: [ "Not Found", "No such user" ]
 */

import { isEmail } from 'validator'

router.put('/user/:id', (req, res) => {
  const id = parseInt(req.params.id)

  errors = validate.UserId(id, '{id}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'No such user'
    res.status(StatusCodes.NOT_FOUND).end()
    return
  }

  const updatedUser = req.body

  errors = validate.UpdatingUser(updatedUser, '{body}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'Invalid update'
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
    return
  }

  if (updatedUser.recovery_email) {
    const recoveryEmail = updatedUser.recovery_email

    if (!isEmail(recoveryEmail)) {
      res.statusMessage = 'Invalid recovery email address'
      res.status(StatusCodes.BAD_REQUEST).end()
      return
    }

    const stmt = db.prepare(`UPDATE users SET recovery_email=? WHERE id=?`)
    stmt.run([recoveryEmail, id])
  }

  const stmt = db.prepare(`UPDATE users SET name=?, password=? WHERE id=?`)

  try {
    info = stmt.run([updatedUser.name, updatedUser.password, id])
    if (info.changes < 1) {
      console.log('update error1: ', { err, info, user })
      res.statusMessage = 'Account update failed.'
      res.status(StatusCodes.BAD_REQUEST).end()
      return
    }
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.statusMessage = 'Account with name already exists'
      res.status(StatusCodes.BAD_REQUEST).end()
      return
    }
    console.log('update error2: ', { err, info, user })
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
    return
  }

  res.redirect(`${id}`)
})

/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: (Partially) update User fields
 *     description: Replace any submitted fields for one User, by id.
 *     operationId: PatchUserById
 *     tags: [Users API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user.
 *         schema:
 *            type: integer
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PatchingUser'
 *     responses:
 *       200:
 *         description: User Updated (submitted fields only, but all fields returned)
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RetrievedUser'
 *       400:
 *          description: Invalid update. (Contents not acceptable)
 *       404:
 *          description: User not found
 *          examples: [ "Not Found", "No such user" ]
 */
router.patch('/user/:id', (req, res) => {
  const id = parseInt(req.params.id)

  errors = validate.UserId(id, '{id}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'No such user'
    res.status(StatusCodes.NOT_FOUND).end()
    return
  }

  const updatedUser = req.body

  errors = validate.PatchingUser(updatedUser, '{body}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'Invalid update'
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).end()
    return
  }

  var info
  try {
    updateClauses = []
    updateParams = []

    if ('name' in updatedUser) {
      updateClauses.push('name = ?')
      updateParams.push(updatedUser.name)
    }

    if ('password' in updatedUser) {
      updateClauses.push('password = ?')
      updateParams.push(updatedUser.password)
    }

    const stmt = db.prepare(
      `UPDATE users SET ${updateClauses.join(', ')} WHERE id=?`
    )

    info = stmt.run([...updateParams, id])
    if (info.changes < 1) {
      res.statusMessage = 'No such user/Error'
      res.status(StatusCodes.NOT_FOUND).end()
      return
    }
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.statusMessage = 'Account with name already exists'
      res.status(StatusCodes.BAD_REQUEST).end()
      return
    }
    console.log('update error: ', { err, updatedUser })
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
    return
  }

  res.redirect(`${id}`)
})

/**
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete User
 *     description: Delete this user from the service
 *     operationId: DeleteUserById
 *     tags: [Users API]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user.
 *         schema:
 *            type: integer
 *     responses:
 *       204:
 *         description: User Deleted
 *       404:
 *          description: No such User
 *          examples: [ "Not Found", "No such user" ]
 */
router.delete('/user/:id', (req, res) => {
  const id = parseInt(req.params.id)

  errors = validate.UserId(id, '{id}')
  if (errors.length) {
    res.json(errors)
    res.statusMessage = 'No such user'
    res.status(StatusCodes.NOT_FOUND).end()
    return
  }

  const stmt = db.prepare('DELETE FROM users where id = ?')

  info = stmt.run([id])
  if (info.changes < 1) {
    res.statusMessage = 'No such user'
    res.status(StatusCodes.NOT_FOUND).end()
    return
  }
  res.status(StatusCodes.NO_CONTENT).end()
})
