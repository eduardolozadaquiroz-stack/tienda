const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Sube un Buffer a Cloudinary (fotos/imágenes) */
function uploadBuffer(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
}

/** Sube un Buffer a Cloudinary con detección automática de tipo (para PDFs, etc.) */
function uploadBufferAuto(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'auto' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
}

/** Elimina un recurso de Cloudinary dado su secure_url */
async function deleteByUrl(url) {
    if (!url || !url.startsWith('http')) return;
    try {
        // Extrae el public_id: todo entre /upload/vXXX/ (o /upload/) y la extensión
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
        if (match) {
            await cloudinary.uploader.destroy(match[1]);
        }
    } catch (e) { /* silencioso */ }
}

module.exports = { uploadBuffer, uploadBufferAuto, deleteByUrl };
