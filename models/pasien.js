"use strict";

module.exports = function(sequelize, DataTypes) {
  var Pasien = sequelize.define("Pasien", {
      nama : DataTypes.STRING
  }, {
      timestamps: false,
      classMethods: {
          associate: function(models) {

          }
      }
  });

  return Pasien;
};
