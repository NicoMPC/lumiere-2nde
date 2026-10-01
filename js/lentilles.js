'use strict';
/* Chapitre « Lentilles et œil » : cours, figures, méthode, exercices, cartes mémoire, atelier.
   Chargé après gfx.js et data.js, avant app.js. */

/* ---------- Styles propres au chapitre (préfixe lz-) ---------- */
(function () {
    if (typeof document === 'undefined' || !document.head) return;
    const st = document.createElement('style');
    st.id = 'lz-style';
    st.textContent = `
:root { --lz1: #ffb020; --lz2: #3ddc97; --lz3: #6fb1ff; }
[data-theme=light] { --lz1: #d9480f; --lz2: #0a8f5a; --lz3: #2563eb; }
.lz-axis { stroke: var(--muted); stroke-width: 1.2; }
.lz-lens { stroke: var(--accent); stroke-width: 2.6; stroke-linecap: round; fill: none; }
.lz-lensh { fill: var(--accent); stroke: none; }
.lz-obj { stroke: var(--text); stroke-width: 3; stroke-linecap: round; fill: none; }
.lz-objh { fill: var(--text); stroke: none; }
.lz-tick { stroke: var(--text); stroke-width: 1.6; }
.lz-r0 { stroke: var(--ray); stroke-width: 2.2; stroke-linecap: round; fill: none; }
.lz-r1 { stroke: var(--lz1); stroke-width: 2.2; stroke-linecap: round; fill: none; }
.lz-r2 { stroke: var(--lz2); stroke-width: 2.2; stroke-linecap: round; fill: none; }
.lz-r3 { stroke: var(--lz3); stroke-width: 2.2; stroke-linecap: round; fill: none; }
.lz-r0.lz-h { fill: var(--ray); stroke: none; }
.lz-r1.lz-h { fill: var(--lz1); stroke: none; }
.lz-r2.lz-h { fill: var(--lz2); stroke: none; }
.lz-r3.lz-h { fill: var(--lz3); stroke: none; }
.lz-t { font-size: 13px; font-weight: 600; }
.lz-c1 { color: var(--lz1); } .lz-c2 { color: var(--lz2); } .lz-c3 { color: var(--lz3); }
.lz-eye { fill: var(--glass); stroke: var(--text); stroke-width: 1.6; }
.lz-cornea { fill: none; stroke: var(--text); stroke-width: 1.6; }
.lz-iris { stroke: var(--warm); stroke-width: 4; stroke-linecap: round; }
.lz-crist { fill: var(--glass); stroke: var(--accent); stroke-width: 2; }
.lz-ret { fill: none; stroke: var(--bad); stroke-width: 4; stroke-linecap: round; }
.lz-lead { stroke: var(--muted); stroke-width: 1; }
`;
    document.head.appendChild(st);
})();

/* ---------- Figures ---------- */
/* Segment de rayon avec une petite flèche (pos = position de la flèche le long du segment, null = pas de flèche). */
function lzSeg(p, q, cls, pos = 0.5) {
    let s = `<line x1="${p[0].toFixed(2)}" y1="${p[1].toFixed(2)}" x2="${q[0].toFixed(2)}" y2="${q[1].toFixed(2)}" class="${cls}"/>`;
    if (pos !== null) {
        const mx = p[0] + (q[0] - p[0]) * pos, my = p[1] + (q[1] - p[1]) * pos;
        const ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
        s += `<polygon points="5,0 -4.5,-4 -4.5,4" transform="translate(${mx.toFixed(2)},${my.toFixed(2)}) rotate(${ang.toFixed(1)})" class="${cls} lz-h"/>`;
    }
    return s;
}
/* Symbole de la lentille convergente : trait vertical, une pointe de flèche vers l'extérieur à chaque bout. */
function lzLens(x, y1, y2) {
    return `<line x1="${x}" y1="${y1 + 6}" x2="${x}" y2="${y2 - 6}" class="lz-lens"/>` +
        `<polygon points="${x},${y1} ${x - 5.5},${y1 + 10} ${x + 5.5},${y1 + 10}" class="lz-lensh"/>` +
        `<polygon points="${x},${y2} ${x - 5.5},${y2 - 10} ${x + 5.5},${y2 - 10}" class="lz-lensh"/>`;
}
/* Flèche verticale (objet ou image) du pied (x, y0) à la pointe (x, y1). */
function lzArrow(x, y0, y1) {
    const len = Math.abs(y1 - y0), hd = Math.min(8, len * 0.55), s = y1 < y0 ? 1 : -1;
    return `<line x1="${x.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x.toFixed(2)}" y2="${(y1 + s * hd * 0.6).toFixed(2)}" class="lz-obj"/>` +
        `<polygon points="${x.toFixed(2)},${y1.toFixed(2)} ${(x - hd * 0.62).toFixed(2)},${(y1 + s * hd).toFixed(2)} ${(x + hd * 0.62).toFixed(2)},${(y1 + s * hd).toFixed(2)}" class="lz-objh"/>`;
}

/* Construction de l'image d'un objet AB par une lentille convergente.
   k = OA / f′ (de 1,3 à 4) ; rays : tracer les trois rayons ; labels : nommer les points. */
function figLens(o = {}) {
    const { rays = true, labels = true } = o;
    const k = Math.max(1.3, Math.min(4, Number(o.k) || 2.5));
    const W = 380, H = 230, ax = 110, Ox = 188, f = 42, h = 26;
    const g = 1 / (k - 1);                       /* grandissement (en valeur absolue) */
    const xa = Ox - k * f, yb = ax - h;          /* objet : A (xa, ax), B (xa, yb) */
    const xi = Ox + k * g * f, yi = ax + g * h;  /* image : A′ (xi, ax), B′ (xi, yi) */
    const ext = Math.min(22, W - 5 - xi);        /* prolongement des rayons après B′ */
    let s = `<line x1="6" y1="${ax}" x2="${W - 6}" y2="${ax}" class="lz-axis"/>`;
    s += lzLens(Ox, 10, 210);
    for (const x of [Ox - f, Ox + f]) s += `<line x1="${x}" y1="${ax - 4}" x2="${x}" y2="${ax + 4}" class="lz-tick"/>`;
    if (rays) {
        const B = [xa, yb];
        /* 1 : parallèle à l'axe, émerge en passant par F′ */
        s += lzSeg(B, [Ox, yb], 'lz-r1', 0.55) + lzSeg([Ox, yb], [xi + ext, yi + ext * h / f], 'lz-r1', 0.5 * (xi - Ox) / (xi + ext - Ox));
        /* 2 : passe par O, non dévié */
        s += lzSeg(B, [Ox, ax], 'lz-r2', 0.6) + lzSeg([Ox, ax], [xi + ext, yi + ext * h / (k * f)], 'lz-r2', 0.72 * (xi - Ox) / (xi + ext - Ox));
        /* 3 : passe par F, émerge parallèle à l'axe */
        s += lzSeg(B, [Ox, yi], 'lz-r3', 0.72) + lzSeg([Ox, yi], [xi + ext, yi], 'lz-r3', 0.3 * (xi - Ox) / (xi + ext - Ox));
    }
    s += lzArrow(xa, ax, yb) + lzArrow(xi, ax, yi);
    s += `<circle cx="${Ox}" cy="${ax}" r="2.6" class="dot"/>`;
    if (labels) {
        const t = (x, y, a, txt) => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${a}" class="lz-t">${txt}</text>`;
        const far = xi > W - 28;
        s += t(xa - 6, yb + 3, 'end', 'B') + t(xa - 4, ax + 15, 'end', 'A');
        s += t(Ox - f - 4, ax + 15, 'end', 'F') + t(Ox + 5, ax - 5, 'start', 'O') + t(Ox + f + 4, ax - 6, 'start', 'F′');
        s += t(far ? xi - 5 : xi + 5, ax - 6, far ? 'end' : 'start', 'A′') + t(xi - 7, yi + 16, 'end', 'B′');
    }
    return `<svg class="illu lz" viewBox="0 0 ${W} ${H}" role="img" aria-label="Construction de l'image A′B′ de l'objet AB par une lentille convergente : image réelle et renversée">${s}</svg>`;
}

/* Les deux foyers : type 'image' (rayons parallèles → F′) ou 'objet' (rayons issus de F → parallèles). */
function figFoyer(type = 'image') {
    const W = 320, H = 150, ax = 75, Ox = 150, f = 80, x0 = 14, x1 = 306;
    let s = `<line x1="6" y1="${ax}" x2="${W - 6}" y2="${ax}" class="lz-axis"/>` + lzLens(Ox, 8, 142);
    for (const dy of [-44, -22, 22, 44]) {
        if (type === 'image') s += lzSeg([x0, ax + dy], [Ox, ax + dy], 'lz-r0', 0.5) + lzSeg([Ox, ax + dy], [x1, ax + dy - dy * (x1 - Ox) / f], 'lz-r0', 0.3);
        else s += lzSeg([Ox - f, ax], [Ox, ax + dy], 'lz-r0', 0.6) + lzSeg([Ox, ax + dy], [x1, ax + dy], 'lz-r0', 0.5);
    }
    const fx = type === 'image' ? Ox + f : Ox - f;
    s += `<circle cx="${fx}" cy="${ax}" r="3.4" class="dot"/><circle cx="${Ox}" cy="${ax}" r="2.6" class="dot"/>`;
    s += `<text x="${Ox + 6}" y="${ax + 16}" class="lz-t">O</text>`;
    s += type === 'image'
        ? `<text x="${fx}" y="${ax + 20}" text-anchor="middle" class="lz-t">F′</text><text x="${x0}" y="${H - 8}" class="med">rayons parallèles à l'axe</text>`
        : `<text x="${fx - 6}" y="${ax + 18}" text-anchor="end" class="lz-t">F</text><text x="${x1}" y="${H - 8}" text-anchor="end" class="med">rayons parallèles à l'axe</text>`;
    return `<svg class="illu lz" viewBox="0 0 ${W} ${H}" role="img" aria-label="${type === 'image' ? 'Des rayons parallèles à l\'axe optique convergent au foyer image F′' : 'Des rayons issus du foyer objet F ressortent parallèles à l\'axe optique'}">${s}</svg>`;
}

/* L'œil (en haut) et son modèle, l'œil réduit (en bas), alignés verticalement. */
function figOeil() {
    const a1 = 82, a2 = 226;
    let s = `<text x="14" y="18" class="nm">L'œil</text><text x="14" y="182" class="nm">Le modèle : l'œil réduit</text>`;
    /* œil réel */
    s += `<circle cx="215" cy="${a1}" r="60" class="lz-eye"/><path d="M165.85,47.6 A40,40 0 0 0 165.85,116.4" class="lz-cornea"/>`;
    s += `<path d="M253.57,36.04 A60,60 0 0 1 253.57,127.96" class="lz-ret"/>`;
    s += `<line x1="172" y1="44" x2="172" y2="69" class="lz-iris"/><line x1="172" y1="95" x2="172" y2="120" class="lz-iris"/>`;
    s += `<ellipse cx="186" cy="${a1}" rx="8" ry="21" class="lz-crist"/>`;
    for (const d of [-1, 1]) s += lzSeg([40, a1 + 13 * d], [148.4, a1 + 13 * d], 'lz-r0', 0.5) + lzSeg([148.4, a1 + 13 * d], [186, a1 + 9 * d], 'lz-r0', null) + lzSeg([186, a1 + 9 * d], [274, a1], 'lz-r0', 0.45);
    s += `<line x1="131" y1="39" x2="152" y2="56" class="lz-lead"/><text x="128" y="38" text-anchor="end" class="med">cornée</text>`;
    s += `<line x1="172" y1="18" x2="172" y2="40" class="lz-lead"/><text x="172" y="13" text-anchor="middle" class="med">iris et pupille</text>`;
    s += `<line x1="186" y1="105" x2="186" y2="148" class="lz-lead"/><text x="186" y="160" text-anchor="middle" class="med">cristallin</text>`;
    s += `<text x="283" y="${a1 + 4}" class="med">rétine</text>`;
    /* modèle */
    s += `<line x1="30" y1="${a2}" x2="290" y2="${a2}" class="lz-axis"/>`;
    s += `<line x1="172" y1="190" x2="172" y2="213" class="lz-iris"/><line x1="172" y1="239" x2="172" y2="262" class="lz-iris"/>`;
    s += lzLens(186, 186, 266);
    s += `<line x1="275" y1="190" x2="275" y2="262" class="lz-ret"/>`;
    for (const d of [-1, 1]) s += lzSeg([40, a2 + 11 * d], [186, a2 + 11 * d], 'lz-r0', 0.45) + lzSeg([186, a2 + 11 * d], [274, a2], 'lz-r0', 0.45);
    s += `<text x="164" y="205" text-anchor="end" class="med">diaphragme</text>`;
    s += `<text x="186" y="282" text-anchor="middle" class="med">lentille convergente</text>`;
    s += `<text x="283" y="${a2 + 4}" class="med">écran</text>`;
    return `<svg class="illu lz" viewBox="0 0 380 292" role="img" aria-label="L'œil et son modèle : l'iris correspond au diaphragme, la cornée et le cristallin à une lentille convergente, la rétine à l'écran">${s}</svg>`;
}

/* ============ COURS ============ */
CH.push({
    id: 'lentilles', title: `Les lentilles et l'œil`, sub: 'Foyers, image, grandissement, œil réduit',
    html: () => `
    <div class="def"><b>Lentille mince convergente</b> : une lentille à <u>bords minces</u> (plus épaisse au centre que sur les bords). Elle rabat les rayons vers l'axe.<br><span class="eg">Symbole : un trait avec une pointe de flèche à chaque bout (double flèche).</span></div>
    <div class="def"><b>Axe optique</b> : la droite perpendiculaire à la lentille qui passe par son centre.<br><b>Centre optique O</b> : le point où l'axe optique traverse la lentille.</div>
    <h3>Les deux foyers</h3>
    <div class="fig">${figFoyer('image')}</div>
    <div class="def"><b>Foyer image F′</b> : le point de l'axe optique où se croisent, après la lentille, tous les rayons arrivés <u>parallèles à l'axe</u>.</div>
    <div class="fig">${figFoyer('objet')}</div>
    <div class="def"><b>Foyer objet F</b> : le symétrique de F′ par rapport à O. Un rayon qui passe par F ressort <u>parallèle à l'axe</u>.</div>
    <div class="formula">f′ = OF′<small>distance focale, en mètres (m) &nbsp;·&nbsp; OF = OF′ : les deux foyers sont à la même distance de O</small></div>
    <h3>Les trois rayons qui construisent l'image</h3>
    <div class="fig">${figLens({ k: 2.5 })}</div>
    <table class="tbl left">
      <tr><td><b class="lz-c1">Parallèle à l'axe</b></td><td>Il ressort en passant par <b>F′</b>.</td></tr>
      <tr><td><b class="lz-c2">Passant par O</b></td><td>Il n'est <b>pas dévié</b>.</td></tr>
      <tr><td><b class="lz-c3">Passant par F</b></td><td>Il ressort <b>parallèle à l'axe</b>.</td></tr>
    </table>
    <p>Les trois rayons partent de B et se croisent en un seul point : <b>B′</b>, l'image de B. L'image A′ de A est sur l'axe, juste à la verticale de B′.</p>
    <div class="def"><b>Image réelle</b> : une image que l'on peut recevoir <u>sur un écran</u>. Quand l'objet est placé avant F (plus loin de la lentille que le foyer objet), l'image est réelle et <b>renversée</b>.</div>
    <h3>Le grandissement</h3>
    <div class="formula">γ = ${F('A′B′', 'AB')} = ${F('OA′', 'OA')}<small>γ (gamma) : sans unité &nbsp;·&nbsp; les longueurs d'une même fraction dans la même unité</small></div>
    <p><b>Pourquoi les deux fractions sont égales ?</b> B, O et B′ sont alignés (le rayon par O n'est pas dévié) et (AB) est parallèle à (A′B′) : c'est une configuration de <b>Thalès</b>.</p>
    <table class="tbl"><tr><th>γ &gt; 1</th><th>γ = 1</th><th>γ &lt; 1</th></tr>
      <tr><td>image <b>agrandie</b></td><td>même taille</td><td>image <b>réduite</b></td></tr></table>
    <div class="exb">AB = 2,0 cm et A′B′ = 3,0 cm → γ = ${F('3,0', '2,0')} = 1,5 : l'image est 1,5 fois plus grande que l'objet.</div>
    <div class="trap">Certains professeurs écrivent γ avec des mesures algébriques (des longueurs avec un signe) : γ est alors <b>négatif</b> quand l'image est renversée. γ = −1,5 se lit « renversée et 1,5 fois plus grande ».</div>
    <h3>L'œil et son modèle</h3>
    <div class="fig">${figOeil()}</div>
    <table class="tbl left"><tr><th>Dans l'œil</th><th>Dans le modèle</th><th>Rôle</th></tr>
      <tr><td>iris et pupille</td><td><b>diaphragme</b></td><td>dose la lumière</td></tr>
      <tr><td>cornée et cristallin</td><td><b>lentille convergente</b></td><td>forme l'image</td></tr>
      <tr><td>rétine</td><td><b>écran</b></td><td>reçoit l'image</td></tr></table>
    <div class="def"><b>Modèle de l'œil réduit</b> : un diaphragme, une lentille convergente et un écran. L'image se forme sur la rétine : elle est réelle et renversée. C'est le cerveau qui la remet à l'endroit.</div>
    <p><a class="btn ghost" href="#atelier/lentille">Déplacer l'objet sur le banc d'optique →</a></p>`,
    quick: { q: `Un rayon arrive sur une lentille convergente parallèlement à l'axe optique. Après la lentille, il…`, opts: [`passe par le foyer image F′`, `continue tout droit`, `passe par le foyer objet F`, `repart en arrière`], a: 0, why: `Parallèle à l'axe avant la lentille → il passe par F′ après. C'est la définition du foyer image.` }
});

KEEP.lentilles = [
    `Parallèle à l'axe → passe par F′. Par O → pas dévié. Par F → ressort parallèle à l'axe.`,
    `f′ = OF′, en mètres. Objet avant F → image réelle et renversée, sur un écran.`,
    `γ = A′B′ / AB = OA′ / OA. Œil réduit : diaphragme, lentille convergente, écran.`
];

/* ============ MÉTHODE ============ */
RC.push({
    title: `Construire l'image donnée par une lentille convergente`, when: `Une lentille, un objet AB posé sur l'axe : on me demande de tracer l'image, sa position, sa taille ou son sens.`,
    steps: [
        `Je trace l'<b>axe optique</b>, la lentille (double flèche) et je place <b>O</b>.`,
        `Je place <b>F′</b> après la lentille et <b>F</b> avant, à la même distance f′ de O. <u>À l'échelle.</u>`,
        `Je place l'objet : A sur l'axe, B au-dessus, AB perpendiculaire à l'axe.`,
        `<span class="si">Si le rayon part de B parallèlement à l'axe</span> → après la lentille, il passe par F′.`,
        `<span class="si">Si le rayon part de B en visant O</span> → il continue tout droit.`,
        `<span class="si">Si le rayon part de B en passant par F</span> → après la lentille, il est parallèle à l'axe.`,
        `<b>B′</b> est au croisement des rayons (deux suffisent, le troisième vérifie). <b>A′</b> est sur l'axe, à la verticale de B′.`,
        `Je mets une <b>flèche</b> sur chaque rayon, puis je mesure OA′ et A′B′ et je reviens aux vraies longueurs avec l'échelle.`,
        `<span class="si">Si on demande le grandissement</span> → γ = ${F('A′B′', 'AB')} = ${F('OA′', 'OA')}, sans unité.`
    ],
    ex: `<b>f′ = 5,0 cm, objet AB = 2,0 cm placé à OA = 15,0 cm.</b><br>La construction donne OA′ = 7,5 cm et A′B′ = 1,0 cm, image renversée.<br>γ = ${F('A′B′', 'AB')} = ${F('1,0', '2,0')} = <b><u>0,50</u></b>. Vérification : ${F('OA′', 'OA')} = ${F('7,5', '15,0')} = 0,50. ✔`,
    trap: `Le rayon parallèle à l'axe passe par F′ (de l'autre côté de la lentille), pas par F. Et les rayons se « cassent » sur le trait de la lentille, jamais avant ni après.`
});
AIGUILLAGE.push([`Une lentille, un objet AB → on me demande l'image ou le grandissement`, RC.length - 1]);

/* ============ EXERCICES ============ */
THEMES.L = { nom: 'Lentilles et œil', short: 'Lentilles' };
EX.push(
{ id: 'L1', t: 'L', lvl: 1, type: 'qcm', q: `Un rayon lumineux arrive sur une lentille convergente en passant par son centre optique O. Que fait-il ?`, opts: [`Il traverse la lentille sans être dévié`, `Il ressort en passant par F′`, `Il ressort parallèle à l'axe optique`, `Il est renvoyé en arrière`], a: 0, hint: `C'est le seul des trois rayons de construction qui se trace d'un seul coup de règle.`, corr: [`Un rayon qui passe par le centre optique O <b>n'est pas dévié</b>.`, `Il se trace en ligne droite, de B jusqu'à B′.`] },
{ id: 'L2', t: 'L', lvl: 1, type: 'qcm', q: `Un rayon arrive sur une lentille convergente parallèlement à l'axe optique. Par quel point passe-t-il après la lentille ?`, opts: [`Le centre optique O`, `Le foyer objet F`, `Le foyer image F′`, `Aucun point particulier`], a: 2, hint: `Relis la définition des deux foyers : lequel se trouve après la lentille ?`, corr: [`Tout rayon arrivant parallèle à l'axe ressort en passant par le <b>foyer image F′</b>.`, `F′ est situé après la lentille, sur l'axe optique.`] },
{ id: 'L3', t: 'L', lvl: 2, type: 'qcm', q: `Avant d'atteindre une lentille convergente, un rayon passe par le foyer objet F. Comment ressort-il ?`, opts: [`En passant par F′`, `Parallèle à l'axe optique`, `Sans être dévié`, `En passant par O`], a: 1, hint: `C'est le trajet « inverse » du rayon qui arrive parallèle à l'axe.`, corr: [`Un rayon qui passe par le foyer objet F ressort <b>parallèle à l'axe optique</b>.`, `C'est le rayon « parallèle → F′ » parcouru dans l'autre sens.`] },
{ id: 'L4', t: 'L', lvl: 1, type: 'qcm', q: `Le foyer image F′ d'une lentille convergente, c'est le point de l'axe optique…`, opts: [`où se croisent, après la lentille, les rayons arrivés parallèles à l'axe`, `situé au centre de la lentille`, `où l'on doit placer l'objet`, `où se forme toujours l'image, quel que soit l'objet`], a: 0, hint: `Pense à l'expérience : on éclaire la lentille avec un faisceau de rayons parallèles à l'axe.`, corr: [`F′ est le point où <b>convergent les rayons arrivés parallèles à l'axe</b>.`, `L'image d'un objet proche ne se forme pas en F′ : elle se forme plus loin.`] },
{ id: 'L5', t: 'L', lvl: 1, type: 'num', q: `On éclaire une lentille convergente avec des rayons parallèles à son axe optique. Après la lentille, ils se croisent tous en un point de l'axe situé à 12,5 cm du centre optique O. Que vaut la distance focale f′, en mètres ?`, a: 0.125, tol: 0.0005, unit: 'm', hint: `Comment s'appelle le point où se croisent ces rayons ? Puis convertis : cm → m, c'est ÷ 100.`, corr: [`Les rayons arrivés parallèles à l'axe se croisent au foyer image F′.`, `f′ = OF′ = 12,5 cm.`, `Conversion : f′ = 12,5 ÷ 100 = <b>0,125 m</b>.`] },
{ id: 'L6', t: 'L', lvl: 1, type: 'qcm', q: `Voici la construction de l'image A′B′ d'un objet AB. Comment est cette image ?`, fig: () => figLens({ k: 2.5 }), opts: [`Renversée et plus petite que l'objet`, `Renversée et plus grande que l'objet`, `Droite et plus petite que l'objet`, `Droite et plus grande que l'objet`], a: 0, hint: `Compare le sens des deux flèches, puis leurs longueurs.`, corr: [`AB pointe vers le haut, A′B′ vers le bas : l'image est <b>renversée</b>.`, `A′B′ est plus courte que AB : l'image est <b>plus petite</b> que l'objet.`] },
{ id: 'L7', t: 'L', lvl: 2, type: 'num', q: `Un objet AB mesure 2,0 cm. Son image A′B′ sur l'écran mesure 5,0 cm. Calcule le grandissement γ.`, a: 2.5, tol: 0.02, unit: '(sans unité)', hint: `γ compare la taille de l'image à celle de l'objet. Laquelle va au-dessus dans la fraction ?`, corr: [`γ = ${F('A′B′', 'AB')} = ${F('5,0', '2,0')}`, `γ = <b>2,5</b> (sans unité).`, `γ &gt; 1 : l'image est agrandie. ✔`] },
{ id: 'L8', t: 'L', lvl: 3, type: 'num', q: `Un objet AB de 1,5 cm est placé à OA = 12 cm d'une lentille convergente. L'image nette se forme sur un écran placé à OA′ = 36 cm de la lentille. Quelle est la taille A′B′ de l'image ?`, a: 4.5, tol: 0.05, unit: 'cm', hint: `Thalès : A′B′ / AB = OA′ / OA. Isole A′B′.`, corr: [`Thalès : ${F('A′B′', 'AB')} = ${F('OA′', 'OA')} donc A′B′ = AB × ${F('OA′', 'OA')}`, `A′B′ = 1,5 × ${F('36', '12')} = 1,5 × 3,0`, `A′B′ = <b>4,5 cm</b>.`] },
{ id: 'L9', t: 'L', lvl: 1, type: 'qcm', q: `Pour une image obtenue sur un écran, on calcule γ = 0,40. Que peut-on dire de l'image ?`, opts: [`Elle est plus petite que l'objet`, `Elle est plus grande que l'objet`, `Elle a la même taille que l'objet`, `Elle mesure 0,40 cm`], a: 0, hint: `Compare γ à 1. Et γ a-t-il une unité ?`, corr: [`γ &lt; 1 : l'image est <b>plus petite</b> que l'objet (réduite).`, `Sa taille vaut 0,40 fois celle de l'objet. γ n'a pas d'unité : ce n'est pas une longueur.`] },
{ id: 'L10', t: 'L', lvl: 1, type: 'qcm', q: `Dans le modèle de l'œil réduit, quel élément joue le rôle de la rétine ?`, opts: [`Le diaphragme`, `La lentille convergente`, `L'écran`, `L'axe optique`], a: 2, hint: `Dans l'œil, où l'image se forme-t-elle ?`, corr: [`L'image se forme sur la rétine, au fond de l'œil.`, `Dans le modèle, ce qui reçoit l'image est l'<b>écran</b>.`] },
{ id: 'L11', t: 'L', lvl: 2, type: 'qcm', q: `Dans le modèle de l'œil réduit, que représente le diaphragme ?`, opts: [`La cornée et le cristallin`, `L'iris et sa pupille`, `La rétine`, `Le nerf optique`], a: 1, hint: `Un diaphragme est une ouverture qui laisse passer plus ou moins de lumière. Quelle partie de l'œil fait cela ?`, corr: [`Le diaphragme limite la quantité de lumière qui entre.`, `Dans l'œil, c'est le rôle de <b>l'iris</b>, dont l'ouverture est la pupille.`, `La cornée et le cristallin, eux, sont modélisés par la lentille convergente.`] },
{ id: 'L12', t: 'L', lvl: 2, type: 'qcm', q: `Pour construire une image, un élève trace depuis B un rayon parallèle à l'axe optique. Après la lentille, il le fait passer par le foyer objet F. Où est l'erreur ?`, opts: [`Ce rayon doit ressortir en passant par F′, pas par F`, `Ce rayon ne doit pas être dévié`, `Ce rayon doit ressortir parallèle à l'axe`, `Il n'y a pas d'erreur`], a: 0, hint: `De quel côté de la lentille se trouve F ? Le rayon peut-il y revenir après l'avoir traversée ?`, corr: [`F est situé avant la lentille : un rayon qui l'a traversée ne peut pas y repasser.`, `Un rayon arrivé parallèle à l'axe ressort en passant par le <b>foyer image F′</b>, situé après la lentille.`] }
);

/* ============ CARTES MÉMOIRE ============ */
FL.push(
[`Foyer image F′ ?`, `Le point de l'axe où se croisent, après la lentille, les rayons arrivés <b>parallèles à l'axe</b>.`],
[`Distance focale ?`, `f′ = OF′, en <b>mètres</b>. F et F′ sont à la même distance de O.`],
[`Les trois rayons de construction ?`, `Parallèle à l'axe → passe par <b>F′</b>. Par <b>O</b> → pas dévié. Par <b>F</b> → ressort parallèle à l'axe.`],
[`Grandissement ?`, `γ = A′B′ / AB = OA′ / OA. <b>Sans unité</b>. γ &gt; 1 : agrandie · γ &lt; 1 : réduite.`],
[`Modèle de l'œil réduit ?`, `Iris et pupille → <b>diaphragme</b>. Cornée et cristallin → <b>lentille convergente</b>. Rétine → <b>écran</b>.`]
);

/* ============ ATELIER ============ */
function labLentille() {
    const FP = 5, AB = 2;   /* f′ = 5,0 cm ; objet de 2,0 cm */
    const won = () => typeof S !== 'undefined' && S && S.lab && S.lab.lens;
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Banc d\'optique')}<h1>Banc d'optique</h1><p class="sub">Une lentille de distance focale f′ = 5,0 cm, un objet AB de 2,0 cm. Déplace l'objet et regarde ce que devient l'image.</p>
    <div class="card lab"><div class="fig" id="lz-fig"></div>
      <label class="rng">Distance objet–lentille OA = <b id="lz-oav"></b><input type="range" id="lz-oa" min="65" max="200" step="1" value="150"></label>
      <div class="readout" id="lz-out"></div></div>
    <div class="card"><h3>Le grandissement, en direct</h3><div id="lz-calc" class="calc"></div></div>
    <div class="card"><h3>Défi</h3><ul class="defis" id="lz-defi"></ul><details class="hintd"><summary>Indice</summary><p>Regarde OA et OA′ dans les valeurs affichées : γ = OA′ ÷ OA. Que faut-il pour que ce quotient vaille 1 ?</p></details></div>`;
    const rg = $('#lz-oa');
    const defi = () => $('#lz-defi').innerHTML = `<li class="${won() ? 'ok' : ''}">Trouve la position où l'image a exactement la même taille que l'objet.</li>`;
    function u(user) {
        const oa = +rg.value / 10, k = oa / FP, g = 1 / (k - 1), oi = oa * g, ab2 = AB * g;
        $('#lz-fig').innerHTML = figLens({ k });
        $('#lz-oav').textContent = fr(oa, 1) + ' cm';
        const same = Math.abs(g - 1) <= 0.03;
        let v;
        if (same) v = 'Objet à 2 f′ de la lentille : l\'image est aussi à 2 f′, renversée, <b>de même taille</b> que l\'objet.';
        else if (k > 2) v = 'Objet au-delà de 2 f′ : l\'image est <b>plus petite</b> que l\'objet. Plus l\'objet s\'éloigne, plus l\'image rétrécit et se rapproche de F′.';
        else v = 'Objet entre f′ et 2 f′ : l\'image est <b>plus grande</b> que l\'objet. Plus l\'objet s\'approche de F, plus l\'image grandit et s\'éloigne.';
        $('#lz-out').innerHTML = `<div class="vals"><span>OA = <b>${fr(oa, 1)} cm</b></span><span>OA′ = <b>${fr(oi, 1)} cm</b></span><span>A′B′ = <b>${fr(ab2, 1)} cm</b></span><span>γ = <b>${fr(g, 2)}</b></span></div><p>${v}</p>`;
        $('#lz-calc').innerHTML = `<div>γ = ${F('A′B′', 'AB')} = ${F(fr(ab2, 2), fr(AB, 1))} ≈ <b>${fr(g, 2)}</b></div>
          <div>γ = ${F('OA′', 'OA')} = ${F(fr(oi, 2), fr(oa, 1))} ≈ <b>${fr(g, 2)}</b> <span class="hintline">Thalès : les deux fractions sont égales</span></div>
          <div>${g > 1.03 ? 'γ &gt; 1 : image agrandie.' : g < 0.97 ? 'γ &lt; 1 : image réduite.' : 'γ = 1 : image de même taille que l\'objet.'} Dans tous les cas, elle est renversée.</div>`;
        if (user && same && winDefi('lens')) defi();
    }
    rg.oninput = () => u(true); defi(); u(false);
}
(window.EXTRA_LABS = window.EXTRA_LABS || []).push({ k: 'lentille', title: 'Banc d\'optique', d: 'Déplace l\'objet devant la lentille, l\'image et le grandissement suivent', fn: labLentille });
(window.EXTRA_DEFIS = window.EXTRA_DEFIS || []).push({ id: 'lens', txt: `Trouve la position où l'image a exactement la même taille que l'objet (atelier Banc d'optique).` });

QH.lentilles = `Relis les 3 rayons de construction : chacun a son propre point de passage.`;
