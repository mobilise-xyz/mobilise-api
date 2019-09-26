const {QuickLink} = require("../models");
const Q = require("q");
const LinkRepositoryInterface = require("./interfaces/linkRepositoryInterface");

let LinkRepository = Object.create(
  LinkRepositoryInterface
);

LinkRepository.add = function (quicklink) {
  return QuickLink.create({
    name: quicklink.name,
    url: quicklink.url
  });
};

LinkRepository.getAll = function () {
  return QuickLink.findAll();
};

LinkRepository.getById = function (id) {
  return QuickLink.findOne({
    where: {
      id: id
    }
  });
};

LinkRepository.removeById = function(id) {
  return QuickLink.destroy({
    where: {
      id: id
    }
  });
};

module.exports = LinkRepository;

