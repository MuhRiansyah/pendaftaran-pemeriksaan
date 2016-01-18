"use strict";

module.exports = function(sequelize, DataTypes) {
    var Antrian_Pemeriksaan = sequelize.define("Antrian_Pemeriksaan", {
        status : DataTypes.INTEGER,
        tanggal : DataTypes.DATE,
        waktu_daftar : DataTypes.TIME
    }, {
        classMethods: {
            associate: function(models) {
                Antrian_Pemeriksaan.belongsTo(models.Pasien, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                Antrian_Pemeriksaan.belongsTo(models.Poliklinik, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    });
    return Antrian_Pemeriksaan;
};
