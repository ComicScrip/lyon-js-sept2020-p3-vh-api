const db = require("../db.js");
const { RecordNotFoundError } = require("../error-types");
const definedAttributesToSqlSet = require("../helpers/definedAttributesToSQLSet.js");

const getOneReview = async (id, failIfNotFound = true) => {
  const reviewId = id;
  const rows = await db.query(
    "SELECT r.rating, r.comment, r.id, e.title, u.firstname, u.lastname, u.email FROM review AS r JOIN event AS e ON r.event_id = e.id JOIN user AS u ON r.user_id = u.id  WHERE r.id = ?",
    [reviewId]
  );
  if (rows.length) {
    return rows[0];
  }
  if (failIfNotFound) throw new RecordNotFoundError("review", id);
  return null;
};

const getReview = async (req) => {
  let request =
    "SELECT r.rating, r.comment, r.id, e.title, u.firstname, u.lastname, u.email FROM review AS r JOIN event AS e ON r.event_id = e.id JOIN user AS u ON r.user_id = u.id";
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
  return db.query(request);
};

const getReviewPerUserPerEvent = async (userId, eventId) => {
  return db.query(
    "SELECT r.rating, r.comment, r.id, e.title, u.firstname FROM review AS r JOIN event AS e ON r.event_id = e.id JOIN user AS u ON r.user_id = u.id WHERE r.user_id=? AND r.event_id=?",
    [userId, eventId]
  );
};

const postReview = async (data) => {
  return db
    .query(`INSERT INTO review SET ${definedAttributesToSqlSet(data)}`, data)
    .then((res) => getOneReview(res.insertId));
};

const deleteReview = async (req) => {
  const reviewId = req.params.id;
  return db.query("DELETE FROM review WHERE id = ?", [reviewId]);
};

module.exports = {
  getReview,
  getOneReview,
  postReview,
  deleteReview,
  getReviewPerUserPerEvent,
};
