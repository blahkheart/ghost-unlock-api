const parseQueryParams = (req, res, next) => {
  req.parsedParams = {
    address: req.query.address,
    action: req.query.action,
  };
  next();
};

module.exports = {
    parseQueryParams
}