/**
 * Created by riansyahPC on 11/26/2015.
 */
var models  = require('../models');
module.exports = {

    registerRoutes: function(app) {
        app.get('/antrianpembayaran', this.menampilkanAntrianPembayaranPasien);
        app.get('/kelolapembayaran', this.menampilkanAntrianPembayaranKasir);
        app.post('/getantribayar', this.menampilkanAntrianPembayaranByTanggal);
        app.get('/kelolapembayaran/:idAntrian/:idPasien/:idPoliklinik/lunas/', this.mengubahStatusAntrian);
        app.get('/kelolapembayaran/:idAntrian/langkahi/', this.melangkahiAntrian);
    },

    menampilkanAntrianPembayaranByTanggal : function(req, res, next){
        var today = req.body.tanggal;        
        models.Pembayaran.findAll({
            include: [ models.Pasien, models.Poliklinik],
            order : '`Pembayaran`.`status` ASC, `Pembayaran`.`waktu_daftar` ASC',
            where: { tanggal : today }
        }).then(function(antrianPembayaran) {
            res.render('kelolaPembayaran',{
                antrianPembayaran : antrianPembayaran,
                hari_ini : today
            })
        });
    },
    menampilkanAntrianPembayaranPasien : function(req, res, next){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();

        if(dd<10) { dd='0'+dd }
        if(mm<10) { mm='0'+mm }
        today = yyyy+'-'+mm+'-'+dd;

        models.Pembayaran.findAll({
            where : {
                $and : [
                    { status : {$ne :  1} }, { tanggal : today }
                ]
            },
            include: [models.Pasien],
            attributes: ['Pasien.nama'],
            order : 'waktu_daftar'
        }).then(function(antrian) {
            res.render('antrianPembayaran',{
                antrianPembayaran : antrian
            })
        })
    },
    menampilkanAntrianPembayaranKasir : function(req, res, next){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //pada javascript January adalah 0!
        var yyyy = today.getFullYear();

        if(dd<10) { dd='0'+dd }
        if(mm<10) { mm='0'+mm }
        today = yyyy+'-'+mm+'-'+dd;

        models.Pembayaran.findAll({
            include: [ models.Pasien, models.Poliklinik],
            order : '`Pembayaran`.`status` ASC, `Pembayaran`.`waktu_daftar` ASC',
            where: { tanggal : today }
        }).then(function(antrianPembayaran) {
            res.render('kelolaPembayaran',{
                antrianPembayaran : antrianPembayaran,
                hari_ini : today
            })
        });
    },
    mengubahStatusAntrian : function(req, res, next){
        //mengubah status yang menunggu menjadi berhenti mengantri
        models.Pembayaran.update({
            status : '1'
        },{
            where: { id : req.params.idAntrian }
        }).then(function() {
            var now = new Date();
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();

            if(dd<10) { dd='0'+dd }
            if(mm<10) { mm='0'+mm }
            today = yyyy+'-'+mm+'-'+dd;
            models.Antrian_Pemeriksaan.create({
                status : 0,
                tanggal : today,
                waktu_daftar : now.getHours()+":"+now.getMinutes()+":"+now.getSeconds(),
                PasienId : req.params.idPasien,
                PoliklinikId : req.params.idPoliklinik
            }).then(function() {
                res.redirect('/kelolapembayaran');
            });
        });
    },
    melangkahiAntrian : function(req, res, next){
        //mengubah waktu_daftar pasien yang dilangkahi menjadi waktu terbaru
        var now = new Date();
        models.Pembayaran.update({
            waktu_daftar : now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()
        },{
            where: { id : req.params.idAntrian }
        }).then(function() {
            res.redirect('/kelolapembayaran');
        });

    }
};