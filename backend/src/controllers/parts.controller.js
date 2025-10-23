const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const Joi = require('joi');
const { Op } = require('sequelize');
const { Part } = require('../models');

// ✅ Validation schema
const partSchema = Joi.object({
  name: Joi.string().min(1).required(),
  brand: Joi.string().allow(''),
  price: Joi.number().precision(2).min(0).required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().allow(''),
  image: Joi.any().optional()
});

// ✅ Helper: Extract Cloudinary public_id from URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const file = parts[parts.length - 1];
    return `auto-parts/${file.split('.')[0]}`;
  } catch {
    return null;
  }
};

// ============================
// 📋 LIST
// ============================
exports.list = async (req, res, next) => {
  try {
    const {
      q = '',
      category = '',
      page = 1,
      limit = 4,
      minPrice,
      maxPrice
    } = req.query;

    const where = {};
    // 🔍 Search by name or brand
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { brand: { [Op.like]: `%${q}%` } }
      ];
    }

    // 🏷️ Category filter
    if (category) where.category = { [Op.like]: `%${category}%` };

    
    // 💰 Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows, count } = await Part.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });


    res.json({
      data: rows,
      meta: {
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching parts:', err);
    next(err);
  }
};

// ============================
// 🔍 GET BY ID
// ============================
exports.getById = async (req, res, next) => {
  try {
    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ message: 'Not found' });
    res.json(part);
  } catch (err) {
    next(err);
  }
};

// ============================
// ➕ CREATE
// ============================
exports.create = async (req, res, next) => {
  try {
    const { error, value } = partSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    let imageUrl = null;

    // ✅ Upload image to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'auto-parts',
        use_filename: true,
        unique_filename: false,
        access_mode: "public", // 👈 ensures image is public
      });
      imageUrl = result.secure_url;

      // Delete temp file
      fs.unlink(req.file.path, (err) => {
        if (err) console.warn('Failed to remove temp file:', err);
      });
    }

    const part = await Part.create({ ...value, image_url: imageUrl });

    res.status(201).json(part);
  } catch (err) {
    next(err);
  }
};

// ============================
// ✏️ UPDATE
// ============================
exports.update = async (req, res, next) => {
  try {
    const { error, value } = partSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ message: 'Not found' });

    let imageUrl = part.image_url;

    // ✅ If new image uploaded, delete old one from Cloudinary
    if (req.file) {
      const oldPublicId = getPublicIdFromUrl(part.image_url);
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId);
        } catch (delErr) {
          console.warn('Failed to delete old Cloudinary image:', delErr.message);
        }
      }

      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: 'auto-parts',
        use_filename: true,
        unique_filename: false,
        access_mode: "public", // 👈 ensures image is public
      });
      imageUrl = uploadRes.secure_url;

      fs.unlink(req.file.path, (err) => {
        if (err) console.warn('Failed to remove temp file:', err);
      });
    }

    await part.update({ ...value, image_url: imageUrl });
    res.json(part);
  } catch (err) {
    next(err);
  }
};

// ============================
// 🗑️ DELETE
// ============================
exports.remove = async (req, res, next) => {
  try {
    const part = await Part.findByPk(req.params.id);
    if (!part) return res.status(404).json({ message: 'Not found' });

    // ✅ Delete image from Cloudinary
    const publicId = getPublicIdFromUrl(part.image_url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.warn('Failed to delete Cloudinary image:', err.message);
      }
    }

    await part.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
