const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
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

      if (!MATERIAS_VALIDAS.includes(materiaId)) {
        return res.status(400).json({ error: 'materiaId inválido' });
      }
      if (!semana || semana < 1 || semana > 18) {
        return res.status(400).json({ error: 'La semana debe estar entre 1 y 18.' });
      }

      const now = new Date();
      const update = {
        materiaId,
        semana,
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
