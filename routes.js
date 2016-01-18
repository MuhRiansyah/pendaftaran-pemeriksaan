var antrianPemeriksaanController = require('./controllers/antrianPemeriksaanController.js');
var antrianPembayaranController = require('./controllers/antrianPembayaranController.js');
var reservasiController = require('./controllers/reservasiController.js');
var models  = require('./models');

module.exports = function(app){
	antrianPemeriksaanController.registerRoutes(app);
	antrianPembayaranController.registerRoutes(app);
	reservasiController.registerRoutes(app);

	app.get('/', function(req, res) {
		models.Poliklinik.findAll().then(function(poliklinik) {
			res.render('index',{
				poliklinik : poliklinik
			})
		})
	});

	app.get('/getpasien/:idPasien', function(req, res) {
		models.Pasien.find({
			attributes: ['nama'],
			where: {
				id : req.params.idPasien
			}
		}).then(function(pasien) {
			res.send(pasien)
		});
	});



};
//function checkAuth(req, res, next) {
//	if (!req.session.loggedin) {
//		res.send('kamu tidak dapat mengakses halaman ini kembali ke <a href="/">halaman login</a>');
//	} else {
//		next();
//	}
//};
