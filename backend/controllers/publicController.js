var Producto = require('../models/producto');
var Variedad = require('../models/variedad');
var Categoria = require('../models/categoria');
var Subcategoria = require('../models/subcategoria');
var Galeria = require('../models/galeria');
var Review = require('../models/review');
var Venta_detalle = require('../models/venta_detalle');

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

/**
 * GET /sugerencias_producto/:id
 * Devuelve hasta 6 productos sugeridos basados en co-compras:
 * "Clientes que compraron este producto también compraron..."
 * Si no hay historial de ventas, regresa productos de la misma categoría.
 */
const sugerencias_producto = async function(req, res) {
    try {
        const productoId = req.params['id'];
        const producto = await Producto.findById(productoId).lean();
        if (!producto) return res.status(404).send({ message: 'Producto no encontrado.' });

        // 1. Encontrar todas las ventas que incluyen este producto
        const detallesConEsteProducto = await Venta_detalle.find({ producto: productoId }).select('venta').lean();
        const ventaIds = [...new Set(detallesConEsteProducto.map(d => String(d.venta)))];

        let sugeridos = [];

        if (ventaIds.length > 0) {
            // 2. En esas mismas ventas, buscar otros productos comprados juntos
            const coCompras = await Venta_detalle.find({
                venta: { $in: ventaIds },
                producto: { $ne: productoId }
            }).select('producto').lean();

            // 3. Contar frecuencia de aparición de cada producto
            const frecuencia = {};
            for (const d of coCompras) {
                const pid = String(d.producto);
                frecuencia[pid] = (frecuencia[pid] || 0) + 1;
            }

            // 4. Ordenar por frecuencia y tomar los top 6
            const topIds = Object.entries(frecuencia)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(e => e[0]);

            if (topIds.length > 0) {
                sugeridos = await Producto.find({
                    _id: { $in: topIds },
                    estado: { $in: [true, 'true'] }
                }).lean();
                // Preservar el orden de frecuencia
                sugeridos.sort((a, b) => topIds.indexOf(String(a._id)) - topIds.indexOf(String(b._id)));
            }
        }

        // 5. Fallback: si hay menos de 4 sugerencias, rellenar con populares de la misma categoría
        if (sugeridos.length < 4) {
            const existingIds = sugeridos.map(p => String(p._id));
            existingIds.push(productoId);
            const fallback = await Producto.find({
                _id: { $nin: existingIds },
                categoria: producto.categoria,
                estado: { $in: [true, 'true'] }
            }).sort({ stock: -1 }).limit(6 - sugeridos.length).lean();
            sugeridos = [...sugeridos, ...fallback];
        }

        res.status(200).send({
            sugeridos,
            tipo: ventaIds.length > 0 ? 'co_compra' : 'categoria'
        });
    } catch(e) { res.status(500).send({ message: 'Error interno.' }); }
}

const sitemap_productos = async function(req, res) {
    try {
        const productos = await Producto.find({ estado: { $in: [true, 'true'] } }).select('slug updatedAt').lean();
        const BASE = process.env.STORE_URL || 'https://oversizemx.pages.dev';
        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        for (const p of productos) {
            const lastmod = p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : '';
            xml += `<url><loc>${BASE}/producto/${p.slug}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}<changefreq>weekly</changefreq><priority>0.8</priority></url>`;
        }
        xml += '</urlset>';
        res.header('Content-Type', 'application/xml').send(xml);
    } catch(e) { res.status(500).send({ message: 'Error interno.' }); }
}

module.exports = {
    obtener_nuevos_productos,
    obtener_productos_recomendados,
    obtener_productos_shop,
    listar_categorias_public,
    obtener_producto_slug,
    obtener_producto_categoria,
    obtener_reviews_producto,
    sugerencias_producto,
    sitemap_productos
}