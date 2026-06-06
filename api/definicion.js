const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const col = db.collection('definiciones');

    if (req.method === 'GET') {
      const items = await col.find({}).toArray();
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const materiaId = String(b.materiaId || '').trim();
      if (!MATERIAS_VALIDAS.includes(materiaId)) {
        return res.status(400).json({ error: 'materiaId inválido' });
      }
      const now = new Date();
      await col.updateOne(
        { materiaId },
        {
          $set: {
            materiaId,
            definicion: String(b.definicion || '').trim(),
            actualizadoPor: String(b.actualizadoPor || '').trim(),
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
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
