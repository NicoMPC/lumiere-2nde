'use strict';
/* Les outils : règles des puissances, conversions d'unités, et les problèmes guidés en 5 étapes.
   Ce fichier ne fait qu'AJOUTER des thèmes et des exercices (identifiants P…, U…, PB…) : aucun exercice existant n'est modifié. */

const xp = (b, e) => `${b}<sup>${String(e).replace('-', '−')}</sup>`;

/* Les 5 étapes, toujours dans cet ordre et avec ces mots. */
const ETAPES = [
    { t: `Je repère ce qu'on cherche`, d: `Je note les données avec leurs unités, et la grandeur demandée.` },
    { t: `J'identifie la formule`, d: `Je l'écris avec des lettres, arrangée pour isoler ce que je cherche.` },
    { t: `Je vérifie les unités`, d: `Distances en mètres, durées en secondes. Je convertis avant de calculer.` },
    { t: `Je calcule`, d: `Les nombres d'un côté, les puissances de 10 de l'autre.` },
    { t: `Je vérifie le résultat`, d: `Une unité, et un ordre de grandeur plausible.` }
];

/* ================= THÈMES ET EXERCICES ================= */
{
    const old = Object.assign({}, THEMES);
    for (const k in THEMES) delete THEMES[k];
    Object.assign(THEMES, { P: { nom: 'Outil : les règles des puissances', short: 'Règles' }, U: { nom: `Outil : les conversions d'unités`, short: 'Conversions' } }, old);
}
EX.push(
/* P — règles des puissances : choisir la règle avant de calculer */
{ id: 'P1', t: 'P', lvl: 1, type: 'qcm', fixed: true, q: `Dans ${xp('x', 3)} × ${xp('x', 2)}, que fait-on des exposants ?`, opts: [`On les additionne`, `On les multiplie`, `On les soustrait`, `On ne peut rien faire`], a: 0, hint: `Écris ${xp('x', 3)} et ${xp('x', 2)} en entier, avec tous les x. Combien de x sont multipliés au total ?`, corr: [`${xp('x', 3)} × ${xp('x', 2)} = (x × x × x) × (x × x).`, `Cela fait 5 facteurs x : on a compté 3 + 2.`, `Deux puissances <b>qui se multiplient</b> : on <b>additionne</b> les exposants.`] },
{ id: 'P2', t: 'P', lvl: 1, type: 'qcm', fixed: true, q: `Dans (${xp('x', 3)})<sup>2</sup>, que fait-on des exposants ?`, opts: [`On les additionne`, `On les multiplie`, `On les soustrait`, `On ne peut rien faire`], a: 1, hint: `Un carré, c'est le nombre multiplié par lui-même : écris (${xp('x', 3)})<sup>2</sup> comme un produit de deux parenthèses, puis compte les x.`, corr: [`(${xp('x', 3)})<sup>2</sup> = ${xp('x', 3)} × ${xp('x', 3)} = (x × x × x) × (x × x × x).`, `Cela fait 6 facteurs x : 2 paquets de 3.`, `Un exposant <b>posé sur une parenthèse</b> : on <b>multiplie</b> les exposants.`] },
{ id: 'P3', t: 'P', lvl: 1, type: 'qcm', q: `${xp('x', 3)} × ${xp('x', 2)} = ?`, opts: [xp('x', 5), xp('x', 6), xp('x', 9), `2${xp('x', 5)}`], a: 0, hint: `Deux puissances de x qui se multiplient, sans parenthèse avec un exposant dessus. Quelle règle ?`, corr: [`Un produit de deux puissances : on additionne les exposants.`, `3 + 2 = 5.`, `${xp('x', 3)} × ${xp('x', 2)} = <b>${xp('x', 5)}</b>.`] },
{ id: 'P4', t: 'P', lvl: 1, type: 'qcm', q: `(${xp('x', 3)})<sup>2</sup> = ?`, opts: [xp('x', 6), xp('x', 5), xp('x', 9), `2${xp('x', 3)}`], a: 0, hint: `L'exposant 2 est posé sur une parenthèse. Quelle règle ?`, corr: [`Une puissance de puissance : on multiplie les exposants.`, `3 × 2 = 6.`, `(${xp('x', 3)})<sup>2</sup> = <b>${xp('x', 6)}</b>.`] },
{ id: 'P5', t: 'P', lvl: 1, type: 'qcm', q: `${p10(4)} × ${p10(3)} = ?`, opts: [p10(7), p10(12), xp('100', 7), p10(1)], a: 0, hint: `Y a-t-il un exposant posé sur une parenthèse ? Sinon, c'est un simple produit de deux puissances.`, corr: [`Un produit : on additionne les exposants.`, `4 + 3 = 7.`, `${p10(4)} × ${p10(3)} = <b>${p10(7)}</b>. La base reste 10.`] },
{ id: 'P6', t: 'P', lvl: 1, type: 'qcm', q: `(${p10(4)})<sup>3</sup> = ?`, opts: [p10(12), p10(7), p10(64), xp('30', 4)], a: 0, hint: `L'exposant 3 est posé sur une parenthèse : (${p10(4)})<sup>3</sup> = ${p10(4)} × ${p10(4)} × ${p10(4)}.`, corr: [`Une puissance de puissance : on multiplie les exposants.`, `4 × 3 = 12.`, `(${p10(4)})<sup>3</sup> = <b>${p10(12)}</b>.`] },
{ id: 'P7', t: 'P', lvl: 1, type: 'qcm', q: `${F(p10(8), p10(5))} = ?`, opts: [p10(3), p10(13), p10(40), xp('1', 3)], a: 0, hint: `Pour un quotient, on fait l'exposant du haut moins l'exposant du bas.`, corr: [`Un quotient : on soustrait les exposants (haut − bas).`, `8 − 5 = 3.`, `${F(p10(8), p10(5))} = <b>${p10(3)}</b>.`] },
{ id: 'P8', t: 'P', lvl: 1, type: 'qcm', q: `${F(xp('x', 7), xp('x', 3))} = ?`, opts: [xp('x', 4), xp('x', 10), xp('x', 21), `4x`], a: 0, hint: `Même règle qu'avec des nombres : exposant du haut moins exposant du bas.`, corr: [`Un quotient : on soustrait les exposants.`, `7 − 3 = 4.`, `${F(xp('x', 7), xp('x', 3))} = <b>${xp('x', 4)}</b>.`] },
{ id: 'P9', t: 'P', lvl: 2, type: 'qcm', q: `${p10(-3)} × ${p10(5)} = ?`, opts: [p10(2), p10(-15), p10(8), p10(-8)], a: 0, hint: `C'est un produit : on additionne les exposants, en gardant le signe de chacun.`, corr: [`Un produit : on additionne les exposants.`, `−3 + 5 = 2.`, `${p10(-3)} × ${p10(5)} = <b>${p10(2)}</b>.`] },
{ id: 'P10', t: 'P', lvl: 2, type: 'qcm', q: `(${p10(-2)})<sup>3</sup> = ?`, opts: [p10(-6), p10(1), p10(-5), p10(-8)], a: 0, hint: `L'exposant 3 est sur la parenthèse : on multiplie les exposants. Quel est le signe de (−2) × 3 ?`, corr: [`Une puissance de puissance : on multiplie les exposants.`, `(−2) × 3 = −6.`, `(${p10(-2)})<sup>3</sup> = <b>${p10(-6)}</b>.`] },
{ id: 'P11', t: 'P', lvl: 2, type: 'qcm', q: `${F(p10(3), p10(-2))} = ?`, opts: [p10(5), p10(1), p10(-6), p10(-5)], a: 0, hint: `Haut moins bas : 3 − (−2). Soustraire un nombre négatif, c'est ajouter son opposé.`, corr: [`Un quotient : on soustrait les exposants.`, `3 − (−2) = 3 + 2 = 5.`, `${F(p10(3), p10(-2))} = <b>${p10(5)}</b>.`] },
{ id: 'P12', t: 'P', lvl: 2, type: 'qcm', q: `${p10(3)} + ${p10(2)} = ?`, opts: [`1 100`, p10(5), p10(6), xp('20', 5)], a: 0, hint: `Les règles sur les exposants valent pour les produits et les quotients. Ici, c'est une addition : calcule chaque terme.`, corr: [`Il n'existe <b>aucune règle</b> sur les exposants pour une addition.`, `${p10(3)} = 1 000 et ${p10(2)} = 100.`, `1 000 + 100 = <b>1 100</b>.`] },
{ id: 'P13', t: 'P', lvl: 2, type: 'qcm', q: `Un élève écrit : ${p10(4)} × ${p10(2)} = ${p10(8)}. Quelle règle a-t-il utilisée à tort ?`, opts: [`Celle de la puissance de puissance (il a multiplié les exposants)`, `Celle du quotient (il a soustrait les exposants)`, `Aucune, son résultat est juste`, `Il a additionné les exposants`], a: 0, hint: `Comment obtient-on 8 à partir de 4 et de 2 ?`, corr: [`4 × 2 = 8 : il a multiplié les exposants, comme pour (${p10(4)})<sup>2</sup>.`, `Ici, il n'y a pas d'exposant sur une parenthèse : c'est un produit, on additionne.`, `${p10(4)} × ${p10(2)} = <b>${p10(6)}</b>.`] },
{ id: 'P14', t: 'P', lvl: 3, type: 'qcm', q: `(2 × ${p10(3)})<sup>2</sup> = ?`, opts: [`4 × ${p10(6)}`, `2 × ${p10(6)}`, `4 × ${p10(5)}`, `2 × ${p10(9)}`], a: 0, hint: `Le carré porte sur toute la parenthèse : sur le 2 et sur ${p10(3)}. Traite-les l'un après l'autre.`, corr: [`(2 × ${p10(3)})<sup>2</sup> = 2<sup>2</sup> × (${p10(3)})<sup>2</sup>.`, `2<sup>2</sup> = 4, et (${p10(3)})<sup>2</sup> = ${p10(6)} (on multiplie les exposants).`, `Résultat : <b>4 × ${p10(6)}</b>.`] },
{ id: 'P15', t: 'P', lvl: 2, type: 'multi', q: `Quelles écritures sont égales à ${p10(6)} ?`, opts: [`${p10(2)} × ${p10(4)}`, `(${p10(2)})<sup>3</sup>`, `${p10(2)} × ${p10(3)}`, `(${p10(3)})<sup>3</sup>`], a: [0, 1], hint: `Pour chaque écriture, décide d'abord : produit (on additionne) ou exposant sur une parenthèse (on multiplie) ?`, corr: [`${p10(2)} × ${p10(4)} : produit, 2 + 4 = 6 → <b>oui</b>.`, `(${p10(2)})<sup>3</sup> : puissance de puissance, 2 × 3 = 6 → <b>oui</b>.`, `${p10(2)} × ${p10(3)} : produit, 2 + 3 = 5 → non.`, `(${p10(3)})<sup>3</sup> : puissance de puissance, 3 × 3 = 9 → non.`] },

/* U — conversions */
{ id: 'U1', t: 'U', lvl: 1, type: 'qcm', fixed: true, q: `Je convertis une distance de kilomètres en mètres. Le nombre devient…`, opts: [`plus grand : je multiplie par 1 000`, `plus petit : je divise par 1 000`, `il ne change pas`], a: 0, hint: `Le mètre est une unité plus petite que le kilomètre. Faut-il plus ou moins de mètres pour couvrir la même distance ?`, corr: [`1 km = 1 000 m.`, `L'unité devient plus petite, donc il en faut davantage.`, `Le nombre devient <b>plus grand</b> : on multiplie par 1 000 (soit par ${p10(3)}).`] },
{ id: 'U2', t: 'U', lvl: 1, type: 'num', q: `Convertis 4,5 km en mètres.`, a: 4500, tol: 0, unit: 'm', hint: `Vers une unité plus petite : le nombre grossit. Par combien multiplie-t-on pour passer des km aux m ?`, corr: [`1 km = 1 000 m.`, `4,5 × 1 000 = <b>4 500 m</b>.`] },
{ id: 'U3', t: 'U', lvl: 1, type: 'num', q: `Convertis 250 m en kilomètres.`, a: 0.25, tol: 0, unit: 'km', hint: `Cette fois on va vers une unité plus grande : le nombre doit diminuer.`, corr: [`1 km = 1 000 m, donc on divise par 1 000.`, `250 ÷ 1 000 = <b>0,25 km</b>.`] },
{ id: 'U4', t: 'U', lvl: 2, type: 'sci', q: `La Lune est à 384 000 km de la Terre. Écris cette distance en mètres, en écriture scientifique.`, a: 3.84e8, unit: 'm', hint: `Deux temps : d'abord 384 000 en écriture scientifique (en km), puis × ${p10(3)} pour passer en mètres.`, corr: [`384 000 km = 3,84 × ${p10(5)} km.`, `km → m : × ${p10(3)}.`, `3,84 × ${p10(5)} × ${p10(3)} = <b>3,84 × ${p10(8)} m</b> (produit : on additionne les exposants).`] },
{ id: 'U5', t: 'U', lvl: 1, type: 'qcm', q: `« Un million », c'est…`, opts: [p10(6), p10(3), p10(9), p10(12)], a: 0, hint: `Écris un million en chiffres et compte les zéros.`, corr: [`Un million = 1 000 000.`, `Il y a 6 zéros.`, `Un million = <b>${p10(6)}</b> (mille = ${p10(3)}, un milliard = ${p10(9)}).`] },
{ id: 'U6', t: 'U', lvl: 2, type: 'sci', q: `Le Soleil est à 150 millions de km de la Terre. Écris cette distance en mètres, en écriture scientifique.`, a: 1.5e11, unit: 'm', hint: `Trois temps : 150 = 1,5 × ${p10(2)} ; « millions » = × ${p10(6)} ; km → m = × ${p10(3)}. Que fait-on des exposants d'un produit ?`, corr: [`150 millions de km = 150 × ${p10(6)} km = 1,5 × ${p10(2)} × ${p10(6)} km = 1,5 × ${p10(8)} km.`, `km → m : × ${p10(3)}.`, `1,5 × ${p10(8)} × ${p10(3)} = <b>1,5 × ${p10(11)} m</b>.`] },
{ id: 'U7', t: 'U', lvl: 1, type: 'num', q: `Convertis 3 minutes en secondes.`, a: 180, tol: 0, unit: 's', hint: `Combien de secondes dans une minute ?`, corr: [`1 min = 60 s.`, `3 × 60 = <b>180 s</b>.`] },
{ id: 'U8', t: 'U', lvl: 1, type: 'num', q: `Convertis 2 heures en secondes.`, a: 7200, tol: 0, unit: 's', hint: `Passe par les minutes : combien de minutes dans une heure, puis combien de secondes dans une minute ?`, corr: [`1 h = 60 min = 60 × 60 s = 3 600 s.`, `2 × 3 600 = <b>7 200 s</b>.`] },
{ id: 'U9', t: 'U', lvl: 2, type: 'num', q: `Convertis 8 min 20 s en secondes.`, a: 500, tol: 0, unit: 's', hint: `Convertis seulement les minutes, puis ajoute les secondes qui restent.`, corr: [`8 min = 8 × 60 = 480 s.`, `480 + 20 = <b>500 s</b>.`, `Piège : 8 min 20 s n'est pas 8,20 min.`] },
{ id: 'U10', t: 'U', lvl: 2, type: 'num', q: `Une durée vaut 760 s. Elle s'écrit 12 min et combien de secondes ?`, a: 40, tol: 0, unit: 's', hint: `Combien de secondes représentent 12 minutes ? Que reste-t-il ensuite ?`, corr: [`12 min = 12 × 60 = 720 s.`, `760 − 720 = 40.`, `760 s = 12 min <b>40 s</b>.`] },
{ id: 'U11', t: 'U', lvl: 2, type: 'sci', q: `Une radiation a pour longueur d'onde 589 nm. Écris cette longueur en mètres, en écriture scientifique.<br>Donnée : 1 nm = ${p10(-9)} m.`, a: 5.89e-7, unit: 'm', hint: `Deux temps : 589 = 5,89 × ${p10(2)}, puis × ${p10(-9)}. C'est un produit de puissances de 10.`, corr: [`589 nm = 589 × ${p10(-9)} m.`, `589 = 5,89 × ${p10(2)}.`, `5,89 × ${p10(2)} × ${p10(-9)} = <b>5,89 × ${p10(-7)} m</b> (2 + (−9) = −7).`] },
{ id: 'U12', t: 'U', lvl: 2, type: 'num', q: `Une radiation a pour longueur d'onde 6,5 × ${p10(-7)} m. Écris cette longueur en nanomètres.<br>Donnée : 1 nm = ${p10(-9)} m.`, a: 650, tol: 0, unit: 'nm', hint: `Le nanomètre est une unité bien plus petite que le mètre : le nombre doit beaucoup grossir. Par quelle puissance de 10 faut-il diviser ?`, corr: [`1 nm = ${p10(-9)} m, donc on divise par ${p10(-9)}.`, `${F(`6,5 × ${p10(-7)}`, p10(-9))} = 6,5 × ${p10(2)} (−7 − (−9) = 2).`, `Résultat : <b>650 nm</b>.`] },
{ id: 'U13', t: 'U', lvl: 2, type: 'qcm', q: `La lumière se propage à 300 000 km/s dans le vide. En m/s, cela donne…`, opts: [`3 × ${p10(8)} m/s`, `3 × ${p10(5)} m/s`, `3 × ${p10(2)} m/s`, `3 × ${p10(11)} m/s`], a: 0, hint: `Seule la distance change d'unité : 300 000 km, c'est combien de mètres ?`, corr: [`300 000 km = 3 × ${p10(5)} km.`, `km → m : × ${p10(3)}.`, `3 × ${p10(5)} × ${p10(3)} = <b>3 × ${p10(8)} m/s</b>.`] },
{ id: 'U14', t: 'U', lvl: 2, type: 'qcm', q: `Un élève écrit : 2,5 km = 0,0025 m. Qu'en penses-tu ?`, opts: [`Il a divisé par 1 000 au lieu de multiplier : 2,5 km = 2 500 m`, `C'est juste`, `Il fallait multiplier par 100 : 2,5 km = 250 m`, `Il fallait diviser par 100 : 2,5 km = 0,025 m`], a: 0, hint: `2,5 km, c'est à peu près la distance d'une demi-heure de marche. 0,0025 m, c'est 2,5 mm. Est-ce plausible ?`, corr: [`Vers une unité plus petite, le nombre doit grossir.`, `1 km = 1 000 m : on multiplie par 1 000.`, `2,5 km = <b>2 500 m</b>.`] },
{ id: 'U15', t: 'U', lvl: 2, type: 'num', q: `Convertis 1 h 30 min en secondes.`, a: 5400, tol: 0, unit: 's', hint: `Convertis l'heure d'un côté, les 30 minutes de l'autre, puis additionne.`, corr: [`1 h = 3 600 s.`, `30 min = 30 × 60 = 1 800 s.`, `3 600 + 1 800 = <b>5 400 s</b>.`] }
);

/* ================= PROBLÈMES GUIDÉS ================= */
/* Une question = { e: n° d'étape (1 à 5), q, puis soit pick: [...] + a: index, soit sci: valeur (ou num: valeur) + unit, hint, show: ligne gardée une fois réussi, diag?: v => message }. */
const C_TXT = `c = 3,00 × ${p10(8)} m/s`;
const pickForm = { t: `t = ${F('d', 'v')}`, d: `d = v × t`, v: `v = ${F('d', 't')}`, n: `n = ${F('c', 'v')}`, vn: `v = ${F('c', 'n')}` };
const QUOI = ['une durée', 'une distance', 'une vitesse', 'un indice optique'];
const FORMES = [pickForm.t, pickForm.d, pickForm.v];
const UNITES = ['s', 'm', 'm/s', 'sans unité'];
const PB = [
    { id: 'PB1', titre: `Le satellite`, enonce: `Un satellite est à 36 000 km de la Terre. Combien de temps met un signal lumineux pour aller du satellite à la Terre ?<br>Donnée : ${C_TXT}.`,
      qs: [
        { e: 1, q: `Que cherche-t-on ?`, pick: QUOI, a: 0, hint: `Relis la question : « combien de temps… ».`, show: `Je cherche une <b>durée t</b>. Données : d = 36 000 km, ${C_TXT}.` },
        { e: 2, q: `Quelle forme de la formule donne directement une durée ?`, pick: FORMES, a: 0, hint: `Tu cherches t : il doit être seul, à gauche du signe égal.`, show: `Formule : ${pickForm.t}, avec v = c.` },
        { e: 3, q: `c est en m/s. Quelle donnée faut-il convertir ?`, pick: [`La distance : des km vers les m`, `La vitesse : des m/s vers les km/h`, `Rien, tout est prêt`], a: 0, hint: `Compare l'unité de la distance avec celle qui apparaît dans « m/s ».`, show: `La distance doit être en mètres.` },
        { e: 3, q: `Écris d = 36 000 km en mètres, en écriture scientifique.`, sci: 3.6e7, unit: 'm', hint: `36 000 = 3,6 × ${p10(4)}, puis km → m : × ${p10(3)}.`, diag: v => Math.abs(v / 3.6e4 - 1) < .02 ? `Ça, c'est encore en kilomètres. Il reste à multiplier par ${p10(3)}.` : Math.abs(v / 3.6e1 - 1) < .02 ? `Tu as divisé par ${p10(3)} : vers une unité plus petite, le nombre doit grossir.` : '', show: `d = 36 000 km = 3,6 × ${p10(4)} km = <b>3,6 × ${p10(7)} m</b>.` },
        { e: 4, q: `Calcule t = ${F(`3,6 × ${p10(7)}`, `3,00 × ${p10(8)}`)}.`, sci: 0.12, unit: 's', hint: `Les nombres ensemble : 3,6 ÷ 3,00. Les puissances ensemble : ${p10(7)} ÷ ${p10(8)}. Pour un quotient, que fait-on des exposants ?`, diag: v => Math.abs(v / 1.2e15 - 1) < .02 ? `Tu as additionné les exposants. Pour une division, on les soustrait : 7 − 8.` : Math.abs(v / 1.2e-4 - 1) < .02 ? `Tu as gardé la distance en kilomètres.` : '', show: `t = ${F(`3,6 × ${p10(7)}`, `3,00 × ${p10(8)}`)} = 1,2 × ${p10(-1)} = <b>0,12 s</b>.` },
        { e: 5, q: `Quelle est l'unité du résultat ?`, pick: UNITES, a: 0, hint: `Tu as calculé une durée, avec une distance en m et une vitesse en m/s.`, show: `t = 0,12 <b>s</b>.` },
        { e: 5, q: `0,12 s pour 36 000 km : est-ce plausible ?`, pick: [`Oui : la lumière fait 300 000 km en une seconde`, `Non, c'est beaucoup trop court`], a: 0, hint: `Compare 36 000 km à la distance que la lumière parcourt en une seconde.`, show: `Plausible : 36 000 km, c'est environ un dixième de 300 000 km.` }
      ],
      modele: [`Données : d = 36 000 km ; ${C_TXT}. Je cherche t.`, `Formule : ${pickForm.t}, avec v = c.`, `Conversion : d = 36 000 km = 3,6 × ${p10(7)} m.`, `Calcul : t = ${F(`3,6 × ${p10(7)}`, `3,00 × ${p10(8)}`)} = 0,12 s.`, `Résultat : <b><u>t = 0,12 s</u></b>. Plausible : bien moins d'une seconde.`] },

    { id: 'PB2', titre: `Jupiter`, enonce: `Jupiter est à 780 millions de km du Soleil. Combien de temps la lumière du Soleil met-elle pour atteindre Jupiter ?<br>Donnée : ${C_TXT}.`,
      qs: [
        { e: 1, q: `Que cherche-t-on ?`, pick: QUOI, a: 0, hint: `« Combien de temps… »`, show: `Je cherche une <b>durée t</b>. Données : d = 780 millions de km, ${C_TXT}.` },
        { e: 2, q: `Quelle forme de la formule ?`, pick: FORMES, a: 0, hint: `La grandeur cherchée doit être seule à gauche.`, show: `Formule : ${pickForm.t}, avec v = c.` },
        { e: 3, q: `Quelle donnée faut-il convertir ?`, pick: [`La distance : des millions de km vers les m`, `La vitesse de la lumière`, `Rien, tout est prêt`], a: 0, hint: `c est en m/s. Dans quelle unité doit être la distance ?`, show: `La distance doit être en mètres.` },
        { e: 3, q: `Écris d = 780 millions de km en mètres, en écriture scientifique.`, sci: 7.8e11, unit: 'm', hint: `Trois facteurs : 780 = 7,8 × ${p10(2)} ; « millions » = × ${p10(6)} ; km → m = × ${p10(3)}. C'est un produit.`, diag: v => Math.abs(v / 7.8e8 - 1) < .02 ? `Ça, c'est en kilomètres. Il reste à multiplier par ${p10(3)}.` : Math.abs(v / 7.8e36 - 1) < .02 ? `Tu as multiplié les exposants. Pour un produit, on les additionne : 2 + 6 + 3.` : '', show: `d = 7,8 × ${p10(2)} × ${p10(6)} × ${p10(3)} m = <b>7,8 × ${p10(11)} m</b>.` },
        { e: 4, q: `Calcule t = ${F(`7,8 × ${p10(11)}`, `3,00 × ${p10(8)}`)}.`, sci: 2600, unit: 's', hint: `7,8 ÷ 3,00 d'un côté, ${p10(11)} ÷ ${p10(8)} de l'autre.`, diag: v => Math.abs(v / 2.6e19 - 1) < .02 ? `Tu as additionné les exposants. Pour une division, on les soustrait : 11 − 8.` : Math.abs(v / 2.6 - 1) < .02 ? `Tu as gardé la distance en kilomètres.` : '', show: `t = ${F(`7,8 × ${p10(11)}`, `3,00 × ${p10(8)}`)} = 2,6 × ${p10(3)} = <b>2 600 s</b>.` },
        { e: 5, q: `Quelle est l'unité du résultat ?`, pick: UNITES, a: 0, hint: `C'est une durée, dans l'unité du système international.`, show: `t = 2 600 <b>s</b>.` },
        { e: 5, q: `La lumière met environ 500 s pour atteindre la Terre. Pour Jupiter, bien plus lointaine, 2 600 s est-il plausible ?`, pick: [`Oui : plus loin, donc plus long`, `Non : ce devrait être plus court`], a: 0, hint: `Jupiter est environ 5 fois plus loin du Soleil que la Terre.`, show: `Plausible : 2 600 s, soit 43 min 20 s, environ 5 fois plus que pour la Terre.` }
      ],
      modele: [`Données : d = 780 millions de km ; ${C_TXT}. Je cherche t.`, `Formule : ${pickForm.t}, avec v = c.`, `Conversion : d = 780 × ${p10(6)} km = 7,8 × ${p10(11)} m.`, `Calcul : t = ${F(`7,8 × ${p10(11)}`, `3,00 × ${p10(8)}`)} = 2,6 × ${p10(3)} s.`, `Résultat : <b><u>t = 2 600 s</u></b>, soit 43 min 20 s.`] },

    { id: 'PB3', titre: `La sonde`, enonce: `Un signal lumineux met 5,0 minutes pour aller de la Terre à une sonde spatiale. À quelle distance se trouve la sonde ?<br>Donnée : ${C_TXT}.`,
      qs: [
        { e: 1, q: `Que cherche-t-on ?`, pick: QUOI, a: 1, hint: `« À quelle distance… »`, show: `Je cherche une <b>distance d</b>. Données : t = 5,0 min, ${C_TXT}.` },
        { e: 2, q: `Quelle forme de la formule donne directement une distance ?`, pick: FORMES, a: 1, hint: `d doit être seul à gauche du signe égal.`, show: `Formule : ${pickForm.d}, avec v = c.` },
        { e: 3, q: `Quelle donnée faut-il convertir ?`, pick: [`La durée : des minutes vers les secondes`, `La vitesse de la lumière`, `Rien, tout est prêt`], a: 0, hint: `c est en m/s : en mètres par quoi ?`, show: `La durée doit être en secondes.` },
        { e: 3, q: `Écris t = 5,0 min en secondes.`, num: 300, unit: 's', hint: `Combien de secondes dans une minute ?`, show: `t = 5,0 × 60 = <b>300 s</b>.` },
        { e: 4, q: `Calcule d = 3,00 × ${p10(8)} × 300.`, sci: 9e10, unit: 'm', hint: `Écris 300 = 3 × ${p10(2)}. Les nombres ensemble, les puissances ensemble. C'est un produit.`, diag: v => Math.abs(v / 1.5e9 - 1) < .02 ? `Tu as gardé la durée en minutes.` : Math.abs(v / 9e16 - 1) < .02 ? `Tu as multiplié les exposants. Pour un produit, on les additionne : 8 + 2.` : '', show: `d = 3,00 × ${p10(8)} × 3 × ${p10(2)} = <b>9 × ${p10(10)} m</b>.` },
        { e: 5, q: `Quelle est l'unité du résultat ?`, pick: UNITES, a: 1, hint: `C'est une distance : des m/s multipliés par des s.`, show: `d = 9 × ${p10(10)} <b>m</b>.` },
        { e: 5, q: `9 × ${p10(10)} m, c'est 90 millions de km. Le Soleil est à 150 millions de km (8 min 20 s de lumière). Plausible ?`, pick: [`Oui : 5 min de lumière, c'est moins que la distance au Soleil`, `Non : ce devrait être plus que la distance au Soleil`], a: 0, hint: `Compare les deux durées : 5 min et 8 min 20 s.`, show: `Plausible : moins de temps, donc moins de distance que jusqu'au Soleil.` }
      ],
      modele: [`Données : t = 5,0 min ; ${C_TXT}. Je cherche d.`, `Formule : ${pickForm.d}, avec v = c.`, `Conversion : t = 5,0 × 60 = 300 s.`, `Calcul : d = 3,00 × ${p10(8)} × 300 = 9 × ${p10(10)} m.`, `Résultat : <b><u>d = 9 × ${p10(10)} m</u></b>, soit 90 millions de km.`] },

    { id: 'PB4', titre: `L'éclair`, enonce: `La lumière d'un éclair met 1,0 × ${p10(-5)} s pour arriver jusqu'à un observateur. À quelle distance l'éclair s'est-il produit ?<br>Donnée : ${C_TXT}.`,
      qs: [
        { e: 1, q: `Que cherche-t-on ?`, pick: QUOI, a: 1, hint: `« À quelle distance… »`, show: `Je cherche une <b>distance d</b>. Données : t = 1,0 × ${p10(-5)} s, ${C_TXT}.` },
        { e: 2, q: `Quelle forme de la formule ?`, pick: FORMES, a: 1, hint: `La grandeur cherchée seule à gauche.`, show: `Formule : ${pickForm.d}, avec v = c.` },
        { e: 3, q: `Quelle donnée faut-il convertir ?`, pick: [`La durée, vers les secondes`, `La vitesse de la lumière`, `Rien, tout est prêt`], a: 2, hint: `Regarde l'unité de chaque donnée : la durée est en quoi ? Et c ?`, show: `Durée en s, vitesse en m/s : <b>rien à convertir</b>. On vérifie quand même à chaque fois.` },
        { e: 4, q: `Calcule d = 3,00 × ${p10(8)} × 1,0 × ${p10(-5)}.`, sci: 3000, unit: 'm', hint: `C'est un produit : on additionne les exposants, signes compris.`, diag: v => Math.abs(v / 3e-40 - 1) < .02 ? `Tu as multiplié les exposants. Pour un produit, on les additionne : 8 + (−5).` : Math.abs(v / 3e13 - 1) < .02 ? `Attention au signe : 8 + (−5), pas 8 + 5.` : '', show: `d = 3,00 × ${p10(8)} × 1,0 × ${p10(-5)} = <b>3,0 × ${p10(3)} m</b>.` },
        { e: 5, q: `Quelle est l'unité du résultat ?`, pick: UNITES, a: 1, hint: `Des m/s multipliés par des s.`, show: `d = 3,0 × ${p10(3)} <b>m</b>.` },
        { e: 5, q: `3 000 m, soit 3 km, pour un éclair qu'on voit depuis sa fenêtre : plausible ?`, pick: [`Oui : quelques kilomètres, c'est l'ordre de grandeur d'un orage`, `Non : un éclair est toujours à des milliers de kilomètres`], a: 0, hint: `À quelle distance voit-on habituellement un orage ?`, show: `Plausible : un orage se trouve à quelques kilomètres.` }
      ],
      modele: [`Données : t = 1,0 × ${p10(-5)} s ; ${C_TXT}. Je cherche d.`, `Formule : ${pickForm.d}, avec v = c.`, `Unités : t en s, c en m/s. Rien à convertir.`, `Calcul : d = 3,00 × ${p10(8)} × 1,0 × ${p10(-5)} = 3,0 × ${p10(3)} m.`, `Résultat : <b><u>d = 3,0 × ${p10(3)} m</u></b>, soit 3 km.`] },

    { id: 'PB5', titre: `La fibre optique`, enonce: `Dans une fibre optique, la lumière se propage à v = 2,0 × ${p10(8)} m/s. Un câble sous-marin mesure 6 000 km. Combien de temps met un signal pour le parcourir ?`,
      qs: [
        { e: 1, q: `Que cherche-t-on ?`, pick: QUOI, a: 0, hint: `« Combien de temps… »`, show: `Je cherche une <b>durée t</b>. Données : d = 6 000 km, v = 2,0 × ${p10(8)} m/s.` },
        { e: 2, q: `Quelle forme de la formule ?`, pick: FORMES, a: 0, hint: `La durée seule à gauche.`, show: `Formule : ${pickForm.t}.` },
        { e: 2, q: `Quelle vitesse faut-il utiliser ici ?`, pick: [`v = 2,0 × ${p10(8)} m/s, celle dans la fibre`, `c = 3,00 × ${p10(8)} m/s, celle dans le vide`], a: 0, hint: `Dans quel milieu la lumière se propage-t-elle dans ce problème ?`, show: `La lumière est dans la fibre : v = 2,0 × ${p10(8)} m/s.` },
        { e: 3, q: `Écris d = 6 000 km en mètres, en écriture scientifique.`, sci: 6e6, unit: 'm', hint: `6 000 = 6 × ${p10(3)}, puis km → m : × ${p10(3)}.`, diag: v => Math.abs(v / 6e3 - 1) < .02 ? `Ça, c'est en kilomètres. Il reste à multiplier par ${p10(3)}.` : Math.abs(v / 6e9 - 1) < .02 ? `Tu as multiplié les exposants. Pour un produit, on les additionne : 3 + 3.` : '', show: `d = 6 × ${p10(3)} km = <b>6 × ${p10(6)} m</b>.` },
        { e: 4, q: `Calcule t = ${F(`6 × ${p10(6)}`, `2,0 × ${p10(8)}`)}.`, sci: 0.03, unit: 's', hint: `6 ÷ 2,0 d'un côté, ${p10(6)} ÷ ${p10(8)} de l'autre : haut moins bas.`, diag: v => Math.abs(v / 3e14 - 1) < .02 ? `Tu as additionné les exposants. Pour une division, on les soustrait : 6 − 8.` : Math.abs(v / 3e2 - 1) < .02 ? `Haut moins bas : 6 − 8, et non 8 − 6.` : Math.abs(v / 0.02 - 1) < .02 ? `Tu as utilisé c. Dans la fibre, la vitesse est 2,0 × ${p10(8)} m/s.` : '', show: `t = ${F(`6 × ${p10(6)}`, `2,0 × ${p10(8)}`)} = 3 × ${p10(-2)} = <b>0,03 s</b>.` },
        { e: 5, q: `Quelle est l'unité du résultat ?`, pick: UNITES, a: 0, hint: `C'est une durée.`, show: `t = 0,03 <b>s</b>.` },
        { e: 5, q: `0,03 s pour traverser un océan : plausible ?`, pick: [`Oui : c'est pour ça qu'un appel vidéo à l'autre bout du monde est presque instantané`, `Non : il faudrait plusieurs minutes`], a: 0, hint: `Pense au délai que tu constates dans un appel avec quelqu'un de très loin.`, show: `Plausible : quelques centièmes de seconde.` }
      ],
      modele: [`Données : d = 6 000 km ; v = 2,0 × ${p10(8)} m/s. Je cherche t.`, `Formule : ${pickForm.t}.`, `Conversion : d = 6 000 km = 6 × ${p10(6)} m.`, `Calcul : t = ${F(`6 × ${p10(6)}`, `2,0 × ${p10(8)}`)} = 3 × ${p10(-2)} s.`, `Résultat : <b><u>t = 0,03 s</u></b>.`] },

    { id: 'PB6', titre: `Une mesure de vitesse`, enonce: `Lors d'une expérience, un faisceau laser parcourt 900 km en 0,0030 s. Calcule la vitesse de la lumière mesurée.`,
      qs: [
        { e: 1, q: `Que cherche-t-on ?`, pick: QUOI, a: 2, hint: `« Calcule la vitesse… »`, show: `Je cherche une <b>vitesse v</b>. Données : d = 900 km, t = 0,0030 s.` },
        { e: 2, q: `Quelle forme de la formule ?`, pick: FORMES, a: 2, hint: `La vitesse seule à gauche.`, show: `Formule : ${pickForm.v}.` },
        { e: 3, q: `On veut une vitesse en m/s. Quelle donnée faut-il convertir ?`, pick: [`La distance : des km vers les m`, `La durée : elle n'est pas en secondes`, `Rien, tout est prêt`], a: 0, hint: `Regarde l'unité de chacune des deux données.`, show: `La distance doit être en mètres ; la durée est déjà en secondes.` },
        { e: 3, q: `Écris d = 900 km en mètres, en écriture scientifique.`, sci: 9e5, unit: 'm', hint: `900 = 9 × ${p10(2)}, puis km → m : × ${p10(3)}.`, diag: v => Math.abs(v / 9e2 - 1) < .02 ? `Ça, c'est en kilomètres. Il reste à multiplier par ${p10(3)}.` : '', show: `d = 9 × ${p10(2)} km = <b>9 × ${p10(5)} m</b>.` },
        { e: 3, q: `Écris t = 0,0030 s en écriture scientifique.`, sci: 3e-3, unit: 's', hint: `De combien de rangs faut-il déplacer la virgule pour obtenir 3,0 ? Un nombre plus petit que 1 a un exposant de quel signe ?`, diag: v => Math.abs(v / 3e3 - 1) < .02 ? `0,0030 est plus petit que 1 : l'exposant est négatif.` : '', show: `t = <b>3,0 × ${p10(-3)} s</b>.` },
        { e: 4, q: `Calcule v = ${F(`9 × ${p10(5)}`, `3,0 × ${p10(-3)}`)}.`, sci: 3e8, unit: 'm/s', hint: `9 ÷ 3,0 d'un côté. Pour les puissances : haut moins bas, soit 5 − (−3).`, diag: v => Math.abs(v / 3e2 - 1) < .02 ? `5 − (−3) : soustraire un négatif, c'est ajouter. Tu as fait 5 − 3.` : Math.abs(v / 3e-15 - 1) < .02 ? `Tu as multiplié les exposants. Pour une division, on les soustrait.` : '', show: `v = ${F(`9 × ${p10(5)}`, `3,0 × ${p10(-3)}`)} = <b>3,0 × ${p10(8)} m/s</b>.` },
        { e: 5, q: `Quelle est l'unité du résultat ?`, pick: UNITES, a: 2, hint: `Des mètres divisés par des secondes.`, show: `v = 3,0 × ${p10(8)} <b>m/s</b>.` },
        { e: 5, q: `3,0 × ${p10(8)} m/s : plausible ?`, pick: [`Oui : c'est la valeur connue de c`, `Non : la lumière va bien plus vite`], a: 0, hint: `Quelle valeur de c donne-t-on toujours dans les énoncés ?`, show: `Plausible : on retrouve c.` }
      ],
      modele: [`Données : d = 900 km ; t = 0,0030 s. Je cherche v.`, `Formule : ${pickForm.v}.`, `Conversion : d = 900 km = 9 × ${p10(5)} m ; t = 3,0 × ${p10(-3)} s.`, `Calcul : v = ${F(`9 × ${p10(5)}`, `3,0 × ${p10(-3)}`)} = 3,0 × ${p10(8)} m/s.`, `Résultat : <b><u>v = 3,0 × ${p10(8)} m/s</u></b>.`] },

    { id: 'PB7', titre: `L'indice d'un liquide`, enonce: `Dans un liquide, la lumière se propage à 225 000 km/s. Calcule l'indice optique de ce liquide.<br>Donnée : ${C_TXT}.`,
      qs: [
        { e: 1, q: `Que cherche-t-on ?`, pick: QUOI, a: 3, hint: `« Calcule l'indice optique… »`, show: `Je cherche un <b>indice optique n</b>. Données : v = 225 000 km/s, ${C_TXT}.` },
        { e: 2, q: `Quelle formule relie l'indice optique et les vitesses ?`, pick: [pickForm.n, `n = ${F('v', 'c')}`, `n = c × v`], a: 0, hint: `Un indice optique est toujours supérieur ou égal à 1 : laquelle des deux vitesses, la plus grande, doit être en haut ?`, show: `Formule : ${pickForm.n}.` },
        { e: 3, q: `Quelle donnée faut-il convertir ?`, pick: [`La vitesse v : des km/s vers les m/s`, `c : des m/s vers les km/h`, `Rien, tout est prêt`], a: 0, hint: `Pour diviser deux vitesses, elles doivent être dans la même unité.`, show: `Les deux vitesses doivent être dans la même unité : v en m/s.` },
        { e: 3, q: `Écris v = 225 000 km/s en m/s, en écriture scientifique.`, sci: 2.25e8, unit: 'm/s', hint: `225 000 = 2,25 × ${p10(5)}, puis km → m : × ${p10(3)}.`, diag: v => Math.abs(v / 2.25e5 - 1) < .02 ? `Ça, c'est en km/s. Il reste à multiplier par ${p10(3)}.` : Math.abs(v / 2.25e15 - 1) < .02 ? `Tu as multiplié les exposants. Pour un produit, on les additionne : 5 + 3.` : '', show: `v = 2,25 × ${p10(5)} km/s = <b>2,25 × ${p10(8)} m/s</b>.` },
        { e: 4, q: `Calcule n = ${F(`3,00 × ${p10(8)}`, `2,25 × ${p10(8)}`)}. Arrondis au centième.`, num: 1.33, tol: 0.006, unit: '', hint: `Les deux puissances de 10 sont identiques : que vaut ${p10(8)} ÷ ${p10(8)} ? Il reste 3,00 ÷ 2,25.`, diag: v => Math.abs(v - 0.75) < .006 ? `Tu as divisé v par c. La plus grande vitesse, c, va en haut.` : '', show: `n = ${F(`3,00 × ${p10(8)}`, `2,25 × ${p10(8)}`)} = <b>1,33</b>.` },
        { e: 5, q: `Quelle est l'unité du résultat ?`, pick: UNITES, a: 3, hint: `On divise des m/s par des m/s : que reste-t-il ?`, show: `n = 1,33, <b>sans unité</b>.` },
        { e: 5, q: `n = 1,33 : plausible ?`, pick: [`Oui : c'est plus grand que 1, et c'est l'indice de l'eau`, `Non : un indice doit être plus petit que 1`], a: 0, hint: `Un indice optique peut-il être plus petit que 1 ?`, show: `Plausible : n ≥ 1, et 1,33 est l'indice de l'eau.` }
      ],
      modele: [`Données : v = 225 000 km/s ; ${C_TXT}. Je cherche n.`, `Formule : ${pickForm.n}.`, `Conversion : v = 225 000 km/s = 2,25 × ${p10(8)} m/s.`, `Calcul : n = ${F(`3,00 × ${p10(8)}`, `2,25 × ${p10(8)}`)} = 1,33.`, `Résultat : <b><u>n = 1,33</u></b> (sans unité). C'est l'indice de l'eau.`] },

    { id: 'PB8', titre: `La vitesse dans le diamant`, enonce: `L'indice optique du diamant est n = 2,42. Calcule la vitesse de la lumière dans le diamant.<br>Donnée : ${C_TXT}.`,
      qs: [
        { e: 1, q: `Que cherche-t-on ?`, pick: QUOI, a: 2, hint: `« Calcule la vitesse… »`, show: `Je cherche une <b>vitesse v</b>. Données : n = 2,42, ${C_TXT}.` },
        { e: 2, q: `On part de ${pickForm.n}. Quelle forme donne directement v ?`, pick: [pickForm.vn, `v = n × c`, `v = ${F('n', 'c')}`], a: 0, hint: `Dans un milieu, la lumière va moins vite que dans le vide : la forme choisie doit donner une vitesse plus petite que c.`, show: `Formule : ${pickForm.n}, donc ${pickForm.vn}.` },
        { e: 3, q: `Quelle donnée faut-il convertir ?`, pick: [`L'indice n`, `La vitesse c`, `Rien, tout est prêt`], a: 2, hint: `n n'a pas d'unité. Et c, dans quelle unité est-elle donnée ?`, show: `c en m/s, n sans unité : <b>rien à convertir</b>.` },
        { e: 4, q: `Calcule v = ${F(`3,00 × ${p10(8)}`, '2,42')}. Garde trois chiffres.`, sci: 1.24e8, unit: 'm/s', hint: `Seul le nombre 3,00 est divisé par 2,42. La puissance ${p10(8)} ne bouge pas.`, diag: v => Math.abs(v / 7.26e8 - 1) < .02 ? `Tu as multiplié par n. La lumière ralentit : on divise.` : '', show: `v = ${F(`3,00 × ${p10(8)}`, '2,42')} = <b>1,24 × ${p10(8)} m/s</b>.` },
        { e: 5, q: `Quelle est l'unité du résultat ?`, pick: UNITES, a: 2, hint: `C'est une vitesse.`, show: `v = 1,24 × ${p10(8)} <b>m/s</b>.` },
        { e: 5, q: `1,24 × ${p10(8)} m/s : plausible ?`, pick: [`Oui : c'est plus petit que c`, `Non : ce devrait être plus grand que c`], a: 0, hint: `Compare avec la vitesse de la lumière dans le vide.`, show: `Plausible : aucune vitesse ne dépasse c.` }
      ],
      modele: [`Données : n = 2,42 ; ${C_TXT}. Je cherche v.`, `Formule : ${pickForm.n}, donc ${pickForm.vn}.`, `Unités : c en m/s, n sans unité. Rien à convertir.`, `Calcul : v = ${F(`3,00 × ${p10(8)}`, '2,42')} = 1,24 × ${p10(8)} m/s.`, `Résultat : <b><u>v = 1,24 × ${p10(8)} m/s</u></b>. Plausible : plus petit que c.`] }
];

function labProbleme() {
    S.pb = S.pb || {};
    const k = parseInt(location.hash.split('/')[2], 10), P = PB[k - 1];
    const back = `<div class="crumb"><a href="#methodes">Méthodes</a><span>›</span>${P ? `<a href="#atelier/probleme">Problèmes guidés</a><span>›</span><b>${P.titre}</b>` : '<b>Problèmes guidés</b>'}</div>`;
    if (!P) {
        const n = PB.filter(p => S.pb[p.id]).length;
        app.innerHTML = `${back}<h1>Problèmes guidés</h1><p class="sub">Une seule méthode pour tous les calculs, toujours dans le même ordre. Chaque étape doit être validée pour ouvrir la suivante.</p>
        <div class="card"><h3>Les 5 étapes</h3><ol class="steps-l">${ETAPES.map(e => `<li><b>${e.t}.</b> ${e.d}</li>`).join('')}</ol></div>
        <div class="card total">${meter([n, PB.length])}</div>
        <div class="list">${PB.map((p, i) => `<a class="row" href="#atelier/probleme/${i + 1}"><span class="num">${S.pb[p.id] ? '✓' : i + 1}</span><span class="row-t"><b>${p.titre}</b><small>${S.pb[p.id] ? 'Mené au bout' : 'À faire'}</small></span><span class="go">→</span></a>`).join('')}</div>`;
        return;
    }
    let step = 0; const done = [];
    app.innerHTML = `${back}<h1>${P.titre}</h1><div id="pb"></div>`;
    function draw(msg) {
        const end = step >= P.qs.length, cur = P.qs[step];
        const lines = ETAPES.map((E, i) => {
            const mine = done.filter(d => d.e === i + 1), isCur = !end && cur.e === i + 1;
            if (!mine.length && !isCur) return `<li class="todo"><span class="pb-t">${E.t}</span></li>`;
            let h = `<span class="pb-t">${E.t}</span>${mine.map(d => `<div class="pb-ok">${d.show}</div>`).join('')}`;
            if (isCur) h += `<div class="pb-q">${cur.q}</div>${hintD(cur.hint)}${cur.pick
                ? `<div class="chips">${cur.order.map(j => `<button class="chip" data-v="${j}">${cur.pick[j]}</button>`).join('')}</div>`
                : cur.sci !== undefined
                    ? `<div class="inp sci"><input type="text" inputmode="decimal" autocomplete="off" class="in-m" placeholder="nombre" aria-label="nombre"><span class="x10">× 10</span><input type="text" inputmode="text" autocomplete="off" class="in-e" placeholder="exp." aria-label="exposant"><span class="unit">${cur.unit || ''}</span></div><p class="note">Exposant 0 si tu n'as pas besoin de puissance de 10.</p><div class="ex-actions"><button class="btn primary" id="pb-ok">Valider</button><button class="btn ghost" id="pb-calc">Calculatrice</button></div>`
                    : `<div class="inp"><input type="text" inputmode="decimal" autocomplete="off" class="in-num" placeholder="ta réponse" aria-label="réponse"><span class="unit">${cur.unit || ''}</span></div><div class="ex-actions"><button class="btn primary" id="pb-ok">Valider</button><button class="btn ghost" id="pb-calc">Calculatrice</button></div>`}${msg ? `<div class="ex-fb ko">${msg}</div>` : ''}`;
            return `<li class="${isCur ? 'cur' : 'ok'}">${h}</li>`;
        }).join('');
        const nx = PB[k];
        $('#pb').innerHTML = `<div class="card lab"><p class="ex-q">${P.enonce}</p><ol class="gd-steps pb-steps">${lines}</ol>
          ${end ? `<div class="ex-fb ok"><b>Problème mené au bout.</b> Voici ce que tu écris sur ta copie.</div><div class="exb pb-modele"><ol class="steps-l">${P.modele.map(m => `<li>${m}</li>`).join('')}</ol></div>
          <div class="ex-actions">${nx ? `<a class="btn primary" href="#atelier/probleme/${k + 1}">Problème suivant →</a>` : ''}<a class="btn ghost" href="#atelier/probleme">Tous les problèmes</a><button class="btn ghost" id="pb-redo">Refaire</button></div>` : `<p class="note">Étape ${cur.e} sur 5.</p>`}</div>`;
        if (end) { $('#pb-redo').onclick = () => route(true); return; }
        const go = (ok, wrong) => {
            if (ok) { done.push({ e: cur.e, show: cur.show }); step++; serie++; if (step >= P.qs.length && !S.pb[P.id]) { S.pb[P.id] = 1; save(); } draw(); }
            else { serie = 0; draw(wrong || `Pas encore. Ouvre l'indice, puis réessaie.`); const g = $('#pb .cur'); g && g.classList.add('shake'); }
        };
        if (cur.pick) $$('#pb [data-v]').forEach(b => b.onclick = () => go(+b.dataset.v === cur.a));
        else {
            const sub = () => {
                let v;
                if (cur.sci !== undefined) {
                    const m = num($('#pb .in-m').value), e = num($('#pb .in-e').value);
                    if (isNaN(e)) { toast(`Écris au moins l'exposant.`); return; }
                    v = (isNaN(m) ? 1 : m) * Math.pow(10, e);
                    go(Math.abs(v / cur.sci - 1) <= 0.011, cur.diag && cur.diag(v));
                } else {
                    v = num($('#pb .in-num').value);
                    if (isNaN(v)) { toast('Écris un nombre.'); return; }
                    go(Math.abs(v - cur.num) <= (cur.tol || 0) + 1e-9, cur.diag && cur.diag(v));
                }
            };
            $('#pb-ok').onclick = sub;
            $$('#pb input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') sub(); }));
            $('#pb-calc').onclick = () => window.Calc && Calc.open();
        }
    }
    P.qs.forEach(q => { if (q.pick) { q.order = [...q.pick.keys()]; for (let i = q.order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [q.order[i], q.order[j]] = [q.order[j], q.order[i]]; } } });
    draw();
}
(window.EXTRA_LABS = window.EXTRA_LABS || []).push({ k: 'probleme', title: 'Problèmes guidés', d: 'Une méthode en 5 étapes, validées une par une', fn: labProbleme });
