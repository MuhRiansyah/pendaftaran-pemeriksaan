"use strict";

module.exports = function(sequelize, DataTypes) {
  var Pembayaran = sequelize.define("Pembayaran", {
      id_pembayaran : DataTypes.INTEGER,
      no_urut : DataTypes.INTEGER,
      id_pasien : DataTypes.INTEGER,
      id_poliklinik : DataTypes.INTEGER,
      status : DataTypes.INTEGER,
      tanggal : DataTypes.DATE
  }, {
          classMethods: {
              associate: function(models) {
                  Pembayaran.hasMany(models.Poliklinik);
                  Pembayaran.hasMany(models.Pasien);
              }
          }
      }
  );

  return Pembayaran;
};
