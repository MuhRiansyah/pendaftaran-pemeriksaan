"use strict";

module.exports = function(sequelize, DataTypes) {
  var Pasien = sequelize.define("Pasien", {
      id_pasien : DataTypes.INTEGER,
      nama : DataTypes.STRING
  }, {
      classMethods: {
          associate: function(models) {
              Pasien.belongsTo(models.Pembayaran, {
                  onDelete: "CASCADE",
                  foreignKey: 'id_pasien'
              });
          }
      }
  });

  return Pasien;
};
