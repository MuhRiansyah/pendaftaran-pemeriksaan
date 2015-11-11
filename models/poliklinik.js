"use strict";

module.exports = function(sequelize, DataTypes) {
  var Poliklinik = sequelize.define("Poliklinik", {
      id_poliklinik : DataTypes.INTEGER,
      nama : DataTypes.STRING
  }, {
      classMethods: {
          associate: function(models) {
              Poliklinik.belongsTo(models.Pembayaran, {
                  onDelete: "CASCADE",
                  foreignKey: {
                      allowNull: false
                  }
              });
          }
      }
  });

  return Poliklinik;
};
