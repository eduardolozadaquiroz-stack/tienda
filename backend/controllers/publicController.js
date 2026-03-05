var Producto = require('../models/producto');
var Variedad = require('../models/variedad');
var Categoria = require('../models/categoria');
var Subcategoria = require('../models/subcategoria');
var Galeria = require('../models/galeria');
var Review = require('../models/review');

const obtener_nuevos_productos = async function(req,res){
    try {
        var productos = await Producto.find({ estado: { $in: [true, 'true'] } }).sort({createdAt:-1}).limit(4);
        res.status(200).send(productos);
    } catch(e) { res.status(500).send({ message: 'Error interno.' }); }
}

const obtener_productos_recomendados = async function(req,res){
    try {
        var productos = await Producto.find({ estado: { $in: [true, 'true'] } }).limit(8);
        res.status(200).send(productos);
    } catch(e) { res.status(500).send({ message: 'Error interno.' }); }
}

const obtener_productos_shop = async function(req,res){
    try {
        var data_productos = [];
        var productos = await Producto.find({ estado: { $in: [true, 'true'] } }).sort({createdAt:-1});
        for(var item of productos){
            var variedades = await Variedad.find({producto: item._id});
            data_productos.push({
                titulo : item.titulo,
                slug : item.slug,
                categoria : item.categoria,
                subcategoria : item.subcategoria,
                precio : item.precio,
                extracto : item.extracto,
                portada : item.portada,
                str_variedad : item.str_variedad,
                estado : item.estado,
                descuento : item.descuento,
                createdAt: item.createdAt,
                variedades
            });
        }
        res.status(200).send(data_productos);
    } catch(e) { res.status(500).send({ message: 'Error interno.' }); }
}

const listar_categorias_public = async function(req,res){
    try {
        var regs = await Categoria.find({estado:true}).sort({titulo:1});
        var categorias = [];
        for(var item of regs){
            var subcategorias = await Subcategoria.find({categoria:item._id});
            var productos = await Producto.find({categoria:item.titulo});
            categorias.push({
                categoria: item,
                subcategorias,
                nproductos: productos.length
            });
        }
        res.status(200).send(categorias);
    } catch(e) { res.status(500).send({ message: 'Error interno.' }); }
}

const obtener_producto_slug = async function(req,res){
    try {
        var slug = req.params['slug'];
        var producto = await Producto.findOne({slug:slug});
        if (!producto) return res.status(404).send({ message: 'Producto no encontrado.' });
        var variedades = await Variedad.find({producto:producto._id});
        var galeria = await Galeria.find({producto:producto._id});
        res.status(200).send({producto, variedades, galeria});
    } catch(e) { res.status(500).send({ message: 'Error interno.' }); }
}

const obtener_producto_categoria = async function(req,res){
    try {
        var categoria = req.params['categoria'];
        var productos = await Producto.find({categoria:categoria}).limit(6);
        res.status(200).send({productos});
    } catch(e) { res.status(500).send({ message: 'Error interno.' }); }
}

const obtener_reviews_producto = async function(req,res){
    try {
        var id = req.params['id'];
        var reviews = await Review.find({producto:id}).populate('cliente');
        res.status(200).send(reviews);
    } catch(e) { res.status(500).send({ message: 'Error interno.' }); }
}

module.exports = {
    obtener_nuevos_productos,
    obtener_productos_recomendados,
    obtener_productos_shop,
    listar_categorias_public,
    obtener_producto_slug,
    obtener_producto_categoria,
    obtener_reviews_producto
}