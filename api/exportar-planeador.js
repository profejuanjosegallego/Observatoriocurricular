const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const { getDb } = require('../lib/mongo');
const { MATERIAS_INFO } = require('../lib/constants');

// Carpeta con los planeadores originales (uno por materia) usados como plantilla exacta.
const PLANTILLAS_DIR = path.join(__dirname, '_plantillas');
const ROW_SEMANA_1 = 16; // Las 18 semanas ocupan las filas 16..33 del formato FTCOCU-129.

const NIVELES_ROMAN = { 1: 'I', 2: 'II', 3: 'III' };

// Norma de Competencia Laboral (SENA) por materia. Solo las materias que tienen norma asignada.
// Para agregar o cambiar una norma, basta con editar este mapa (materiaId: 'número').
const NORMAS_COMPETENCIA = {
  agiles: '220501131',
  frontend2: '220501123',
};

// Datos institucionales generales que aplican a todos los planeadores.
const NOMBRE_ESCUELA = 'Escuela de Tecnología y Administración';

// El planeador original institucional NO tiene fondo de color; con este interruptor en false
// el export sale igual (blanco, solo bordes). Ponerlo en true restaura los encabezados azules.
const USAR_RELLENO = false;

const DARK_BLUE = { argb: 'FF002060' };
const MED_BLUE = { argb: 'FF4472C4' };
const LIGHT_BLUE = { argb: 'FFD6E4F0' };
const WHITE = { argb: 'FFFFFFFF' };
const BLACK = { argb: 'FF000000' };
const GREEN = { argb: 'FF107C41' }; // verde para identificar lo anexado/cambiado

// Color del texto de los encabezados: blanco cuando hay relleno azul, negro cuando el fondo es blanco
// (si no, el texto blanco quedaría invisible sobre blanco).
const HEADER_TEXT = USAR_RELLENO ? WHITE : BLACK;

const THIN_BORDER = { style: 'thin', color: BLACK };
const ALL_BORDERS = { top: THIN_BORDER, left: THIN_BORDER, bottom: THIN_BORDER, right: THIN_BORDER };

function fontBase(overrides = {}) {
  return { name: 'Arial', size: 9, ...overrides };
}

// Devuelve el relleno solo si USAR_RELLENO está activo; en false no pinta fondo (undefined = sin relleno).
function fillSolid(color) {
  return USAR_RELLENO ? { type: 'pattern', pattern: 'solid', fgColor: color } : undefined;
}

// Normaliza una línea de temática para comparar contra el respaldo (baseline) sin falsos positivos.
function normLine(s) {
  return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().toLowerCase();
}

// Índice del respaldo: semana -> Set de textos originales normalizados. Sirve de línea base del diff.
function baselineDeBackup(backup) {
  if (!backup || !Array.isArray(backup.semanas)) return null;
  const idx = {};
  for (const w of backup.semanas) {
    const set = new Set();
    const det = Array.isArray(w.tematicasDetalle) ? w.tematicasDetalle : null;
    if (det && det.length) {
      det.forEach(t => { const n = normLine(t && t.texto); if (n) set.add(n); });
    } else if (w.tematicas) {
      String(w.tematicas).split('\n').forEach(l => { const n = normLine(l); if (n) set.add(n); });
    }
    idx[Number(w.semana)] = set;
  }
  return idx;
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

// Una temática es "anexada" (cambio posterior a la importación del planeador) si su detalle trae
// autor de edición, o si es una recomendación transversal ("Objetivo del semestre — …").
function esAnexado(t) {
  if (!t) return false;
  const texto = String(t.texto || '');
  return !!t.editadoPor || /^\s*Objetivo del semestre\s*—/i.test(texto);
}

// Arma el texto enriquecido de las temáticas anexadas: primero lo original, un espacio en blanco y
// luego lo cambiado en verde. `origTexts` y `camTexts` son arreglos de líneas ya separadas.
function tematicasRichText(origTexts, camTexts) {
  const runs = [];
  const origText = origTexts.join('\n').replace(/\r\n/g, '\n');
  if (origText) runs.push({ text: origText, font: fontBase({ size: 8 }) });
  runs.push({ text: origText ? '\n\n' : '', font: fontBase({ size: 8 }) });
  runs.push({ text: camTexts.join('\n').replace(/\r\n/g, '\n'), font: fontBase({ size: 8, bold: true, color: GREEN }) });
  return { richText: runs };
}

// Construye el valor de la celda de temáticas. Lo cambiado respecto de la versión original (baseSet, si
// hay respaldo; si no, la heurística de anexado) sale en verde tras un espacio; lo original en negro.
function buildTematicas(s, baseSet) {
  const esCambio = (texto, t) => baseSet ? !baseSet.has(normLine(texto)) : esAnexado(t);

  const detalle = Array.isArray(s.tematicasDetalle)
    ? s.tematicasDetalle.filter(t => String(t && t.texto || '').trim())
    : null;

  if (detalle && detalle.length) {
    const originales = detalle.filter(t => !esCambio(t.texto, t));
    const cambios = detalle.filter(t => esCambio(t.texto, t));
    if (!cambios.length) return detalle.map(t => t.texto).join('\n').replace(/\r\n/g, '\n');
    return tematicasRichText(originales.map(t => t.texto), cambios.map(t => t.texto));
  }

  // Texto plano: se compara línea por línea.
  const texto = (s.tematicas || '').replace(/\r\n/g, '\n');
  if (!texto.trim()) return '';
  const origs = [], cams = [];
  for (const l of texto.split('\n')) {
    if (l.trim() && esCambio(l, null)) cams.push(l); else origs.push(l);
  }
  if (!cams.length) return texto;
  return tematicasRichText(origs, cams);
}

// Devuelve el texto plano de una celda (soporta texto enriquecido y fórmulas).
function textoCelda(cell) {
  let v = cell && cell.value;
  if (v && typeof v === 'object') {
    if (v.richText) return v.richText.map(t => t.text).join('');
    if (v.result !== undefined) return String(v.result);
    if (v.text) return v.text;
    return '';
  }
  return v == null ? '' : String(v);
}

// Lista de temáticas actuales de una semana (detalle si existe; si no, el texto por líneas).
function entradasTematicas(s) {
  if (Array.isArray(s.tematicasDetalle) && s.tematicasDetalle.length) {
    return s.tematicasDetalle.map(t => String(t && t.texto || '')).filter(x => x.trim());
  }
  return String(s.tematicas || '').split('\n').filter(x => x.trim());
}

// Semanas en las que NO se deben anexar temáticas (verde), por materia. Se muestra solo lo original.
const SIN_ANEXAR = { logica: new Set([2]) };

// Columnas a considerar para el alto de fila (letra de la celda + columnas que ocupa su ancho).
const COLS_FIT = [
  { addr: 'A', anchos: [1] },
  { addr: 'B', anchos: [2] },
  { addr: 'D', anchos: [4] },
  { addr: 'H', anchos: [8] },
  { addr: 'I', anchos: [9] },
  { addr: 'J', anchos: [10, 11] }, // Observaciones (J:K combinadas)
];

// Ajusta el alto de cada fila de datos para que se vea TODO el texto envuelto, sin estirar a mano.
// Estima líneas por celda según el ancho de columna; sobreestima un poco para no recortar.
function ajustarAlturaFilas(ws, filaIni, filaFin) {
  const anchoDe = (col) => { const c = ws.getColumn(col); return (c && c.width) ? c.width : 8.43; };
  const contarLineas = (texto, chars) => String(texto || '').split('\n')
    .reduce((a, l) => a + Math.max(1, Math.ceil(l.length / Math.max(1, chars))), 0);
  for (let r = filaIni; r <= filaFin; r++) {
    let maxLineas = 1;
    for (const c of COLS_FIT) {
      const txt = textoCelda(ws.getCell(`${c.addr}${r}`));
      const ancho = c.anchos.reduce((s, n) => s + anchoDe(n), 0);
      maxLineas = Math.max(maxLineas, contarLineas(txt, Math.floor(ancho)));
    }
    // Alto de Excel en puntos; ~12.5 pt por línea. Tope 409 (máximo de Excel).
    ws.getRow(r).height = Math.min(409, Math.max(24, maxLineas * 12.5 + 4));
  }
}

// Genera el Excel a partir del archivo ORIGINAL de la materia (plantilla), garantizando formato 100%
// idéntico. Solo modifica la columna de temáticas: conserva lo original en negro y agrega en verde,
// tras un espacio, lo que no está en el planeador original (los anexos). Devuelve null si no hay plantilla.
async function construirDesdePlantilla(materiaId, info, filled) {
  const ruta = path.join(PLANTILLAS_DIR, `${materiaId}.xlsx`);
  if (!fs.existsSync(ruta)) return null;

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(ruta);
  const ws = wb.worksheets[0];

  const omitir = SIN_ANEXAR[materiaId];
  for (let i = 0; i < 18; i++) {
    const r = ROW_SEMANA_1 + i;
    // Columna Semana/Fecha: solo el número de semana, sin las fechas.
    ws.getCell(`B${r}`).value = `Semana ${i + 1}`;

    const s = filled[i];
    if (!s) continue;
    if (omitir && omitir.has(i + 1)) continue; // Semana marcada: sin verde, se deja solo lo original.
    const dCell = ws.getCell(`D${r}`);
    const original = textoCelda(dCell).replace(/\r\n/g, '\n');
    const baseNorm = normLine(original);

    const anexados = entradasTematicas(s).filter(t => !baseNorm.includes(normLine(t)));
    if (!anexados.length) continue; // Sin cambios: se deja la celda original intacta.

    const baseFont = dCell.font || fontBase({ size: 8 });
    dCell.value = {
      richText: [
        { text: original, font: baseFont },
        { text: original ? '\n\n' : '', font: baseFont },
        { text: anexados.join('\n'), font: { ...baseFont, bold: true, color: GREEN } },
      ],
    };
  }

  // Número de Norma de Competencia Laboral (la plantilla ya lo trae en las materias que lo tienen;
  // se refuerza desde el mapa por si acaso, preservando el estilo de la celda).
  const norma = NORMAS_COMPETENCIA[materiaId];
  if (norma) ws.getCell('H8').value = norma;

  // Ajustes institucionales generales (aplican a todas las materias).
  ws.getCell('A6').value = NOMBRE_ESCUELA; // antes "Escuela de Nuevas Tecnologías"
  ws.getCell('K6').value = null;           // Periodo en blanco (antes "1-2025")

  // Alto de fila automático para que todo el contenido sea visible sin estirar.
  ajustarAlturaFilas(ws, ROW_SEMANA_1, ROW_SEMANA_1 + 17);

  return wb;
}

// Arma el libro de Excel del planeador con el formato institucional FTCOCU-129 exacto.
// Respaldo cuando no hay plantilla del original disponible. Se separa del handler para poder probarlo sin BD.
function construirWorkbook(materiaId, info, filled, baseline) {
  const totHT = filled.reduce((a, s) => a + (Number(s.HT) || 0), 0);
  const totHP = filled.reduce((a, s) => a + (Number(s.HP) || 0), 0);
  const totHTI = filled.reduce((a, s) => a + (Number(s.HTI) || 0), 0);
  const totalHoras = totHT + totHP + totHTI;
  const unidades = [...new Set(filled.map(s => s.unidadAprendizaje).filter(Boolean))];

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
  const labelFont = fontBase({ size: 8, bold: true, color: HEADER_TEXT });
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
  ws.getCell('A6').value = NOMBRE_ESCUELA;
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

  // Número de Norma de Competencia Laboral (debajo de la etiqueta, en H8). Solo si la materia tiene norma.
  const norma = NORMAS_COMPETENCIA[materiaId];
  if (norma) {
    ws.getCell('H8').value = norma;
    ws.getCell('H8').font = fontBase({ size: 8, bold: true });
    ws.getCell('H8').alignment = { vertical: 'middle', horizontal: 'left' };
  }

  // ═══════════════════════════════════════════════
  // ROWS 12-13: Spacer
  // ═══════════════════════════════════════════════
  ws.getRow(12).height = 6;
  ws.getRow(13).height = 6;

  // ═══════════════════════════════════════════════
  // ROWS 14-15: Table headers (two-row header)
  // ═══════════════════════════════════════════════
  const thFont = fontBase({ size: 8, bold: true, color: HEADER_TEXT });
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

    ws.getCell(`B${r}`).value = `Semana ${s.semana}`;
    ws.getCell(`B${r}`).font = dataFont;
    ws.getCell(`B${r}`).alignment = dataAlign;

    ws.getCell(`C${r}`).value = '';
    ws.getCell(`C${r}`).font = dataFont;

    ws.getCell(`D${r}`).value = buildTematicas(s, baseline && baseline[Number(s.semana)]);
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
  ws.getCell('A37').font = fontBase({ size: 9, bold: true, color: HEADER_TEXT });
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

  // Alto de fila automático para que todo el contenido sea visible sin estirar.
  ajustarAlturaFilas(ws, ROW_SEMANA_1, ROW_SEMANA_1 + 17);

  return wb;
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
    const [semanas, backup] = await Promise.all([
      db.collection('planeadores').find({ materiaId }).sort({ semana: 1 }).toArray(),
      db.collection('planeadores_backup').findOne({ materiaId }),
    ]);

    const filled = Array.from({ length: 18 }, (_, i) => {
      const s = semanas.find(d => d.semana === i + 1);
      return s || { semana: i + 1, unidadAprendizaje: '', fechaProgramada: '', tematicas: '', HT: 0, HP: 0, HTI: 0, metodologia: '', resultadoAprendizaje: '', observaciones: '' };
    });

    // 1) Ruta preferida: usar el planeador ORIGINAL de la materia como plantilla (formato 100% idéntico)
    //    y marcar en verde solo lo anexado respecto de ese original.
    // 2) Respaldo: si no hay plantilla, se arma el formato a mano y el verde se calcula contra el backup.
    let wb = await construirDesdePlantilla(materiaId, info, filled);
    if (!wb) {
      const baseline = baselineDeBackup(backup);
      wb = construirWorkbook(materiaId, info, filled, baseline);
    }
    const buffer = await wb.xlsx.writeBuffer();

    // Nombre del archivo. Las cabeceras HTTP son Latin-1, por lo que las tildes/eñes rompen el
    // filename clásico. Se envían dos: filename="…" en ASCII (sin tildes) y filename*=UTF-8''… (RFC 5987).
    const base = info.nombre.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '').replace(/\s+/g, '_');
    const nombreUtf8 = `FTCOCU-129_Planeador_${base}.xlsx`;
    const nombreAscii = nombreUtf8.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7E]/g, '_');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreAscii}"; filename*=UTF-8''${encodeURIComponent(nombreUtf8)}`);
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

module.exports.construirWorkbook = construirWorkbook;
module.exports.construirDesdePlantilla = construirDesdePlantilla;
module.exports.buildTematicas = buildTematicas;
module.exports.baselineDeBackup = baselineDeBackup;
module.exports.NORMAS_COMPETENCIA = NORMAS_COMPETENCIA;
