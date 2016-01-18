"use strict";

module.exports = function(sequelize, DataTypes) {
  var Poliklinik = sequelize.define("Poliklinik", {
      nama : DataTypes.STRING
  });
  return Poliklinik;
};
