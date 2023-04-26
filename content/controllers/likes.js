import { db } from "../db.js";
import Ajv, { ValidationError } from 'ajv';
import { LikeComment, LikePost } from "../models/schema-validation.js";

const ajv = new Ajv({ allErrors: true })
const likePostValidate = ajv.compile(LikePost)
const likeCommentValidate = ajv.compile(LikeComment)

export const likePost = async (req, res) => {
    if(!likePostValidate(req.body)) {
        const error = new ValidationError(likePostValidate.errors);
        return res.status(400).json({ error })
    }

    const { post_id, username } = req.body
    const check = db.prepare(`SELECT * FROM likesPost WHERE username=? AND post_id=?`)
    const checkRes = check.all(username, post_id)

    if(checkRes.length === 0) {
        const q = db.prepare(`INSERT INTO likesPost(username, post_id) VALUES (?, ?);`)
        q.run(username, post_id)
        return res.status(201).json({ message: "liked" })
    } else {
        const q = db.prepare(`DELETE FROM likesPost WHERE username=? AND post_id=?;`)
        q.run(username, post_id)
        return res.status(204).json({ message: "unliked" })
    }

}

export const getPostLike = async (req, res) => {
    const { post_id } = req.params
    if(!post_id)
        res.status(400).json({ error: "Invalid Id" })
    
    const q = db.prepare(`SELECT * FROM likesPost WHERE post_id=?;`)
    const result = q.all(post_id)
    res.status(200).json({ result: result })
}


export const likeComment = async (req, res) => {
    if(!likeCommentValidate(req.body)) {
        const error = new ValidationError(likeCommentValidate.errors);
        return res.status(400).json({ error })        
    }

    const { comment_id, username } = req.body
    const check = db.prepare(`SELECT * FROM likesComment WHERE username=? AND comment_id=?`)
    const checkRes = check.all(username, comment_id) 

    if(checkRes.length === 0) {
        const q = db.prepare(`INSERT INTO likesComment(username, comment_id) VALUES (?, ?);`)
        q.run(username, comment_id)
        return res.status(201).json({ message: "liked" })
    } else {
        const q = db.prepare(`DELETE FROM likesComment WHERE username=? AND comment_id=?;`)
        q.run(username, comment_id)
        return res.status(204).json({ message: "unliked" })
    }
}


export const getCommentLike = async (req, res) => {
    const { comment_id } = req.params
    if(!comment_id)
        res.status(400).json({ error: "Invalid Id" })
    
    const q = db.prepare(`SELECT * FROM likesComment WHERE comment_id=?;`)
    const result = q.all(comment_id)
    res.status(200).json({ result: result })
}

