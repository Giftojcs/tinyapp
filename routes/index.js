const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user_id) {
    res.redirect('/urls');
  } else {
    res.redirect('/auth/login');
  }
});

module.exports = router;

