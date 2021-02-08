const {
  findAddress,
  findOne,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../models/adress");

module.exports.handleAllAddress = async (req, res) => {
  const data = await findAddress(req);
  const allAddressesLength = await findAddress();
  res.set("X-Total-Count", allAddressesLength.length);
  return res.status(200).send(data);
};

module.exports.handleOneAddress = async (req, res) => {
  const data = await findOne(req.params.id);
  return res.status(200).send(data);
};

module.exports.handleCreateAddress = async (req, res) => {
  const data = await createAddress(req);
  return res.status(201).send(data);
};

module.exports.handleUpdateAddress = async (req, res) => {
  const data = await updateAddress(req.params.id, req.body);
  return res.send(data);
};

module.exports.handleDeleteAddress = async (req, res) => {
  await deleteAddress(req.params.id);
  return res.sendStatus(204);
};
