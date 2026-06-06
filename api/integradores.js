const { getDb } = require('../lib/mongo');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Método no permitido' });
    }

    const db = await getDb();
    const col = db.collection('integradores');
    const nivel = req.query && req.query.nivel;

    if (nivel) {
      const doc = await col.findOne({ nivel: Number(nivel) });
      return res.status(200).json(doc || null);
    }

    const items = await col.find({}).sort({ nivel: 1 }).toArray();
    return res.status(200).json(items);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
