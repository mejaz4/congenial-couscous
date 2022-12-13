const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection')
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')

afterAll(() => {
    return db.end()
})

beforeEach(() => seed(testData))

describe('1: GET api/treasures', () => {
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
