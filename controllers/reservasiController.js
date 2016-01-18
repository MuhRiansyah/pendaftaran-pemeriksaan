/**
 * Created by riansyahPC on 11/26/2015.
 */
var models  = require('../models');
module.exports = {

    registerRoutes: function(app) {
        app.get('/reservasi', this.menampilkanFormReservasi);
        app.post('/tambahreservasi', this.menambahReservasi);
    },

    menambahReservasi : function(req, res, next){
        var now = new Date();
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        if(dd<10) { dd='0'+dd }
        if(mm<10) { mm='0'+mm }
        today = yyyy+'-'+mm+'-'+dd;

        models.Pembayaran.create({
            status : 0,
            tanggal : today,
            waktu_daftar : now.getHours()+":"+now.getMinutes()+":"+now.getSeconds(),
            PasienId : req.body.idPasien,
            PoliklinikId : req.body.idPoliklinik
        }).then(function() {
            res.redirect('/reservasi');
        });
        //jika menggunakan saldo
        //models.Pasien.find({
        //    attributes: ['saldo'],
        //    where: {
        //        id : req.body.idPasien
        //    }
        //}).then(function(saldo) {
        //    models.Pasien.update({
        //        saldo : saldo.saldo - 120000
        //    },{
        //        where: { id : req.body.idPasien }
        //    }).then(function() {
        //        models.Antrian_Pemeriksaan.create({
        //            status : 0,
        //            tanggal : today,
        //            waktu_daftar : now.getHours()+":"+now.getMinutes()+":"+now.getSeconds(),
        //            PasienId : req.body.idPasien,
        //            PoliklinikId : req.body.idPoliklinik
        //        }).then(function() {
        //            res.redirect('/reservasi');
        //        });
    },

    menampilkanFormReservasi : function(req, res, next){
        models.Poliklinik.findAll()
            .then(function(poliklinik) {
                res.render('reservasi',{
                    poliklinik : poliklinik
                })
            })
    }
};