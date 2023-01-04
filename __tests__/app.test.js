const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')

afterAll(() => {
  return db.end()
})

beforeEach(() => seed(testData))

describe('1: GET api/topics', () => {
  test('200: responds with an array of topic objects', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((result) => {
        const topics = result.body.topics
        expect(topics).toHaveLength(3)
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          )
        })
      })
  });

  test('status:404, invalid path ', () => {
    return request(app)
      .get('/api/banana')
      .expect(404).then(({ body: { msg } }) => {
        expect(msg).toBe('Not Found')
      })
  });
})

describe('2. GET /api/articles', () => {
  test('status:200, responds with an array of articles objects', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          })
        });
      });
  })
})

describe('3. GET /api/articles/:article_id', () => {
  test('status:200, responds with a single matching article', () => {
    const articleId = 3;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then((response) => {
        const article = response.body.article
        expect(article).toEqual({
          author: "icellusedkars",
          title: 'Eight pug gifs that remind me of mitch',
          article_id: articleId,
          body: "some gifs",
          topic: 'mitch',
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
        });
      });
  });
  test('400: invalid article_id', () => {
    return request(app)
      .get('/api/articles/bananas')
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('Bad Request')
      })
  })

  test('404: valid article_id but doesnt exist', () => {
    return request(app)
      .get('/api/articles/30')
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('Not Found')
      })
  })

});

describe('4. GET /api/articles/:article_id/comments', () => {
  test('status:200, responds with comments from a single matching article_id', () => {
    const articleId = 3;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then((response) => {
        const { comments } = response.body
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          })
        })
      });
  })
  test('status:200, empty array test if article exists but doesnt have comments', () => {
    const articleId = 12;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then((response) => {
        const { comments } = response.body
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
        expect(comments).toEqual([])
      });
  })
  test('404: valid article_id but doesnt exist', () => {
    return request(app)
      .get('/api/articles/30/comments')
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('Not Found')
      })
  })
  test('400: invalid article_id', () => {
    return request(app)
      .get('/api/articles/bananas/comments')
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('Bad Request')
      })
  })
})


describe('5. Post /api/articles/:article_id/comments', () => {
  test('status: 201 responds with an object of a new comment', () => {
    const newComment = {
      username: "butter_bridge",
      body: "To be, or not to be",
    }
    return request(app)
      .post('/api/articles/2/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "To be, or not to be",
          article_id: 2,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        })
      })
  });
  test('status: 201 posting a new comment to a valid article id with multiple keys, but will only accept body and author', () => {
    const newComment = {
      username: "butter_bridge",
      body: "To be, or not to be",
      article_id: 15,
      topic: "the chronicles of narnia",
    }
    return request(app)
      .post('/api/articles/7/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "To be, or not to be",
          article_id: 7,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        })
      })
  });
  test('404: posting a comment to a valid but non-existent article returns not found', () => {
    const newComment = {
      username: "butter_bridge",
      body: "To be, or not to be",
    }
    return request(app)
      .post('/api/articles/100/comments')
      .send(newComment)
      .expect(404)
      .then((response) => {
        const msg = response.body.msg
        expect(msg).toBe('Not Found')
      })
  })
  test('400: posting a comment to a valid article id with username as number', () => {
    const newComment = {
      username: 3,
      body: "To be, or not to be",
    }
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg
        expect(msg).toBe('Bad Request')
      })
  })
  test('400: posting a comment to a valid article id with body as number', () => {
    const newComment = {
      username: "butter_bridge",
      body: 4,
    }
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg
        expect(msg).toBe('Bad Request')
      })
  })
  test('400: posting a comment to a valid article id with a missing key', () => {
    const newComment = {
      username: "butter_bridge",
    }
    return request(app)
      .post('/api/articles/10/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg
        expect(msg).toBe('Bad Request')
      })
  })
  test('400: posting a comment to an invalid article id returnsbad request', () => {
    const newComment = {
      username: "butter_bridge",
      body: "hi!!",
    }
    return request(app)
      .post('/api/articles/xxxx/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        const msg = response.body.msg
        expect(msg).toBe('Bad Request')
      })
  })

})

describe('6. PATCH/api/articles/:article_id', () => {
  test('status: 200 responds with updated article after vote increment', () => {
    return request(app)
      .patch('/api/articles/3')
      .send({ inc_votes: 45 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedVotes).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: '2020-11-03T09:12:00.000Z',
          votes: 45,
        })
      })
  })
  test('status: 200 responds with updated article after vote decrement', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedVotes).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 50,
        })
      })
  })
  test('400: invalid article_id', () => {
    return request(app)
      .patch('/api/articles/bananas')
      .send({ inc_votes: 8 })
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('Bad Request')
      })
  })
  test('400: string votes', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'bh' })
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('Bad Request')
      })
  })
  test('404: valid article_id but doesnt exist', () => {
    return request(app)
      .patch('/api/articles/30')
      .send({ inc_votes: 13 })
      .expect(404)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('Not Found')
      })
  })
  test('400: invalid article_id', () => {
    return request(app)
      .patch('/api/articles/bananas')
      .send({ inc_votes: 5 })
      .expect(400)
      .then((response) => {
        const msg = response.body.msg;
        expect(msg).toBe('Bad Request')
      })
  })
})

// /api/resource/:id body: {} -> malformed body / missing required fields: 400 Bad Request
// /api/resource/:id body: { increase_votes_by: "word" } -> incorrect type: 400 Bad Request
// votes not a number

//bad req invalid id

// body VARCHAR NOT NULL, 400 bad req ""

// author VARCHAR REFERENCES users(username) NOT NULL,
// not found author 404 not found
// username cant be number
// string of numbers,