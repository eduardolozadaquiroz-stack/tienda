var Producto = require('../models/producto');
var Categoria = require('../models/categoria');
var Subcategoria = require('../models/subcategoria');
var Galeria = require('../models/galeria');
var Variedad = require('../models/variedad');
var Ingreso = require('../models/ingreso');
var Ingreso_detalle = require('../models/ingreso_detalle');
var slugify = require('slugify');
var fs = require('fs');
var path = require('path');
var cloudinaryHelper = require('../helpers/cloudinary');
var logger = require('../helpers/logger');

// OWASP #3: escapar caracteres especiales de RegExp
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const registro_producto_admin = async function(req,res){
    if(req.user){
        let data = req.body;
        let productos = await Producto.find({titulo:data.titulo});

        if(productos.length>= 1){
            res.status(200).send({data:undefined,message: 'El titulo del producto ya existe.'});   
        }else{
            //REGISTRO PRODUCTO
            let uploadResult;
            try {
                uploadResult = await cloudinaryHelper.uploadBuffer(req.files['portada'][0].buffer, 'productos');
            } catch (cloudErr) {
                logger.error('CLOUDINARY_ERROR', { error: cloudErr.message });
                return res.status(500).send({ data: undefined, message: 'No se pudo subir la imagen. Verifica las credenciales de Cloudinary.' });
            }
            var str_portada = uploadResult.secure_url;

            ///

            data.portada = str_portada;
            data.slug = slugify(data.titulo);
            data.estado   = data.estado   === 'true' || data.estado   === true;
            data.descuento = data.descuento === 'true' || data.descuento === true;
            data.personalizable = data.personalizable === 'true' || data.personalizable === true;
            
            try {
                let producto = await Producto.create(data);
                res.status(200).send({data:producto});
            } catch (error) {
                res.status(500).send({data:undefined,message: 'No se pudo registrar el producto.'});   
            }
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const listar_productos_admin = async function(req,res){
    if(req.user){

        let filtro = req.params['filtro'] || '';
        // OWASP #3: escapar input antes de usarlo en RegExp
        const safeFilter = escapeRegex(filtro.trim());

        let productos = await Producto.find({
            $or: [
                {titulo: new RegExp(safeFilter,'i')},
                {categoria: new RegExp(safeFilter,'i')}
            ]
        }).sort({createdAt:-1});
        res.status(200).send(productos);

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

// OWASP #10 (SSRF): solo permitir redirecciones a dominios confiables
const ALLOWED_REDIRECT_HOSTS = ['res.cloudinary.com', 'cloudinary.com'];

function safeRedirect(res, rawUrl) {
    try {
        const decoded = decodeURIComponent(rawUrl);
        const parsed = new URL(decoded);
        if (!ALLOWED_REDIRECT_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h))) {
            return res.status(400).send({ message: 'URL no permitida.' });
        }
        return res.redirect(302, decoded);
    } catch (_) {
        return res.status(400).send({ message: 'URL no válida.' });
    }
}

const obtener_portada_producto = async function(req,res){
    let img = req.params['img'];

    // OWASP #10: usar safeRedirect en lugar de redirect directo
    if (img && img.startsWith('http')) {
        return safeRedirect(res, img);
    }

    // OWASP #5: evitar path traversal en archivos locales
    const safeName = path.basename(img);
    fs.stat('./uploads/productos/' + safeName, function(err){
        if(err){
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/productos/' + safeName;
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}


const obtener_producto_admin = async function(req,res){
    if(req.user){

        let id = req.params['id'];

        try {
            let producto = await Producto.findById({_id: id});
       
            res.status(200).send(producto);
        } catch (error) {
            res.status(200).send(undefined);
        }

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const actualizar_producto_admin = async function(req,res){
    if(req.user){
        let data = req.body;
        let id = req.params['id'];


        let productos = await Producto.find({titulo:data.titulo});

        if(productos.length>= 1){
            if(productos[0]._id == id){
                if(req.files && req.files['portada']){
                    //REGISTRO PRODUCTO
                    let uploadResult1;
                    try {
                        uploadResult1 = await cloudinaryHelper.uploadBuffer(req.files['portada'][0].buffer, 'productos');
                    } catch (cloudErr) {
                        logger.error('CLOUDINARY_ERROR', { error: cloudErr.message });
                        return res.status(500).send({ data: undefined, message: 'No se pudo subir la imagen. Verifica las credenciales de Cloudinary.' });
                    }
                    var str_portada = uploadResult1.secure_url;
    
                    ///
    
                    data.portada = str_portada;
                    data.slug = slugify(data.titulo);
                    
                    try {
                        let producto = await Producto.findByIdAndUpdate({_id:id},{
                            titulo: data.titulo,
                            categoria:data.categoria,
                            subcategoria:data.subcategoria,
                            extracto: data.extracto,
                            estado: data.estado === 'true' || data.estado === true,
                            str_variedad: data.str_variedad,
                            descuento: data.descuento === 'true' || data.descuento === true,
                            personalizable: data.personalizable === 'true' || data.personalizable === true,
                            portada: data.portada,
                            precio: Number(data.precio) || 0,
                        });
                        res.status(200).send({data:producto});
                    } catch (error) {
                        res.status(200).send({data:undefined,message: 'No se pudo crear el producto.'});   
                    }
                }else{
    
                     data.slug = slugify(data.titulo);
                     
                     try {
                         let producto = await Producto.findByIdAndUpdate({_id:id},{
                             titulo: data.titulo,
                             categoria:data.categoria,
                             subcategoria:data.subcategoria,
                             extracto: data.extracto,
                             estado: data.estado === 'true' || data.estado === true,
                             str_variedad: data.str_variedad,
                             descuento: data.descuento === 'true' || data.descuento === true,
                             personalizable: data.personalizable === 'true' || data.personalizable === true,
                             precio: Number(data.precio) || 0,
                         });
                         res.status(200).send({data:producto});
                     } catch (error) {
                         res.status(200).send({data:undefined,message: 'No se pudo crear el producto.'});   
                     }
                }
            }else{
                res.status(200).send({data:undefined,message: 'El titulo de producto ya existe.'});   
            }
        }else{
            if(req.files && req.files['portada']){
                //REGISTRO PRODUCTO
                let uploadResult2;
                try {
                    uploadResult2 = await cloudinaryHelper.uploadBuffer(req.files['portada'][0].buffer, 'productos');
                } catch (cloudErr) {
                    logger.error('CLOUDINARY_ERROR', { error: cloudErr.message });
                    return res.status(500).send({ data: undefined, message: 'No se pudo subir la imagen. Verifica las credenciales de Cloudinary.' });
                }
                var str_portada = uploadResult2.secure_url;

                ///

                data.portada = str_portada;
                data.slug = slugify(data.titulo);
                
                try {
                    let producto = await Producto.findByIdAndUpdate({_id:id},{
                        titulo: data.titulo,
                        categoria:data.categoria,
                        subcategoria:data.subcategoria,
                        extracto: data.extracto,
                        estado: data.estado === 'true' || data.estado === true,
                        str_variedad: data.str_variedad,
                        descuento: data.descuento === 'true' || data.descuento === true,
                        personalizable: data.personalizable === 'true' || data.personalizable === true,
                        portada: data.portada,
                        precio: Number(data.precio) || 0,
                    });
                    res.status(200).send({data:producto});
                } catch (error) {
                    res.status(200).send({data:undefined,message: 'No se pudo crear el producto.'});   
                }
            }else{

                 data.slug = slugify(data.titulo);
                 
                 try {
                     let producto = await Producto.findByIdAndUpdate({_id:id},{
                         titulo: data.titulo,
                         categoria:data.categoria,
                         subcategoria:data.subcategoria,
                         extracto: data.extracto,
                         estado: data.estado === 'true' || data.estado === true,
                         str_variedad: data.str_variedad,
                         descuento: data.descuento === 'true' || data.descuento === true,
                         personalizable: data.personalizable === 'true' || data.personalizable === true,
                         precio: Number(data.precio) || 0,
                     });
                     res.status(200).send({data:producto});
                 } catch (error) {
                     res.status(200).send({data:undefined,message: 'No se pudo crear el producto.'});   
                 }
            }
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const registro_variedad_producto = async (req,res)=>{
    if(req.user){

       let data = req.body;

       let variedad = await Variedad.create(data);
       res.status(200).send({data:variedad});

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}


const obtener_variedades_producto = async function(req,res){
    if(req.user){

       let id = req.params['id'];
       let variedades = await Variedad.find({producto:id}).sort({stock:-1});
       res.status(200).send(variedades);

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const eliminar_variedad_producto = async function(req,res){
    if(req.user){
       let id = req.params['id'];
       let variedad = await Variedad.findOneAndRemove({_id:id});

       // Descontar el stock de la variedad del producto padre
       if(variedad && variedad.producto && variedad.stock > 0){
           let producto = await Producto.findById(variedad.producto);
           if(producto){
               let nuevo_stock = parseInt(producto.stock) - parseInt(variedad.stock);
               await Producto.findByIdAndUpdate(variedad.producto, {
                   stock: nuevo_stock < 0 ? 0 : nuevo_stock
               });
           }
       }

       res.status(200).send(variedad);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const listar_activos_productos_admin = async function(req,res){
    if(req.user){

        let productos = await Producto.find().sort({createdAt:-1});
        res.status(200).send(productos);

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const registro_ingreso_admin = async function(req,res){
    if(req.user){

        let data = req.body; //ingreso
        try {
            
            let reg_ingresos = await Ingreso.find().sort({createdAt:-1});

            if(reg_ingresos.length == 0){
                data.serie = 1;
            }else{
                data.serie = reg_ingresos[0].serie + 1;
            }

            // OWASP #3: parsear input externo con manejo seguro de errores
            let detalles;
            try {
                detalles = JSON.parse(data.detalles);
                if (!Array.isArray(detalles)) throw new Error('detalles debe ser un arreglo');
            } catch (parseErr) {
                logger.suspiciousInput(req, 'detalles JSON inválido en registro_ingreso_admin');
                return res.status(400).send({ message: 'El campo detalles no es válido.' });
            }

            var uploadDoc = await cloudinaryHelper.uploadBufferAuto(req.files['documento'][0].buffer, 'facturas');
            var str_documento = uploadDoc.secure_url;

            data.documento = str_documento;
            data.usuario = req.user.sub;
            let ingreso = await Ingreso.create(data);

            for(var item of detalles){
                item.ingreso = ingreso._id;
                await Ingreso_detalle.create(item);

                //ACTUALIZAR CANTIDADES
                let variedad = await Variedad.findById({_id: item.variedad});
                await Variedad.findByIdAndUpdate({_id: item.variedad},{
                    stock: parseInt(variedad.stock) + parseInt(item.cantidad)
                });

                let producto = await Producto.findById({_id: item.producto});
                await Producto.findByIdAndUpdate({_id: item.producto},{
                    stock: parseInt(producto.stock) + parseInt(item.cantidad)
                });

                //MARGEN DE GANANCIA
                if(producto.stock >= 1){
                    //
                    let subtotal_residual = producto.precio * producto.stock;
                    let ganancia = Math.ceil((item.precio_unidad * data.ganancia)/100);
                    let subtotal_ingreso = (parseFloat(item.precio_unidad) + parseFloat(ganancia))*item.cantidad;

                    let cantidades = parseInt(producto.stock) + parseInt(item.cantidad);
                    let subtotales = parseFloat(subtotal_residual) + parseFloat(subtotal_ingreso);

                    let precio_equilibro = Math.ceil(subtotales/cantidades);

                    await Producto.findByIdAndUpdate({_id: item.producto},{
                        precio: precio_equilibro
                    });

                }else{
                    let ganancia = Math.ceil((item.precio_unidad * data.ganancia)/100);
                    await Producto.findByIdAndUpdate({_id: item.producto},{
                        precio: parseFloat(item.precio_unidad) + parseFloat(ganancia)
                    });
                }
            }
            res.status(200).send(ingreso);
        } catch (error) {
            res.status(500).send({message: 'No se pudo registrar el ingreso'});
        }



    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const subir_imagen_producto_admin = async function(req,res){
    if(req.user){
        let data = req.body;

        //REGISTRO PRODUCTO
        var uploadImg = await cloudinaryHelper.uploadBuffer(req.files['imagen'][0].buffer, 'galeria');
        var str_imagen = uploadImg.secure_url;

        ///

        data.imagen = str_imagen;
        try {
            let imagen = await Galeria.create(data);
            res.status(200).send(imagen);
        } catch (error) {
            res.status(500).send({data:undefined,message: 'No se pudo subir la imagen.'});   
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_galeria_producto = async function(req,res){
    let img = req.params['img'];

    // OWASP #10: usar safeRedirect
    if (img && img.startsWith('http')) {
        return safeRedirect(res, img);
    }

    // OWASP #5: evitar path traversal
    const safeName = path.basename(img);
    fs.stat('./uploads/galeria/' + safeName, function(err){
        if(err){
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/galeria/' + safeName;
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const obtener_galeria_producto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];

        let galeria = await Galeria.find({producto:id});
        res.status(200).send(galeria);

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}


const eliminar_galeria_producto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];

        try {
            let reg = await Galeria.findById({_id:id});
            if (reg && reg.imagen) {
                if (reg.imagen.startsWith('http')) {
                    await cloudinaryHelper.deleteByUrl(reg.imagen);
                } else {
                    try { fs.unlinkSync('./uploads/galeria/'+reg.imagen); } catch(e){}
                }
            }

            let galeria = await Galeria.findByIdAndRemove({_id:id});
            res.status(200).send(galeria);
        } catch (error) {
            res.status(500).send({data:undefined,message: 'No se pudo eliminar la imagen.'});   
        }


    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}


const crear_categoria_admin = async function(req,res){
    if(req.user){
        let data = req.body;

        try {
            var reg = await Categoria.find({titulo:data.titulo});

            if(reg.length == 0){
                data.slug = slugify(data.titulo).toLowerCase();
                var categoria = await Categoria.create(data);
                res.status(200).send(categoria);
            }else{
                res.status(200).send({data:undefined,message: 'La categoria ya existe.'});   
            }
        } catch (error) {
            res.status(200).send({data:undefined,message: 'Ocurrió un error durante el proceso.'});  
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const listar_categorias_admin = async function(req,res){
    if(req.user){

        var regs = await Categoria.find().sort({titulo:1});
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
    
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const crear_subcategoria_admin = async function(req,res){
    if(req.user){
        let data = req.body;

        var reg = await Subcategoria.find({titulo:data.titulo});

        if(reg.length == 0){
            var subcategoria = await Subcategoria.create(data);
            res.status(200).send(subcategoria);
        }else{
            res.status(200).send({data:undefined,message: 'La subcategoria ya existe.'});   
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}


const eliminar_subcategoria_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];

        var reg = await Subcategoria.findByIdAndRemove({_id:id});
        res.status(200).send(reg);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const cambiar_estado_producto_admin = async function(req,res){
    if(req.user){

        let id = req.params['id'];
        let data = req.body;

        let nuevo_estado = false;

        if(data.estado){
            nuevo_estado = false;
        }else{
            nuevo_estado = true;
        }

        let categoria = await Categoria.findByIdAndUpdate({_id:id},{
            estado: nuevo_estado
        });

        res.status(200).send(categoria);

    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_ingresos_admin = async function(req,res){
    if(req.user){
        let inicio = req.params['inicio'];
        let hasta = req.params['hasta'];

        var ingresos = await Ingreso.find({
            createdAt: {
                $gte: new Date(inicio+'T00:00:00'),
                $lt:  new Date(hasta+'T00:00:00'),
            }
        });
        res.status(200).send(ingresos);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_comprobante_ingreso = async function(req,res){
    let name = req.params['name'];

    if (name && name.startsWith('http')) {
        return res.redirect(302, decodeURIComponent(name));
    }

    fs.stat('./uploads/facturas/'+name,function(err){
        if(err){
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/facturas/'+name;
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const eliminar_producto_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];
        try {
            // Eliminar portada
            let producto = await Producto.findById(id);
            if(!producto) return res.status(404).send({message: 'Producto no encontrado.'});

            if (producto.portada && producto.portada.startsWith('http')) {
                await cloudinaryHelper.deleteByUrl(producto.portada);
            } else {
                try { fs.unlinkSync('./uploads/productos/'+producto.portada); } catch(e){}
            }

            // Eliminar imágenes de galería
            let imagenes = await Galeria.find({producto: id});
            for(let img of imagenes){
                if (img.imagen && img.imagen.startsWith('http')) {
                    await cloudinaryHelper.deleteByUrl(img.imagen);
                } else {
                    try { fs.unlinkSync('./uploads/galeria/'+img.imagen); } catch(e){}
                }
            }
            await Galeria.deleteMany({producto: id});

            // Eliminar variedades
            await Variedad.deleteMany({producto: id});

            // Eliminar producto
            await Producto.findByIdAndRemove(id);

            res.status(200).send({message: 'Producto eliminado correctamente.'});
        } catch (error) {
            res.status(500).send({message: 'No se pudo eliminar el producto.'});
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_detalles_ingreso_admin = async function(req,res){
    if(req.user){
        let id = req.params['id'];

        var ingreso = await Ingreso.findById({_id:id});
        var detalles = await Ingreso_detalle.find({ingreso:id}).populate('producto').populate('variedad');
        res.status(200).send({ingreso,detalles});
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

module.exports = {
    registro_producto_admin,
    listar_productos_admin,
    obtener_portada_producto,
    obtener_producto_admin,
    actualizar_producto_admin,
    registro_variedad_producto,
    obtener_variedades_producto,
    eliminar_variedad_producto,
    listar_activos_productos_admin,
    registro_ingreso_admin,
    subir_imagen_producto_admin,
    obtener_galeria_producto,
    obtener_galeria_producto_admin,
    eliminar_galeria_producto_admin,
    crear_categoria_admin,
    listar_categorias_admin,
    crear_subcategoria_admin,
    eliminar_subcategoria_admin,
    cambiar_estado_producto_admin,
    obtener_ingresos_admin,
    obtener_comprobante_ingreso,
    obtener_detalles_ingreso_admin,
    eliminar_producto_admin
}