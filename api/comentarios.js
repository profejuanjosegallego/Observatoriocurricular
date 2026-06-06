const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const col = db.collection('comentarios_planeador');

    if (req.method === 'GET') {
      const materia = req.query && req.query.materia;
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

      if (!MATERIAS_VALIDAS.includes(materiaId)) {
        return res.status(400).json({ error: 'materiaId inválido' });
      }
      if (!semana || semana < 1 || semana > 18) {
        return res.status(400).json({ error: 'La semana debe estar entre 1 y 18.' });
      }
      if (!texto) {
        return res.status(400).json({ error: 'El comentario no puede estar vacío.' });
      }
      if (!autor) {
        return res.status(400).json({ error: 'El nombre del autor es obligatorio.' });
      }

      const now = new Date();
      await col.insertOne({
        materiaId,
        semana,
        autor,
        rol: String(b.rol || 'docente').trim(),
        texto,
        createdAt: now,
      });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
