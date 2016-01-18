/**
 * Created by riansyahPC on 11/26/2015.
 */
var models  = require('../models');
var async  = require('async');
module.exports = {

    registerRoutes: function(app) {
        app.get('/antrianpemeriksaan/:id', this.menampilkanAntrianPemeriksaanPasien);
        app.get('/kelolaantrian/:id', this.menampilkanAntrianPemeriksaanSuster);
        app.get('/kelolaantrian/:idAntrian/selesai/:idPoliklinik', this.mengubahStatusAntrian);
        app.get('/kelolaantrian/:idAntrian/langkahi/:idPoliklinik', this.melangkahiAntrian);
    },

    menampilkanAntrianPemeriksaanPasien : function(req, res, next){
        //status 0=menunggu,1=selesai
        async.series([
                function(callback){
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //pada javascript January adalah 0!
                    var yyyy = today.getFullYear();

                    if(dd<10) { dd='0'+dd }
                    if(mm<10) { mm='0'+mm }
                    today = yyyy+'-'+mm+'-'+dd;

                    models.Antrian_Pemeriksaan.findAll({
                        where : {
                            $and : [
                                { tanggal : today},
                                { status : {$ne :  1} },
                                { poliklinikId : req.params.id }
                            ]
                        },
                        include: [models.Pasien],
                        attributes: ['Pasien.nama'],
                        order : 'waktu_daftar'
                    }).then(function(antrian) {
                        if(antrian){
                            callback(null,antrian);
                        }else{
                            callback(null,{'Pasien':{'nama':'kosong'}});
                        }
                    })
                }
                ,function(callback){
                    models.Poliklinik.find({
                        where : {id : req.params.id}
                    }).then(function(antrian) {
                        callback(null,antrian);
                    })
                }
            ],
            function(err,result){
                res.render('antrianPemeriksaan',{
                    antrian : result[0],
                    poliklinik : result[1]
                })
            }
        )
    },
    menampilkanAntrianPemeriksaanSuster : function(req, res, next){
        //status 0=menunggu,1=selesai
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();

        if(dd<10) { dd='0'+dd }
        if(mm<10) { mm='0'+mm }
        today = yyyy+'-'+mm+'-'+dd;

        async.series([
                function(callback){
                    models.Antrian_Pemeriksaan.findAll({
                        where : {
                            $and : [
                                { poliklinikId : req.params.id }, { tanggal : today }
                            ]
                        },
                        include: [models.Pasien],
                        //attributes: ['id','Pasien.nama','Antrian_pemeriksaan.status'],
                        //order : '`Pembayaran`.`status` ASC, `Pembayaran`.`waktu_daftar` ASC',
                        order : 'status ASC, waktu_daftar ASC'
                    }).then(function(antrian) {
                        if(antrian){
                            callback(null,antrian);
                        }else{
                            callback(null,{'Pasien':{'nama':'kosong'}});
                        }
                    })
                },function(callback){
                    models.Poliklinik.find({
                        where : {id : req.params.id}
                    }).then(function(antrian) {
                        callback(null,antrian);
                    })
                }
            ],
            function(err,result){
                res.render('kelolaantrian',{
                    antrian : result[0],
                    poliklinik : result[1],
                    idpoliklinik : req.params.id
                })
            }
        )
    },
    mengubahStatusAntrian : function(req, res, next){
        //mengubah status yang menunggu menjadi berhenti mengantri
        models.Antrian_Pemeriksaan.update({
            status : '1'
        },{
            where: { id : req.params.idAntrian }
        }).then(function() {
            res.redirect('/kelolaantrian/'+req.params.idPoliklinik);
        });
    },
    melangkahiAntrian : function(req, res, next){
        //dilangkahi ga usah pake status, langsung aja..
        //yang terlambat memeriksa langsung di geser urutan terakhir(waktu_daftar nya diupdate)
        var now = new Date();
        models.Antrian_Pemeriksaan.update({
            waktu_daftar : now.getHours()+":"+now.getMinutes()+":"+now.getSeconds()
        },{
            where: { id : req.params.idAntrian }
        }).then(function() {
            res.redirect('/kelolaantrian/'+req.params.idPoliklinik);
        });
    }
};