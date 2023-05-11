import request from 'supertest'
import app from '../index.js'
import { db } from '../db.js'

beforeAll((done) => {
  done()
})

afterAll((done) => {
  done()
})

export const conn = request(app)
let post_id = 1
let comment_id = 1

let post_id2 = 1
let comment_id2 = 1
describe('GET /content/posts', () => {
  it('Should return all posts', async () => {
    const res = await conn.get('/content/posts')
    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBeDefined()
  })
})

describe('POST /content/posts', () => {
  it('Should post a post', async () => {
    const res = await conn.post('/content/posts').send({
      username: 'TEST',
      title: 'TEST',
      tags: 'TEST',
      image: 'TEST',
      description: 'TEST'
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
  })

  it('Post by Jeremy Smith', async () => {
    const res = await conn.post('/content/posts').send({
      username: 'JEREMYSMITH',
      title: 'THIS IS A POST BY JEREMY SMITH',
      tags: 'TAG,DOG,CAT,ANIMAL,PETS',
      image: 'hello.png',
      description: 'THESE ARE MY PETS'
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
  })
})

describe('PUT /content/posts', () => {
  it('Should update a post', async () => {
    const q = db.prepare(
      `SELECT (id) FROM posts WHERE username=? AND title=? AND image=?`
    )
    const { id } = q.get('TEST', 'TEST', 'TEST')
    post_id = id
    const res = await conn.put('/content/posts').send({
      post_id: post_id,
      title: 'TEST',
      tags: 'TEST',
      image: 'TEST',
      description: 'CHANGED'
    })
    expect(res.statusCode).toBe(204)
    expect(res.body).toBeDefined()
  })

  it('Post description attribute should be updated to CHANGED', async () => {
    const q = db.prepare(
      `SELECT description FROM posts WHERE username=? AND title=? AND image=?`
    )
    const { description } = q.get('TEST', 'TEST', 'TEST')
    expect(description).toBe('CHANGED')
  })

  it('Update Jeremy Smith\'s post', async () => {
    const q = db.prepare(
      `SELECT (id) FROM posts WHERE username=? AND tags LIKE '%PETS%'`
    )
    const { id } = q.get('JEREMYSMITH')
    post_id2 = id
    const res = await conn.put('/content/posts').send({
      post_id: post_id2,
      title: 'Jeremy Smith and his pets',
      tags: 'TAG,DOG,CAT,ANIMAL,PETS',
      image: 'hello.png',
      description: 'This is my pet dog and cat'
    })
    expect(res.statusCode).toBe(204)
    expect(res.body).toBeDefined()
  })

  it('Jeremy Smith\'s post title should be updated', async () => {
    const q = db.prepare(
      `SELECT title FROM posts WHERE username=? AND tags LIKE '%PETS%'`
    )
    const { title } = q.get('JEREMYSMITH')
    expect(title).toBe('Jeremy Smith and his pets')
  })
})

describe('GET /content/posts/:post_id', () => {
  it('Fetch a post by id', async () => {
    const res = await conn.get(`/content/posts/${post_id}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.id).toBe(post_id)
    expect(res.body.result.description).toBe('CHANGED')
  })

  it('Fetch Jeremy\'s post by id', async () => {
    const res = await conn.get(`/content/posts/${post_id2}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.id).toBe(post_id2)
    expect(res.body.result.description).toBe('This is my pet dog and cat')
  })
})

describe('DELETE /content/posts/:post_id', () => {
  it('DELETE a post by id', async () => {
    const res = await conn.delete(`/content/posts/${post_id}`)
    expect(res.statusCode).toBe(204)
  })

  it('DELETE Jeremy\'s post', async () => {
    const res = await conn.delete(`/content/posts/${post_id2}`)
    expect(res.statusCode).toBe(204)
  })
})

describe('GET /content/posts/:post_id', () => {
  it('Get a deleted post', async () => {
    const res = await conn.get(`/content/posts/${post_id}`)
    expect(res.statusCode).toBe(404)
  })

  it('Get jeremy\'s deleted post', async () => {
    const res = await conn.get(`/content/posts/${post_id2}`)
    expect(res.statusCode).toBe(404)
  })
})

describe('POST /content/comments', () => {
  it('Post a comment', async () => {
    const res = await conn.post(`/content/comments`).send({
      post_id: 1,
      username: 'TEST',
      body: 'TEST'
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
  })

  it('Post a comment by Jeremy', async () => {
    const res = await conn.post(`/content/comments`).send({
      post_id: 2,
      username: 'JEREMYSMITH',
      body: 'This is a comment made by Mr. Smith'
    })
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
  })
})

describe('GET /content/comments/user/:username', () => {
  var q = db.prepare(`SELECT (id) FROM comments WHERE username=? AND body=?`)
  var { id } = q.get('TEST', 'TEST')
  comment_id = id
  it('Get a comment by username', async () => {
    const res = await conn.get(`/content/comments/user/TEST`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBeDefined()
  })

  it('Get Jeremy\'s comment by username', async () => {
    q = db.prepare(`SELECT (id) FROM comments WHERE username=?`)
    var { id } = q.get('JEREMYSMITH')
    comment_id2 = id
    const res = await conn.get(`/content/comments/user/JEREMYSMITH`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBeDefined()
  })
})

describe('GET /content/comments/post/:post_id', () => {
  it('Get a comment by post id', async () => {
    const res = await conn.get(`/content/comments/user/1`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBeDefined()
  })

  it('Get Jeremy\'s comment by post id', async () => {
    const res = await conn.get(`/content/comments/user/2`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBeDefined()
  })
})

describe('DELETE /content/comments/:comment_id', () => {
  it('Delete a comment by id', async () => {
    const res = await conn.delete(`/content/comments/${comment_id}`)
    expect(res.statusCode).toBe(204)
  })

  it('Delete Jeremy\'s comment by id', async () => {
    const res = await conn.delete(`/content/comments/${comment_id2}`)
    expect(res.statusCode).toBe(204)
  })
})

describe('GET /content/likes/post/:post_id', () => {
  it('Get a likes by post id', async () => {
    const res = await conn.get(`/content/likes/post/1`)
    expect(res.statusCode).toBe(200)
  })

  it('Get likes on Jeremy\'s post by post id', async () => {
    const res = await conn.get(`/content/likes/post/2`)
    expect(res.statusCode).toBe(200)
  })
})

describe('GET /content/likes/post/:comment_id', () => {
  it('Get a likes by comment id', async () => {
    const res = await conn.get(`/content/likes/comment/1`)
    expect(res.statusCode).toBe(200)
  })

  it('Get likes on Jeremy\'s comment by comment id', async () => {
    const res = await conn.get(`/content/likes/comment/2`)
    expect(res.statusCode).toBe(200)
  })
})