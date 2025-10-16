// Example utility for pagination (used in userController)
module.exports = (model, query, page, limit) => {
  return model.find(query).skip((page - 1) * limit).limit(limit);
};
