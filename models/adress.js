const db = require('../db.js');
const { RecordNotFoundError } = require('../error-types');
const definedAttributesToSqlSet = require('../helpers/definedAttributesToSQLSet.js'); 

const findOne = async (id, failIfNotFound = true) => {
    const rows = await db.query(`SELECT * FROM address WHERE id =?`, [id]);
    if (rows.length) {
      return rows[0];
    }
    if (failIfNotFound) throw new RecordNotFoundError('address', id);
    return null;
  };

  const findById = async (id, failIfNotFound = true) => {
    const rows = await db.query('SELECT * FROM address WHERE id = ?', [id]);
    if (rows.length) {
      return rows[0];
    }
    if (failIfNotFound) throw new RecordNotFoundError
    return null;
  }

const findAddress = async (req) => {
  let request = "SELECT * FROM address";
  if (req) {
    if (req.query.sort) {
      const parsedSort = JSON.parse(req.query.sort);
      request += ` ORDER BY ${parsedSort[0]} ${parsedSort[1]}`;
    }
    if (req.query.range) {
      const parsedRange = JSON.parse(req.query.range);
      request += ` LIMIT ${parsedRange[0]} OFFSET ${parsedRange[1]}`;
    }
  }
  const rows = await db.query(request);
  if (rows.length === 0) {
    return null;
  }
  return rows;
}

const createAddress = async (req) => {
    const { street, zipcode, city } = req.body;
    return db.query
    (`INSERT INTO address (street, zipcode, city) VALUES (?, ?, ?)`, [street, zipcode, city])
    .then((res) => findById(res.insertId));
  };

  const updateAddress = async (id, newAttributes) => {
    const namedAttributes = definedAttributesToSqlSet(newAttributes);
    return db.query(`UPDATE address SET ${namedAttributes} WHERE id = :id`, {...newAttributes, id})
      .then(() => findOne(id));
  };
  
  const deleteAddress = async (id, failIfNotFound = true) => {
    const res = await db.query('DELETE FROM address WHERE id = ?', [id]);
    if (res.affectedRows !== 0) {
      return true;
    }
    if (failIfNotFound) throw new RecordNotFoundError('address', id);
    return false;
  };
  
  

module.exports = { findAddress, findOne, createAddress, updateAddress, deleteAddress };