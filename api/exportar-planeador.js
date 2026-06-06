const ExcelJS = require('exceljs');
const { getDb } = require('../lib/mongo');
const { MATERIAS_INFO } = require('../lib/constants');

const NIVELES_ROMAN = { 1: 'I', 2: 'II', 3: 'III' };

const DARK_BLUE = { argb: 'FF002060' };
const MED_BLUE = { argb: 'FF4472C4' };
const LIGHT_BLUE = { argb: 'FFD6E4F0' };
const WHITE = { argb: 'FFFFFFFF' };
const BLACK = { argb: 'FF000000' };

const THIN_BORDER = { style: 'thin', color: BLACK };
const ALL_BORDERS = { top: THIN_BORDER, left: THIN_BORDER, bottom: THIN_BORDER, right: THIN_BORDER };

function fontBase(overrides = {}) {
  return { name: 'Arial', size: 9, ...overrides };
}

function fillSolid(color) {
  return { type: 'pattern', pattern: 'solid', fgColor: color };
}

function applyBordersAndFont(ws, row, colStart, colEnd, font, fill, alignment) {
  for (let c = colStart; c <= colEnd; c++) {
    const cell = ws.getRow(row).getCell(c);
    cell.border = ALL_BORDERS;
    if (font) cell.font = font;
    if (fill) cell.fill = fill;
    if (alignment) cell.alignment = alignment;
  }
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Método no permitido' });
    }

    const materiaId = req.query && req.query.materia;
    if (!materiaId || !MATERIAS_INFO[materiaId]) {
      return res.status(400).json({ error: 'Se requiere un parámetro materia válido.' });
    }

    const info = MATERIAS_INFO[materiaId];
    const db = await getDb();
    const semanas = await db.collection('planeadores')
      .find({ materiaId })
      .sort({ semana: 1 })
      .toArray();

    const filled = Array.from({ length: 18 }, (_, i) => {
      const s = semanas.find(d => d.semana === i + 1);
      return s || { semana: i + 1, unidadAprendizaje: '', fechaProgramada: '', tematicas: '', HT: 0, HP: 0, HTI: 0, metodologia: '', resultadoAprendizaje: '', observaciones: '' };
    });

    const totHT = filled.reduce((a, s) => a + (Number(s.HT) || 0), 0);
    const totHP = filled.reduce((a, s) => a + (Number(s.HP) || 0), 0);
    const totHTI = filled.reduce((a, s) => a + (Number(s.HTI) || 0), 0);
    const totalHoras = totHT + totHP + totHTI;
    const unidades = [...new Set(filled.map(s => s.unidadAprendizaje).filter(Boolean))];

    const tematicasTexto = (s) => {
      if (Array.isArray(s.tematicasDetalle) && s.tematicasDetalle.length > 0) {
        return s.tematicasDetalle.map(t => t.texto).join('\n');
      }
      return s.tematicas || '';
    };

    const wb = new ExcelJS.Workbook();
    wb.creator = 'Matriz del Consultor — CESDE';
    const ws = wb.addWorksheet('Planeador', {
      pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
    });

    // ── Column widths (A=1 .. K=11) ──
    ws.columns = [
      { width: 18 }, // A: Unidad
      { width: 16 }, // B: Semana/Fecha
      { width: 14 }, // C: Fecha desarrollo
      { width: 42 }, // D: Temáticas
      { width: 5 },  // E: HT
      { width: 5 },  // F: HP
      { width: 5 },  // G: HTI
      { width: 28 }, // H: Metodología
      { width: 30 }, // I: Resultado
      { width: 14 }, // J: Observaciones
      { width: 14 }, // K: Observaciones (cont.)
    ];

    const wrap = { wrapText: true, vertical: 'middle' };
    const wrapCenter = { wrapText: true, vertical: 'middle', horizontal: 'center' };

    // ═══════════════════════════════════════════════
    // ROWS 1-3: Header institucional
    // ═══════════════════════════════════════════════
    ws.mergeCells('A1:C3');
    ws.getCell('A1').value = 'CESDE';
    ws.getCell('A1').font = fontBase({ size: 16, bold: true, color: DARK_BLUE });
    ws.getCell('A1').alignment = wrapCenter;
    ws.getCell('A1').fill = fillSolid(LIGHT_BLUE);

    ws.mergeCells('D1:I2');
    ws.getCell('D1').value = 'CESDE';
    ws.getCell('D1').font = fontBase({ size: 18, bold: true, color: DARK_BLUE });
    ws.getCell('D1').alignment = wrapCenter;
    ws.getCell('D1').fill = fillSolid(LIGHT_BLUE);

    ws.mergeCells('J1:K1');
    ws.getCell('J1').value = 'Código\nFTCOCU-129';
    ws.getCell('J1').font = fontBase({ size: 8, bold: true });
    ws.getCell('J1').alignment = wrapCenter;

    ws.mergeCells('J2:K2');
    ws.getCell('J2').value = 'Versión 02';
    ws.getCell('J2').font = fontBase({ size: 8, bold: true });
    ws.getCell('J2').alignment = wrapCenter;

    ws.mergeCells('D3:I3');
    ws.getCell('D3').value = 'PLANEADOR DE SUBMÓDULO';
    ws.getCell('D3').font = fontBase({ size: 12, bold: true, color: DARK_BLUE });
    ws.getCell('D3').alignment = wrapCenter;
    ws.getCell('D3').fill = fillSolid(LIGHT_BLUE);

    ws.mergeCells('J3:K3');
    ws.getCell('J3').value = new Date();
    ws.getCell('J3').numFmt = 'DD/MM/YYYY';
    ws.getCell('J3').font = fontBase({ size: 8 });
    ws.getCell('J3').alignment = wrapCenter;

    for (let r = 1; r <= 3; r++) applyBordersAndFont(ws, r, 1, 11);

    // ═══════════════════════════════════════════════
    // ROW 4: Spacer
    // ═══════════════════════════════════════════════
    ws.getRow(4).height = 6;

    // ═══════════════════════════════════════════════
    // ROW 5: Labels institucionales
    // ═══════════════════════════════════════════════
    const labelFont = fontBase({ size: 8, bold: true, color: WHITE });
    const labelFill = fillSolid(DARK_BLUE);
    const valFont = fontBase({ size: 8 });

    ws.mergeCells('A5:B5');
    ws.getCell('A5').value = 'SEDE / ESCUELA';
    ws.getCell('A5').font = labelFont;
    ws.getCell('A5').fill = labelFill;
    ws.getCell('A5').alignment = wrapCenter;

    ws.mergeCells('C5:D5');
    ws.getCell('C5').value = 'PROGRAMA';
    ws.getCell('C5').font = labelFont;
    ws.getCell('C5').fill = labelFill;
    ws.getCell('C5').alignment = wrapCenter;

    ws.mergeCells('E5:H5');
    ws.getCell('E5').value = 'SUBMÓDULO';
    ws.getCell('E5').font = labelFont;
    ws.getCell('E5').fill = labelFill;
    ws.getCell('E5').alignment = wrapCenter;

    ws.getCell('I5').value = 'DOCENTE';
    ws.getCell('I5').font = labelFont;
    ws.getCell('I5').fill = labelFill;
    ws.getCell('I5').alignment = wrapCenter;

    ws.getCell('J5').value = 'NIVEL';
    ws.getCell('J5').font = labelFont;
    ws.getCell('J5').fill = labelFill;
    ws.getCell('J5').alignment = wrapCenter;

    ws.getCell('K5').value = 'PERIODO';
    ws.getCell('K5').font = labelFont;
    ws.getCell('K5').fill = labelFill;
    ws.getCell('K5').alignment = wrapCenter;

    applyBordersAndFont(ws, 5, 1, 11);

    // ═══════════════════════════════════════════════
    // ROW 6: Values institucionales
    // ═══════════════════════════════════════════════
    ws.mergeCells('A6:B6');
    ws.getCell('A6').value = 'Escuela de Nuevas Tecnologías';
    ws.getCell('A6').font = valFont;
    ws.getCell('A6').alignment = wrap;

    ws.mergeCells('C6:D6');
    ws.getCell('C6').value = 'Técnico Laboral como Asistente en Desarrollo de Software';
    ws.getCell('C6').font = valFont;
    ws.getCell('C6').alignment = wrap;

    ws.mergeCells('E6:H6');
    ws.getCell('E6').value = info.nombre;
    ws.getCell('E6').font = fontBase({ size: 9, bold: true });
    ws.getCell('E6').alignment = wrapCenter;

    ws.getCell('I6').value = '';
    ws.getCell('I6').font = valFont;

    ws.getCell('J6').value = NIVELES_ROMAN[info.nivel] || String(info.nivel);
    ws.getCell('J6').font = valFont;
    ws.getCell('J6').alignment = wrapCenter;

    ws.getCell('K6').value = '';
    ws.getCell('K6').font = valFont;
    ws.getCell('K6').alignment = wrapCenter;

    applyBordersAndFont(ws, 6, 1, 11);

    // ═══════════════════════════════════════════════
    // ROWS 7-11: Metadata de horas
    // ═══════════════════════════════════════════════
    const metaRows = [
      ['Jornada', '', '', '', 'Horas Totales del Submódulo', '', totalHoras, 'Normas de Competencia Laboral'],
      ['Grupo', '', '', '', 'Horas Teóricas (HT)', '', totHT, ''],
      ['Horario', '', '', '', 'Horas Prácticas (HP)', '', totHP, ''],
      ['', '', '', '', 'Horas Trabajo Independiente (HTI)', '', totHTI, ''],
      ['', '', '', '', 'Unidades de Aprendizaje', '', unidades.length, ''],
    ];

    metaRows.forEach((vals, i) => {
      const r = 7 + i;
      ws.getCell(`A${r}`).value = vals[0];
      ws.getCell(`A${r}`).font = fontBase({ size: 8, bold: true });
      ws.mergeCells(`E${r}:F${r}`);
      ws.getCell(`E${r}`).value = vals[4];
      ws.getCell(`E${r}`).font = fontBase({ size: 8, bold: true });
      ws.getCell(`E${r}`).alignment = { horizontal: 'right', vertical: 'middle' };
      ws.getCell(`G${r}`).value = vals[6];
      ws.getCell(`G${r}`).font = fontBase({ size: 9, bold: true });
      ws.getCell(`G${r}`).alignment = wrapCenter;
      ws.getCell(`G${r}`).fill = fillSolid(LIGHT_BLUE);
      if (vals[7]) {
        ws.getCell(`H${r}`).value = vals[7];
        ws.getCell(`H${r}`).font = fontBase({ size: 8, bold: true });
      }
      applyBordersAndFont(ws, r, 1, 11);
    });

    // ═══════════════════════════════════════════════
    // ROWS 12-13: Spacer
    // ═══════════════════════════════════════════════
    ws.getRow(12).height = 6;
    ws.getRow(13).height = 6;

    // ═══════════════════════════════════════════════
    // ROWS 14-15: Table headers (two-row header)
    // ═══════════════════════════════════════════════
    const thFont = fontBase({ size: 8, bold: true, color: WHITE });
    const thFill = fillSolid(MED_BLUE);
    const thAlign = { wrapText: true, vertical: 'middle', horizontal: 'center' };

    // Row 14
    ws.mergeCells('A14:A15');
    ws.getCell('A14').value = 'UNIDAD';
    ws.getCell('A14').font = thFont;
    ws.getCell('A14').fill = thFill;
    ws.getCell('A14').alignment = thAlign;

    ws.getCell('B14').value = 'SEMANA/FECHA';
    ws.getCell('B14').font = thFont;
    ws.getCell('B14').fill = thFill;
    ws.getCell('B14').alignment = thAlign;

    ws.mergeCells('C14:C15');
    ws.getCell('C14').value = 'FECHA DESARROLLO DEL TEMA';
    ws.getCell('C14').font = thFont;
    ws.getCell('C14').fill = thFill;
    ws.getCell('C14').alignment = thAlign;

    ws.mergeCells('D14:D15');
    ws.getCell('D14').value = 'TEMÁTICAS A DESARROLLAR';
    ws.getCell('D14').font = thFont;
    ws.getCell('D14').fill = thFill;
    ws.getCell('D14').alignment = thAlign;

    ws.mergeCells('E14:G14');
    ws.getCell('E14').value = 'TIEMPOS PARA EL DESARROLLO';
    ws.getCell('E14').font = thFont;
    ws.getCell('E14').fill = thFill;
    ws.getCell('E14').alignment = thAlign;

    ws.mergeCells('H14:H15');
    ws.getCell('H14').value = 'FORMAS DE ENSEÑANZA Y APRENDIZAJE\n(METODOLOGÍAS)';
    ws.getCell('H14').font = thFont;
    ws.getCell('H14').fill = thFill;
    ws.getCell('H14').alignment = thAlign;

    ws.mergeCells('I14:I15');
    ws.getCell('I14').value = 'RESULTADOS DE APRENDIZAJE';
    ws.getCell('I14').font = thFont;
    ws.getCell('I14').fill = thFill;
    ws.getCell('I14').alignment = thAlign;

    ws.mergeCells('J14:K15');
    ws.getCell('J14').value = 'RESULTADOS DE LA SESIÓN\n(Observaciones/Propuesta Mejora)';
    ws.getCell('J14').font = thFont;
    ws.getCell('J14').fill = thFill;
    ws.getCell('J14').alignment = thAlign;

    // Row 15: sub-headers
    ws.getCell('B15').value = 'PROGRAMADA';
    ws.getCell('B15').font = thFont;
    ws.getCell('B15').fill = thFill;
    ws.getCell('B15').alignment = thAlign;

    ws.getCell('E15').value = 'HT';
    ws.getCell('E15').font = thFont;
    ws.getCell('E15').fill = thFill;
    ws.getCell('E15').alignment = thAlign;

    ws.getCell('F15').value = 'HP';
    ws.getCell('F15').font = thFont;
    ws.getCell('F15').fill = thFill;
    ws.getCell('F15').alignment = thAlign;

    ws.getCell('G15').value = 'HTI';
    ws.getCell('G15').font = thFont;
    ws.getCell('G15').fill = thFill;
    ws.getCell('G15').alignment = thAlign;

    applyBordersAndFont(ws, 14, 1, 11);
    applyBordersAndFont(ws, 15, 1, 11);

    // ═══════════════════════════════════════════════
    // ROWS 16-33: Data rows (18 semanas)
    // ═══════════════════════════════════════════════
    const dataFont = fontBase({ size: 8 });
    const dataAlign = { wrapText: true, vertical: 'top' };
    const numAlign = { vertical: 'middle', horizontal: 'center' };

    filled.forEach((s, i) => {
      const r = 16 + i;
      const row = ws.getRow(r);
      row.height = 36;

      ws.getCell(`A${r}`).value = (s.unidadAprendizaje || '').replace(/\r\n/g, '\n');
      ws.getCell(`A${r}`).font = dataFont;
      ws.getCell(`A${r}`).alignment = dataAlign;

      ws.getCell(`B${r}`).value = (s.fechaProgramada || `Semana ${String(s.semana).padStart(2, '0')}`).replace(/\r\n/g, '\n');
      ws.getCell(`B${r}`).font = dataFont;
      ws.getCell(`B${r}`).alignment = dataAlign;

      ws.getCell(`C${r}`).value = '';
      ws.getCell(`C${r}`).font = dataFont;

      ws.getCell(`D${r}`).value = tematicasTexto(s).replace(/\r\n/g, '\n');
      ws.getCell(`D${r}`).font = dataFont;
      ws.getCell(`D${r}`).alignment = dataAlign;

      ws.getCell(`E${r}`).value = Number(s.HT) || 0;
      ws.getCell(`E${r}`).font = dataFont;
      ws.getCell(`E${r}`).alignment = numAlign;

      ws.getCell(`F${r}`).value = Number(s.HP) || 0;
      ws.getCell(`F${r}`).font = dataFont;
      ws.getCell(`F${r}`).alignment = numAlign;

      ws.getCell(`G${r}`).value = Number(s.HTI) || 0;
      ws.getCell(`G${r}`).font = dataFont;
      ws.getCell(`G${r}`).alignment = numAlign;

      ws.getCell(`H${r}`).value = (s.metodologia || '').replace(/\r\n/g, '\n');
      ws.getCell(`H${r}`).font = dataFont;
      ws.getCell(`H${r}`).alignment = dataAlign;

      ws.getCell(`I${r}`).value = (s.resultadoAprendizaje || '').replace(/\r\n/g, '\n');
      ws.getCell(`I${r}`).font = dataFont;
      ws.getCell(`I${r}`).alignment = dataAlign;

      ws.mergeCells(`J${r}:K${r}`);
      ws.getCell(`J${r}`).value = (s.observaciones || '').replace(/\r\n/g, '\n');
      ws.getCell(`J${r}`).font = dataFont;
      ws.getCell(`J${r}`).alignment = dataAlign;

      applyBordersAndFont(ws, r, 1, 11);
    });

    // ═══════════════════════════════════════════════
    // ROW 34: Totals
    // ═══════════════════════════════════════════════
    const totRow = 34;
    ws.getCell(`D${totRow}`).value = 'TOTALES';
    ws.getCell(`D${totRow}`).font = fontBase({ size: 9, bold: true });
    ws.getCell(`D${totRow}`).alignment = { horizontal: 'right', vertical: 'middle' };

    ws.getCell(`E${totRow}`).value = totHT;
    ws.getCell(`E${totRow}`).font = fontBase({ size: 9, bold: true });
    ws.getCell(`E${totRow}`).alignment = numAlign;
    ws.getCell(`E${totRow}`).fill = fillSolid(LIGHT_BLUE);

    ws.getCell(`F${totRow}`).value = totHP;
    ws.getCell(`F${totRow}`).font = fontBase({ size: 9, bold: true });
    ws.getCell(`F${totRow}`).alignment = numAlign;
    ws.getCell(`F${totRow}`).fill = fillSolid(LIGHT_BLUE);

    ws.getCell(`G${totRow}`).value = totHTI;
    ws.getCell(`G${totRow}`).font = fontBase({ size: 9, bold: true });
    ws.getCell(`G${totRow}`).alignment = numAlign;
    ws.getCell(`G${totRow}`).fill = fillSolid(LIGHT_BLUE);

    applyBordersAndFont(ws, totRow, 1, 11);

    // ═══════════════════════════════════════════════
    // ROWS 36-40: Control de versiones
    // ═══════════════════════════════════════════════
    ws.getRow(35).height = 6;
    ws.getRow(36).height = 6;

    ws.mergeCells('A37:K37');
    ws.getCell('A37').value = 'CONTROL DE VERSIONES';
    ws.getCell('A37').font = fontBase({ size: 9, bold: true, color: WHITE });
    ws.getCell('A37').fill = fillSolid(DARK_BLUE);
    ws.getCell('A37').alignment = wrapCenter;
    applyBordersAndFont(ws, 37, 1, 11);

    ws.getCell('A38').value = 'Versión';
    ws.getCell('A38').font = fontBase({ size: 8, bold: true });
    ws.mergeCells('B38:I38');
    ws.getCell('B38').value = 'Descripción del Cambio';
    ws.getCell('B38').font = fontBase({ size: 8, bold: true });
    ws.getCell('J38').value = 'Versión';
    ws.getCell('J38').font = fontBase({ size: 8, bold: true });
    ws.mergeCells('K38:K38');
    ws.getCell('K38').value = 'Fecha';
    ws.getCell('K38').font = fontBase({ size: 8, bold: true });
    applyBordersAndFont(ws, 38, 1, 11);

    ws.getCell('A39').value = '00';
    ws.getCell('A39').font = fontBase({ size: 8 });
    ws.mergeCells('B39:I39');
    ws.getCell('B39').value = 'Creación de formato y asignación de código';
    ws.getCell('B39').font = fontBase({ size: 8 });
    ws.getCell('J39').value = '01';
    ws.getCell('J39').font = fontBase({ size: 8 });
    ws.getCell('K39').value = '';
    applyBordersAndFont(ws, 39, 1, 11);

    ws.getCell('A40').value = '01';
    ws.getCell('A40').font = fontBase({ size: 8 });
    ws.mergeCells('B40:I40');
    ws.getCell('B40').value = 'Actualización formato';
    ws.getCell('B40').font = fontBase({ size: 8 });
    ws.getCell('J40').value = '02';
    ws.getCell('J40').font = fontBase({ size: 8 });
    ws.getCell('K40').value = new Date();
    ws.getCell('K40').numFmt = 'DD/MM/YYYY';
    ws.getCell('K40').font = fontBase({ size: 8 });
    applyBordersAndFont(ws, 40, 1, 11);

    // ═══════════════════════════════════════════════
    // ROWS 42-44: Firmas
    // ═══════════════════════════════════════════════
    ws.getRow(41).height = 6;

    ws.mergeCells('A42:K42');
    ws.getCell('A42').value = '';
    applyBordersAndFont(ws, 42, 1, 11);

    const firmaLabels = ['ELABORÓ', 'REVISÓ', 'APROBÓ'];
    ws.mergeCells('B43:D43');
    ws.getCell('B43').value = firmaLabels[0];
    ws.getCell('B43').font = fontBase({ size: 9, bold: true });
    ws.getCell('B43').alignment = wrapCenter;
    ws.getCell('B43').fill = fillSolid(LIGHT_BLUE);

    ws.mergeCells('E43:H43');
    ws.getCell('E43').value = firmaLabels[1];
    ws.getCell('E43').font = fontBase({ size: 9, bold: true });
    ws.getCell('E43').alignment = wrapCenter;
    ws.getCell('E43').fill = fillSolid(LIGHT_BLUE);

    ws.mergeCells('I43:K43');
    ws.getCell('I43').value = firmaLabels[2];
    ws.getCell('I43').font = fontBase({ size: 9, bold: true });
    ws.getCell('I43').alignment = wrapCenter;
    ws.getCell('I43').fill = fillSolid(LIGHT_BLUE);

    applyBordersAndFont(ws, 43, 1, 11);

    ws.getCell('A44').value = 'NOMBRE';
    ws.getCell('A44').font = fontBase({ size: 8, bold: true });
    ws.mergeCells('B44:D44');
    ws.mergeCells('E44:H44');
    ws.mergeCells('I44:K44');
    applyBordersAndFont(ws, 44, 1, 11);

    ws.getCell('A45').value = 'CARGO';
    ws.getCell('A45').font = fontBase({ size: 8, bold: true });
    ws.mergeCells('B45:D45');
    ws.mergeCells('E45:H45');
    ws.mergeCells('I45:K45');
    applyBordersAndFont(ws, 45, 1, 11);

    // ── Generate buffer and send ──
    const buffer = await wb.xlsx.writeBuffer();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="FTCOCU-129_Planeador_${info.nombre.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '').replace(/\s+/g, '_')}.xlsx"`);
    res.setHeader('Content-Length', buffer.byteLength);
    res.statusCode = 200;
    res.end(Buffer.from(buffer));
  } catch (e) {
    console.error('Error exportando planeador:', e);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: e.message }));
  }
};
