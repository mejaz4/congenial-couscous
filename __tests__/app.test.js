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
          .expect(404).then(({body: { msg }})=> {
            expect(msg).toBe('Invalid Path')
          })
      });
})

describe('2. GET /api/articles', () => {
    test('status:200, responds with an array of articles objects', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
            console.log(articles, '<<treasure')
          expect(articles).toBeInstanceOf(Array);
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