const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const col = db.collection('recomendaciones_override');
    const materia = (req.query && req.query.materia) || '';

    if (!MATERIAS_VALIDAS.includes(materia)) {
      return res.status(400).json({ error: 'materiaId inválido' });
    }

    if (req.method === 'GET') {
      const items = await col.find({ materiaId: materia }).toArray();
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const indice = Number(b.indice);
      const accion = String(b.accion || '').trim();
      const usuario = String(b.usuario || '').trim();

      if (isNaN(indice) || indice < 0) {
        return res.status(400).json({ error: 'Índice inválido.' });
      }
      if (!['editado', 'eliminado'].includes(accion)) {
        return res.status(400).json({ error: 'Acción inválida. Use "editado" o "eliminado".' });
      }
      if (!usuario) {
        return res.status(400).json({ error: 'Se requiere el nombre del usuario.' });
      }

      const now = new Date();
      const datos = {
        materiaId: materia,
        indice,
        accion,
        usuario,
        fecha: now,
      };

      if (accion === 'editado') {
        datos.tema = String(b.tema || '').trim();
        datos.justificacion = String(b.justificacion || '').trim();
      }

      await col.updateOne(
        { materiaId: materia, indice },
        { $set: datos },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const indice = Number(req.query.indice);
      if (isNaN(indice)) {
        return res.status(400).json({ error: 'Índice inválido.' });
      }
      await col.deleteOne({ materiaId: materia, indice });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
