'use strict';
/* Masterclass Snell-Descartes : page #masterclass (cours en 6 cartes + 25 exercices en 6 familles).
   Ce fichier ne fait qu'AJOUTER : thème SD, exercices SD1 à SD25, clé S.mc (cartes relues). Aucun exercice existant n'est modifié. */

const MC_FAM = [
    { t: `Repérer et prévoir`, d: `Le vocabulaire, les angles, le sens du rayon`, ids: [1, 4] },
    { t: `Trouver l'angle de réfraction i₂`, d: `Le grand classique, dans tous les sens`, ids: [5, 9] },
    { t: `Trouver l'angle d'incidence i₁`, d: `La même loi, retournée`, ids: [10, 12] },
    { t: `Trouver un indice n`, d: `On isole n au lieu de sin(i)`, ids: [13, 16] },
    { t: `Identifier le milieu`, d: `Calculer n, puis comparer au tableau`, ids: [17, 20] },
    { t: `Problèmes`, d: `Comme au contrôle, avec tout mélangé`, ids: [21, 25] }
];
const MC_LOI = `n₁ × sin(i₁) = n₂ × sin(i₂)`;

{
    const sn = x => Math.sin(x * Math.PI / 180), asn = x => Math.asin(x) * 180 / Math.PI;
    const a1 = x => fr(x, 1), s3 = x => fr(x, 3), n2d = x => fr(x, 2), r1 = x => Number(x.toFixed(1)), r2 = x => Number(x.toFixed(2));
    const N = '(sans unité)', TOLA = 0.6, TOLN = 0.02;

    /* Toujours les 5 étapes, dans cet ordre et avec ces mots. */
    const c5 = (a, b, c, d, e) => [`<b>Je repère ce qu'on cherche :</b> ${a}`, `<b>J'identifie la formule :</b> ${b}`, `<b>Je vérifie les unités :</b> ${c}`, `<b>Je calcule :</b> ${d}`, `<b>Je vérifie le résultat :</b> ${e}`];
    const DEG = `angles en degrés, depuis la normale, calculatrice en mode degrés ; n sans unité.`;

    /* Schéma à l'échelle : milieu 1 en haut, milieu 2 en bas. */
    const fig = (m1, m2, i1, i2, l1, l2) => () => {
        const X = 170, Y = 105, R = 96, ax = X - R * Math.sin(i1 * Math.PI / 180), ay = Y - R * Math.cos(i1 * Math.PI / 180), bx = X + R * Math.sin(i2 * Math.PI / 180), by = Y + R * Math.cos(i2 * Math.PI / 180);
        return `<svg class="mc-svg" viewBox="0 0 340 210" role="img" aria-label="Rayon passant de ${m1} à ${m2}"><rect width="340" height="105" fill="var(--air)"/><rect y="105" width="340" height="105" fill="var(--glass)"/><path d="M0 105H340" stroke="var(--muted)" stroke-width="1.5"/><path d="M170 8V202" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="5 5"/><path d="M${ax.toFixed(1)} ${ay.toFixed(1)}L170 105L${bx.toFixed(1)} ${by.toFixed(1)}" fill="none" stroke="var(--ray)" stroke-width="3" stroke-linejoin="round"/><text x="10" y="22" class="mc-t">${m1}</text><text x="10" y="198" class="mc-t">${m2}</text><text x="${(ax - 6).toFixed(1)}" y="${(ay + 5).toFixed(1)}" text-anchor="end" class="mc-t b">${l1}</text><text x="${(bx + 8).toFixed(1)}" y="${Math.min(by, 192).toFixed(1)}" class="mc-t b">${l2}</text></svg>`;
    };

    /* Trouver i₂ */
    const iiOut = (id, lvl, q, n1, n2, i1, m1, m2, hint, opt = {}) => {
        const s = n1 * sn(i1) / n2, i2 = asn(s), plus = n2 > n1;
        return Object.assign({
            id, t: 'SD', lvl, type: 'num', unit: '°', tol: TOLA, a: r1(i2), q, hint,
            corr: c5(`l'angle de réfraction i₂. Données : milieu 1 = ${m1} (n₁ = ${n2d(n1)}), milieu 2 = ${m2} (n₂ = ${n2d(n2)}), i₁ = ${i1}°.`, `${MC_LOI}, donc sin(i₂) = ${F('n₁ × sin(i₁)', 'n₂')}.`, DEG, `sin(i₂) = ${F(`${n2d(n1)} × sin(${i1}°)`, n2d(n2))} ≈ ${s3(s)}, puis i₂ = sin<sup>−1</sup>(${s3(s)}) ≈ <b>${a1(i2)}°</b>.`, `n₂ ${plus ? '>' : '<'} n₁ : le rayon doit ${plus ? 'se rapprocher' : `s'écarter`} de la normale, et ${a1(i2)}° ${plus ? '<' : '>'} ${i1}°. Cohérent.`)
        }, opt);
    };
    /* Trouver i₁ */
    const iiIn = (id, lvl, q, n1, n2, i2, m1, m2, hint, opt = {}) => {
        const s = n2 * sn(i2) / n1, i1 = asn(s);
        return Object.assign({
            id, t: 'SD', lvl, type: 'num', unit: '°', tol: TOLA, a: r1(i1), q, hint,
            corr: c5(`l'angle d'incidence i₁. Données : milieu 1 = ${m1} (n₁ = ${n2d(n1)}), milieu 2 = ${m2} (n₂ = ${n2d(n2)}), i₂ = ${i2}°.`, `${MC_LOI}, donc sin(i₁) = ${F('n₂ × sin(i₂)', 'n₁')}.`, DEG, `sin(i₁) = ${F(`${n2d(n2)} × sin(${i2}°)`, n2d(n1))} ≈ ${s3(s)}, puis i₁ = sin<sup>−1</sup>(${s3(s)}) ≈ <b>${a1(i1)}°</b>.`, `n₂ ${n2 > n1 ? '>' : '<'} n₁ : on doit avoir i₂ ${n2 > n1 ? '<' : '>'} i₁, et ${i2}° ${n2 > n1 ? '<' : '>'} ${a1(i1)}°. Cohérent.`)
        }, opt);
    };
    /* Trouver n₂ */
    const nOut = (id, lvl, q, n1, i1, i2, m1, m2, hint, opt = {}) => {
        const n = n1 * sn(i1) / sn(i2);
        return Object.assign({
            id, t: 'SD', lvl, type: 'num', unit: N, tol: TOLN, a: r2(n), q, hint,
            corr: c5(`l'indice n₂. Données : milieu 1 = ${m1} (n₁ = ${n2d(n1)}), i₁ = ${i1}°, i₂ = ${i2}°.`, `${MC_LOI}, donc n₂ = ${F('n₁ × sin(i₁)', 'sin(i₂)')}.`, DEG, `n₂ = ${F(`${n2d(n1)} × sin(${i1}°)`, `sin(${i2}°)`)} ≈ ${F(s3(n1 * sn(i1)), s3(sn(i2)))} ≈ <b>${n2d(n)}</b>.`, `n₂ ≥ 1, sans unité, et n₂ > n₁ comme i₂ < i₁. Cohérent.`)
        }, opt);
    };

    /* Le tableau des milieux, le même dans toute la famille « Identifier le milieu ». */
    const MIL = [['eau', 1.33], ['éthanol', 1.36], ['glycérol', 1.47], ['plexiglas', 1.49], ['verre', 1.52], ['diamant', 2.42]];
    const milTab = `<div class="mc-mil">${MIL.map(m => `<span>${m[0]} <b>${n2d(m[1])}</b></span>`).join('')}</div>`;
    const milieu = (id, lvl, q, n1, i1, i2, m1, hint, opt = {}) => {
        const n = n1 * sn(i1) / sn(i2), k = MIL.reduce((b, m, j) => Math.abs(m[1] - n) < Math.abs(MIL[b][1] - n) ? j : b, 0);
        return Object.assign({
            id, t: 'SD', lvl, type: 'qcm', fixed: true, opts: MIL.map(m => m[0]), a: k, q: q + milTab, hint,
            corr: c5(`la nature du milieu 2. Il faut d'abord son indice n₂, à partir de n₁ = ${n2d(n1)} (${m1}), i₁ = ${i1}° et i₂ = ${i2}°.`, `${MC_LOI}, donc n₂ = ${F('n₁ × sin(i₁)', 'sin(i₂)')}.`, DEG, `n₂ = ${F(`${n2d(n1)} × sin(${i1}°)`, `sin(${i2}°)`)} ≈ <b>${n2d(n)}</b>.`, `dans le tableau, la valeur la plus proche est ${n2d(MIL[k][1])} : c'est <b>${MIL[k][0] === 'eau' ? `l'eau` : MIL[k][0]}</b>.`)
        }, opt);
    };

    const old = Object.assign({}, THEMES);
    for (const k in THEMES) delete THEMES[k];
    Object.assign(THEMES, { SD: { nom: 'Masterclass Snell-Descartes', short: 'Masterclass' } }, old);

    EX.push(
    /* 1. Repérer et prévoir */
    { id: 'SD1', t: 'SD', lvl: 1, type: 'qcm', fixed: true, q: `L'angle d'incidence i₁ est l'angle entre…`, opts: [`le rayon incident et la surface`, `le rayon incident et la normale`, `le rayon incident et le rayon réfracté`, `la normale et la surface`], a: 1, hint: `Dans toutes les lois de Snell-Descartes, il y a une droite de référence pour mesurer les angles. Laquelle ?`, corr: [`Les angles se mesurent toujours depuis la <b>normale</b>, la droite perpendiculaire à la surface au point d'incidence.`, `i₁ est donc l'angle entre le rayon incident et la normale.`] },
    { id: 'SD2', t: 'SD', lvl: 1, type: 'num', unit: '°', tol: 0.1, a: 55, q: `Un rayon arrive sur l'eau en faisant un angle de 35° <b>avec la surface</b>. Que vaut l'angle d'incidence i₁ ?`, hint: `La normale et la surface forment un angle droit. Le rayon et ces deux droites se partagent cet angle.`, corr: c5(`l'angle d'incidence i₁, mesuré depuis la normale. L'énoncé donne un angle mesuré depuis la surface.`, `normale et surface sont perpendiculaires, donc i₁ = 90° − angle avec la surface.`, `tout est en degrés.`, `i₁ = 90° − 35° = <b>55°</b>.`, `i₁ est compris entre 0° et 90°. Cohérent.`) },
    { id: 'SD3', t: 'SD', lvl: 1, type: 'num', unit: '°', tol: 0.1, a: 42, q: `Un rayon arrive sur une plaque de verre avec i₁ = 42°. Une partie de la lumière est réfléchie. Que vaut l'angle de réflexion r ?`, hint: `Attention, on parle du rayon réfléchi, pas du rayon réfracté : ce n'est pas la même loi.`, corr: c5(`l'angle de réflexion r.`, `loi de Snell-Descartes pour la réflexion : r = i₁.`, `les deux angles sont en degrés, mesurés depuis la normale.`, `r = <b>42°</b>. Aucun indice dans ce calcul.`, `le rayon réfléchi repart de l'autre côté de la normale, dans le même milieu. Cohérent.`) },
    { id: 'SD4', t: 'SD', lvl: 2, type: 'qcm', fixed: true, q: `Sans calculer : un rayon passe de l'huile (n₁ = 1,47) à l'eau (n₂ = 1,33) avec i₁ = 35°. Que peut-on prévoir ?`, opts: [`i₂ sera plus petit que 35°`, `i₂ sera égal à 35°`, `i₂ sera plus grand que 35°`, `Il n'y aura pas de rayon réfracté`], a: 2, hint: `Compare n₁ et n₂. Si n₁ × sin(i₁) = n₂ × sin(i₂), le plus petit indice va avec quel sinus ?`, corr: [`n₂ < n₁ : la lumière entre dans un milieu d'indice plus petit.`, `Le rayon <b>s'écarte</b> de la normale, donc <b>i₂ > 35°</b>.`, `Le calcul le confirme : sin(i₂) = ${F('1,47 × sin(35°)', '1,33')} ≈ ${s3(1.47 * sn(35) / 1.33)}, soit i₂ ≈ ${a1(asn(1.47 * sn(35) / 1.33))}°.`] },

    /* 2. Trouver i₂ */
    iiOut('SD5', 1, `Un rayon passe de l'air (n₁ = 1,00) au verre (n₂ = 1,50) avec i₁ = 45°. Calcule i₂.`, 1, 1.5, 45, 'air', 'verre', `Écris la loi, isole sin(i₂), et attends d'avoir sin(i₂) pour appuyer sur sin⁻¹.`, { fig: fig('air', 'verre', 45, asn(sn(45) / 1.5), 'i₁ = 45°', 'i₂ = ?') }),
    iiOut('SD6', 1, `Un laser passe de l'air (n₁ = 1,00) au diamant (n₂ = 2,42) avec i₁ = 40°. Calcule i₂.`, 1, 2.42, 40, 'air', 'diamant', `Commence par écrire n₁ et n₂, puis isole sin(i₂).`),
    iiOut('SD7', 2, `Un rayon sort du verre (n₁ = 1,50) vers l'air (n₂ = 1,00) avec i₁ = 25°. Calcule i₂.`, 1.5, 1, 25, 'verre', 'air', `Le milieu 1 est celui d'où vient la lumière. Lequel est-ce ici ?`, { fig: fig('verre', 'air', 25, asn(1.5 * sn(25)), 'i₁ = 25°', 'i₂ = ?') }),
    iiOut('SD8', 2, `Un rayon passe du verre (n₁ = 1,50) à l'eau (n₂ = 1,33) avec i₁ = 25°. Calcule i₂.`, 1.5, 1.33, 25, 'verre', 'eau', `Aucun des deux milieux n'est l'air : n₁ ne vaut pas 1,00. La loi reste la même.`),
    iiOut('SD9', 2, `Dans un aquarium, un laser va de l'eau (n₁ = 1,33) vers l'air (n₂ = 1,00) avec i₁ = 40°. Calcule i₂.`, 1.33, 1, 40, 'eau', 'air', `La lumière sort de l'eau. Le rayon va-t-il se rapprocher ou s'écarter de la normale ? Garde ta prévision pour vérifier à la fin.`),

    /* 3. Trouver i₁ */
    iiIn('SD10', 2, `De l'air (n₁ = 1,00) vers un verre d'indice n₂ = 1,50, on veut obtenir i₂ = 20°. Quel angle d'incidence i₁ faut-il ?`, 1, 1.5, 20, 'air', 'verre', `L'inconnue est i₁ : isole sin(i₁) d'abord, l'angle viendra après.`, { fig: fig('air', 'verre', asn(1.5 * sn(20)), 20, 'i₁ = ?', 'i₂ = 20°') }),
    iiIn('SD11', 2, `Un rayon passe de l'air (n₁ = 1,00) à l'eau (n₂ = 1,33). On mesure i₂ = 25°. Que valait i₁ ?`, 1, 1.33, 25, 'air', 'eau', `Même méthode que l'exercice d'avant. Le n₂ reste du côté de sin(i₂).`),
    iiIn('SD12', 3, `Une lumière sort de l'eau (n₁ = 1,33) dans l'air (n₂ = 1,00) avec un angle de réfraction i₂ = 60°. Calcule i₁.`, 1.33, 1, 60, 'eau', 'air', `Le 1,33 multiplie sin(i₁) ici. Pour garder sin(i₁) seul, que fais-tu de lui ?`),

    /* 4. Trouver n */
    nOut('SD13', 1, `Un rayon passe de l'air (n₁ = 1,00) dans un plastique. On mesure i₁ = 40° et i₂ = 25°. Calcule l'indice n₂.`, 1, 40, 25, 'air', 'plastique', `L'inconnue est n₂ : il faut la laisser seule. Par quoi est-elle multipliée ?`, { fig: fig('air', 'plastique', 40, 25, 'i₁ = 40°', 'i₂ = 25°') }),
    nOut('SD14', 2, `De l'air (n₁ = 1,00) vers un bloc transparent : i₁ = 60° et i₂ = 35°. Calcule n₂.`, 1, 60, 35, 'air', 'bloc transparent', `Isole n₂, puis vérifie que ton résultat respecte la règle n ≥ 1.`),
    nOut('SD15', 3, `De l'eau (n₁ = 1,33) vers un milieu inconnu : i₁ = 30° et i₂ = 20°. Calcule n₂.`, 1.33, 30, 20, 'eau', 'milieu inconnu', `Attention, n₁ ne vaut pas 1,00 ici : il reste dans le calcul.`),
    { id: 'SD16', t: 'SD', lvl: 2, type: 'qcm', fixed: true, q: `De l'air vers du verre, un élève calcule n₂ = sin(25°) ÷ sin(40°) et trouve n₂ = 0,66. Que peut-on dire ?`, opts: [`C'est juste : un indice peut valoir 0,66`, `C'est impossible : un indice vaut au moins 1. Il a inversé les deux sinus`, `Sa calculatrice est forcément en radians`, `Il aurait dû soustraire les sinus`], a: 1, hint: `C'est l'étape 5 : je vérifie le résultat. Quelle règle un indice respecte-t-il toujours ?`, corr: [`Un indice optique vaut toujours <b>au moins 1</b> : 0,66 est impossible.`, `La bonne formule, avec i₁ = 40° et i₂ = 25° : n₂ = ${F('n₁ × sin(i₁)', 'sin(i₂)')} = ${F('sin(40°)', 'sin(25°)')} ≈ ${n2d(sn(40) / sn(25))}.`, `Il avait mis les sinus à l'envers. C'est l'étape « je vérifie le résultat » qui attrape l'erreur.`] },

    /* 5. Identifier le milieu */
    milieu('SD17', 2, `Un rayon passe de l'air (n₁ = 1,00) dans un liquide transparent. On mesure i₁ = 45° et i₂ = 31,2°. De quel liquide s'agit-il ?`, 1, 45, 31.2, 'air', `Tu ne peux pas choisir sans nombre : calcule d'abord n₂, puis cherche la valeur la plus proche.`),
    milieu('SD18', 2, `Un rayon passe de l'air (n₁ = 1,00) dans un milieu transparent. On mesure i₁ = 50° et i₂ = 31,4°. Quel est ce milieu ?`, 1, 50, 31.4, 'air', `Même méthode : n₂ d'abord, le tableau ensuite.`),
    milieu('SD19', 3, `Un rayon passe de l'<b>eau</b> (n₁ = 1,33) dans un solide transparent. On mesure i₁ = 30° et i₂ = 26,0°. Quel est ce solide ?`, 1.33, 30, 26, 'eau', `La lumière vient de l'eau : quelle valeur prend n₁ dans la formule ?`),
    milieu('SD20', 2, `Un rayon passe de l'air (n₁ = 1,00) dans une pierre taillée. On mesure i₁ = 35° et i₂ = 13,7°. De quelle matière est-elle faite ?`, 1, 35, 13.7, 'air', `L'angle a beaucoup diminué : attends-toi à un indice élevé, et calcule-le.`),

    /* 6. Problèmes */
    iiOut('SD21', 3, `Un laser éclaire un aquarium. Son faisceau fait un angle de 35° <b>avec la surface</b> de l'eau. Calcule l'angle de réfraction.<br>Données : n(air) = 1,00 ; n(eau) = 1,33.`, 1, 1.33, 55, 'air', 'eau', `Quel est le vrai i₁ ? Les angles se mesurent depuis la normale, pas depuis la surface.`, { corr: c5(`l'angle de réfraction i₂. Mais d'abord i₁, car 35° est mesuré depuis la surface : i₁ = 90° − 35° = 55°.`, `${MC_LOI}, donc sin(i₂) = ${F('n₁ × sin(i₁)', 'n₂')}.`, DEG, `sin(i₂) = ${F('1,00 × sin(55°)', '1,33')} ≈ ${s3(sn(55) / 1.33)}, puis i₂ ≈ <b>${a1(asn(sn(55) / 1.33))}°</b>.`, `l'eau a un indice plus grand que l'air : i₂ < i₁. Cohérent.`) }),
    { id: 'SD22', t: 'SD', lvl: 3, type: 'num', unit: '°', tol: TOLA, a: 40, q: `Un rayon traverse une vitre à faces parallèles (n = 1,50) entourée d'air (n = 1,00). Il arrive avec i₁ = 40°. Avec quel angle ressort-il dans l'air, de l'autre côté ?`, hint: `Il y a deux réfractions : air → verre, puis verre → air. L'angle d'arrivée sur la 2e face est celui trouvé dans le verre, car les faces sont parallèles.`, corr: c5(`l'angle de sortie dans l'air, après deux réfractions.`, `${MC_LOI}, appliquée à chaque face.`, DEG, `1re face : sin(i₂) = ${F('sin(40°)', '1,50')} ≈ ${s3(sn(40) / 1.5)}, donc i₂ ≈ ${a1(asn(sn(40) / 1.5))}°.<br>2e face : sin(sortie) = 1,50 × sin(${a1(asn(sn(40) / 1.5))}°) ≈ ${s3(sn(40))}, donc sortie = <b>40°</b>.`, `le rayon ressort parallèle à sa direction d'arrivée, seulement décalé. Cohérent.`) },
    { id: 'SD23', t: 'SD', lvl: 3, type: 'num', unit: N, tol: TOLN, a: 1.5, q: `En TP, un rayon passe de l'air (n₁ = 1,00) à un demi-cylindre transparent. On mesure :<br>i₁ = 20° → i₂ = 13,2°<br>i₁ = 40° → i₂ = 25,4°<br>i₁ = 60° → i₂ = 35,3°<br>Calcule l'indice du demi-cylindre.`, hint: `Pour chaque ligne, calcule le rapport des sinus. Le même milieu doit donner à peu près le même nombre.`, corr: c5(`l'indice n₂, à partir de trois mesures.`, `n₂ = ${F('n₁ × sin(i₁)', 'sin(i₂)')}, avec n₁ = 1,00.`, DEG, `${F('sin(20°)', 'sin(13,2°)')} ≈ ${n2d(sn(20) / sn(13.2))} ; ${F('sin(40°)', 'sin(25,4°)')} ≈ ${n2d(sn(40) / sn(25.4))} ; ${F('sin(60°)', 'sin(35,3°)')} ≈ ${n2d(sn(60) / sn(35.3))}. Donc <b>n₂ ≈ 1,50</b>.`, `les trois rapports sont égaux : sin(i₁) et sin(i₂) sont proportionnels, comme le dit la loi.`) },
    { id: 'SD24', t: 'SD', lvl: 3, type: 'num', unit: '°', tol: TOLA, a: r1(asn(sn(50) / 1.5)), q: `Dans un milieu transparent, la lumière se propage à v = 2,00 × 10<sup>8</sup> m/s. Un rayon y entre depuis l'air (n = 1,00) avec i₁ = 50°. Calcule l'angle de réfraction.<br>Données : c = 3,00 × 10<sup>8</sup> m/s ; n = c ÷ v.`, hint: `L'indice n'est pas donné, mais tu as de quoi le calculer. Il te servira de n₂.`, corr: c5(`l'angle i₂. Il manque n₂, à calculer avec la vitesse.`, `n₂ = ${F('c', 'v')}, puis sin(i₂) = ${F('n₁ × sin(i₁)', 'n₂')}.`, `c et v sont tous les deux en m/s ; angles en degrés.`, `n₂ = ${F('3,00 × 10<sup>8</sup>', '2,00 × 10<sup>8</sup>')} = 1,50.<br>sin(i₂) = ${F('sin(50°)', '1,50')} ≈ ${s3(sn(50) / 1.5)}, donc i₂ ≈ <b>${a1(asn(sn(50) / 1.5))}°</b>.`, `n₂ > n₁ et i₂ < i₁. Cohérent.`) },
    { id: 'SD25', t: 'SD', lvl: 3, type: 'qcm', fixed: true, q: `Une lumière blanche entre dans du verre depuis l'air (n = 1,00) avec i₁ = 45°. Dans ce verre, n(rouge) = 1,51 et n(violet) = 1,53. Quelle couleur est la plus déviée ?`, opts: [`Le rouge : i₂ ≈ ${a1(asn(sn(45) / 1.51))}°, contre ${a1(asn(sn(45) / 1.53))}° pour le violet`, `Le violet : i₂ ≈ ${a1(asn(sn(45) / 1.53))}°, contre ${a1(asn(sn(45) / 1.51))}° pour le rouge`, `Aucune : i₂ est le même pour toutes les couleurs`], a: 1, hint: `Fais les deux calculs. La couleur la plus déviée est celle qui finit le plus près de la normale.`, corr: c5(`i₂ pour chaque couleur, puis la plus déviée.`, `sin(i₂) = ${F('n₁ × sin(i₁)', 'n₂')}.`, DEG, `Rouge : sin(i₂) = ${F('sin(45°)', '1,51')} ≈ ${s3(sn(45) / 1.51)}, donc i₂ ≈ ${a1(asn(sn(45) / 1.51))}°.<br>Violet : sin(i₂) = ${F('sin(45°)', '1,53')} ≈ ${s3(sn(45) / 1.53)}, donc i₂ ≈ ${a1(asn(sn(45) / 1.53))}°.`, `le <b>violet</b> a le plus grand indice et le plus petit angle : il est le plus dévié. C'est la dispersion de la lumière blanche.`) }
    );
}

/* Les 6 cartes de cours */
const MC_CARTES = [
    { t: `Le vocabulaire`, h: () => `<div class="fig">${EX.find(e => e.id === 'SD13').fig()}</div><ul class="mc-ul"><li>La <b>surface de séparation</b> entre les deux milieux s'appelle le <b>dioptre</b>.</li><li>La <b>normale</b> est la droite perpendiculaire à cette surface, au point où le rayon arrive.</li><li><b>i₁</b> : angle d'incidence. <b>i₂</b> : angle de réfraction.</li></ul><div class="trap">Les deux angles se mesurent <b>depuis la normale</b>. Si l'énoncé donne l'angle avec la surface : i = 90° − cet angle.</div>` },
    { t: `Les deux lois`, h: () => `<p><b>Réflexion</b> : le rayon repart du même côté, avec r = i₁.</p><p><b>Réfraction</b> : le rayon change de direction en entrant dans l'autre milieu.</p><div class="formula">${MC_LOI}<small>milieu 1 : d'où vient la lumière &nbsp;·&nbsp; milieu 2 : où elle entre</small></div><p>Les rayons incident, réfléchi, réfracté et la normale sont dans un même plan.</p>` },
    { t: `Trouver un angle`, h: () => `<ol class="steps-l"><li>J'isole le sinus cherché.</li><li>Je calcule ce sinus : un nombre entre 0 et 1.</li><li>Je passe à l'angle avec <b>sin⁻¹</b>.</li></ol><div class="exb">Air → eau, i₁ = 40°.<br>sin(i₂) = ${F('1,00 × sin(40°)', '1,33')} ≈ 0,483<br>i₂ = sin<sup>−1</sup>(0,483) ≈ <b>28,9°</b></div><div class="trap">0,483 n'est pas la réponse : c'est un sinus, pas un angle. Et on ne simplifie jamais par « sin ».</div>` },
    { t: `Trouver un indice`, h: () => `<div class="formula small">n₂ = ${F('n₁ × sin(i₁)', 'sin(i₂)')}</div><div class="exb">Air → plastique, i₁ = 40°, i₂ = 25°.<br>n₂ = ${F('1,00 × sin(40°)', 'sin(25°)')} ≈ ${F('0,643', '0,423')} ≈ <b>1,52</b></div><p>Pas de sin⁻¹ ici : un indice n'est pas un angle. Il n'a pas d'unité, et il vaut toujours au moins 1.</p>` },
    { t: `Trouver le milieu`, h: () => `<p>On ne reconnaît pas un milieu à l'œil : on le reconnaît à son <b>indice</b>.</p><ol class="steps-l"><li>Je calcule n₂ avec la loi.</li><li>Je cherche la valeur la plus proche dans le tableau de l'énoncé.</li></ol><div class="exb">n₂ ≈ 1,36 et le tableau donne eau 1,33, éthanol 1,36, verre 1,52 : c'est de l'<b>éthanol</b>.</div>` },
    { t: `Les réflexes qui sauvent`, h: () => `<ul class="mc-ul"><li><b>Calculatrice en mode degrés</b>, à vérifier avant le premier calcul.</li><li><b>n₁, c'est d'où vient la lumière</b>, pas forcément l'air.</li><li><b>Prévoir le sens</b> : indice plus grand, le rayon se rapproche de la normale (i₂ < i₁) ; indice plus petit, il s'en écarte (i₂ > i₁).</li><li><b>i₁ = 0°</b> : le rayon n'est pas dévié.</li></ul><p>Et toujours les 5 étapes : ${ETAPES.map(e => e.t.charAt(0).toLowerCase() + e.t.slice(1)).join(', ')}.</p>` }
];
const mcList = f => EX.filter(e => { const n = +e.id.slice(2); return e.t === 'SD' && n >= f.ids[0] && n <= f.ids[1]; });
const mcDone = l => l.filter(e => stOf(e.id) === 'ok').length;
const mcAll = () => EX.filter(e => e.t === 'SD');
const mcRead = () => { S.mc = S.mc || {}; return MC_CARTES.filter((c, i) => S.mc[i]).length; };

/* Le bandeau d'accueil : c'est la première chose que l'on voit sur le site. */
function mcBanner() {
    const l = mcAll(), n = mcDone(l);
    return `<a class="mc-banner" href="#masterclass"><svg viewBox="0 0 120 80" aria-hidden="true"><rect y="40" width="120" height="40" fill="rgba(120,190,255,.2)"/><path d="M0 40H120" stroke="rgba(255,255,255,.6)"/><path d="M60 4V76" stroke="rgba(255,255,255,.5)" stroke-dasharray="3 3"/><path class="mc-beam" d="M18 2L60 40L80 76" fill="none" stroke="#ffd84d" stroke-width="3" stroke-linejoin="round"/></svg><span class="mc-b-t"><small>Masterclass · Nouveau</small><b>Snell-Descartes</b><span>Le cours à relire, puis ${l.length} exercices pour tout maîtriser${n ? ` (${n} / ${l.length})` : ''}</span></span><i>→</i></a>`;
}

/* Le rayon qui balaie : les deux membres de la loi restent égaux, quel que soit l'angle. */
function mcAnim() {
    const svg = $('#mc-ray'), inc = $('#mc-inc'), ref = $('#mc-ref'), out = $('#mc-live'); if (!svg) return;
    const rad = Math.PI / 180, X = 170, Y = 95, R = 120;
    const put = i => {
        const r = Math.asin(Math.sin(i * rad) / 1.33) / rad, sa = Math.sin(i * rad), sb = Math.sin(r * rad);
        inc.setAttribute('d', `M${(X - R * sa).toFixed(1)} ${(Y - R * Math.cos(i * rad)).toFixed(1)}L${X} ${Y}`);
        ref.setAttribute('d', `M${X} ${Y}L${(X + R * sb).toFixed(1)} ${(Y + R * Math.cos(r * rad)).toFixed(1)}`);
        out.innerHTML = `<span>i₁ = <b>${fr(i, 1)}°</b></span><span>i₂ = <b>${fr(r, 1)}°</b></span><span class="mc-eq">1,00 × sin(i₁) = 1,33 × sin(i₂) = <b>${fr(sa, 3)}</b></span>`;
    };
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return put(40);
    const t0 = performance.now(), step = t => { if (!svg.isConnected) return; put(42.5 - 27.5 * Math.cos((t - t0) / 1900)); requestAnimationFrame(step); };
    requestAnimationFrame(step);
}

function vMasterclass(sub) {
    const f = MC_FAM[+sub - 1];
    if (f) return mcFamily(+sub - 1, f);
    const l = mcAll(), lus = mcRead(), tous = lus === MC_CARTES.length;
    const msg = [`Tout tient dans <b>une seule formule</b>. Relis ces 6 cartes avant de commencer : 5 minutes bien placées.`, `Bien parti. Continue, chaque carte correspond à un type de question.`, `Tu avances. Lis les pièges : ce sont eux qui coûtent des points.`, `La moitié du cours est relue. Ne t'arrête pas là.`, `Plus que deux cartes.`, `Dernière carte, celle qui rapporte le plus de points.`, `Cours relu. Maintenant, place aux exercices.`][lus];
    app.innerHTML = `<section class="mc-hero">
      <p class="mc-kick">Masterclass</p>
      <h1>Snell-Descartes.<br><span class="grad">Une loi, tous les exercices.</span></h1>
      <svg id="mc-ray" viewBox="0 0 340 190" role="img" aria-label="Un rayon passe de l'air à l'eau et se rapproche de la normale"><rect width="340" height="95" fill="var(--air)"/><rect y="95" width="340" height="95" fill="var(--glass)"/><path d="M0 95H340" stroke="var(--muted)" stroke-width="1.5"/><path d="M170 6V184" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="5 5"/><path id="mc-inc" fill="none" stroke="var(--ray)" stroke-width="3.5" stroke-linecap="round"/><path id="mc-ref" fill="none" stroke="var(--ray)" stroke-width="3.5" stroke-linecap="round"/><text x="10" y="20" class="mc-t">air, n₁ = 1,00</text><text x="10" y="180" class="mc-t">eau, n₂ = 1,33</text></svg>
      <div class="mc-live" id="mc-live"></div>
      <div class="hello"><div class="lumi-w">${lumi(tous ? 'wow' : 'ok')}</div><div class="bubble">${msg}</div></div>
    </section>
    <section id="mc-cours"><h2>1. Je relis le cours</h2>
      <div class="mc-prog" aria-label="${lus} cartes relues sur ${MC_CARTES.length}">${MC_CARTES.map((c, i) => `<i class="${S.mc[i] ? 'on' : ''}"></i>`).join('')}</div>
      ${MC_CARTES.map((c, i) => `<article class="card mc-card${S.mc[i] ? ' lu' : ''}"><h3><span class="num">${i + 1}</span>${c.t}</h3>${c.h()}<button class="btn ${S.mc[i] ? 'done' : 'ghost'}" data-mc="${i}">${S.mc[i] ? '✓ Relu' : `J'ai relu cette carte`}</button></article>`).join('')}
      <a class="row hot2" href="#atelier/refraction"><span class="num">↔</span><span class="row-t"><b>Envie de voir la loi bouger ?</b><small>Le simulateur de réfraction</small></span><span class="go">→</span></a>
    </section>
    <section id="mc-exos"><h2>2. Je m'entraîne</h2>
      <p class="sub">${l.length} exercices, du plus simple au plus complet. Un indice sur chacun, et une correction en 5 étapes.</p>
      <div class="card total">${meter([mcDone(l), l.length])}</div>
      <div class="list">${MC_FAM.map((x, i) => { const m = mcList(x); return `<a class="row" href="#masterclass/${i + 1}"><span class="num">${i + 1}</span><span class="row-t"><b>${x.t}</b><small>${x.d}</small></span><span class="row-m">${meter([mcDone(m), m.length])}</span></a>`; }).join('')}</div>
      <div class="pn"><a class="btn primary" href="#masterclass/1">Commencer les exercices →</a></div>
    </section>`;
    $$('[data-mc]').forEach(b => b.onclick = e => {
        const i = +b.dataset.mc, avant = mcRead();
        S.mc[i] = !S.mc[i]; save();
        const fini = avant < MC_CARTES.length && mcRead() === MC_CARTES.length;
        route(true);
        if (fini) { confetti(); toast(`Cours relu. Place aux exercices.`); }
    });
    mcAnim();
}

function mcFamily(k, f) {
    const l = mcList(f), nx = MC_FAM[k + 1];
    app.innerHTML = `<div class="crumb"><a href="#masterclass">← Masterclass</a><span>›</span>${k + 1} / ${MC_FAM.length}</div><h1>${f.t}</h1><p class="sub">${f.d}. Formule : ${MC_LOI}.</p><div id="exlist"></div>
    <div class="pn"><a class="btn ghost" href="#masterclass">← La Masterclass</a>${nx ? `<a class="btn primary" href="#masterclass/${k + 2}">${nx.t} →</a>` : `<a class="btn primary" href="#masterclass">Terminer</a>`}</div>`;
    const box = $('#exlist');
    l.forEach(ex => { const d = document.createElement('div'); box.appendChild(d); renderEx(ex, d); });
}
