var models  = require('../models');
var express = require('express');
var router  = express.Router();
var async = require('async');



router.get('/pendaftaran', function(req, res) {
  async.parallel([
        function(callback){
          models.Poliklinik.findAll({attributes: ['id_poliklinik','nama']})
              .then(function(poliklinik) {
                callback(null,poliklinik);
              })
        },
        function(callback){
          models.Pasien.findAll({attributes: ['id_pasien','nama']})
              .then(function(pasien) {
                callback(null,pasien);
              })
        }
      ],
      function(err,result){
        var idPasien = [];
        for(val in result[1]){
          idPasien[val] = ''+result[1][val].id_pasien+'';
        }
        res.render('pendaftaran.jade',{
          poliklinik : result[0],
          idPasien : JSON.stringify(idPasien)
        })
      }
  )
});

router.get('/getpasien/:idPasien', function(req, res) {
    models.Pasien.findAll({
        attributes: ['nama'],
        where: {
            id_pasien : req.params.idPasien
        }
    }).then(function(namaPasien) {
        res.send(namaPasien[0].nama)
    });
});
//router.get('/', function(req, res) {
//    models.User.findAll({
//        include: [ models.Task ]
//    }).then(function(users) {
//        res.render('index', {
//            title: 'Express',
//            users: users
//        });
//    });
//});

router.get('/kasir', function(req, res) {
    //models.Pembayaran.findAll({
    //    include: [ models.Pasien ]
    //    //attributes: ['id_pembayaran', 'no_urut','id_pasien',
    //    //    'id_poliklinik','status','tanggal'
    //    //]
    //}).then(function(antrianPembayaran) {
    //    res.render('kasir.jade',{
    //        antrianPembayaran : antrianPembayaran
    //    })
    //});
    models.getPembayarans().then(function(antrianPembayaran) {
        res.render('kasir.jade',{
            antrianPembayaran : antrianPembayaran
        })
    });

});

router.get('/antrianpembayaran', function(req, res) {
  models.Antrian.findAll({
    attributes: ['no_urut', 'pasien','poliklinik']
  }).then(function(antrian) {
    res.render('antrian_pembayaran.jade',{
      antrian : antrian
    })
  });
});

router.get('/antrianpemeriksaan', function(req, res) {
  models.Antrian.findAll({
      attributes: ['no_urut', 'pasien','poliklinik']
  }).then(function(antrian) {
      res.render('antrian_pemeriksaan.jade',{
        antrian : antrian
      })
  });
});


router.get('/suster', function(req, res) {
  models.Antrian.findAll({
    attributes: ['no_urut', 'pasien','poliklinik']
  }).then(function(antrian) {
    res.render('suster.jade',{
      antrian : antrian
    })
  });
});

router.get('/suster/:no_urut/hapus', function(req, res) {
  models.Antrian.destroy({
    where: {
      no_urut : req.params.no_urut
    }
  }).then(function() {
    res.redirect('/suster');
  });
});

module.exports = router;
