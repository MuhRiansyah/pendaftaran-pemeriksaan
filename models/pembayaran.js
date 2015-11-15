"use strict";

module.exports = function(sequelize, DataTypes) {
  var Pembayaran = sequelize.define("Pembayaran", {
          status : DataTypes.INTEGER,
          tanggal : DataTypes.DATE,
          //tanggal digunakan jika ada antrian pembayaran yang tidak sempat ditangani
          waktu_daftar : DataTypes.TIME
  }, {
          classMethods: {
              associate: function(models) {
                  Pembayaran.belongsTo(models.Pasien, {
                      onDelete: "CASCADE",
                      foreignKey: {
                          allowNull: false
                      }
                  });
                  Pembayaran.belongsTo(models.Poliklinik, {
                      onDelete: "CASCADE",
                      foreignKey: {
                          allowNull: false
                      }
                  });
              }
          }
      }
  );

  return Pembayaran;
};
