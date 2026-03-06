var express = require('express');
var productoController = require('../controllers/productoController');
var authenticate = require('../middlewares/authenticate');
var multer = require('multer');

// Usamos memoryStorage: las imágenes se suben a Cloudinary desde el buffer en memoria
var uploadProducto = multer({ storage: multer.memoryStorage() });
var uploadFactura  = multer({ storage: multer.memoryStorage() });
var uploadGaleria  = multer({ storage: multer.memoryStorage() });

var api = express.Router();

api.post('/registro_producto_admin', authenticate.decodeToken, uploadProducto.fields([{name:'portada', maxCount:1}]), productoController.registro_producto_admin);
api.get('/listar_productos_admin/:filtro?', authenticate.decodeToken, productoController.listar_productos_admin);
api.get('/listar_activos_productos_admin', authenticate.decodeToken, productoController.listar_activos_productos_admin);

api.get('/obtener_portada_producto/:img', productoController.obtener_portada_producto);
api.get('/obtener_producto_admin/:id', authenticate.decodeToken, productoController.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id', authenticate.decodeToken, uploadProducto.fields([{name:'portada', maxCount:1}]), productoController.actualizar_producto_admin);

////////////////////////////////////////////////////////////////////////////////////////////////////////////

api.post('/registro_variedad_producto', authenticate.decodeToken, productoController.registro_variedad_producto);
api.get('/obtener_variedades_producto/:id', authenticate.decodeToken, productoController.obtener_variedades_producto);
api.delete('/eliminar_variedad_producto/:id', authenticate.decodeToken, productoController.eliminar_variedad_producto);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

api.post('/registro_ingreso_admin', authenticate.decodeToken, uploadFactura.fields([{name:'documento', maxCount:1}]), productoController.registro_ingreso_admin);
api.get('/obtener_ingresos_admin/:inicio/:hasta', authenticate.decodeToken, productoController.obtener_ingresos_admin);
api.get('/obtener_comprobante_ingreso/:name', productoController.obtener_comprobante_ingreso);
api.get('/obtener_detalles_ingreso_admin/:id', authenticate.decodeToken, productoController.obtener_detalles_ingreso_admin);
///////////////////////////////////////////////////////////////////////////////////////////////////////////
api.post('/subir_imagen_producto_admin', authenticate.decodeToken, uploadGaleria.fields([{name:'imagen', maxCount:1}]), productoController.subir_imagen_producto_admin);
api.get('/obtener_galeria_producto/:img', productoController.obtener_galeria_producto);
api.get('/obtener_galeria_producto_admin/:id', authenticate.decodeToken, productoController.obtener_galeria_producto_admin);
api.delete('/eliminar_galeria_producto_admin/:id', authenticate.decodeToken, productoController.eliminar_galeria_producto_admin);


///////////////////////////////////////////////////////////////////////////////////////////////////////////
api.post('/crear_categoria_admin', authenticate.decodeToken, productoController.crear_categoria_admin);
api.get('/listar_categorias_admin', authenticate.decodeToken, productoController.listar_categorias_admin);
api.post('/crear_subcategoria_admin', authenticate.decodeToken, productoController.crear_subcategoria_admin);
api.delete('/eliminar_subcategoria_admin/:id', authenticate.decodeToken, productoController.eliminar_subcategoria_admin);
api.put('/cambiar_estado_producto_admin/:id', authenticate.decodeToken, productoController.cambiar_estado_producto_admin);
api.delete('/eliminar_producto_admin/:id', authenticate.decodeToken, productoController.eliminar_producto_admin);

module.exports = api;