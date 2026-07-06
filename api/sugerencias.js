const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const col = db.collection('sugerencias');

    // --- Banco de necesidades reales de empresas (Vigilancia Tecnológica e Inteligencia Competitiva) ---
    const esBanco = (req.query && req.query.banco) || (req.method === 'POST' && (req.body || {}).banco);
    if (esBanco) {
      const banco = db.collection('necesidades_empresa');
      const s = v => String(v == null ? '' : v).trim();

      if (req.method === 'GET') {
        const items = await banco.find({}).sort({ createdAt: -1 }).toArray();
        return res.status(200).json(items);
      }

      if (req.method === 'POST') {
        const b = req.body || {};
        const empresa = b.empresa || {};
        const contacto = b.contacto || {};
        const reto = b.reto || {};
        const contexto = b.contexto || {};
        const disposicion = b.disposicion || {};

        const empresaNombre = s(empresa.nombre);
        const email = s(contacto.email);
        const retoTitulo = s(reto.titulo);
        const retoProblema = s(reto.problema);
        if (!empresaNombre) return res.status(400).json({ error: 'El nombre de la empresa es obligatorio.' });
        if (!email) return res.status(400).json({ error: 'El correo de contacto es obligatorio.' });
        if (!retoTitulo || !retoProblema) return res.status(400).json({ error: 'El título y la descripción del reto son obligatorios.' });
        if (!b.consentimiento) return res.status(400).json({ error: 'Debe autorizar el tratamiento de los datos (Ley 1581 de 2012).' });

        const tecnologiasActuales = Array.isArray(contexto.tecnologiasActuales)
          ? contexto.tecnologiasActuales.map(s).filter(Boolean).slice(0, 20) : [];
        const now = new Date();
        await banco.insertOne({
          empresa: { nombre: empresaNombre, sector: s(empresa.sector), tamano: s(empresa.tamano), ciudad: s(empresa.ciudad) },
          contacto: { nombre: s(contacto.nombre), cargo: s(contacto.cargo), email, telefono: s(contacto.telefono) },
          reto: {
            titulo: retoTitulo,
            problema: retoProblema,
            area: s(reto.area),
            situacionActual: s(reto.situacionActual),
            resultadoEsperado: s(reto.resultadoEsperado),
            datosDisponibles: s(reto.datosDisponibles),
            restricciones: s(reto.restricciones),
          },
          contexto: {
            urgencia: s(contexto.urgencia),
            impacto: s(contexto.impacto),
            plazoNegocio: s(contexto.plazoNegocio),
            tecnologiasActuales,
            confidencial: !!contexto.confidencial,
          },
          disposicion: {
            mentoria: !!disposicion.mentoria,
            datosReales: !!disposicion.datosReales,
            vinculacion: !!disposicion.vinculacion,
          },
          consentimiento: !!b.consentimiento,
          // Campos reservados para la fase de análisis y valoración de CESDE (aún no editables).
          estado: 'nueva',
          createdAt: now,
          updatedAt: now,
        });
        return res.status(200).json({ ok: true });
      }

      if (req.method === 'DELETE') {
        const id = req.query && req.query.id;
        if (!id) return res.status(400).json({ error: 'Se requiere el id de la necesidad.' });
        const { ObjectId } = require('mongodb');
        await banco.deleteOne({ _id: new ObjectId(id) });
        return res.status(200).json({ ok: true });
      }

      res.setHeader('Allow', 'GET, POST, DELETE');
      return res.status(405).json({ error: 'Método no permitido' });
    }

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
