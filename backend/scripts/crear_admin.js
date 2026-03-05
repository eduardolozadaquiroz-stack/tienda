require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

// ─── DATOS DEL ADMINISTRADOR INICIAL ────────────────────────────────────────
// Configura estas variables en el archivo .env ANTES de ejecutar este script:
//   ADMIN_NOMBRE   - nombre del administrador
//   ADMIN_APELLIDO - apellido
//   ADMIN_EMAIL    - correo de acceso
//   ADMIN_PASSWORD - contraseña inicial (mín. 8 caracteres, cámbiala después)
// ────────────────────────────────────────────────────────────────────────────
const ADMIN = {
    nombres:   process.env.ADMIN_NOMBRE   || '',
    apellidos: process.env.ADMIN_APELLIDO || '',
    email:     process.env.ADMIN_EMAIL    || '',
    password:  process.env.ADMIN_PASSWORD || '',
    rol:       'ADMIN_ROL',
    estado:    true
};

if (!ADMIN.email || !ADMIN.password) {
    console.error('ERROR: Debes definir ADMIN_EMAIL y ADMIN_PASSWORD en el archivo .env antes de ejecutar este script.');
    process.exit(1);
}
if (ADMIN.password.length < 8) {
    console.error('ERROR: ADMIN_PASSWORD debe tener al menos 8 caracteres.');
    process.exit(1);
}

async function crearAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB Atlas');

        const existe = await Usuario.findOne({ email: ADMIN.email });
        if (existe) {
            console.log(`Ya existe un usuario con el email: ${ADMIN.email}`);
            process.exit(0);
        }

        const hash = await bcrypt.hash(ADMIN.password, 10);
        const usuario = await Usuario.create({ ...ADMIN, password: hash });

        console.log('✓ Administrador creado exitosamente.');
        console.log(`  Email : ${usuario.email} | Rol: ${usuario.rol}`);
        console.log('  Recuerda cambiar la contraseña después de iniciar sesión.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

crearAdmin();
