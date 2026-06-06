const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const col = db.collection('sugerencias');

    if (req.method === 'GET') {
      const materia = req.query && req.query.materia;
      const filtro = materia ? { materiaId: materia } : {};
      const items = await col.find(filtro).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const materiaId = String(b.materiaId || '').trim();
      const profesor = String(b.profesor || '').trim();
      const semana = String(b.semana || '').trim();
      const titulo = String(b.titulo || '').trim();
      const descripcion = String(b.descripcion || '').trim();

      if (!MATERIAS_VALIDAS.includes(materiaId)) {
        return res.status(400).json({ error: 'materiaId inválido' });
      }
      if (!profesor) {
        return res.status(400).json({ error: 'El nombre del contribuyente es obligatorio.' });
      }
      if (!semana || !titulo) {
        return res.status(400).json({ error: 'La semana y el título son obligatorios.' });
      }

      const now = new Date();

      if (b._id) {
        const { ObjectId } = require('mongodb');
        await col.updateOne(
          { _id: new ObjectId(b._id) },
          { $set: { semana, titulo, descripcion, profesor, updatedAt: now } }
        );
      } else {
        await col.insertOne({
          materiaId,
          profesor,
          semana,
          titulo,
          descripcion,
          createdAt: now,
          updatedAt: now,
        });
      }
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = req.query && req.query.id;
      if (!id) return res.status(400).json({ error: 'Se requiere el id de la sugerencia.' });
      const { ObjectId } = require('mongodb');
      await col.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
