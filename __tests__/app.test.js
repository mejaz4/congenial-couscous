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

});