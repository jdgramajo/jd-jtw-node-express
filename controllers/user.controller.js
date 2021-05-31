const returnRoles = (req, res) => {
  res.status(200).send({ roles: req.roles });
};

const confirmRole = (req, res) => {
  res.status(200).send({ hasRole: req.hasRole });
};

module.exports = {
  returnRoles,
  confirmRole
}
