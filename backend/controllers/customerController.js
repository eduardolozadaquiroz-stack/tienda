var Carrito = require('../models/carrito');
var Variedad = require('../models/variedad');
var Direccion = require('../models/direccion');
var Venta = require('../models/venta');
var Venta_detalle = require('../models/venta_detalle');
var Review = require('../models/review');
var socketModule = require('../socket');
var fs = require('fs');
var path = require('path');
var logger = require('../helpers/logger');
var cloudinaryHelper = require('../helpers/cloudinary');

// Umbral: más de 3 ventas del mismo cliente en 10 minutos = comportamiento inusual
const VENTAS_UMBRAL = 3;
const VENTAS_VENTANA_MS = 10 * 60 * 1000;

const crear_producto_carrito = async function(req,res){
    if(req.user){
        let data = req.body;
        data.cliente = req.user.sub; // Siempre obtener el cliente del token, nunca confiar en el body

        var variedad = await Variedad.findById({_id:data.variedad}).populate('producto');

        if(data.cantidad <= variedad.stock){
            if(variedad.producto.precio >= 1){
                // Agregar imagen de diseño si se subió — subir a Cloudinary para persistencia
                if(req.files && req.files['imagen_diseno'] && req.files['imagen_diseno'][0]){
                    try {
                        const result = await cloudinaryHelper.uploadBuffer(
                            req.files['imagen_diseno'][0].buffer,
                            'diseños'
                        );
                        data.imagen_diseno = result.secure_url;
                    } catch(e) {
                        // Si falla Cloudinary, continuar sin imagen
                        data.imagen_diseno = '';
                    }
                }
                let carrito = await Carrito.create(data);
                res.status(200).send(carrito);
            }else{
                res.status(200).send({data:undefined,message: 'El producto tiene precio en 0'});
            }
        }else{
            res.status(200).send({data:undefined,message: 'Se supero el stock del producto'});
        }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_carrito_cliente = async function(req,res){
    if(req.user){
       let carrito = await Carrito.find({cliente:req.user.sub}).populate('producto').populate('variedad').sort({createdAt:-1}).limit(5);
       let carrito_general = await Carrito.find({cliente:req.user.sub}).populate('producto').populate('variedad').sort({createdAt:-1});
       res.status(200).send({carrito,carrito_general});
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}



const eliminar_producto_carrito = async function(req,res){
    if(req.user){
       let id = req.params['id'];
       // Verificar propiedad antes de eliminar (Broken Access Control)
       const item = await Carrito.findById(id);
       if (!item || item.cliente.toString() !== req.user.sub.toString()) {
           return res.status(403).send({ data: undefined, message: 'No tienes permiso para eliminar este item.' });
       }
       let reg = await Carrito.findByIdAndRemove({_id:id});
       res.status(200).send(reg);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const crear_direccion_cliente = async function(req,res){
    if(req.user){
       try {
           let data = req.body;
           data.cliente = req.user.sub;
           let direccion = await Direccion.create(data);
           res.status(200).send(direccion);
       } catch(err) {
           res.status(400).send({data: undefined, message: err.message || 'Error al guardar la dirección.'});
       }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obternet_direcciones_cliente = async function(req,res){
    if(req.user){
      
       let direcciones = await Direccion.find({cliente:req.user.sub});
       res.status(200).send(direcciones);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const eliminar_direccion_cliente = async function(req,res){
    if(req.user){
       let id = req.params['id'];
       // Verificar propiedad antes de eliminar (Broken Access Control)
       const dir = await Direccion.findById(id);
       if (!dir || dir.cliente.toString() !== req.user.sub.toString()) {
           return res.status(403).send({ data: undefined, message: 'No tienes permiso para eliminar esta dirección.' });
       }
       let direccion = await Direccion.findByIdAndRemove({_id:id});
       res.status(200).send(direccion);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const validar_payment_id_venta = async function(req,res){
   
    if(req.user){
        let payment_id = req.params['payment_id'];
        let ventas = await Venta.find({transaccion:payment_id});
        res.status(200).send(ventas);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}


const crear_venta_cliente = async function(req,res){
    if(req.user){
        let data = req.body;
        data.cliente = req.user.sub; // Siempre obtener el cliente del token, nunca confiar en el body

        data.year = new Date().getFullYear();
        data.month = new Date().getMonth()+1;
        data.day = new Date().getDate();
        data.estado = 'Pagado';

        let ventas = await Venta.find().sort({createdAt:-1});

        if(ventas.length == 0){
            data.serie = 1;
        }else{
            data.serie = ventas[0].serie + 1;
        }
        
        let venta = await Venta.create(data);

        // Alerta de compras inusuales: más de 3 ventas en 10 minutos del mismo cliente
        const ventasRecientes = await Venta.countDocuments({
            cliente: data.cliente,
            createdAt: { $gte: new Date(Date.now() - VENTAS_VENTANA_MS) }
        });
        if (ventasRecientes > VENTAS_UMBRAL) {
            logger.security('UNUSUAL_PURCHASE_ACTIVITY', {
                clienteId: data.cliente,
                ventasRecientes,
                total: data.total
            });
        }

        for(var item of data.detalles){

            item.year = new Date().getFullYear();
            item.month = new Date().getMonth()+1;
            item.day = new Date().getDate();
            item.venta = venta._id;

            await Venta_detalle.create(item);
        
        }

        await Carrito.deleteMany({cliente:data.cliente});

        const io = socketModule.getIo();
        if (io) {
            io.emit('nueva_venta', {
                serie: venta.serie,
                total: venta.total,
                cliente: data.cliente,
                createdAt: venta.createdAt || new Date()
            });
        }

        res.status(200).send(venta);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_informacion_venta = async function(req, res) {
    if (req.user) {
        let id = req.params['id'];
        let venta = await Venta.findById({_id: id}).populate('cliente').populate('direccion');
        let regs = await Venta_detalle.find({venta: id}).populate('producto').populate('variedad');
        var detalles = [];

        for (var item of regs) {
            let reviews = await Review.find({cliente: item.cliente, producto: item.producto._id});
            detalles.push({
                detalle: item,
                reviews
            });
        }

        if (venta && venta.cliente && req.user.sub.toString() === venta.cliente._id.toString()) {
            res.status(200).send({venta, detalles});
        } else {
            res.status(200).send({data: undefined, message: 'No tienes acceso a esta venta'});
        }
    } else {
        res.status(500).send({data: undefined, message: 'ErrorToken'});
    }
}


const obtener_ventas_cliente = async function(req,res){
   
    if(req.user){
   
        let ventas = await Venta.find({cliente:req.user.sub}).populate('cliente').populate('direccion');
        res.status(200).send(ventas);
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const registrar_review_cliente = async function(req,res){
    if(req.user){

        let data = req.body;

        data.cliente = req.user.sub;

        let regs = await Review.find({cliente: data.cliente, producto: data.producto});

       if (regs.length == 0) {
            let review = await Review.create(data);
            res.status(200).send(review);
       } else {
            res.status(200).send({data:undefined, message:'Usted ya hizo el comentario para el producto'});
       }
    }else{
        res.status(500).send({data:undefined,message: 'ErrorToken'});
    }
}

const obtener_imagen_diseno = async function(req,res){
    let name = req.params['name'];
    fs.stat('./uploads/diseños/'+name, function(err){
        if(err){
            res.status(404).send('Not found');
        }else{
            res.status(200).sendFile(path.resolve('./uploads/diseños/'+name));
        }
    });
}

// ── PERFIL DEL CLIENTE ──────────────────────────────────────────────────────
var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt');

const obtener_perfil_cliente = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Token inválido.' });
    const cliente = await Cliente.findById(req.user.sub);
    if (!cliente) return res.status(404).send({ message: 'Cliente no encontrado.' });
    res.status(200).send(cliente);
};

const actualizar_perfil_cliente = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Token inválido.' });
    try {
        const { nombres, apellidos, pais, genero } = req.body;
        const update = { nombres, apellidos, pais, genero };
        if (req.files && req.files['avatar'] && req.files['avatar'][0]) {
            // eliminar avatar anterior de Cloudinary si existe
            const viejo = await Cliente.findById(req.user.sub);
            if (viejo && viejo.avatar) {
                await cloudinaryHelper.deleteByUrl(viejo.avatar);
            }
            const uploaded = await cloudinaryHelper.uploadBuffer(req.files['avatar'][0].buffer, 'avatars');
            update.avatar = uploaded.secure_url;
        }
        const cliente = await Cliente.findByIdAndUpdate(req.user.sub, update, { new: true });
        res.status(200).send(cliente);
    } catch(err) {
        res.status(500).send({ message: err.message || 'Error al actualizar el perfil.' });
    }
};

const cambiar_password_cliente = async function(req, res) {
    if (!req.user) return res.status(401).send({ message: 'Token inválido.' });
    const { password_actual, password_nuevo } = req.body;
    if (!password_actual || !password_nuevo)
        return res.status(400).send({ message: 'Ingrese la contraseña actual y la nueva.' });
    if (password_nuevo.length < 8)
        return res.status(400).send({ message: 'La nueva contraseña debe tener al menos 8 caracteres.' });
    if (!/[A-Z]/.test(password_nuevo))
        return res.status(400).send({ message: 'La nueva contraseña debe incluir al menos una mayúscula.' });
    if (!/[a-z]/.test(password_nuevo))
        return res.status(400).send({ message: 'La nueva contraseña debe incluir al menos una minúscula.' });
    if (!/[^A-Za-z0-9]/.test(password_nuevo))
        return res.status(400).send({ message: 'La nueva contraseña debe incluir al menos un carácter especial.' });
    const cliente = await Cliente.findById(req.user.sub).select('+password');
    if (!cliente) return res.status(404).send({ message: 'Cliente no encontrado.' });
    const match = await bcrypt.compare(password_actual, cliente.password);
    if (!match) return res.status(400).send({ message: 'La contraseña actual es incorrecta.' });
    const hash = await bcrypt.hash(password_nuevo, 10);
    await Cliente.findByIdAndUpdate(req.user.sub, { password: hash });
    res.status(200).send({ message: 'ok' });
};

const obtener_avatar_cliente = function(req, res) {
    const name = req.params['name'];
    const filePath = './uploads/avatars/' + name;
    fs.stat(filePath, function(err) {
        if (err) res.status(404).send('Not found');
        else res.status(200).sendFile(path.resolve(filePath));
    });
};

module.exports = {
    crear_producto_carrito,
    obtener_carrito_cliente,
    eliminar_producto_carrito,
    crear_direccion_cliente,
    obternet_direcciones_cliente,
    eliminar_direccion_cliente,
    validar_payment_id_venta,
    crear_venta_cliente,
    obtener_informacion_venta,
    obtener_ventas_cliente,
    registrar_review_cliente,
    obtener_imagen_diseno,
    obtener_perfil_cliente,
    actualizar_perfil_cliente,
    cambiar_password_cliente,
    obtener_avatar_cliente
}