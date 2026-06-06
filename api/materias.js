const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS, MATERIAS_INFO } = require('../lib/constants');

module.exports = async (req, res) => {
  try {
    const db = await getDb();

    if (req.method === 'GET') {
      const id = req.query && req.query.id;

      if (id) {
        const doc = await db.collection('materias').findOne({ materiaId: id });
        const info = MATERIAS_INFO[id];
        return res.status(200).json(doc || (info ? { materiaId: id, nombre: info.nombre, nivel: info.nivel, bootcamp: info.bootcamp } : null));
      }

      const materias = await db.collection('materias').find({}).toArray();
      const aportes = await db.collection('aportes').find({}).toArray();
      const planeadores = await db.collection('planeadores').find({}).toArray();

      const result = MATERIAS_VALIDAS.map(mid => {
        const info = MATERIAS_INFO[mid];
        const doc = materias.find(m => m.materiaId === mid) || {};
        return {
          materiaId: mid,
          nombre: info.nombre,
          nivel: info.nivel,
          bootcamp: info.bootcamp,
          ...doc,
          stats: {
            totalAportes: aportes.filter(a => a.materiaId === mid).length,
            semanasCompletadas: planeadores.filter(p => p.materiaId === mid && p.tematicas).length,
            totalSemanas: 18,
          },
        };
      });

      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const materiaId = String(b.materiaId || '').trim();
      if (!MATERIAS_VALIDAS.includes(materiaId)) {
        return res.status(400).json({ error: 'materiaId inválido' });
      }
      const now = new Date();
      const update = { materiaId, updatedAt: now };
      if (b.proposito !== undefined) update.proposito = String(b.proposito).trim();
      if (b.objetivo !== undefined) update.objetivo = String(b.objetivo).trim();
      if (b.competencia !== undefined) update.competencia = String(b.competencia).trim();
      if (b.relacionPerfilEgreso !== undefined) update.relacionPerfilEgreso = String(b.relacionPerfilEgreso).trim();
      if (b.relacionConsultorTech !== undefined) update.relacionConsultorTech = String(b.relacionConsultorTech).trim();
      if (b.editadoPor) update.editadoPor = String(b.editadoPor).trim();
      if (b.definicionSintesis !== undefined) update.definicionSintesis = String(b.definicionSintesis).trim();
      await db.collection('materias').updateOne(
        { materiaId },
        { $set: update, $setOnInsert: { createdAt: now } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
