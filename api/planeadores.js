const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const action = (req.query && req.query.action) || '';

    // --- Comentarios del planeador ---
    if (action === 'comentarios') {
      const col = db.collection('comentarios_planeador');

      if (req.method === 'GET') {
        const materia = req.query.materia;
        if (!materia) return res.status(400).json({ error: 'Se requiere el parámetro materia.' });
        const items = await col.find({ materiaId: materia }).sort({ createdAt: -1 }).toArray();
        return res.status(200).json(items);
      }

      if (req.method === 'POST') {
        const b = req.body || {};
        const materiaId = String(b.materiaId || '').trim();
        const semana = Number(b.semana);
        const texto = String(b.texto || '').trim();
        const autor = String(b.autor || '').trim();

        if (!MATERIAS_VALIDAS.includes(materiaId)) return res.status(400).json({ error: 'materiaId inválido' });
        if (!semana || semana < 1 || semana > 18) return res.status(400).json({ error: 'La semana debe estar entre 1 y 18.' });
        if (!texto) return res.status(400).json({ error: 'El comentario no puede estar vacío.' });
        if (!autor) return res.status(400).json({ error: 'El nombre del autor es obligatorio.' });

        await col.insertOne({
          materiaId, semana, autor,
          rol: String(b.rol || 'docente').trim(),
          texto,
          createdAt: new Date(),
        });
        return res.status(200).json({ ok: true });
      }

      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Método no permitido' });
    }

    // --- Backup del planeador ---
    if (action === 'backup') {
      const backupCol = db.collection('planeadores_backup');
      const planCol = db.collection('planeadores');
      const materia = (req.query.materia) || '';

      if (!MATERIAS_VALIDAS.includes(materia)) return res.status(400).json({ error: 'materiaId inválido' });

      if (req.method === 'GET') {
        const backup = await backupCol.findOne({ materiaId: materia });
        return res.status(200).json({ existe: !!backup, fecha: backup?.fecha || null });
      }

      if (req.method === 'POST') {
        const bodyAction = (req.body && req.body.action) || 'save';

        if (bodyAction === 'save') {
          const semanas = await planCol.find({ materiaId: materia }).sort({ semana: 1 }).toArray();
          const snapshot = semanas.map(s => { const { _id, ...rest } = s; return rest; });
          await backupCol.updateOne(
            { materiaId: materia },
            { $set: { materiaId: materia, semanas: snapshot, fecha: new Date() } },
            { upsert: true }
          );
          return res.status(200).json({ ok: true, msg: 'Respaldo guardado.' });
        }

        if (bodyAction === 'restore') {
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
    }

    // --- Planeador principal ---
    const col = db.collection('planeadores');

    if (req.method === 'GET') {
      const materia = req.query && req.query.materia;
      if (!materia) return res.status(400).json({ error: 'Se requiere el parámetro materia.' });
      const items = await col.find({ materiaId: materia }).sort({ semana: 1 }).toArray();
      return res.status(200).json(items);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const b = req.body || {};
      const materiaId = String(b.materiaId || '').trim();
      const semana = Number(b.semana);

      if (!MATERIAS_VALIDAS.includes(materiaId)) return res.status(400).json({ error: 'materiaId inválido' });
      if (!semana || semana < 1 || semana > 18) return res.status(400).json({ error: 'La semana debe estar entre 1 y 18.' });

      const now = new Date();
      const update = {
        materiaId, semana,
        unidadAprendizaje: String(b.unidadAprendizaje || '').trim(),
        HT: Number(b.HT) || 0,
        HP: Number(b.HP) || 0,
        HTI: Number(b.HTI) || 0,
        metodologia: String(b.metodologia || '').trim(),
        resultadoAprendizaje: String(b.resultadoAprendizaje || '').trim(),
        observaciones: String(b.observaciones || '').trim(),
        editadoPor: String(b.editadoPor || '').trim(),
        updatedAt: now,
      };

      if (Array.isArray(b.tematicasDetalle)) {
        update.tematicasDetalle = b.tematicasDetalle.map(t => ({
          texto: String(t.texto || '').trim(),
          editadoPor: t.editadoPor || null,
          editadoEn: t.editadoEn || null,
        }));
        update.tematicas = update.tematicasDetalle.map(t => t.texto).join('\n');
      } else {
        update.tematicas = String(b.tematicas || '').trim();
      }

      if (b.resultadoEditadoPor) {
        update.resultadoEditadoPor = String(b.resultadoEditadoPor).trim();
        update.resultadoEditadoEn = b.resultadoEditadoEn || now.toISOString();
      }

      await col.updateOne(
        { materiaId, semana },
        { $set: update, $setOnInsert: { createdAt: now } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
