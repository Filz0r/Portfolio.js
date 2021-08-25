const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.json('hello API!');
});

router.get('/home', (req, res) => {
  res.json('hello homepage!');
});

module.exports = router;
