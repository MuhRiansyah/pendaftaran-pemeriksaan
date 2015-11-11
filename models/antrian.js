"use strict";

module.exports = function(sequelize, DataTypes) {
  var Antrian = sequelize.define("Antrian", {
      no_urut : DataTypes.INTEGER,
      pasien : DataTypes.STRING,
      poliklinik : DataTypes.STRING
  });

  return Antrian;
};
