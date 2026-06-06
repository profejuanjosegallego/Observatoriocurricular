const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const backupCol = db.collection('planeadores_backup');
    const planCol = db.collection('planeadores');
    const materia = (req.query && req.query.materia) || '';

    if (!MATERIAS_VALIDAS.includes(materia)) {
      return res.status(400).json({ error: 'materiaId inválido' });
    }

    if (req.method === 'GET') {
      const backup = await backupCol.findOne({ materiaId: materia });
      return res.status(200).json({ existe: !!backup, fecha: backup?.fecha || null });
    }

    if (req.method === 'POST') {
      const action = (req.body && req.body.action) || 'save';

      if (action === 'save') {
        const semanas = await planCol.find({ materiaId: materia }).sort({ semana: 1 }).toArray();
        const snapshot = semanas.map(s => {
          const { _id, ...rest } = s;
          return rest;
        });
        await backupCol.updateOne(
          { materiaId: materia },
          { $set: { materiaId: materia, semanas: snapshot, fecha: new Date() } },
          { upsert: true }
        );
        return res.status(200).json({ ok: true, msg: 'Respaldo guardado.' });
      }

      if (action === 'restore') {
        const backup = await backupCol.findOne({ materiaId: materia });
        if (!backup || !backup.semanas || backup.semanas.length === 0) {
          return res.status(404).json({ error: 'No se encontró respaldo para esta materia.' });
        }
        await planCol.deleteMany({ materiaId: materia });
        const docs = backup.semanas.map(s => ({ ...s, restoredAt: new Date() }));
        await planCol.insertMany(docs);
        return res.status(200).json({ ok: true, msg: 'Planeador restaurado al estado original.' });
      }

      return res.status(400).json({ error: 'Acción inválida. Use "save" o "restore".' });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
