"use strict";

module.exports = function(sequelize, DataTypes) {
  var Poliklinik = sequelize.define("Poliklinik", {
      nama : DataTypes.STRING
  }, {
      classMethods: {
          associate: function(models) {

          }
      }
  });

  return Poliklinik;
};
