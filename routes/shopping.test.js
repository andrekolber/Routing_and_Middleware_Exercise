process.env.NODE_ENV = 'test';

const request = require('supertest');
const { response } = require('../app');

const app = require('../app');
let shoppingList = require('../fakeDb');

let bacon = {
	name  : 'bacon',
	price : 7.99,
};

beforeEach(() => {
	shoppingList.push(bacon);
});

afterEach(() => {
	shoppingList.length = 0;
});

describe('GET /shoppingList', () => {
	test('Get all items', async () => {
		const res = await request(app).get('/shoppingList');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ shoppingList: [ bacon ] });
	});
});

describe('GET /shoppingList/:name', () => {
	test('Get item by name', async () => {
		const res = await request(app).get(`/shoppingList/${bacon.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ item: bacon });
	});

	test('Respond with 404 for invalid item name', async () => {
		const res = await request(app).get(`/shoppingList/mayo`);
		expect(res.statusCode).toBe(404);
	});
});

describe('POST /shoppingList', () => {
	test('Create shoppingList item', async () => {
		const res = await request(app).post('/shoppingList').send({
			name  : 'ribeye',
			price : 19.99,
		});
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({
			added : {
				name  : 'ribeye',
				price : 19.99,
			},
		});
	});

	test('Respond with 404 if item is missing', async () => {
		const res = await request(app).post('/shoppingList').send({});
		expect(res.statusCode).toBe(400);
	});
});

describe('PATCH /shoppingList/:name', () => {
	test('Updates a single item', async () => {
		const res = await request(app).patch(`/shoppingList/${bacon.name}`).send({
			name  : 'ham',
			price : 4.99,
		});
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			item : {
				name  : 'ham',
				price : 4.99,
			},
		});
	});

	test('Respond with 404 for invalid item', async () => {
		const res = await request(app).patch(`/shoppingList/mayo`).send({
			name  : 'ham',
			price : 4.99,
		});
		expect(res.statusCode).toBe(404);
	});
});

describe('DELETE /shoppingList/:name', () => {
	test('Delete an item', async () => {
		const res = await request(app).delete(`/shoppingList/${bacon.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});

	test('Respong with 404 for deleting an invalid cat', async () => {
		const res = await request(app).delete(`/shoppingList/mayo`);
		expect(res.statusCode).toBe(404);
	});
});
