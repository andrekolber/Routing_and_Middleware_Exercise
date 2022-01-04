const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const shoppingList = require('../fakeDb');

router.get('/', (req, res) => {
	res.json({ shoppingList });
});

router.post('/', (req, res, next) => {
	try {
		if (!req.body.name) throw new ExpressError('Item name is required', 400);
		const newItem = {
			name  : req.body.name,
			price : req.body.price,
		};
		shoppingList.push(newItem);
		return res.status(201).json({ added: newItem });
	} catch (e) {
		return next(e);
	}
});

router.get('/:name', (req, res) => {
	const item = shoppingList.find((item) => item.name === req.params.name);
	if (item === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	res.json({ item });
});

router.patch('/:name', (req, res) => {
	const item = shoppingList.find((item) => item.name === req.params.name);
	if (item === undefined) {
		throw new ExpressError('Item not found', 404);
	}
	item.name = req.body.name;
	item.price = req.body.price;
	res.json({ item });
});

router.delete('/:name', (req, res) => {
	const item = shoppingList.findIndex((item) => item.name === req.params.name);
	if (item === -1) {
		throw new ExpressError('Item not found', 404);
	}
	shoppingList.splice(item, 1);
	res.json({ message: 'Deleted' });
});

module.exports = router;
