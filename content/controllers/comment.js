import { db } from "../db.js";
import Ajv, { ValidationError } from 'ajv';
import { Comment, UpdateComment } from "../models/schema-validation.js";


const ajv = new Ajv({allErrors: true})
const commentValidate = ajv.compile(Comment)
const updateCommentValidate = ajv.compile(UpdateComment)

export const getAllComments = async (req, res) => {
    const q = db.prepare('SELECT * FROM comments')
    const result = q.all()
    return res.status(200).json({
        result: result
    })
}


export const addComment = async(req, res) => {
    if(!commentValidate(req.body)) {
        const error = new ValidationError(commentValidate.errors);
        return res.status(400).json({ error })        
    }

    const { post_id, username, body } = req.body
    const currentDate = new Date()
    
    const q = db.prepare(`INSERT INTO comments (post_id, username, body, date) VALUES(?, ?, ?, ?);`)
    q.run(post_id, username, body, currentDate.toISOString())

    res.status(201).json({ message: "success" })
}


export const updateComment = async(req, res) => {
    if(!updateCommentValidate(req.body)) {
        const error = new ValidationError(updateCommentValidate.errors);
        return res.status(400).json({ error })         
    }
    const { comment_id, body } = req.body

    const q = db.prepare(`UPDATE comments SET body=? WHERE id=?`)
    const result = q.run(body, comment_id).changes

    if(result > 0)
        res.status(204).json({ message: "Success" })
    else
        res.status(400).json({ error: "Id not found" })
}


export const deleteCommentById = async (req, res) => {
    const { comment_id } = req.params
    if(!comment_id)
        return res.status(400).json({ error: "Invalid Id" })

    const q = db.prepare(`DELETE FROM comments WHERE id=?`)
    const result = q.run(comment_id).changes

    if(result > 0)
        res.status(204).json({ message: "success" })
    else
        res.status(400).json({ error: "Id not found" })
}


export const getCommentsByUsername = async (req, res) => {
    const { username } = req.params
    if(!username)
        return res.status(400).json({ error: "Invalid username" })

    const q = db.prepare(`SELECT * FROM comments WHERE username=?`)
    const result = q.all(username)
    if(result)
        return res.status(200).json({ result: result })
    else
        return res.status(404).json({ error: "Not Found" })
}


export const getCommentsByPostId = async (req, res) => {
    const { post_id } = req.params
    if(!post_id)
        return res.status(400).json({ error: "Invalid Post's Id" })
        
    const q = db.prepare(`SELECT * FROM comments WHERE post_id=?`)
    const result = q.all(post_id)
    return res.status(200).json({ result: result })
}


export const getCommentById = async (req, res) => {
    const { comment_id } = req.params
    const q = db.prepare(`SELECT * FROM comments WHERE id=?`)
    const result = q.get(comment_id)
    res.status(200).json({ result: result })
}