var models  = require('../models');
var express = require('express');
var router  = express.Router();
var async = require('async');

router.get('/', function(req, res) {
    models.Poliklinik.findAll().then(function(poliklinik) {
        res.render('index.jade',{
            poliklinik : poliklinik
        })
    })
});

router.get('/pendaftaran', function(req, res) {
    models.Poliklinik.findAll()
        .then(function(poliklinik) {
            res.render('pendaftaran.jade',{
                poliklinik : poliklinik
            })
        })
});

router.post('/tambahpendaftaran', function(req, res) {
    var now = new Date();
    models.Pembayaran.create({
        //pasien ID dan poliklinik ID tidak didaftarkan di model pembayaran karena sudah digenerate
        // gimana cara menginputkan id  pasien dan id poliklinik
        status : 0,
        tanggal : now.getFullYear()+"-"+(now.getMonth()+1)+"-"+(now.getDay()+8),
        waktu_daftar : now.getHours()+":"+now.getMinutes()+":"+now.getSeconds(),
        PasienId : req.body.idPasien,
        PoliklinikId : req.body.idPoliklinik
    }).then(function() {
        res.redirect('/pendaftaran');
    });
});

router.get('/getpasien/:idPasien', function(req, res) {
    models.Pasien.findAll({
        attributes: ['nama'],
        where: {
            id : req.params.idPasien
        }
    }).then(function(namaPasien) {
        res.send(namaPasien[0].nama)
    });
});

router.get('/kasir', function(req, res) {
    models.Pembayaran.findAll({
        include: [ models.Pasien, models.Poliklinik]
    }).then(function(antrianPembayaran) {
        res.render('kasir.jade',{
            antrianPembayaran : antrianPembayaran
        })
    });
});

router.get('/antrianpembayaran', function(req, res) {
    async.series([
            function(callback){
                models.Pembayaran.findAll({
                    where : {
                        status : {
                            $ne : 1
                        }
                    },
                    include: [models.Pasien],
                    attributes: ['Pasien.nama'],
                    order : 'waktu_daftar'
                }).then(function(antrian) {
                    callback(null,antrian);
                })
            },
            function(callback){
                models.Pembayaran.find({
                    where : {
                        status : 1
                    },
                    include: [models.Pasien],
                    attributes: ['Pasien.nama']
                }).then(function(pasien) {
                    callback(null,pasien);
                })
            }
        ],
        function(err,result){
            res.render('antrian_pembayaran.jade',{
                sedangMembayar : result[1],
                antrianPembayaran : result[0]
            })
        }
    )
});

router.get('/antrianpemeriksaan/:id', function(req, res) {
    //status 0=menunggu,1=selesai
    async.series([
            function(callback){
                models.Antrian_Pemeriksaan.findAll({
                    where : {
                        $and : [
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
            res.render('antrian_pemeriksaan.jade',{
                antrian : result[0],
                poliklinik : result[1]
            })
        }
    )
});

//versi yang masih ada status 'sedang-diperiksa'

//router.get('/antrianpemeriksaan/:id', function(req, res) {
//    //tampilan urutan pasien diatur berdasarkan poliklinik
//    //status 0=menunggu,1=sedang-diperiksa,2=selesai
//    async.series([
//            function(callback){
//                models.Antrian_Pemeriksaan.findAll({
//                    where : {
//                        $and : [
//                            { status : {$ne :  2} },
//                            { poliklinikId : req.params.id }
//                        ]
//                    },
//                    include: [models.Pasien],
//                    attributes: ['Pasien.nama'],
//                    order : 'waktu_daftar'
//                }).then(function(antrian) {
//                    if(antrian){
//                        callback(null,antrian);
//                    }else{
//                        callback(null,{'Pasien':{'nama':'kosong'}});
//                    }
//                })
//            },
//            function(callback){
//                models.Antrian_Pemeriksaan.find({
//                    where : {
//                        $and : [
//                            { status : 1 },
//                            { poliklinikId : req.params.id }
//                        ]
//                    },
//                    include: [models.Pasien],
//                    attributes: ['Pasien.nama']
//                }).then(function(pasien) {
//                    if(pasien){
//                        callback(null,pasien);
//                    }else{
//                        callback(null,{'Pasien':{'nama':'kosong'}});
//                    }
//                })
//            }
//            ,function(callback){
//                models.Poliklinik.find({
//                    where : {id : req.params.id}
//                }).then(function(antrian) {
//                    callback(null,antrian);
//                })
//            }
//        ],
//        function(err,result){
//            res.render('antrian_pemeriksaan.jade',{
//                sedangDiperiksa : result[1],
//                antrian : result[0],
//                poliklinik : result[2]
//            })
//        }
//    )
//});


router.get('/suster/:id', function(req, res) {
    //status 0=menunggu,1=selesai
    async.series([
            function(callback){
                models.Antrian_Pemeriksaan.findAll({
                    where : {
                        $and : [
                            { status : {$ne :  1} },
                            { poliklinikId : req.params.id }
                        ]
                    },
                    include: [models.Pasien],
                    attributes: ['id','Pasien.nama'],
                    order : 'waktu_daftar'
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
            res.render('suster.jade',{
                antrian : result[0],
                poliklinik : result[1],
                idpoliklinik : req.params.id
            })
        }
    )
});

router.get('/suster/:idAntrian/selesai/:idPoliklinik', function(req, res) {
    //mengubah status yang sedang diperiksa atau menunggu menjadi berhenti mengantri
    models.Antrian_Pemeriksaan.update({
        status : '1'
    },{
        where: { id : req.params.idAntrian }
    }).then(function() {
        res.redirect('/suster/'+req.params.idPoliklinik);
    });
});

router.get('/suster/:idAntrian/langkahi', function(req, res) {
    //dilangkahi ga usah pake status, langsung aja..
    // pasien yang dilangkahi, ditambahi 1 detik waktu pasien urutan ke 3
    //waktu-daftar pasien dilangkahi = (select waktu_daftar pasien ke3) + 1 detik
    models.Antrian_Pemeriksaan.destroy({
        where: { id : req.params.idAntrian }
    }).then(function() {
        res.redirect('/suster');
    });
});

module.exports = router;
