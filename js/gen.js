'use strict';
/* Générateurs de petites questions à valeurs aléatoires.
   Chargé après gfx.js et data.js. Chaque générateur reçoit rnd() (voir mulberry) et renvoie un exercice.
   Même graine → même question. Seul rnd sert de source de hasard. */

function mulberry(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* ---------- Aides internes ---------- */
const gInt = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1));
const gPick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
/* exposant écrit dans une somme : (−5) si négatif */
const gPar = e => e < 0 ? `(−${-e})` : `${e}`;
/* dixièmes entiers → « 1,5 » */
const gTen = k => fr(k / 10, 1);
/* valeur exacte de k × 10^e (k entier) */
const gVal = (k, e) => Number(`${k}e${e}`);
/* k × 10^e (k entier > 0) → écriture scientifique « 1,26 × 10^n » */
function gSci(k, e) {
    const s = String(k);
    let rest = s.slice(1).replace(/0+$/, '');
    if (!rest) rest = '0';
    return `${s[0]},${rest} × ${p10(e + s.length - 1)}`;
}
/* écriture décimale simple si la valeur est un entier « lisible », sinon '' */
function gPlain(k, e, unit) {
    if (e < 0) return '';
    const v = gVal(k, e);
    if (v < 10 || v >= 1e6) return '';
    return ` (${String(v).replace(/\B(?=(\d{3})+$)/g, ' ')} ${unit})`;
}
const gSciVal = r => (Number.isNaN(r.m) ? 1 : r.m) * Math.pow(10, r.e);
const gNear = (v, ref, rel = 0.011) => Number.isFinite(v) && ref !== 0 && Math.abs(v / ref - 1) <= rel;
const gList = arr => arr.length === 1 ? `${arr[0]}` : `${arr.slice(0, -1).join(', ')} et ${arr[arr.length - 1]}`;

const G_C = `c = 3,00 × ${p10(8)} m/s`;

/* Milieux : nom, indice, « de … », « dans … » */
const G_MIL = [
    { nom: 'air', n: 1.00, de: `de l'air`, dans: `dans l'air` },
    { nom: 'eau', n: 1.33, de: `de l'eau`, dans: `dans l'eau` },
    { nom: 'éthanol', n: 1.36, de: `de l'éthanol`, dans: `dans l'éthanol` },
    { nom: 'glycérol', n: 1.47, de: `du glycérol`, dans: `dans le glycérol` },
    { nom: 'verre', n: 1.50, de: `du verre`, dans: `dans le verre` },
    { nom: 'diamant', n: 2.42, de: `du diamant`, dans: `dans le diamant` }
];
const G_RAD = Math.PI / 180;

/* Couples (milieu inconnu, i₁) dont les angles ARRONDIS redonnent un indice proche de la valeur réelle */
const G_INCONNUS = (() => {
    const out = [];
    for (const m of G_MIL) {
        if (m.n === 1) continue;
        for (let i1 = 20; i1 <= 70; i1++) {
            const i2 = Math.round(Math.asin(Math.sin(i1 * G_RAD) / m.n) / G_RAD);
            const n = Math.sin(i1 * G_RAD) / Math.sin(i2 * G_RAD);
            if (Math.abs(n - m.n) <= 0.012) out.push({ m, i1, i2, n: Math.round(n * 100) / 100 });
        }
    }
    return out;
})();

const G_ELEM = {
    H: { le: `l'hydrogène`, Le: `L'hydrogène`, de: `de l'hydrogène` },
    Na: { le: `le sodium`, Le: `Le sodium`, de: `du sodium` },
    He: { le: `l'hélium`, Le: `L'hélium`, de: `de l'hélium` },
    Hg: { le: `le mercure`, Le: `Le mercure`, de: `du mercure` },
    Li: { le: `le lithium`, Le: `Le lithium`, de: `du lithium` }
};
/* sodium (589) et hélium (588) : jamais ensemble */
const gCompat = (x, y) => x !== y && !((x === 'Na' && y === 'He') || (x === 'He' && y === 'Na'));

const G_SOURCES = [
    [`Le Soleil`, 1, `Le Soleil fabrique sa propre lumière.`],
    [`Une étoile`, 1, `Une étoile fabrique sa propre lumière, comme le Soleil.`],
    [`Une flamme de bougie`, 1, `La flamme fabrique sa propre lumière.`],
    [`Une lampe de bureau allumée`, 1, `Allumée, la lampe fabrique sa propre lumière.`],
    [`Un écran de téléphone allumé`, 1, `Allumé, l'écran fabrique sa propre lumière.`],
    [`Un laser allumé`, 1, `Le laser fabrique sa propre lumière.`],
    [`Un éclair`, 1, `L'éclair fabrique sa propre lumière.`],
    [`De la lave en fusion`, 1, `Très chaude, la lave fabrique sa propre lumière.`],
    [`Un feu de bois`, 1, `Les flammes fabriquent leur propre lumière.`],
    [`Une braise rougeoyante`, 1, `Très chaude, la braise fabrique sa propre lumière.`],
    [`Un ver luisant`, 1, `Le ver luisant fabrique sa propre lumière.`],
    [`La Lune`, 0, `La Lune ne fabrique pas de lumière : elle renvoie celle du Soleil.`],
    [`La planète Mars`, 0, `Une planète ne fabrique pas de lumière : elle renvoie celle du Soleil.`],
    [`La planète Vénus`, 0, `Une planète ne fabrique pas de lumière : elle renvoie celle du Soleil.`],
    [`Un mur blanc`, 0, `Le mur ne fabrique pas de lumière : il renvoie celle qu'il reçoit.`],
    [`Une feuille de papier`, 0, `La feuille ne fabrique pas de lumière : elle renvoie celle qu'elle reçoit.`],
    [`Un nuage`, 0, `Le nuage ne fabrique pas de lumière : il renvoie celle du Soleil.`],
    [`Un écran de cinéma`, 0, `L'écran de cinéma ne fabrique pas de lumière : il renvoie celle du projecteur.`],
    [`Un tableau blanc`, 0, `Le tableau ne fabrique pas de lumière : il renvoie celle qu'il reçoit.`],
    [`Une pomme`, 0, `La pomme ne fabrique pas de lumière : elle renvoie celle qu'elle reçoit.`],
    [`Un arbre`, 0, `L'arbre ne fabrique pas de lumière : il renvoie celle qu'il reçoit.`],
    [`Un champ de neige`, 0, `La neige ne fabrique pas de lumière : elle renvoie celle du Soleil.`],
    [`Une lampe de bureau éteinte`, 0, `Éteinte, la lampe ne fabrique pas de lumière : on la voit parce qu'elle renvoie celle qu'elle reçoit.`],
    [`Un téléphone éteint`, 0, `Éteint, le téléphone ne fabrique pas de lumière : on le voit parce qu'il renvoie celle qu'il reçoit.`]
];

const G_OBJETS = [['tee-shirt', 0], ['ballon', 0], ['pull', 0], ['cahier', 0], ['sac', 0], ['voiture', 1], ['trousse', 1], ['balle', 1], ['casquette', 1], ['chaise', 1]];
const G_COUL = [{ m: 'rouge', f: 'rouge' }, { m: 'vert', f: 'verte' }, { m: 'bleu', f: 'bleue' }];
const G_LUM = [
    { nom: 'rouge', c: [0] }, { nom: 'verte', c: [1] }, { nom: 'bleue', c: [2] },
    { nom: 'blanche', c: [0, 1, 2] }, { nom: 'jaune', c: [0, 1] }, { nom: 'cyan', c: [1, 2] }, { nom: 'magenta', c: [0, 2] }
];

/* ---------- Les générateurs ---------- */
const GEN = [

/* 0 — temps mis par la lumière */
rnd => {
    const ctx = gPick(rnd, [
        { es: [3], q: d => `Un éclair tombe à ${d} m de toi. Combien de temps met sa lumière pour te parvenir ?` },
        { es: [4, 5], q: d => `Un signal lumineux est envoyé entre deux villes distantes de ${d} m. Combien de temps dure le trajet ?` },
        { es: [6, 7], q: d => `Un satellite se trouve à ${d} m de la Terre. Combien de temps met un signal lumineux pour l'atteindre ?` },
        { es: [10, 11, 12], q: d => `Une sonde spatiale se trouve à ${d} m de la Terre. Combien de temps met un signal lumineux pour l'atteindre ?` },
        { es: [16, 17], q: d => `Une étoile se trouve à ${d} m de la Terre. Combien de temps met sa lumière pour nous parvenir ?` }
    ]);
    const e = gPick(rnd, ctx.es);
    const m10 = gPick(rnd, [12, 15, 18, 21, 24, 27, 30, 36, 42, 45, 48, 54, 60, 66, 72, 75, 81, 84, 90, 96]);
    const q10 = m10 / 3, d = `${gTen(m10)} × ${p10(e)}`;
    const brut = `${gTen(q10)} × ${p10(e - 8)}`, fin = gSci(q10, e - 9);
    return {
        gen: true, t: 'B', lvl: q10 < 10 ? 2 : 1, type: 'sci', unit: 's',
        q: `${ctx.q(d)} (${G_C})`,
        a: gVal(q10, e - 9),
        hint: `Tu cherches un temps : t = d ÷ c. Sépare les nombres et les puissances de 10. Pour une division, que fais-tu des exposants ?`,
        corr: [
            `t = ${F('d', 'c')} = ${F(d, `3,00 × ${p10(8)}`)}`,
            `Nombres : ${gTen(m10)} ÷ 3,00 = ${gTen(q10)}. Puissances : 10<sup>${e} − 8</sup> = ${p10(e - 8)}.`,
            `t = ${q10 < 10 ? `${brut} s = ` : ''}<b>${fin} s</b>${gPlain(q10, e - 9, 's')}.`
        ],
        diag: r => gNear(gSciVal(r), gVal(3 * m10, e + 7), 1e-6) ? `Tu as multiplié la distance par c. Pour un temps, on divise : t = d ÷ c, et les exposants se soustraient.` : null
    };
},

/* 1 — distance parcourue en un temps donné */
rnd => {
    const ctx = gPick(rnd, [
        { es: [-7, -6], q: t => `Une impulsion laser va d'un émetteur à un récepteur en ${t} s. Quelle distance les sépare ?` },
        { es: [-6, -5], q: t => `La lumière d'un éclair met ${t} s pour arriver jusqu'à toi. À quelle distance est tombé l'éclair ?` },
        { es: [-3, -2], q: t => `Un signal lumineux met ${t} s pour atteindre un satellite. À quelle distance se trouve ce satellite ?` },
        { es: [2, 3, 4], q: t => `La lumière d'une planète met ${t} s pour nous parvenir. À quelle distance se trouve cette planète ?` }
    ]);
    const e = gPick(rnd, ctx.es);
    const m10 = gPick(rnd, [10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 22, 23, 24, 25, 30, 31, 32, 35, 40, 45, 50, 60, 70, 80]);
    const d10 = 3 * m10, t = `${gTen(m10)} × ${p10(e)}`;
    const brut = `${gTen(d10)} × ${p10(8 + e)}`, fin = gSci(d10, 7 + e);
    return {
        gen: true, t: 'B', lvl: d10 >= 100 ? 2 : 1, type: 'sci', unit: 'm',
        q: `${ctx.q(t)} (${G_C})`,
        a: gVal(d10, 7 + e),
        hint: `Tu cherches une distance : d = c × t. Les nombres ensemble, les puissances ensemble. Pour une multiplication, que fais-tu des exposants ?`,
        corr: [
            `d = c × t = 3,00 × ${p10(8)} × ${t}`,
            `Nombres : 3,00 × ${gTen(m10)} = ${gTen(d10)}. Puissances : 10<sup>8 + ${gPar(e)}</sup> = ${p10(8 + e)}.`,
            `d = ${d10 >= 100 ? `${brut} m = ` : ''}<b>${fin} m</b>${gPlain(d10, 7 + e, 'm')}.`
        ]
    };
},

/* 2 — aller-retour (écho laser) */
rnd => {
    const ctx = gPick(rnd, [
        { es: [-7], cible: `un mur`, la: `le mur` },
        { es: [-6, -5], cible: `une falaise`, la: `la falaise` },
        { es: [-5, -4], cible: `un avion`, la: `l'avion` },
        { es: [-3, -2], cible: `un satellite`, la: `le satellite` },
        { es: [2, 3], cible: `une sonde spatiale`, la: `la sonde` }
    ]);
    const e = gPick(rnd, ctx.es);
    const T10 = gPick(rnd, [12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 84, 88]);
    const h10 = T10 / 2, d10 = 3 * h10, T = `${gTen(T10)} × ${p10(e)}`;
    const brut = `${gTen(d10)} × ${p10(8 + e)}`, fin = gSci(d10, 7 + e);
    const a = gVal(d10, 7 + e);
    return {
        gen: true, t: 'B', lvl: 3, type: 'sci', unit: 'm',
        q: `Un laser envoie une impulsion vers ${ctx.cible}. Elle <b>revient</b> à son point de départ au bout de ${T} s. À quelle distance se trouve ${ctx.la} ? (${G_C})`,
        a,
        hint: `Le temps donné correspond à l'aller ET au retour. Combien de temps pour l'aller seul ?`,
        corr: [
            `Aller simple : t = ${T} ÷ 2 = ${gTen(h10)} × ${p10(e)} s.`,
            `d = c × t = 3,00 × ${p10(8)} × ${gTen(h10)} × ${p10(e)}`,
            `Nombres : 3,00 × ${gTen(h10)} = ${gTen(d10)}. Puissances : 10<sup>8 + ${gPar(e)}</sup> = ${p10(8 + e)}.`,
            `d = ${d10 >= 100 ? `${brut} m = ` : ''}<b>${fin} m</b>${gPlain(d10, 7 + e, 'm')}.`
        ],
        diag: r => gNear(gSciVal(r), 2 * a, 1e-6) ? `Tu as trouvé la distance de l'aller-retour. Le temps donné couvre deux fois le trajet : divise-le par 2 avant de calculer (ou divise ton résultat par 2).` : null
    };
},

/* 3 — puissances de 10 (GEN_POW) */
rnd => {
    const form = gInt(rnd, 0, 4);
    const MUL = `Tu as multiplié les exposants : ça, c'est la règle d'un exposant posé sur une parenthèse. Ici il y a un × entre deux puissances → on additionne.`;
    const ADDP = `Tu as additionné les exposants : ça, c'est la règle de deux puissances reliées par un ×. Ici l'exposant est posé sur une parenthèse → on multiplie.`;
    const ADDD = `Tu as additionné les exposants : ça, c'est la règle de la multiplication. Ici c'est une division → on soustrait.`;
    const mk = (lvl, q, k, e, wrongE, msg, hint, corr) => ({
        gen: true, t: 'M', lvl, type: 'sci', unit: '', q: `Calcule : ${q}`, a: gVal(k, e), hint, corr,
        diag: r => gNear(gSciVal(r), gVal(k, wrongE), 1e-6) ? msg : null
    });
    let x, y;
    if (form === 0 || form === 3) { do { x = gInt(rnd, 2, 9); y = gInt(rnd, 2, 9); } while (x * y === x + y); }
    if (form === 0) {
        const a = gInt(rnd, 2, 5), b = gInt(rnd, 2, 5), ab = a * b;
        return mk(ab >= 10 ? 2 : 1, `(${a} × ${p10(x)}) × (${b} × ${p10(y)})`, ab, x + y, x * y, MUL,
            `Les nombres ensemble, les puissances ensemble. Deux puissances qui se multiplient : que fais-tu des exposants ?`,
            [`Nombres ensemble : ${a} × ${b} = ${ab}.`, `Puissances ensemble : ${p10(x)} × ${p10(y)} = 10<sup>${x} + ${y}</sup> = ${p10(x + y)}.`,
             `Résultat : <b>${ab} × ${p10(x + y)}</b>${ab >= 10 ? ` = <b>${gSci(ab, x + y)}</b> en écriture scientifique` : ''}.`]);
    }
    if (form === 1) {
        const [a, b] = gPick(rnd, [[4, 2], [6, 2], [8, 2], [6, 3], [9, 3], [8, 4]]);
        x = gInt(rnd, 5, 12); y = gInt(rnd, 2, x - 2);
        return mk(1, `(${a} × ${p10(x)}) ÷ (${b} × ${p10(y)})`, a / b, x - y, x + y, ADDD,
            `Les nombres ensemble, les puissances ensemble. Deux puissances qui se divisent : que fais-tu des exposants ?`,
            [`Nombres ensemble : ${a} ÷ ${b} = ${a / b}.`, `Puissances ensemble : ${p10(x)} ÷ ${p10(y)} = 10<sup>${x} − ${y}</sup> = ${p10(x - y)}.`,
             `Résultat : <b>${a / b} × ${p10(x - y)}</b>.`]);
    }
    if (form === 2) {
        do { x = gInt(rnd, 2, 6); y = gInt(rnd, 2, 4); } while (x * y === x + y);
        return mk(1, `(${p10(x)})<sup>${y}</sup>`, 1, x * y, x + y, ADDP,
            `Regarde ce qui relie les deux nombres : un × entre deux puissances, ou un exposant posé sur une parenthèse ?`,
            [`C'est ${p10(x)} répété ${y} fois : exposant posé sur une parenthèse → on multiplie les exposants.`,
             `(${p10(x)})<sup>${y}</sup> = 10<sup>${x} × ${y}</sup> = <b>${p10(x * y)}</b> (1 × ${p10(x * y)}).`]);
    }
    if (form === 3) {
        return mk(1, `${p10(x)} × ${p10(y)}`, 1, x + y, x * y, MUL,
            `Regarde ce qui relie les deux nombres : un × entre deux puissances, ou un exposant posé sur une parenthèse ?`,
            [`Deux puissances qui se multiplient → on additionne les exposants.`,
             `${p10(x)} × ${p10(y)} = 10<sup>${x} + ${y}</sup> = <b>${p10(x + y)}</b> (1 × ${p10(x + y)}).`]);
    }
    x = gInt(rnd, 5, 12); y = gInt(rnd, 2, x - 2);
    return mk(1, `${p10(x)} ÷ ${p10(y)}`, 1, x - y, x + y, ADDD,
        `Deux puissances qui se divisent : que fais-tu des exposants ? Si tu hésites, écris les zéros sur un petit exemple.`,
        [`Deux puissances qui se divisent → on soustrait les exposants.`,
         `${p10(x)} ÷ ${p10(y)} = 10<sup>${x} − ${y}</sup> = <b>${p10(x - y)}</b> (1 × ${p10(x - y)}).`]);
},

/* 4 — réflexion */
rnd => {
    const surface = rnd() < 0.5;
    let ang; do { ang = gInt(rnd, 10, 80); } while (ang === 45);
    if (!surface) {
        const s = gPick(rnd, [`un miroir`, `un miroir plan`, `la surface d'un lac`, `une vitre`]);
        return {
            gen: true, t: 'C', lvl: 1, type: 'num', unit: '°', a: ang, tol: 0.5,
            q: `Un rayon arrive sur ${s} avec un angle d'incidence de ${ang}°. Que vaut l'angle de réflexion ?`,
            hint: `Loi de la réflexion : quel lien entre r et i₁ ?`,
            corr: [`L'angle d'incidence est déjà mesuré par rapport à la normale : i₁ = ${ang}°.`, `Loi de la réflexion : r = i₁ = <b>${ang}°</b>.`],
            diag: r => Math.abs(r.v - (90 - ang)) <= 0.5 ? `Tu as calculé 90° − ${ang}°. Ce n'est pas utile ici : un angle d'incidence est déjà mesuré par rapport à la normale. Applique directement r = i₁.`
                : Math.abs(r.v - 2 * ang) <= 0.5 ? `Tu as doublé l'angle : ça, c'est l'angle entre le rayon incident et le rayon réfléchi. L'angle de réflexion se mesure depuis la normale.` : null
        };
    }
    const s = gPick(rnd, [`d'un miroir`, `d'un miroir plan`, `d'un lac`, `d'une vitre`]);
    return {
        gen: true, t: 'C', lvl: 2, type: 'num', unit: '°', a: 90 - ang, tol: 0.5,
        q: `Un rayon fait un angle de ${ang}° avec la <b>surface</b> ${s}. Que vaut l'angle de réflexion ?`,
        hint: `Les angles se mesurent par rapport à la normale, pas par rapport à la surface. Normale et surface font 90° entre elles.`,
        corr: [`Angle avec la normale : i₁ = 90° − ${ang}° = ${90 - ang}°.`, `Loi de la réflexion : r = i₁ = <b>${90 - ang}°</b>.`],
        diag: r => Math.abs(r.v - ang) <= 0.5 ? `${ang}°, c'est l'angle avec la surface. L'angle d'incidence se mesure depuis la normale : i₁ = 90° − ${ang}°. Ensuite r = i₁.` : null
    };
},

/* 5 — réfraction : calcul de i₂ */
rnd => {
    let m1, m2, i1, s, i2;
    do {
        m1 = gPick(rnd, G_MIL); m2 = gPick(rnd, G_MIL); i1 = 5 * gInt(rnd, 3, 14);
        s = m1.n * Math.sin(i1 * G_RAD) / m2.n;
        i2 = s <= 0.95 ? Math.asin(s) / G_RAD : NaN;
    } while (Math.abs(m1.n - m2.n) < 0.13 || !(s <= 0.95) || Math.abs(i2 - i1) < 2.5);
    const a = Math.round(i2 * 10) / 10, s1 = Math.sin(i1 * G_RAD), up = m2.n > m1.n;
    const sInv = m2.n * s1 / m1.n, aInv = sInv <= 1 ? Math.asin(sInv) / G_RAD : NaN;
    const A = fr(a, 1);
    return {
        gen: true, t: 'D', lvl: m1.n === 1 ? 1 : 2, type: 'num', unit: '°', a, tol: 1,
        q: `Un rayon passe ${m1.de} (n = ${fr(m1.n)}) ${m2.dans} (n = ${fr(m2.n)}) avec un angle d'incidence de ${i1}°. Calcule l'angle de réfraction i₂.`,
        hint: m1.n === 1 ? `n₁ × sin(i₁) = n₂ × sin(i₂). Isole sin(i₂), puis utilise sin⁻¹. Calculatrice en degrés.`
            : `Attention à l'ordre : le milieu 1 est celui d'où vient la lumière. Écris la loi, isole sin(i₂), puis utilise sin⁻¹.`,
        corr: [
            `n₁ = ${fr(m1.n)} (${m1.nom}), n₂ = ${fr(m2.n)} (${m2.nom}).`,
            `sin(i₂) = ${F('n₁ × sin(i₁)', 'n₂')} = ${F(`${fr(m1.n)} × sin(${i1}°)`, fr(m2.n))} = ${F(fr(m1.n * s1, 3), fr(m2.n))} = ${fr(s, 3)}`,
            `i₂ = sin<sup>−1</sup>(${fr(s, 3)}) ≈ <b>${A}°</b>`,
            `Vérification : n₂ ${up ? '&gt;' : '&lt;'} n₁ et ${A}° ${up ? '&lt;' : '&gt;'} ${i1}°, le rayon ${up ? `s'est rapproché` : `s'est écarté`} de la normale. ✔`
        ],
        diag: r => {
            const v = r.v;
            if (!Number.isFinite(v)) return null;
            if (v > 0 && v < 1 && Math.abs(v - s) <= 0.02) return `${fr(s, 3)}, c'est sin(i₂) : un sinus, pas un angle. Il reste une étape : la touche sin<sup>−1</sup> pour repasser à l'angle.`;
            if (Number.isFinite(aInv) && Math.abs(v - aInv) <= 1) return `Tu as inversé n₁ et n₂. Le milieu 1 est celui d'où vient la lumière : ici n₁ = ${fr(m1.n)} (${m1.nom}) et n₂ = ${fr(m2.n)} (${m2.nom}).`;
            if (Math.abs(v - i1) <= 0.5) return `${i1}°, c'est l'angle d'incidence. Le rayon change de direction en changeant de milieu : applique n₁ × sin(i₁) = n₂ × sin(i₂).`;
            return null;
        }
    };
},

/* 6 — indice d'un milieu inconnu */
rnd => {
    const c = gPick(rnd, G_INCONNUS), { m, i1, i2, n } = c;
    const quoi = m.nom === 'verre' ? gPick(rnd, [`un bloc transparent`, `une plaque transparente`])
        : m.nom === 'diamant' ? `une pierre transparente` : gPick(rnd, [`un liquide`, `un liquide transparent`, `un liquide inconnu`]);
    const s1 = Math.sin(i1 * G_RAD), s2 = Math.sin(i2 * G_RAD), N = fr(n);
    return {
        gen: true, t: 'D', lvl: 2, type: 'num', unit: '(sans unité)', a: n, tol: 0.03,
        q: `Un rayon passe de l'air (n = 1,00) dans ${quoi}. On mesure i₁ = ${i1}° et i₂ = ${i2}°. Calcule l'indice de ce milieu.`,
        hint: `Cette fois tu isoles n₂ dans n₁ × sin(i₁) = n₂ × sin(i₂). Vérifie ensuite que ton résultat est plus grand que 1.`,
        corr: [
            `n₂ = ${F('n₁ × sin(i₁)', 'sin(i₂)')} = ${F(`1,00 × sin(${i1}°)`, `sin(${i2}°)`)} = ${F(fr(s1, 3), fr(s2, 3))}`,
            `n₂ ≈ <b>${N}</b> (sans unité).`,
            `${Math.abs(n - m.n) < 0.005 ? `C'est l'indice ${m.de}` : `C'est proche de ${fr(m.n)}, l'indice ${m.de}`} : le milieu est sans doute ${m.de}.`
        ],
        diag: r => {
            const v = r.v;
            if (!Number.isFinite(v)) return null;
            if (v < 1 && Math.abs(v - s2 / s1) <= 0.03) return `Un indice est toujours ≥ 1. Tu as trouvé l'inverse : tu as divisé sin(i₂) par sin(i₁). C'est sin(i₁) qui va en haut.`;
            if (Math.abs(v - i1 / i2) <= 0.02 && Math.abs(i1 / i2 - n) > 0.03) return `Tu as divisé les angles. Ce sont leurs sinus qu'il faut diviser : sin(${i1}°) ÷ sin(${i2}°).`;
            if (v < 1 && v > 0) return `Un indice est toujours ≥ 1. Vérifie l'ordre de ta division et le mode degrés de la calculatrice.`;
            return null;
        }
    };
},

/* 7 — vitesse de la lumière dans un milieu */
rnd => {
    let n, ou;
    if (rnd() < 0.5) { const m = gPick(rnd, G_MIL.slice(1)); n = m.n; ou = `${m.dans} (n = ${fr(n)})`; }
    else { n = gInt(rnd, 22, 50) * 5 / 100; ou = `dans un milieu transparent d'indice n = ${fr(n)}`; }
    const v = 3 / n, exact = Math.abs(v * 100 - Math.round(v * 100)) < 1e-9, a = 3e8 / n;
    return {
        gen: true, t: 'B', lvl: 2, type: 'sci', unit: 'm/s', a, tol: 0.02,
        q: `Calcule la vitesse de la lumière ${ou}. (n = c / v ; ${G_C})`,
        hint: `Isole v dans n = c / v. Le résultat doit être plus petit que c.`,
        corr: [
            `n = ${F('c', 'v')} donc v = ${F('c', 'n')}`,
            `v = ${F(`3,00 × ${p10(8)}`, fr(n))} ${exact ? '=' : '≈'} <b>${fr(v)} × ${p10(8)} m/s</b>.`,
            `Vérification : c'est plus petit que c. ✔`
        ],
        diag: r => gNear(gSciVal(r), 3e8 * n, 0.02) ? `Tu as multiplié c par n. Dans un milieu, la lumière est plus lente que dans le vide : v = c ÷ n.` : null
    };
},

/* 8 — domaine d'une radiation */
rnd => {
    const a = gInt(rnd, 0, 2);
    const L = a === 0 ? gInt(rnd, 200, 385) : a === 1 ? gInt(rnd, 415, 785) : gInt(rnd, 815, 1400);
    const q = gPick(rnd, [
        `Une radiation a pour longueur d'onde ${L} nm. À quel domaine appartient-elle ?`,
        `Un capteur détecte une radiation de longueur d'onde ${L} nm. À quel domaine appartient-elle ?`,
        `Une lampe émet une radiation de longueur d'onde λ = ${L} nm. Cette radiation est dans le domaine…`
    ]);
    return {
        gen: true, t: 'E', lvl: 1, type: 'qcm', fixed: true, a, q,
        opts: [`Ultraviolet`, `Visible`, `Infrarouge`],
        hint: `Le domaine visible va de 400 nm à 800 nm. Où se place ta valeur par rapport à ces deux bornes ?`,
        corr: a === 0 ? [`Le visible va de 400 nm à 800 nm.`, `${L} nm &lt; 400 nm → <b>ultraviolet</b>, invisible pour l'œil.`]
            : a === 2 ? [`Le visible va de 400 nm à 800 nm.`, `${L} nm &gt; 800 nm → <b>infrarouge</b>, invisible pour l'œil.`]
            : [`Le visible va de 400 nm à 800 nm.`, `400 nm &lt; ${L} nm &lt; 800 nm → <b>visible</b> (couleur : ${colorName(L)}).`]
    };
},

/* 9 — conversion m → nm */
rnd => {
    const big = rnd() < 0.2, N = big ? 10 * gInt(rnd, 100, 150) : gInt(rnd, 250, 990), k = big ? 3 : 2;
    const m = fr(N / Math.pow(10, k), 2), e = k - 9;
    const src = gPick(rnd, [`Une radiation a pour longueur d'onde`, `Un laser émet une radiation de longueur d'onde`, `Une lampe émet une radiation de longueur d'onde`, `Une diode émet une radiation de longueur d'onde`]);
    const dom = N < 400 ? `Moins de 400 nm : c'est un ultraviolet.` : N > 800 ? `Plus de 800 nm : c'est un infrarouge.` : `Entre 400 et 800 nm : c'est une radiation visible.`;
    return {
        gen: true, t: 'E', lvl: 2, type: 'num', unit: 'nm', a: N, tol: 1,
        q: `${src} ${m} × ${p10(e)} m. Exprime-la en nanomètres. (1 nm = ${p10(-9)} m)`,
        hint: `Pour passer des m aux nm, divise par ${p10(-9)}. Division de puissances : les exposants se soustraient. Attention au signe : soustraire −9, c'est ajouter 9.`,
        corr: [
            `λ = ${F(`${m} × ${p10(e)}`, p10(-9))} = ${m} × 10<sup>−${-e} − (−9)</sup> = ${m} × ${p10(k)}`,
            `λ = <b>${N} nm</b>.`,
            dom
        ],
        diag: r => !Number.isFinite(r.v) || r.v === N ? null
            : [0.001, 0.01, 0.1, 10, 100, 1000].some(f => Math.abs(r.v - N * f) <= N * f * 1e-9) ? `Les chiffres sont bons, mais la virgule est mal placée. Recompte l'exposant : ${-e > 0 ? `−${-e}` : e} − (−9) = ${k}, donc × ${p10(k)}.` : null
    };
},

/* 10 — sens de déviation */
rnd => {
    let m1, m2; do { m1 = gPick(rnd, G_MIL); m2 = gPick(rnd, G_MIL); } while (m1 === m2);
    const up = m2.n > m1.n;
    return {
        gen: true, t: 'D', lvl: 1, type: 'qcm', fixed: true, a: up ? 0 : 1,
        q: `La lumière passe ${m1.de} (n = ${fr(m1.n)}) ${m2.dans} (n = ${fr(m2.n)}), avec un angle d'incidence non nul. Le rayon réfracté…`,
        opts: [`se rapproche de la normale`, `s'écarte de la normale`],
        hint: `Compare les deux indices : la lumière entre-t-elle dans un milieu d'indice plus grand ou plus petit ?`,
        corr: [
            `n₂ = ${fr(m2.n)} (${m2.nom}) ${up ? '&gt;' : '&lt;'} n₁ = ${fr(m1.n)} (${m1.nom}) : la lumière entre dans un milieu d'indice plus ${up ? 'grand' : 'petit'}.`,
            `Le rayon <b>${up ? 'se rapproche' : `s'écarte`}</b> de la normale : i₂ ${up ? '&lt;' : '&gt;'} i₁.`
        ]
    };
},

/* 11 — type de spectre */
rnd => {
    const a = gInt(rnd, 0, 3), keys = Object.keys(GAZ);
    let o;
    if (a === 0) o = { T: gPick(rnd, [null, null, 4500, 6000, 8000]) };
    else if (a === 1) o = { mode: 'emission', lines: GAZ[gPick(rnd, keys)].raies.slice() };
    else if (a === 2) {
        const x = gPick(rnd, keys), y = gPick(rnd, keys);
        o = { mode: 'absorption', lines: [...new Set(GAZ[x].raies.concat(rnd() < 0.4 && gCompat(x, y) ? GAZ[y].raies : []))].sort((p, q) => p - q) };
    } else o = { bands: gPick(rnd, [[[620, 800]], [[600, 800]], [[490, 580]], [[500, 570]], [[400, 490]], [[400, 480]], [[400, 490], [620, 800]], [[490, 800]], [[400, 580]]]) };
    return {
        gen: true, t: 'E', lvl: 1, type: 'qcm', fixed: true, a,
        q: `De quel type est ce spectre ?`,
        fig: () => spectrum(o),
        opts: [`Spectre continu`, `Spectre de raies d'émission`, `Spectre de raies d'absorption`, `Spectre de bandes d'absorption`],
        hint: `Regarde d'abord le fond : noir ou coloré ? Puis ce qui s'y ajoute : rien, des traits fins, ou de larges zones noires ?`,
        corr: [
            [`Bande colorée sans aucune interruption → <b>spectre continu</b>.`, `Il est produit par un corps chaud et dense (filament, braise).`],
            [`Fond noir + traits fins colorés → <b>spectre de raies d'émission</b>.`, `Il est produit par un gaz excité.`],
            [`Fond coloré + traits fins noirs → <b>spectre de raies d'absorption</b>.`, `De la lumière blanche a traversé un gaz, qui a absorbé ces radiations.`],
            [`Fond coloré + larges zones noires → <b>spectre de bandes d'absorption</b>.`, `De la lumière blanche a traversé un filtre ou une solution colorée.`]
        ][a]
    };
},

/* 12 — couleur perçue d'un objet */
rnd => {
    const [nom, fem] = gPick(rnd, G_OBJETS), ci = gInt(rnd, 0, 2), col = G_COUL[ci], lum = gPick(rnd, G_LUM);
    const adj = fem ? col.f : col.m, e = fem ? 'e' : '', il = fem ? 'elle' : 'il', Il = fem ? 'Elle' : 'Il';
    const Obj = `${fem ? 'La' : 'Le'} ${nom} ${adj}`, recoit = lum.c.includes(ci);
    const noms = lum.c.map(k => G_COUL[k].m), autres = lum.c.filter(k => k !== ci).map(k => `le ${G_COUL[k].m}`);
    const corr = [];
    if (lum.c.length > 1) corr.push(`Lumière ${lum.nom} = ${noms.join(' + ')}${recoit ? '' : ` : pas de ${col.m}`}.`);
    if (recoit) {
        corr.push(`${Obj} diffuse le ${col.m}, et ${il} en reçoit${autres.length ? ` ; ${il} absorbe ${gList(autres)}` : ''}.`);
        corr.push(`${Il} paraît <b>${adj}</b>.`);
    } else {
        corr.push(`${Obj} ne diffuse que le ${col.m}, et ${il} n'en reçoit pas.`);
        corr.push(`${Il} absorbe ${gList(autres)} : rien ne repart → <b>noir</b>.`);
    }
    return {
        gen: true, t: 'G', lvl: lum.c.length === 2 ? 2 : 1, type: 'qcm', fixed: true, a: recoit ? ci : 3,
        q: `${fem ? 'Une' : 'Un'} ${nom} ${adj} est éclairé${e} uniquement par une lumière ${lum.nom}. De quelle couleur paraît-${il} ?`,
        opts: [`Rouge`, `Vert`, `Bleu`, `Noir`],
        hint: `Quelles couleurs (rouge, vert, bleu) cette lumière contient-elle ? L'objet reçoit-il la couleur qu'il sait diffuser ?`,
        corr
    };
},

/* 13 — présence d'un élément dans un spectre d'absorption */
rnd => {
    const keys = Object.keys(GAZ), X = gPick(rnd, keys), raies = GAZ[X].raies, E = G_ELEM[X], oui = rnd() < 0.5;
    const loin = (l, arr) => arr.every(w => Math.abs(w - l) >= 12);
    let lines, manque = [], autre = false;
    if (oui) {
        const Y = gPick(rnd, keys);
        autre = rnd() < 0.6 && gCompat(X, Y);
        lines = raies.concat(autre ? GAZ[Y].raies : []);
    } else {
        let ok = false;
        for (let k = 0; k < 40 && !ok; k++) {
            const Y = gPick(rnd, keys), avecY = gCompat(X, Y) && (raies.length === 1 || rnd() < 0.5);
            const nb = raies.length === 1 ? 1 : gInt(rnd, 1, Math.min(2, raies.length - 1));
            const pool = raies.slice(); manque = [];
            for (let j = 0; j < nb; j++) manque.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
            lines = pool.concat(avecY ? GAZ[Y].raies : []);
            ok = lines.length > 0 && manque.every(l => loin(l, lines));
        }
        if (!ok) { /* repli déterministe */
            const Z = raies.length > 1 ? null : 'H';
            manque = raies.length > 1 ? raies.filter(l => Math.abs(l - raies[0]) < 12) : raies.slice();
            lines = Z ? GAZ[Z].raies.slice() : raies.filter(l => !manque.includes(l));
        }
        manque.sort((p, q) => p - q);
    }
    lines = [...new Set(lines)].sort((p, q) => p - q);
    const une = raies.length === 1, liste = `${une ? 'Raie' : 'Raies'} ${E.de} : ${raies.join(' – ')} nm`;
    return {
        gen: true, t: 'E', lvl: 2, type: 'qcm', fixed: true, a: oui ? 0 : 1,
        q: `Voici le spectre de la lumière d'une étoile. ${E.Le} est-il présent dans son atmosphère ?<br><span class="given">${liste}</span>`,
        fig: () => spectrum({ mode: 'absorption', lines }),
        opts: [`Oui`, `Non`],
        hint: `Repère la position de chaque raie noire sur l'axe, puis cherche une par une les raies de l'élément. Sont-elles toutes là ?`,
        corr: oui ? [
            `${liste}.`,
            une ? `On retrouve cette raie noire dans le spectre.` : `On retrouve ces ${raies.length} raies noires dans le spectre.`,
            ...(autre ? [`Les autres raies viennent d'un autre élément : cela ne change rien.`] : []),
            `<b>Oui</b>, ${E.le} est présent.`
        ] : [
            `${liste}.`,
            manque.length === 1 ? `Il n'y a pas de raie noire à ${manque[0]} nm dans le spectre.` : `Il n'y a pas de raie noire à ${gList(manque)} nm dans le spectre.`,
            une ? `<b>Non</b>, ${E.le} n'est pas présent.` : `Il suffit qu'une seule raie manque : <b>non</b>, ${E.le} n'est pas présent.`
        ]
    };
},

/* 14 — source primaire ou objet diffusant */
rnd => {
    const [nom, prim, why] = gPick(rnd, G_SOURCES);
    return {
        gen: true, t: 'A', lvl: 1, type: 'qcm', fixed: true, a: prim ? 0 : 1,
        q: `${nom} : source primaire ou objet diffusant ?`,
        opts: [`Source primaire`, `Objet diffusant`],
        hint: `Imagine cet objet dans le noir complet, sans aucune autre lumière autour. Le verrais-tu encore ?`,
        corr: [why, prim ? `C'est une <b>source primaire</b>.` : `C'est un <b>objet diffusant</b>.`]
    };
}
];

const GEN_POW = 3;
