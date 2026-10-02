'use strict';
/* Aides d'affichage : fractions, puissances, spectres, schémas de rayons, illustrations. */

const F = (a, b) => `<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const p10 = e => `10<sup>${String(e).replace('-', '−')}</sup>`;
const fr = (x, d = 2) => Number(x).toFixed(d).replace('.', ',');

/* ---------- Spectres ---------- */
function wl2rgb(w, k = 1, bright = false) {
    let r = 0, g = 0, b = 0;
    if (w < 440) { r = (440 - w) / 60; b = 1; }
    else if (w < 490) { g = (w - 440) / 50; b = 1; }
    else if (w < 510) { g = 1; b = (510 - w) / 20; }
    else if (w < 580) { r = (w - 510) / 70; g = 1; }
    else if (w < 645) { r = 1; g = (645 - w) / 65; }
    else { r = 1; }
    let f = 1;
    if (!bright) {
        if (w < 420) f = 0.5 + 0.5 * (w - 400) / 20;
        else if (w > 700) f = 0.4 + 0.6 * (800 - w) / 100;
    }
    const c = v => Math.round(255 * Math.pow(Math.max(0, Math.min(1, v * f * k)), 0.8));
    return `rgb(${c(r)},${c(g)},${c(b)})`;
}
function planck(w, T) { const x = 1.4388e7 / (w * T); return 1 / (Math.pow(w, 5) * (Math.exp(x) - 1)); }

/* mode : 'continu' | 'emission' | 'absorption' ; bands = intervalles transmis ; T = température (K) */
let specN = 0;
function spectrum(o = {}) {
    const { mode = 'continu', lines = [], bands = null, T = null, axis = true, h = 36, title = 'spectre' } = o;
    const id = 'sg' + (++specN);
    let s = '', defs = '', max = 0;
    if (T) for (let w = 400; w <= 800; w += 4) max = Math.max(max, planck(w, T));
    if (mode === 'emission') s += `<rect x="0" y="0" width="400" height="${h}" fill="#000"/>`;
    else {
        let stops = '';
        for (let w = 400; w <= 800; w += 5) stops += `<stop offset="${((w - 400) / 4).toFixed(2)}%" stop-color="${wl2rgb(w, T ? Math.pow(planck(w, T) / max, 0.55) : 1)}"/>`;
        defs = `<defs><linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">${stops}</linearGradient></defs>`;
        s += `<rect x="0" y="0" width="400" height="${h}" fill="url(#${id})"/>`;
        if (bands) {
            let x = 400;
            for (const b of [...bands].sort((a, c) => a[0] - c[0]).concat([[800, 800]])) { if (b[0] > x) s += `<rect x="${x - 400}" y="0" width="${b[0] - x}" height="${h}" fill="#000"/>`; x = Math.max(x, b[1]); }
        }
    }
    for (const l of lines) s += `<rect x="${l - 400 - 1.4}" y="0" width="2.8" height="${h}" fill="${mode === 'emission' ? wl2rgb(l, 1, true) : '#000'}"/>`;
    let ax = '';
    if (axis) {
        for (let w = 400; w <= 800; w += 10) {
            const big = w % 100 === 0, mid = w % 50 === 0;
            ax += `<line x1="${w - 400}" y1="${h}" x2="${w - 400}" y2="${h + (big ? 9 : mid ? 6 : 3)}" class="tick"/>`;
            if (big) ax += `<text x="${w - 400}" y="${h + 24}" text-anchor="middle" class="axt">${w}</text>`;
        }
        ax += `<text x="418" y="${h + 24}" class="axt">nm</text>`;
    }
    return `<svg class="spec" viewBox="-16 -2 468 ${h + (axis ? 31 : 4)}" role="img" aria-label="${title}">${defs}${s}<rect x="0" y="0" width="400" height="${h}" class="specframe"/>${ax}</svg>`;
}

/* ---------- Schéma de rayons ---------- */
function medFill(n) { return n <= 1.001 ? 'var(--air)' : `rgba(70,160,255,${Math.min(0.5, (n - 1) * 0.3 + 0.1).toFixed(2)})`; }
function ray(p, q, cls = 'ray', pos = 0.55) {
    const mx = p[0] + (q[0] - p[0]) * pos, my = p[1] + (q[1] - p[1]) * pos;
    const ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
    return `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" class="${cls}"/>` +
        `<polygon points="6,0 -6,-5.5 -6,5.5" transform="translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${ang.toFixed(1)})" class="${cls} head"/>`;
}
function rayDiagram(o = {}) {
    const { n1 = 1, n2 = 1.33, i = 40, mirror = false, names = false, letters = false, m1 = 'air', m2 = 'eau', reflect = true, angles = true, legend = true, anim = false, hit = false } = o;
    const W = 320, H = 250, cx = 160, cy = 125, L = 112, rad = Math.PI / 180, a = i * rad;
    const s = mirror ? 2 : n1 * Math.sin(a) / n2, tot = s > 1, a2 = tot ? 0 : Math.asin(s), i2 = a2 / rad;
    const pt = (r, t) => [cx + r * Math.sin(t * rad), cy - r * Math.cos(t * rad)];
    const A = pt(L, -i), B = pt(L, i), C = pt(L, 180 - i2), I = [cx, cy];
    const arc = (r, t1, t2) => { const p = pt(r, t1), q = pt(r, t2); return `<path d="M${p[0].toFixed(1)},${p[1].toFixed(1)} A${r},${r} 0 0 ${t2 > t1 ? 1 : 0} ${q[0].toFixed(1)},${q[1].toFixed(1)}" class="arc"/>`; };
    const lab = (r, t, txt) => { const p = pt(r, t); return `<text x="${p[0].toFixed(1)}" y="${(p[1] + 4).toFixed(1)}" text-anchor="middle" class="ang">${txt}</text>`; };
    let g = `<rect x="0" y="0" width="${W}" height="${cy}" fill="${medFill(n1)}"/>`;
    if (mirror) {
        g += `<rect x="0" y="${cy}" width="${W}" height="12" class="mirror"/>`;
        for (let x = 6; x < W; x += 14) g += `<line x1="${x}" y1="${cy + 12}" x2="${x - 8}" y2="${cy + 22}" class="hatch"/>`;
    } else g += `<rect x="0" y="${cy}" width="${W}" height="${H - cy}" fill="${medFill(n2)}"/>`;
    g += `<line x1="0" y1="${cy}" x2="${W}" y2="${cy}" class="dioptre"/>`;
    g += `<line x1="${cx}" y1="6" x2="${cx}" y2="${mirror ? cy : H - 6}" class="normale"/>`;
    g += ray(A, I, 'ray');
    const showR = reflect || mirror || tot;
    if (showR) g += ray(I, B, (mirror || tot) ? 'ray' : 'ray dim', 0.5);
    if (!mirror && !tot) g += ray(I, C, 'ray', 0.5);
    if (angles && i > 3) {
        g += arc(36, 0, -i) + lab(50, -i / 2, 'i₁');
        if (showR) g += arc(36, 0, i) + lab(50, i / 2, 'r');
        if (!mirror && !tot && i2 > 2) g += arc(36, 180, 180 - i2) + lab(52, 180 - i2 / 2, 'i₂');
    }
    g += `<circle cx="${cx}" cy="${cy}" r="3" class="dot"/>`;
    if (legend) {
        g += `<text x="8" y="${cy - 8}" class="med">${mirror ? m1 : 'milieu 1 : ' + m1}</text>`;
        g += mirror ? `<text x="8" y="${cy + 38}" class="med">miroir</text>` : `<text x="8" y="${cy + 17}" class="med">milieu 2 : ${m2}</text>`;
    }
    if (names) {
        g += `<text x="${cx + 5}" y="16" class="med">normale</text>`;
        g += `<text x="${cx - 9}" y="${cy + 16}" text-anchor="end" class="ang">I</text>`;
        g += `<text x="${W - 6}" y="${cy - 7}" text-anchor="end" class="med">${mirror ? 'surface' : 'dioptre'}</text>`;
        g += `<text x="${A[0] - 2}" y="${A[1] - 8}" text-anchor="middle" class="nm">rayon incident</text>`;
        if (showR) g += `<text x="${B[0] + 4}" y="${B[1] - 8}" text-anchor="middle" class="nm">rayon réfléchi</text>`;
        if (!mirror && !tot) g += `<text x="${C[0] + 8}" y="${C[1] + 2}" class="nm">rayon réfracté</text>`;
    }
    if (letters) {
        const badge = (p, t, dx, dy) => `<circle cx="${(p[0] + dx).toFixed(1)}" cy="${(p[1] + dy).toFixed(1)}" r="11" class="badge"/><text x="${(p[0] + dx).toFixed(1)}" y="${(p[1] + dy + 4.5).toFixed(1)}" text-anchor="middle" class="badget">${t}</text>`;
        g += badge(A, 'A', -4, -4) + badge(B, 'B', 4, -4) + badge(C, 'C', 10, 4);
    }
    if (anim) {
        const end = (mirror || tot) ? B : C;
        g += `<circle r="5" class="photon"><animateMotion dur="2.4s" repeatCount="indefinite" path="M${A[0].toFixed(1)},${A[1].toFixed(1)} L${cx},${cy} L${end[0].toFixed(1)},${end[1].toFixed(1)}"/></circle>`;
    }
    if (hit) {
        const hl = (p, q, k) => `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" class="hit" data-k="${k}"/>`;
        g += hl([0, cy], [W, cy], 'dioptre') + hl([cx, 6], [cx, H - 6], 'normale') + hl(A, I, 'incident') + hl(I, B, 'reflechi') + hl(I, C, 'refracte') + `<circle cx="${cx}" cy="${cy}" r="15" class="hit" data-k="point"/>`;
    }
    return `<svg class="rays" viewBox="0 0 ${W} ${H}" role="img" aria-label="schéma de rayons lumineux">${g}</svg>`;
}

/* ---------- Illustrations du cours ---------- */
function figSources() {
    let sun = '';
    for (let k = 0; k < 12; k++) { const t = k * 30 * Math.PI / 180; sun += `<line x1="${(52 + 28 * Math.cos(t)).toFixed(1)}" y1="${(52 + 28 * Math.sin(t)).toFixed(1)}" x2="${(52 + 38 * Math.cos(t)).toFixed(1)}" y2="${(52 + 38 * Math.sin(t)).toFixed(1)}" stroke="#ffc933" stroke-width="3" stroke-linecap="round"/>`; }
    return `<svg class="illu src" viewBox="0 0 320 190" role="img" aria-label="Le Soleil éclaire la Lune, qui renvoie la lumière vers l'œil">
    <g class="sunlight">${sun}</g><circle cx="52" cy="52" r="22" class="sun"/>
    <g class="moon"><circle cx="262" cy="46" r="20" class="moonb"/><circle cx="256" cy="40" r="4" class="crat"/><circle cx="270" cy="52" r="5" class="crat"/><circle cx="259" cy="56" r="2.5" class="crat"/></g>
    <g class="sunlight">${ray([92, 50], [238, 46], 'ray')}${ray([250, 68], [186, 138], 'ray')}
    <circle r="4.5" class="photon"><animateMotion dur="3s" repeatCount="indefinite" path="M92,50 L238,46 L250,68 L186,138"/></circle></g>
    <path d="M140,150 Q168,128 196,150 Q168,172 140,150 Z" class="eye"/><circle cx="168" cy="150" r="9" class="iris"/><circle cx="168" cy="150" r="4" fill="#000"/>
    <text x="52" y="108" text-anchor="middle" class="nm">Soleil</text><text x="52" y="122" text-anchor="middle" class="med">source primaire</text>
    <text x="316" y="86" text-anchor="end" class="nm">Lune</text><text x="316" y="100" text-anchor="end" class="med">source secondaire</text>
    <text x="168" y="184" text-anchor="middle" class="med">l'œil reçoit la lumière</text>
    </svg>`;
}
function figOmbre(cx = 130) {
    const r = 22, lx = 30, ly = 90, sx = 290, d = cx - lx, a = Math.asin(r / d), L = Math.sqrt(d * d - r * r);
    const tx = lx + L * Math.cos(a), dy = L * Math.sin(a), h = (sx - lx) * Math.tan(a);
    const y1 = Math.max(6, ly - h), y2 = Math.min(174, ly + h), f = v => v.toFixed(1);
    const out = h < 70;
    return `<svg class="illu" viewBox="0 0 320 180" role="img" aria-label="Une source, un objet opaque et son ombre sur un écran">
    <polygon points="${f(tx)},${f(ly - dy)} ${sx},${f(y1)} ${sx},${f(y2)} ${f(tx)},${f(ly + dy)}" class="shadow"/>
    ${out ? ray([lx, ly], [sx, 14], 'ray', 0.35) + ray([lx, ly], [sx, 166], 'ray', 0.35) : ''}
    <line x1="${lx}" y1="${ly}" x2="${f(tx)}" y2="${f(ly - dy)}" class="ray"/><line x1="${lx}" y1="${ly}" x2="${f(tx)}" y2="${f(ly + dy)}" class="ray"/>
    <line x1="${f(tx)}" y1="${f(ly - dy)}" x2="${sx}" y2="${f(y1)}" class="normale"/><line x1="${f(tx)}" y1="${f(ly + dy)}" x2="${sx}" y2="${f(y2)}" class="normale"/>
    <circle cx="${lx}" cy="${ly}" r="9" fill="#ffc933"/>
    <circle cx="${cx}" cy="${ly}" r="${r}" class="opaque"/>
    <line x1="${sx}" y1="6" x2="${sx}" y2="174" class="dioptre"/><line x1="${sx}" y1="${f(y1)}" x2="${sx}" y2="${f(y2)}" stroke="#000" stroke-width="7"/>
    <text x="${lx}" y="118" text-anchor="middle" class="med">source</text><text x="${cx}" y="${ly + 4}" text-anchor="middle" class="med" style="fill:#000">opaque</text>
    <text x="${f((cx + sx) / 2 + 14)}" y="94" text-anchor="middle" class="nm">ombre</text><text x="284" y="178" text-anchor="end" class="med">écran</text>
    </svg>`;
}
/* Mascotte : un photon */
function lumi(mood = 'ok') {
    const mouth = mood === 'wow' ? '<ellipse cx="32" cy="40" rx="5" ry="6" fill="#3b2a00"/>' : '<path d="M23,37 Q32,47 41,37" fill="none" stroke="#3b2a00" stroke-width="2.6" stroke-linecap="round"/>';
    let rays = '';
    for (let k = 0; k < 8; k++) { const t = k * 45 * Math.PI / 180; rays += `<line x1="${(32 + 25 * Math.cos(t)).toFixed(1)}" y1="${(32 + 25 * Math.sin(t)).toFixed(1)}" x2="${(32 + 30 * Math.cos(t)).toFixed(1)}" y2="${(32 + 30 * Math.sin(t)).toFixed(1)}"/>`; }
    return `<svg class="lumi" viewBox="0 0 64 64" aria-hidden="true"><g class="lumi-rays" stroke="#ffd84d" stroke-width="3" stroke-linecap="round">${rays}</g><circle cx="32" cy="32" r="20" fill="#ffd84d"/><circle cx="25" cy="28" r="3.2" fill="#3b2a00"/><circle cx="39" cy="28" r="3.2" fill="#3b2a00"/>${mouth}</svg>`;
}
function colorName(w) { return w < 400 ? 'ultraviolet' : w < 430 ? 'violet' : w < 490 ? 'bleu' : w < 570 ? 'vert' : w < 590 ? 'jaune' : w < 620 ? 'orange' : w <= 800 ? 'rouge' : 'infrarouge'; }
function figSoleilTerre() {
    return `<svg class="illu" viewBox="0 0 320 96" role="img" aria-label="La lumière du Soleil met 8 minutes 20 secondes pour atteindre la Terre">
    <circle cx="30" cy="48" r="20" fill="#ffc933"/>
    <line x1="56" y1="48" x2="282" y2="48" class="normale"/>
    <circle cx="295" cy="48" r="9" fill="#3b82f6"/><path d="M290,44 q4,-4 8,0 q-2,5 -6,3 z" fill="#22c55e"/>
    <circle r="5" cy="48" fill="#fff8d6" stroke="#ffc933" stroke-width="2"><animate attributeName="cx" from="56" to="282" dur="2.6s" repeatCount="indefinite"/></circle>
    <text x="168" y="34" text-anchor="middle" class="nm">150 millions de km</text>
    <text x="168" y="72" text-anchor="middle" class="nm">8 min 20 s</text>
    <text x="30" y="88" text-anchor="middle" class="med">Soleil</text><text x="295" y="76" text-anchor="middle" class="med">Terre</text>
    </svg>`;
}
function figPrisme(anim = false) {
    const cols = ['#ff2a2a', '#ff8a1e', '#ffe21e', '#2fd35a', '#22b8ff', '#4a55ff', '#9a3cff'];
    let fan = '';
    cols.forEach((c, k) => {
        const t = k / 6, x1 = 192 + 6 * t, y1 = 87.5 + 11 * t, y2 = 96 + 62 * t;
        fan += `<line x1="122.3" y1="97.5" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="${c}" stroke-width="1.6" opacity=".8"/>`;
        fan += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="314" y2="${y2.toFixed(1)}" stroke="${c}" stroke-width="4" stroke-linecap="round" class="${anim ? 'fan' : ''}" style="animation-delay:${(0.5 + k * 0.08).toFixed(2)}s"/>`;
    });
    return `<svg class="illu prism" viewBox="0 0 320 180" role="img" aria-label="Un prisme décompose la lumière blanche : le rouge est le moins dévié, le violet le plus dévié">
    <line x1="6" y1="121" x2="122.3" y2="97.5" stroke="#fff" stroke-width="4" stroke-linecap="round" class="white ${anim ? 'beam' : ''}"/>
    ${fan}
    <polygon points="160,25 95,150 225,150" class="glass"/>
    ${anim ? '' : `<text x="8" y="142" class="med">lumière blanche</text><text x="312" y="74" text-anchor="end" class="med">rouge : le moins dévié</text><text x="312" y="174" text-anchor="end" class="med">violet : le plus dévié</text><text x="160" y="166" text-anchor="middle" class="med">prisme</text>`}
    </svg>`;
}
function figRGB(on = [1, 1, 1], labels = true) {
    const c = (x, y, col, k) => on[k] ? `<circle cx="${x}" cy="${y}" r="56" fill="${col}" style="mix-blend-mode:screen"/>` : '';
    const all = on[0] && on[1] && on[2];
    return `<svg class="illu rgb" viewBox="0 0 220 210" role="img" aria-label="Synthèse additive : rouge, vert, bleu">
    <g style="isolation:isolate"><rect x="0" y="0" width="220" height="210" rx="14" fill="#000"/>
    ${c(110, 78, '#ff0000', 0)}${c(78, 132, '#00ff00', 1)}${c(142, 132, '#0000ff', 2)}</g>
    ${labels ? `${on[0] && on[1] ? '<text x="76" y="98" text-anchor="middle" class="rgbt">jaune</text>' : ''}${on[0] && on[2] ? '<text x="143" y="98" text-anchor="middle" class="rgbt">magenta</text>' : ''}${on[1] && on[2] ? '<text x="110" y="156" text-anchor="middle" class="rgbt">cyan</text>' : ''}${all ? '<text x="110" y="118" text-anchor="middle" class="rgbt">blanc</text>' : ''}` : ''}
    </svg>`;
}
function figFiltre() {
    return `<svg class="illu" viewBox="0 0 320 110" role="img" aria-label="Un filtre rouge laisse passer le rouge et absorbe le vert et le bleu">
    ${ray([14, 30], [150, 30], 'cr', 0.5)}${ray([14, 55], [150, 55], 'cg', 0.5)}${ray([14, 80], [150, 80], 'cb', 0.5)}
    ${ray([170, 30], [306, 30], 'cr', 0.5)}
    <rect x="150" y="10" width="20" height="90" rx="3" fill="#ff2a2a" opacity=".55" stroke="#ff2a2a"/>
    <text x="160" y="108" text-anchor="middle" class="med"></text>
    <text x="182" y="60" class="med">vert absorbé</text><text x="182" y="85" class="med">bleu absorbé</text>
    <text x="14" y="16" class="med">lumière blanche</text><text x="306" y="16" text-anchor="end" class="med">lumière rouge</text>
    </svg>`;
}
function figTshirt(col) {
    return `<svg class="illu tshirt" viewBox="0 0 160 140" role="img" aria-label="tee-shirt"><rect width="160" height="140" rx="14" fill="#05070f"/>
    <path d="M52,22 L28,34 L12,62 L32,74 L42,60 L42,122 L118,122 L118,60 L128,74 L148,62 L132,34 L108,22 Q80,44 52,22 Z" fill="${col}" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/></svg>`;
}
