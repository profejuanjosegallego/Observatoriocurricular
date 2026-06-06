const { getDb } = require('../lib/mongo');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const col = db.collection('usuarios');

    if (req.method === 'GET') {
      const items = await col.find({ activo: { $ne: false } }).sort({ nombre: 1 }).toArray();
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const nombre = String(b.nombre || '').trim();
      if (!nombre) {
        return res.status(400).json({ error: 'El nombre es obligatorio.' });
      }

      const now = new Date();
      await col.updateOne(
        { nombre },
        {
          $set: {
            nombre,
            rol: String(b.rol || 'docente').trim(),
            email: String(b.email || '').trim(),
            activo: true,
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
