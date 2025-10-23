const express = require('express');
const router = express.Router();
const partsController = require('../controllers/parts.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');
router.get('/', partsController.list); // supports search/pagination
router.get('/:id', partsController.getById);

router.post('/', auth, upload.single('image'), partsController.create);
router.put('/:id', auth, upload.single('image'), partsController.update);
router.delete('/:id', auth, partsController.remove);

module.exports = router;
