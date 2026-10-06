'use strict';
/* Tout le contenu du site : cours, méthodes, exercices, cartes mémoire. */

const GAZ = {
    H: { nom: 'Hydrogène', raies: [410, 434, 486, 656] },
    Na: { nom: 'Sodium', raies: [589] },
    He: { nom: 'Hélium', raies: [447, 471, 492, 502, 588, 668, 707] },
    Hg: { nom: 'Mercure', raies: [405, 436, 546, 577, 579] },
    Li: { nom: 'Lithium', raies: [460, 610, 671] }
};
const MILIEUX = [['air', 1.00], ['eau', 1.33], ['verre', 1.50], ['diamant', 2.42]];

/* ============ COURS ============ */
const CH = [
{
    id: 'sources', title: `D'où vient la lumière`, sub: 'Sources primaires et sources secondaires',
    html: () => `
    <div class="fig">${figSources()}</div>
    <div class="def"><b>Source primaire</b> : elle <u>fabrique</u> sa lumière.<br><span class="eg">Soleil, étoile, flamme, lampe allumée, écran.</span></div>
    <div class="def"><b>Source secondaire</b> (ou objet diffusant) : elle ne fabrique rien, elle <u>renvoie</u> dans toutes les directions la lumière qu'elle reçoit.<br><span class="eg">Lune, planète, feuille de papier, mur.</span></div>
    <p><b>Pour voir un objet</b>, il faut que de la lumière partie de cet objet <u>entre dans ton œil</u>. La lumière va de l'objet vers l'œil, jamais l'inverse.</p>
    <div class="trap">La Lune brille, mais elle n'est <b>pas</b> une source primaire : éteins le Soleil, elle disparaît.</div>`,
    quick: { q: `Lequel est une source primaire ?`, opts: [`La Lune`, `Un miroir`, `Une flamme de bougie`, `Une feuille blanche`], a: 2, why: `La flamme fabrique sa lumière. Les trois autres ne font que renvoyer celle qu'ils reçoivent.` }
},
{
    id: 'rectiligne', title: `Comment elle se déplace`, sub: 'La propagation rectiligne',
    html: () => `
    <div class="def">Dans un milieu <b>transparent</b> et <b>homogène</b> (le même partout : air, eau, verre, vide), la lumière se propage <b>en ligne droite</b>.</div>
    <div class="def"><b>Rayon lumineux</b> : le trait droit, <u>avec une flèche</u>, qui représente le trajet de la lumière.</div>
    <div class="fig">${figOmbre()}</div>
    <p>La preuve par l'ombre : un objet opaque arrête les rayons. Comme la lumière ne contourne pas l'objet, il y a une <b>zone d'ombre</b> derrière lui.</p>
    <div class="trap">Un rayon sans flèche = un point en moins. La flèche donne le sens de parcours.</div>`,
    quick: { q: `Dans quel cas la lumière se propage-t-elle en ligne droite ?`, opts: [`Toujours, partout`, `Dans un milieu transparent et homogène`, `Seulement dans le vide`, `Seulement dans l'air`], a: 1, why: `« Transparent et homogène » : les deux mots sont attendus. Dès que le milieu change, la direction peut changer (c'est la réfraction).` }
},
{
    id: 'vitesse', title: `À quelle vitesse`, sub: 'c, v = d / t et l\'année-lumière',
    html: () => `
    <div class="formula">c = 3,00 × ${p10(8)} m/s<small>vitesse de la lumière dans le vide (et dans l'air, quasiment pareil). Par cœur.</small></div>
    <p>On l'appelle la <b>vitesse de propagation</b> de la lumière (ou célérité). C'est 300 000 km chaque seconde. Rien ne va plus vite. Dans l'eau ou le verre, la lumière est <b>plus lente</b>.</p>
    <div class="formula">v = ${F('d', 't')}<small>v en m/s &nbsp;·&nbsp; d en m &nbsp;·&nbsp; t en s</small></div>
    <div class="tri">
      <div><span>Je cherche la vitesse</span><b>v = ${F('d', 't')}</b></div>
      <div><span>Je cherche la distance</span><b>d = v × t</b></div>
      <div><span>Je cherche le temps</span><b>t = ${F('d', 'v')}</b></div>
    </div>
    <div class="fig">${figSoleilTerre()}</div>
    <div class="def"><b>Année-lumière (a.l.)</b> : c'est une <u>distance</u>, pas une durée. La distance parcourue par la lumière en un an dans le vide : 1 a.l. ≈ 9,47 × ${p10(15)} m.</div>
    <div class="exb">Une étoile est à 4,2 a.l. → sa lumière met 4,2 ans à arriver → on la voit <b>telle qu'elle était il y a 4,2 ans</b>. Regarder loin, c'est regarder dans le passé.</div>`,
    quick: { q: `Une année-lumière, c'est…`, opts: [`une durée`, `une vitesse`, `une distance`, `une quantité de lumière`], a: 2, why: `C'est la distance que parcourt la lumière en un an. Le mot « année » est un piège.` }
},
{
    id: 'puissances', title: `L'outil maths : les puissances de 10`, sub: 'Additionner ou multiplier les exposants ?',
    html: () => `
    <p>En optique, tous les nombres sont énormes ou minuscules. Trois règles suffisent.</p>
    <div class="rule add"><div class="rule-h">Deux puissances qui se <b>multiplient</b> → j'<b>additionne</b> les exposants</div>
      <div class="rule-m">${p10(2)} × ${p10(4)} = 10<sup>2 + 4</sup> = ${p10(6)}</div>
      <div class="rule-s">Vérifie en comptant les zéros : 100 × 10 000 = 1 000 000. Deux zéros + quatre zéros = six zéros.</div></div>
    <div class="rule sub"><div class="rule-h">Deux puissances qui se <b>divisent</b> → je <b>soustrais</b> les exposants</div>
      <div class="rule-m">${p10(11)} ÷ ${p10(8)} = 10<sup>11 − 8</sup> = ${p10(3)}</div></div>
    <div class="rule mul"><div class="rule-h">Une <b>parenthèse avec un exposant dessus</b> → je <b>multiplie</b> les exposants</div>
      <div class="rule-m">(${p10(2)})<sup>3</sup> = ${p10(2)} × ${p10(2)} × ${p10(2)} = 10<sup>2 × 3</sup> = ${p10(6)}</div>
      <div class="rule-s">C'est la même puissance répétée 3 fois.</div></div>
    <div class="def"><b>Comment ne plus jamais confondre</b><br>Regarde ce qui relie les deux nombres.<br>
      Un signe <b>×</b> entre deux puissances → <b>+</b> sur les exposants.<br>
      Un exposant <b>posé sur une parenthèse</b> → <b>×</b> sur les exposants.</div>
    <table class="tbl"><tr><th>J'écris</th><th>Je fais</th><th>Résultat</th></tr>
      <tr><td>${p10(2)} × ${p10(4)}</td><td>2 + 4</td><td><b>${p10(6)}</b></td></tr>
      <tr><td>(${p10(2)})<sup>4</sup></td><td>2 × 4</td><td><b>${p10(8)}</b></td></tr></table>
    <h3>Avec des nombres devant</h3>
    <p>Je range : les nombres ensemble, les puissances ensemble.</p>
    <div class="steps">
      <div>(<span class="ca">2</span> × <span class="cb">${p10(2)}</span>) × (<span class="ca">2</span> × <span class="cb">${p10(4)}</span>)</div>
      <div>= (<span class="ca">2 × 2</span>) × (<span class="cb">${p10(2)} × ${p10(4)}</span>)</div>
      <div>= <span class="ca">4</span> × <span class="cb">${p10(6)}</span></div>
    </div>
    <div class="exb">Le calcul type du contrôle : t = ${F(`1,5 × ${p10(11)}`, `3 × ${p10(8)}`)} = ${F('1,5', '3')} × ${F(p10(11), p10(8))} = 0,5 × ${p10(3)} = 500 s</div>
    <div class="trap">(${p10(2)})<sup>3</sup> n'est pas ${p10(5)}, et ${p10(2)} × ${p10(3)} n'est pas ${p10(6)}. Si tu hésites, écris les zéros.</div>
    <p><a class="btn ghost" href="#atelier/puissances">S'entraîner sur des calculs →</a></p>`,
    quick: { q: `(2 × ${p10(2)}) × (2 × ${p10(4)}) = ?`, opts: [`2 × ${p10(6)}`, `4 × ${p10(8)}`, `4 × ${p10(6)}`, `4 × ${p10(2)}`], a: 2, why: `Nombres ensemble : 2 × 2 = 4. Puissances ensemble : ${p10(2)} × ${p10(4)} = 10<sup>2+4</sup> = ${p10(6)}.` }
},
{
    id: 'vocabulaire', title: `Le vocabulaire du schéma`, sub: 'Dioptre, normale, rayons, angles',
    html: () => `
    <div class="fig">${rayDiagram({ names: true })}</div>
    <table class="tbl left">
      <tr><td><b>Dioptre</b></td><td>La surface qui sépare deux milieux transparents (ex : la surface de l'eau).</td></tr>
      <tr><td><b>Rayon incident</b></td><td>Le rayon qui <u>arrive</u> sur la surface.</td></tr>
      <tr><td><b>Point d'incidence I</b></td><td>L'endroit où le rayon touche la surface.</td></tr>
      <tr><td><b>Normale</b></td><td>La droite <u>perpendiculaire</u> à la surface, passant par I. En pointillés.</td></tr>
      <tr><td><b>Rayon réfléchi</b></td><td>Le rayon qui <u>rebondit</u> et reste dans le milieu 1.</td></tr>
      <tr><td><b>Rayon réfracté</b></td><td>Le rayon qui <u>traverse</u> et passe dans le milieu 2.</td></tr>
      <tr><td><b>i₁, r, i₂</b></td><td>Angle d'incidence, de réflexion, de réfraction.</td></tr>
    </table>
    <div class="trap">Les angles se mesurent <b>toujours entre le rayon et la NORMALE</b>, jamais entre le rayon et la surface.<br>Si l'énoncé donne l'angle avec la surface (ex : 50°), l'angle d'incidence vaut 90° − 50° = 40°.</div>
    <p><a class="btn ghost" href="#atelier/schema">S'entraîner à repérer chaque élément →</a></p>`,
    quick: { q: `La normale, c'est…`, opts: [`la surface de séparation`, `la droite perpendiculaire à la surface au point d'incidence`, `le rayon qui arrive`, `une droite parallèle à la surface`], a: 1, why: `Perpendiculaire à la surface, et elle passe par le point d'incidence I.` }
},
{
    id: 'reflexion', title: `La réflexion`, sub: 'La lumière rebondit',
    html: () => `
    <div class="fig">${rayDiagram({ mirror: true, i: 35, names: true })}</div>
    <div class="def"><b>Lois de Snell-Descartes pour la réflexion</b><br>
      1. Le rayon réfléchi est dans le même plan que le rayon incident et la normale.<br>
      2. L'angle de réflexion est égal à l'angle d'incidence :</div>
    <div class="formula">r = i₁</div>
    <div class="exb">Un rayon arrive sur un miroir avec i₁ = 35°. Il repart de l'autre côté de la normale avec r = 35°.</div>
    <div class="trap">Un rayon fait 25° avec la <u>surface</u> du miroir → i₁ = 90° − 25° = 65°, donc r = 65°.</div>`,
    quick: { q: `Un rayon arrive sur un miroir avec un angle d'incidence de 20°. L'angle de réflexion vaut…`, opts: [`70°`, `40°`, `20°`, `10°`], a: 2, why: `r = i₁, tout simplement.` }
},
{
    id: 'refraction', title: `La réfraction`, sub: 'La lumière change de direction en changeant de milieu',
    html: () => `
    <div class="def"><b>Réfraction</b> : changement de direction de la lumière quand elle passe d'un milieu transparent à un autre.</div>
    <div class="def"><b>Indice optique n</b> (aussi appelé indice de réfraction) : un nombre <u>sans unité</u> qui caractérise un milieu transparent. Toujours n ≥ 1. Plus n est grand, plus la lumière y est ralentie.</div>
    <table class="tbl"><tr><th>Milieu</th><th>vide</th><th>air</th><th>eau</th><th>verre</th><th>diamant</th></tr>
      <tr><th>n</th><td>1</td><td>1,00</td><td>1,33</td><td>≈ 1,5</td><td>2,42</td></tr></table>
    <div class="def"><b>Lois de Snell-Descartes pour la réfraction</b><br>
      1. Le rayon réfracté est dans le même plan que le rayon incident et la normale.<br>2. Les angles vérifient :</div>
    <div class="formula">n₁ × sin(i₁) = n₂ × sin(i₂)<small>n₁, i₁ : côté où la lumière arrive &nbsp;·&nbsp; n₂, i₂ : côté où elle repart</small></div>
    <h3>Dans quel sens le rayon tourne ?</h3>
    <div class="duo">
      <div><div class="fig">${rayDiagram({ n1: 1, n2: 1.33, i: 50, reflect: false })}</div><p><b>Indice plus grand</b> (air → eau)<br>le rayon <b>se rapproche</b> de la normale : i₂ &lt; i₁</p></div>
      <div><div class="fig">${rayDiagram({ n1: 1.33, n2: 1, i: 30, m1: 'eau', m2: 'air', reflect: false })}</div><p><b>Indice plus petit</b> (eau → air)<br>le rayon <b>s'écarte</b> de la normale : i₂ &gt; i₁</p></div>
    </div>
    <p>Cas particulier : un rayon qui arrive <b>sur la normale</b> (i₁ = 0°) n'est <b>pas dévié</b>.</p>
    <div class="formula">n = ${F('c', 'v')}<small>le lien entre l'indice et la vitesse v de la lumière dans le milieu</small></div>
    <div class="exb">Une paille dans un verre d'eau paraît cassée : les rayons venant de la partie immergée sont déviés en sortant de l'eau, donc l'œil ne la voit pas à sa vraie place.</div>
    <p><a class="btn ghost" href="#atelier/refraction">Faire bouger le rayon →</a> <a class="btn ghost" href="#atelier/guide">Calculer i₂ pas à pas →</a></p>`,
    quick: { q: `La lumière passe du verre (n = 1,5) à l'air (n = 1,00). Le rayon réfracté…`, opts: [`se rapproche de la normale`, `s'écarte de la normale`, `n'est jamais dévié`, `repart en arrière`], a: 1, why: `Elle entre dans un milieu d'indice plus petit → le rayon s'écarte de la normale (i₂ > i₁).` }
},
{
    id: 'dispersion', title: `Le prisme et la dispersion`, sub: 'La lumière blanche est un mélange',
    html: () => `
    <div class="fig">${figPrisme()}</div>
    <div class="def"><b>Lumière blanche</b> : un mélange de <u>toutes</u> les couleurs (Soleil, lampe à filament).</div>
    <div class="def"><b>Dispersion</b> : séparation des couleurs de la lumière. Un <b>prisme</b> ou un <b>réseau</b> la réalise : ce sont des <b>systèmes dispersifs</b>.</div>
    <p><b>Pourquoi ça marche ?</b> L'indice du verre n'est pas exactement le même pour chaque couleur. Chaque couleur est donc réfractée d'un angle différent, à l'entrée puis à la sortie du prisme.</p>
    <div class="def">Le <b style="color:#b98cff">violet</b> est le <b>plus dévié</b>. Le <b style="color:#ff6b6b">rouge</b> est le <b>moins dévié</b>.</div>
    <div class="exb">L'arc-en-ciel : chaque goutte de pluie se comporte comme un petit prisme.</div>`,
    quick: { q: `À la sortie d'un prisme, quelle couleur est la plus déviée ?`, opts: [`Le rouge`, `Le jaune`, `Le vert`, `Le violet`], a: 3, why: `Violet : le plus dévié. Rouge : le moins dévié.` }
},
{
    id: 'longueur', title: `Longueur d'onde et spectre visible`, sub: 'De 400 nm à 800 nm',
    html: () => `
    <div class="def"><b>Radiation</b> (ou rayonnement monochromatique) : une lumière d'une seule couleur « pure ». Elle est repérée par sa <b>longueur d'onde λ</b> (lambda), en <b>nanomètres</b> : 1 nm = ${p10(-9)} m.</div>
    <div class="def"><b>Monochromatique</b> : une seule radiation (ex : laser).<br><b>Polychromatique</b> : plusieurs radiations (ex : lumière blanche).</div>
    <div class="def"><b>Spectre</b> : l'image obtenue quand on a séparé les radiations d'une lumière.</div>
    <div class="fig">${spectrum({ title: 'spectre de la lumière blanche de 400 à 800 nanomètres' })}
      <div class="specnames"><span style="left:7.7%;color:#b98cff">violet</span><span style="left:18.4%;color:#6aa8ff">bleu</span><span style="left:31.2%;color:#4ade80">vert</span><span style="left:41.9%;color:#fde047">jaune</span><span style="left:48.7%;color:#fb923c">orange</span><span style="left:67.5%;color:#ff6b6b">rouge</span></div></div>
    <div class="formula small">UV &nbsp;|&nbsp; 400 nm — <b>visible</b> — 800 nm &nbsp;|&nbsp; IR<small>en dessous de 400 nm : ultraviolets &nbsp;·&nbsp; au-dessus de 800 nm : infrarouges &nbsp;·&nbsp; invisibles tous les deux</small></div>
    <div class="exb">Un laser rouge émet à 633 nm : c'est entre 400 et 800, donc visible, et c'est du côté rouge.</div>`,
    quick: { q: `Une radiation de longueur d'onde 950 nm est…`, opts: [`visible, rouge`, `un ultraviolet`, `un infrarouge`, `visible, violette`], a: 2, why: `Plus de 800 nm → infrarouge, invisible pour l'œil.` }
},
{
    id: 'spectres', title: `Les types de spectres`, sub: 'Continu, raies d\'émission, raies d\'absorption',
    html: () => `
    <div class="spec-card"><h4>Spectre continu</h4>${spectrum({ axis: false })}<p>Bande colorée <b>sans interruption</b>, d'<b>origine thermique</b>. Produit par un corps <b>chaud</b> et dense : filament de lampe, braise. La surface d'une étoile aussi, mais son atmosphère y ajoute des raies noires (voir plus bas).</p></div>
    <div class="spec-card"><h4>Spectre de raies d'émission</h4>${spectrum({ mode: 'emission', lines: GAZ.H.raies, axis: false })}<p><b>Traits colorés sur fond noir</b>. Produit par un <b>gaz</b> à basse pression, chauffé ou excité électriquement (lampe à hydrogène, à sodium, néon).</p></div>
    <div class="spec-card"><h4>Spectre de raies d'absorption</h4>${spectrum({ mode: 'absorption', lines: GAZ.H.raies })}<p><b>Fond coloré avec des traits noirs</b>. De la lumière blanche qui a <b>traversé un gaz</b> : le gaz a retiré certaines radiations.</p></div>
    <div class="def"><b>Idée 1 — la température.</b> Plus un corps est chaud, plus son spectre continu s'enrichit <u>vers le violet</u>. Un corps peu chaud émet surtout du rouge. Une étoile bleue est plus chaude qu'une étoile rouge.</div>
    <div class="def"><b>Idée 2 — la carte d'identité.</b> Chaque élément chimique a ses propres raies, toujours aux mêmes longueurs d'onde. Et un gaz <u>absorbe exactement les radiations qu'il sait émettre</u> : regarde, les raies noires sont aux mêmes endroits que les raies colorées.</div>
    <div class="exb">L'hydrogène a des raies à 410, 434, 486 et 656 nm. Si on retrouve ces quatre raies dans le spectre d'une étoile, il y a de l'hydrogène dans son atmosphère.</div>
    <p><a class="btn ghost" href="#atelier/spectres">Manipuler les spectres →</a></p>`,
    quick: { q: `Des traits colorés sur un fond noir, c'est un spectre…`, opts: [`continu`, `de raies d'émission`, `de raies d'absorption`, `de lumière blanche`], a: 1, why: `Fond noir + raies colorées = émission (un gaz excité). Fond coloré + raies noires = absorption.` }
},
{
    id: 'couleurs', title: `Couleurs, filtres et objets`, sub: 'Complément : filtres et objets colorés',
    html: () => `
    <div class="compl">Complément. Ce chapitre ne figure pas dans le programme officiel de 2nde, mais certains professeurs le traitent. Vérifie dans ton cours s'il te concerne.</div>
    <div class="fig">${figRGB()}</div>
    <div class="def"><b>Synthèse additive</b> (on superpose des lumières) : rouge + vert + bleu = <b>blanc</b>.<br>rouge + vert = jaune &nbsp;·&nbsp; rouge + bleu = magenta &nbsp;·&nbsp; vert + bleu = cyan.</div>
    <div class="fig">${figFiltre()}</div>
    <div class="def"><b>Filtre rouge, vert ou bleu</b> : laisse passer sa couleur, <u>absorbe</u> les deux autres.</div>
    <div class="def"><b>Objet rouge, vert ou bleu</b> : <u>diffuse</u> sa couleur, absorbe les deux autres. S'il ne reçoit pas sa couleur, il paraît <b>noir</b>.</div>
    <p>Jaune = rouge + vert &nbsp;·&nbsp; cyan = vert + bleu &nbsp;·&nbsp; magenta = rouge + bleu : ces objets (ou ces filtres) renvoient (ou laissent passer) <b>deux</b> couleurs.</p>
    <div class="exb">Un tee-shirt bleu éclairé en lumière rouge : il ne reçoit pas de bleu, et il absorbe le rouge → il paraît noir.</div>
    <h3>Le spectre après un filtre</h3>
    <p>Lumière blanche → filtre → spectroscope : les couleurs absorbées deviennent de <b>larges bandes noires</b>. C'est un <b>spectre de bandes d'absorption</b>. Ce qui reste coloré = ce que le filtre laisse passer.</p>
    <div class="fig">${spectrum({ bands: [[620, 800]], title: 'spectre après un filtre rouge' })}<div class="cap">Lumière blanche après un filtre rouge</div></div>
    <div class="trap">Raies <b>fines</b> noires → un <b>gaz</b> a absorbé. Bandes <b>larges</b> noires → un <b>filtre</b> ou une solution colorée a absorbé.</div>`,
    quick: { q: `Un tee-shirt vert est éclairé uniquement par une lumière rouge. Il paraît…`, opts: [`vert`, `rouge`, `jaune`, `noir`], a: 3, why: `Il ne reçoit pas de vert à diffuser et il absorbe le rouge : rien ne repart vers l'œil.` }
}
];

/* ============ MÉTHODES ============ */
const AIGUILLAGE = [
    [`« Combien de temps », « à quelle distance », « quelle vitesse »`, 1],
    [`Un schéma à lire ou à compléter`, 2],
    [`Je connais n₁, n₂ et i₁ → on me demande i₂`, 3],
    [`Je connais les deux angles → on me demande un indice ou le nom du milieu`, 4],
    [`On me parle de la vitesse de la lumière dans l'eau, le verre…`, 5],
    [`Un spectre à identifier ou à exploiter`, 6],
    [`Un filtre, un objet coloré, « quelle couleur voit-on »`, 7]
];
const RC = [
{ title: `La rédaction qui rapporte tous les points`, when: `Valable pour TOUT calcul.`,
  steps: [`<b>Données :</b> je recopie ce que l'énoncé donne, avec les unités. Je note ce que je cherche.`, `<b>Formule avec des lettres :</b> j'écris la formule, puis je l'arrange pour isoler ce que je cherche.`, `<b>Conversions :</b> je vérifie les unités et je mets tout dans les bonnes unités <u>avant</u> de calculer.`, `<b>Application numérique :</b> je remplace les lettres par les nombres.`, `<b>Résultat :</b> nombre + <u>unité</u>, souligné.`, `<b>Vérification :</b> est-ce plausible ?`] },
{ title: `Calculs avec la vitesse de la lumière`, when: `Je vois : « combien de temps met la lumière », « à quelle distance », « quelle vitesse ».`,
  steps: [`<span class="si">Je choisis la forme de la formule :</span> v = ${F('d', 't')} &nbsp;·&nbsp; d = v × t &nbsp;·&nbsp; t = ${F('d', 'v')}`, `<span class="si">Je vérifie les unités.</span> Distance en <b>mètres</b>, temps en <b>secondes</b>.<br>km → m : × ${p10(3)} &nbsp;·&nbsp; min → s : × 60 &nbsp;·&nbsp; h → s : × 3600 &nbsp;·&nbsp; « millions de km » : × ${p10(9)} m.`, `<span class="si">Je calcule</span> en séparant les nombres et les puissances de 10 (division → je soustrais les exposants ; multiplication → je les additionne).`, `<span class="si">Je vérifie :</span> une vitesse trouvée doit être ≤ 3 × ${p10(8)} m/s.`],
  ex: `<b>Le Soleil est à 150 millions de km. Temps mis par sa lumière ?</b><br>d = 150 × ${p10(6)} km = 150 × ${p10(9)} m = 1,5 × ${p10(11)} m.<br>t = ${F('d', 'c')} = ${F(`1,5 × ${p10(11)}`, `3,00 × ${p10(8)}`)} = 0,5 × ${p10(3)} = <b><u>500 s</u></b> (8 min 20 s).`,
  trap: `« Écho », « aller-retour », « revient » → le temps donné correspond à <b>2 fois</b> la distance. Je divise le temps par 2.` },
{ title: `Lire ou compléter un schéma`, when: `Un schéma de réflexion ou de réfraction.`,
  steps: [`Je repère la <b>surface</b> et le <b>point d'incidence I</b>.`, `Je trace la <b>normale</b> : pointillés, perpendiculaire à la surface, passant par I. <u>Avant tout le reste.</u>`, `Je repère le <b>sens</b> de la lumière (les flèches) : le rayon qui arrive est l'incident.`, `Je marque les angles <b>entre chaque rayon et la normale</b>.`, `<span class="si">Si l'énoncé donne l'angle avec la surface</span> → angle avec la normale = 90° − cet angle.`, `<span class="si">Si c'est une réflexion</span> → rayon réfléchi de l'autre côté de la normale, avec r = i₁.`, `<span class="si">Si c'est une réfraction</span> → je calcule i₂ (recette 3), je trace le rayon de l'autre côté de la surface <u>et</u> de l'autre côté de la normale.`, `Je mets une <b>flèche</b> sur chaque rayon.`] },
{ title: `Réfraction : trouver l'angle i₂`, when: `Je connais n₁, n₂ et i₁.`,
  steps: [`<b>J'étiquette.</b> Milieu 1 = celui d'où <u>vient</u> la lumière. Milieu 2 = celui où elle <u>entre</u>.`, `<b>Je vérifie</b> que i₁ est mesuré depuis la normale (sinon 90° − angle).`, `<b>Calculatrice en mode DEGRÉS.</b>`, `<b>J'écris la loi :</b> n₁ × sin(i₁) = n₂ × sin(i₂)`, `<b>J'isole :</b> sin(i₂) = ${F('n₁ × sin(i₁)', 'n₂')}`, `<b>Je calcule ce nombre</b> (il doit être entre 0 et 1).`, `<b>Je repasse à l'angle</b> avec la touche sin<sup>−1</sup> (ou arcsin, ou Asn).`, `<span class="si">Je vérifie le sens :</span> n₂ &gt; n₁ → je dois trouver i₂ &lt; i₁. n₂ &lt; n₁ → je dois trouver i₂ &gt; i₁.`],
  ex: `<b>Air (1,00) → eau (1,33), i₁ = 40°.</b><br>sin(i₂) = ${F('1,00 × sin(40°)', '1,33')} = ${F('0,643', '1,33')} = 0,483 → i₂ = sin<sup>−1</sup>(0,483) = <b><u>29°</u></b><br>Vérification : n₂ &gt; n₁ et 29° &lt; 40°. ✔`,
  trap: `sin(i₂) = 0,483 n'est pas la réponse : c'est un sinus, pas un angle. Et on ne « simplifie » jamais les sin : sin(40°) ÷ 1,33 n'est pas sin(40 ÷ 1,33).` },
{ title: `Réfraction : trouver un indice`, when: `Je connais les deux angles et un seul indice.`,
  steps: [`J'étiquette n₁, i₁, i₂ et je mets la calculatrice en degrés.`, `J'écris la loi : n₁ × sin(i₁) = n₂ × sin(i₂)`, `J'isole : n₂ = ${F('n₁ × sin(i₁)', 'sin(i₂)')}`, `Je calcule. <b>Pas d'unité</b> pour un indice.`, `<span class="si">Je vérifie :</span> n ≥ 1 obligatoirement. Si je trouve 0,65, j'ai inversé les angles.`, `<span class="si">Si on demande le nom du milieu</span> → je compare avec le tableau d'indices de l'énoncé.`],
  ex: `<b>Air → milieu inconnu : i₁ = 50°, i₂ = 30°.</b><br>n₂ = ${F('1,00 × sin(50°)', 'sin(30°)')} = ${F('0,766', '0,500')} = <b><u>1,53</u></b> → proche de 1,5 : du verre.` },
{ title: `Indice et vitesse dans un milieu`, when: `On me parle de la vitesse de la lumière dans un milieu.`,
  steps: [`J'écris n = ${F('c', 'v')} avec c = 3,00 × ${p10(8)} m/s.`, `<span class="si">Si je cherche v</span> → v = ${F('c', 'n')} &nbsp;·&nbsp; <span class="si">si je cherche n</span> → n = ${F('c', 'v')}`, `<span class="si">Je vérifie :</span> v plus petite que c, et n ≥ 1.`],
  ex: `<b>Dans le verre (n = 1,5) :</b> v = ${F(`3,00 × ${p10(8)}`, '1,5')} = <b><u>2,0 × ${p10(8)} m/s</u></b>.` },
{ title: `Exercices sur les spectres`, when: `Un spectre à identifier ou à exploiter.`,
  steps: [`<b>Quel type ?</b> <span class="si">Bande colorée sans coupure</span> → continu (corps chaud). <span class="si">Fond noir + traits colorés</span> → raies d'émission (gaz excité). <span class="si">Fond coloré + traits noirs</span> → raies d'absorption (lumière blanche ayant traversé un gaz). <span class="si">Larges bandes noires</span> → bandes d'absorption (filtre, solution).`, `<b>Quel élément ?</b> Je lis la longueur d'onde de <u>chaque</u> raie, je compare avec les raies de chaque élément de l'énoncé.`, `<span class="si">Si TOUTES les raies d'un élément sont présentes</span> → il est présent. <span class="si">S'il en manque une seule</span> → il est absent.`, `Je rédige : « On retrouve les raies de longueurs d'onde … nm, caractéristiques de …, donc … est présent. »`, `<b>Quelle source est la plus chaude ?</b> Celle dont le spectre continu est le plus riche du côté bleu-violet.`, `<b>Visible ou pas ?</b> Je convertis λ en nm. Entre 400 et 800 → visible. Moins de 400 → UV. Plus de 800 → IR.`],
  ex: `<b>Raies noires à 410, 434, 486, 589, 656 nm. Données : H 410–434–486–656 ; Na 589 ; He 447–502–588–668.</b><br>Hydrogène : les 4 raies présentes → <b>présent</b>. Sodium : 589 présente → <b>présent</b>. Hélium : 447, 502, 668 absentes (et 588 ≠ 589) → <b>absent</b>.` },
{ title: `Couleur vue à travers un filtre ou sur un objet`, when: `« Quelle couleur voit-on ? »`,
  steps: [`Je liste les couleurs présentes dans la lumière qui <b>arrive</b> (blanche = rouge + vert + bleu).`, `Je barre celles que le filtre ou l'objet <b>absorbe</b> (rouge, vert, bleu : tout sauf la sienne ; jaune : le bleu ; cyan : le rouge ; magenta : le vert).`, `<span class="si">S'il reste une couleur</span> → c'est la couleur vue. <span class="si">S'il en reste deux</span> → j'applique la synthèse additive. <span class="si">S'il ne reste rien</span> → noir.`] }
];
const VERIFS = [`Chaque résultat a une <b>unité</b> (sauf n, qui n'en a pas).`, `Distances en m, temps en s avant d'utiliser v = d/t.`, `Angles mesurés par rapport à la <b>normale</b>.`, `Calculatrice en <b>degrés</b>.`, `n₁ = milieu d'où vient la lumière ; n₂ = milieu où elle entre.`, `Indice plus grand → rayon plus près de la normale : mon résultat respecte ça.`, `Tout indice trouvé est ≥ 1 ; toute vitesse trouvée est ≤ 3 × ${p10(8)} m/s.`, `Schémas : normale en pointillés, flèches sur les rayons, angles nommés.`];

/* ============ EXERCICES ============ */
const THEMES = {
    A: { nom: 'Sources et propagation', short: 'Sources' },
    B: { nom: 'Vitesse de la lumière', short: 'Vitesse' },
    M: { nom: 'Puissances de 10', short: 'Puissances' },
    C: { nom: 'Schéma et réflexion', short: 'Réflexion' },
    D: { nom: 'Réfraction', short: 'Réfraction' },
    E: { nom: 'Spectres', short: 'Spectres' },
    G: { nom: 'Couleurs et filtres', short: 'Couleurs' }
};
/* type : qcm (a = index) | multi (a = [index]) | num (a, tol, unit) | sci (a = valeur, unit) */
const EX = [
/* A — sources */
{ id: 'A1', t: 'A', lvl: 1, type: 'qcm', q: `Parmi ces objets, lequel est une source primaire de lumière ?`, opts: [`Un écran de téléphone allumé`, `La Lune`, `Un miroir`, `Un mur blanc`], a: 0, hint: `Lequel fabrique lui-même sa lumière ?`, corr: [`Une source primaire produit sa propre lumière.`, `L'écran allumé en produit. La Lune, le miroir et le mur renvoient seulement celle qu'ils reçoivent.`] },
{ id: 'A2', t: 'A', lvl: 1, type: 'qcm', q: `Pourquoi voit-on la Lune la nuit ?`, opts: [`Elle produit sa propre lumière`, `Notre œil envoie de la lumière vers elle`, `Elle diffuse vers nous la lumière du Soleil`, `Elle réfléchit la lumière de la Terre uniquement`], a: 2, hint: `La Lune est-elle une source primaire ? D'où vient alors la lumière ?`, corr: [`La Lune est une source secondaire.`, `Elle reçoit la lumière du Soleil et en renvoie une partie vers nos yeux.`] },
{ id: 'A3', t: 'A', lvl: 1, type: 'qcm', q: `Complète : « Dans un milieu … , la lumière se propage en ligne droite. »`, opts: [`opaque et homogène`, `transparent et homogène`, `transparent et coloré`, `quelconque`], a: 1, hint: `Deux adjectifs : la lumière doit pouvoir passer, et le milieu doit être le même partout.`, corr: [`Principe de propagation rectiligne : milieu <b>transparent</b> et <b>homogène</b>.`] },
{ id: 'A4', t: 'A', lvl: 1, type: 'qcm', q: `On observe une étoile située à 50 années-lumière. On la voit…`, opts: [`telle qu'elle est aujourd'hui`, `telle qu'elle sera dans 50 ans`, `telle qu'elle était il y a 50 ans`, `50 fois plus petite qu'en réalité`], a: 2, hint: `Combien de temps sa lumière a-t-elle mis pour arriver ?`, corr: [`Sa lumière a voyagé pendant 50 ans.`, `Ce qu'on reçoit aujourd'hui est donc parti il y a 50 ans : on la voit dans le passé.`] },
/* B — vitesse */
{ id: 'B1', t: 'B', lvl: 1, type: 'num', q: `La Lune est à 3,84 × ${p10(8)} m de la Terre. Combien de temps met la lumière pour faire ce trajet ? (c = 3,00 × ${p10(8)} m/s)`, a: 1.28, tol: 0.02, unit: 's', hint: `Tu cherches un temps : t = d ÷ c. Les unités sont déjà les bonnes.`, corr: [`t = ${F('d', 'c')} = ${F(`3,84 × ${p10(8)}`, `3,00 × ${p10(8)}`)}`, `Les ${p10(8)} se simplifient : t = 3,84 ÷ 3,00 = <b>1,28 s</b>.`] },
{ id: 'B2', t: 'B', lvl: 2, type: 'num', q: `Mars est à 2,25 × ${p10(8)} <b>km</b> de la Terre. Combien de temps met un signal lumineux pour y parvenir ? (c = 3,00 × ${p10(8)} m/s)`, a: 750, tol: 5, unit: 's', hint: `Attention à l'unité de la distance. km → m : × ${p10(3)}.`, corr: [`Conversion : d = 2,25 × ${p10(8)} km = 2,25 × ${p10(11)} m.`, `t = ${F('d', 'c')} = ${F(`2,25 × ${p10(11)}`, `3,00 × ${p10(8)}`)} = 0,75 × ${p10(3)}`, `t = <b>750 s</b> (12 min 30 s).`] },
{ id: 'B3', t: 'B', lvl: 2, type: 'sci', q: `La lumière d'un éclair met 1,0 × ${p10(-5)} s pour arriver jusqu'à toi. À quelle distance est tombé l'éclair ?`, a: 3e3, unit: 'm', hint: `Tu cherches une distance : d = c × t. Multiplication de puissances → additionne les exposants (8 + (−5)).`, corr: [`d = c × t = 3,00 × ${p10(8)} × 1,0 × ${p10(-5)}`, `Nombres : 3,00 × 1,0 = 3,0. Puissances : 10<sup>8 + (−5)</sup> = ${p10(3)}.`, `d = <b>3,0 × ${p10(3)} m</b> (3 km).`] },
{ id: 'B4', t: 'B', lvl: 3, type: 'sci', q: `Un laser est envoyé vers un satellite. Le signal <b>revient</b> au bout de 0,24 s. À quelle distance se trouve le satellite ?`, a: 3.6e7, unit: 'm', hint: `0,24 s, c'est l'aller ET le retour. Combien de temps pour l'aller seul ?`, corr: [`Aller simple : t = 0,24 ÷ 2 = 0,12 s.`, `d = c × t = 3,00 × ${p10(8)} × 0,12`, `d = <b>3,6 × ${p10(7)} m</b> (36 000 km).`] },
{ id: 'B5', t: 'B', lvl: 2, type: 'sci', q: `Proxima du Centaure est à 4,2 années-lumière. Sachant que 1 a.l. = 9,47 × ${p10(15)} m, quelle est sa distance en mètres ?`, a: 3.98e16, tol: 0.02, unit: 'm', hint: `1 a.l. vaut 9,47 × ${p10(15)} m. Tu en as 4,2.`, corr: [`d = 4,2 × 9,47 × ${p10(15)} = 39,8 × ${p10(15)} m`, `d ≈ <b>3,98 × ${p10(16)} m</b> (environ 4,0 × ${p10(16)} m).`] },
{ id: 'B6', t: 'B', lvl: 2, type: 'sci', q: `L'indice du verre est n = 1,5. Calcule la vitesse de la lumière dans le verre. (n = c / v)`, a: 2e8, tol: 0.02, unit: 'm/s', hint: `Isole v dans n = c / v : v = c ÷ n.`, corr: [`n = ${F('c', 'v')} donc v = ${F('c', 'n')}`, `v = ${F(`3,00 × ${p10(8)}`, '1,5')} = <b>2,0 × ${p10(8)} m/s</b>.`, `Vérification : plus petit que c. ✔`] },
{ id: 'B7', t: 'B', lvl: 2, type: 'num', q: `Dans un milieu transparent, la lumière se propage à v = 1,24 × ${p10(8)} m/s. Calcule l'indice n de ce milieu. (n = c / v)`, a: 2.42, tol: 0.03, unit: '(sans unité)', hint: `n = c ÷ v. Les puissances de 10 se simplifient.`, corr: [`n = ${F('c', 'v')} = ${F(`3,00 × ${p10(8)}`, `1,24 × ${p10(8)}`)} = 3,00 ÷ 1,24`, `n ≈ <b>2,42</b> : c'est l'indice du diamant.`] },
/* M — puissances */
{ id: 'M1', t: 'M', lvl: 1, type: 'sci', q: `Calcule : (2 × ${p10(2)}) × (2 × ${p10(4)})`, a: 4e6, unit: '', hint: `Les nombres ensemble, les puissances ensemble. Deux puissances qui se multiplient : que fais-tu des exposants ?`, corr: [`Nombres : 2 × 2 = 4.`, `Puissances : ${p10(2)} × ${p10(4)} = 10<sup>2 + 4</sup> = ${p10(6)}.`, `Résultat : <b>4 × ${p10(6)}</b>.`] },
{ id: 'M2', t: 'M', lvl: 1, type: 'qcm', q: `(${p10(2)})<sup>3</sup> = ?`, opts: [p10(5), p10(6), p10(8), p10(23)], a: 1, hint: `Une parenthèse avec un exposant dessus : c'est ${p10(2)} répété 3 fois.`, corr: [`(${p10(2)})<sup>3</sup> = ${p10(2)} × ${p10(2)} × ${p10(2)}`, `Exposant posé sur une parenthèse → on multiplie : 2 × 3 = 6.`, `Résultat : <b>${p10(6)}</b>.`] },
{ id: 'M3', t: 'M', lvl: 1, type: 'qcm', q: `${p10(2)} × ${p10(3)} = ?`, opts: [p10(6), p10(23), p10(5), p10(1)], a: 2, hint: `Écris les zéros : 100 × 1000.`, corr: [`Deux puissances qui se multiplient → on additionne : 2 + 3 = 5.`, `100 × 1000 = 100 000 = <b>${p10(5)}</b>.`] },
{ id: 'M4', t: 'M', lvl: 1, type: 'sci', q: `Calcule : (6 × ${p10(8)}) ÷ (2 × ${p10(5)})`, a: 3e3, unit: '', hint: `Nombres ensemble : 6 ÷ 2. Puissances ensemble : division → soustrais les exposants.`, corr: [`Nombres : 6 ÷ 2 = 3.`, `Puissances : ${p10(8)} ÷ ${p10(5)} = 10<sup>8 − 5</sup> = ${p10(3)}.`, `Résultat : <b>3 × ${p10(3)}</b>.`] },
{ id: 'M5', t: 'M', lvl: 2, type: 'sci', q: `Calcule : (3 × ${p10(8)}) × (5 × ${p10(2)})`, a: 1.5e11, unit: '', hint: `3 × 5 = 15, puis les puissances. Tu peux laisser 15 × … ou passer en écriture scientifique.`, corr: [`Nombres : 3 × 5 = 15. Puissances : 10<sup>8 + 2</sup> = ${p10(10)}.`, `15 × ${p10(10)} = <b>1,5 × ${p10(11)}</b> (écriture scientifique).`] },
{ id: 'M6', t: 'M', lvl: 2, type: 'sci', q: `Calcule : (1,5 × ${p10(11)}) ÷ (3 × ${p10(8)})`, a: 5e2, unit: '', hint: `1,5 ÷ 3 = 0,5. Puis ${p10(11)} ÷ ${p10(8)}.`, corr: [`Nombres : 1,5 ÷ 3 = 0,5.`, `Puissances : 10<sup>11 − 8</sup> = ${p10(3)}.`, `0,5 × ${p10(3)} = <b>5 × ${p10(2)}</b> = 500.`] },
/* C — schéma & réflexion */
{ id: 'C1', t: 'C', lvl: 1, type: 'num', q: `Un rayon arrive sur un miroir avec un angle d'incidence de 35°. Que vaut l'angle de réflexion ?`, a: 35, tol: 0.5, unit: '°', hint: `Loi de la réflexion : quel lien entre r et i₁ ?`, corr: [`Loi de la réflexion : r = i₁.`, `r = <b>35°</b>.`] },
{ id: 'C2', t: 'C', lvl: 2, type: 'num', q: `Un rayon fait un angle de 25° avec la <b>surface</b> d'un miroir. Que vaut l'angle de réflexion ?`, a: 65, tol: 0.5, unit: '°', hint: `L'angle d'incidence se mesure par rapport à la normale, pas par rapport à la surface.`, corr: [`Angle avec la normale : i₁ = 90° − 25° = 65°.`, `r = i₁ = <b>65°</b>.`] },
{ id: 'C3', t: 'C', lvl: 1, type: 'qcm', q: `Sur ce schéma, quel rayon est le rayon <b>réfracté</b> ?`, fig: () => rayDiagram({ n1: 1, n2: 1.5, i: 45, letters: true, angles: false, m2: 'verre', reflect: true }), opts: [`Le rayon A`, `Le rayon B`, `Le rayon C`], fixed: true, a: 2, hint: `Le rayon réfracté est celui qui passe dans le milieu 2.`, corr: [`A arrive sur la surface : rayon incident.`, `B repart dans le milieu 1 : rayon réfléchi.`, `C traverse et passe dans le milieu 2 : <b>rayon réfracté</b>.`] },
{ id: 'C4', t: 'C', lvl: 1, type: 'qcm', q: `Par rapport à quoi mesure-t-on l'angle d'incidence ?`, opts: [`La surface de séparation`, `Le rayon réfléchi`, `La normale`, `L'horizontale`], a: 2, hint: `Relis le piège du cours « Le vocabulaire du schéma » : entre le rayon et quoi ?`, corr: [`Tous les angles (i₁, r, i₂) se mesurent entre le rayon et la <b>normale</b>.`] },
/* D — réfraction */
{ id: 'D1', t: 'D', lvl: 1, type: 'num', q: `Un rayon passe de l'air (n = 1,00) dans l'eau (n = 1,33) avec un angle d'incidence de 40°. Calcule l'angle de réfraction.`, a: 28.9, tol: 1, unit: '°', hint: `n₁ × sin(i₁) = n₂ × sin(i₂). Isole sin(i₂), puis utilise sin⁻¹. Calculatrice en degrés.`, corr: [`sin(i₂) = ${F('n₁ × sin(i₁)', 'n₂')} = ${F('1,00 × sin(40°)', '1,33')} = 0,483`, `i₂ = sin<sup>−1</sup>(0,483) ≈ <b>29°</b>`, `Vérification : n₂ &gt; n₁ et 29° &lt; 40°. ✔`] },
{ id: 'D2', t: 'D', lvl: 1, type: 'num', q: `Un rayon passe de l'air (n = 1,00) dans le verre (n = 1,50) avec i₁ = 60°. Calcule i₂.`, a: 35.3, tol: 1, unit: '°', hint: `sin(i₂) = n₁ × sin(i₁) ÷ n₂.`, corr: [`sin(i₂) = ${F('1,00 × sin(60°)', '1,50')} = ${F('0,866', '1,50')} = 0,577`, `i₂ = sin<sup>−1</sup>(0,577) ≈ <b>35°</b>`, `Vérification : 35° &lt; 60°, le rayon s'est rapproché de la normale. ✔`] },
{ id: 'D3', t: 'D', lvl: 2, type: 'num', q: `Un rayon passe de l'<b>eau</b> (n = 1,33) vers l'<b>air</b> (n = 1,00) avec i₁ = 30°. Calcule i₂.`, a: 41.7, tol: 1, unit: '°', hint: `Attention à l'ordre : le milieu 1 est celui d'où vient la lumière. Ici n₁ = 1,33.`, corr: [`n₁ = 1,33 (eau), n₂ = 1,00 (air).`, `sin(i₂) = ${F('1,33 × sin(30°)', '1,00')} = 1,33 × 0,500 = 0,665`, `i₂ = sin<sup>−1</sup>(0,665) ≈ <b>42°</b>`, `Vérification : n₂ &lt; n₁ et 42° &gt; 30°. ✔`] },
{ id: 'D4', t: 'D', lvl: 2, type: 'num', q: `Un rayon passe de l'air dans un liquide. On mesure i₁ = 45° et i₂ = 32°. Calcule l'indice du liquide.`, a: 1.33, tol: 0.03, unit: '(sans unité)', hint: `Cette fois tu isoles n₂ : n₂ = n₁ × sin(i₁) ÷ sin(i₂).`, corr: [`n₂ = ${F('n₁ × sin(i₁)', 'sin(i₂)')} = ${F('1,00 × sin(45°)', 'sin(32°)')} = ${F('0,707', '0,530')}`, `n₂ ≈ <b>1,33</b> : c'est de l'eau.`] },
{ id: 'D5', t: 'D', lvl: 2, type: 'num', q: `Un rayon passe de l'air dans un bloc transparent. On mesure i₁ = 50° et i₂ = 30°. Calcule l'indice du bloc.`, a: 1.53, tol: 0.03, unit: '(sans unité)', hint: `n₂ = n₁ × sin(i₁) ÷ sin(i₂).`, corr: [`n₂ = ${F('1,00 × sin(50°)', 'sin(30°)')} = ${F('0,766', '0,500')}`, `n₂ ≈ <b>1,53</b> : proche de 1,5, c'est du verre.`] },
{ id: 'D6', t: 'D', lvl: 1, type: 'qcm', q: `La lumière passe du verre (n = 1,5) dans l'air (n = 1,00). Le rayon réfracté…`, opts: [`se rapproche de la normale`, `s'écarte de la normale`, `continue tout droit, quel que soit l'angle`, `est toujours perpendiculaire à la surface`], a: 1, hint: `Elle entre dans un milieu d'indice plus petit ou plus grand ?`, corr: [`n₂ (air) &lt; n₁ (verre) : indice plus petit.`, `Le rayon <b>s'écarte</b> de la normale : i₂ &gt; i₁.`] },
{ id: 'D7', t: 'D', lvl: 1, type: 'qcm', q: `Un rayon arrive sur la surface de l'eau en suivant exactement la normale (i₁ = 0°). Que se passe-t-il ?`, opts: [`Il est dévié de 33°`, `Il est entièrement réfléchi`, `Il continue tout droit, sans être dévié`, `Il disparaît`], a: 2, hint: `Que vaut sin(0°) ? Qu'est-ce que ça donne pour sin(i₂) ?`, corr: [`sin(0°) = 0, donc sin(i₂) = 0 et i₂ = 0°.`, `Le rayon <b>n'est pas dévié</b>.`] },
{ id: 'D8', t: 'D', lvl: 3, type: 'num', q: `Un rayon venant de l'air fait un angle de 30° avec la <b>surface</b> de l'eau (n = 1,33). Calcule l'angle de réfraction.`, a: 40.6, tol: 1, unit: '°', hint: `Première étape : trouve l'angle d'incidence par rapport à la normale.`, corr: [`i₁ = 90° − 30° = 60°.`, `sin(i₂) = ${F('1,00 × sin(60°)', '1,33')} = ${F('0,866', '1,33')} = 0,651`, `i₂ = sin<sup>−1</sup>(0,651) ≈ <b>41°</b>`] },
{ id: 'D9', t: 'D', lvl: 2, type: 'qcm', q: `En calculant l'indice d'un liquide, un élève trouve n = 0,65. Que faut-il en conclure ?`, opts: [`C'est un liquide très léger`, `Il y a une erreur : un indice est toujours ≥ 1`, `Le liquide ralentit beaucoup la lumière`, `Il faut ajouter une unité`], a: 1, hint: `Quelle est la plus petite valeur possible pour un indice ?`, corr: [`Un indice est toujours ≥ 1 (1 pour le vide).`, `0,65 est impossible : il a sûrement inversé les deux angles ou les deux milieux.`] },
{ id: 'D10', t: 'D', lvl: 2, type: 'num', q: `Un rayon passe de l'air dans un diamant (n = 2,42) avec i₁ = 45°. Calcule i₂.`, a: 17, tol: 1, unit: '°', hint: `Même méthode que d'habitude. L'indice est très grand : attends-toi à un angle petit.`, corr: [`sin(i₂) = ${F('1,00 × sin(45°)', '2,42')} = ${F('0,707', '2,42')} = 0,292`, `i₂ = sin<sup>−1</sup>(0,292) ≈ <b>17°</b>`, `Le diamant dévie énormément la lumière.`] },
/* E — spectres */
{ id: 'E1', t: 'E', lvl: 1, type: 'qcm', q: `De quel type est ce spectre ?`, fig: () => spectrum({ mode: 'emission', lines: GAZ.Hg.raies }), opts: [`Spectre continu`, `Spectre de raies d'émission`, `Spectre de raies d'absorption`], fixed: true, a: 1, hint: `Regarde le fond : noir ou coloré ?`, corr: [`Fond noir + raies colorées → <b>spectre de raies d'émission</b>.`, `Il est produit par un gaz excité (ici une lampe à vapeur de mercure).`] },
{ id: 'E2', t: 'E', lvl: 1, type: 'qcm', q: `De quel type est ce spectre ?`, fig: () => spectrum({ mode: 'absorption', lines: GAZ.Na.raies }), opts: [`Spectre continu`, `Spectre de raies d'émission`, `Spectre de raies d'absorption`], fixed: true, a: 2, hint: `Regarde le fond : noir ou coloré ? Et la raie ?`, corr: [`Fond coloré + raie noire → <b>spectre de raies d'absorption</b>.`, `De la lumière blanche a traversé un gaz, qui a absorbé cette radiation.`] },
{ id: 'E3', t: 'E', lvl: 2, type: 'multi', q: `Voici le spectre de la lumière d'une étoile. Quels éléments sont présents dans son atmosphère ?<br><span class="given">Hydrogène : 410 – 434 – 486 – 656 nm &nbsp;·&nbsp; Sodium : 589 nm &nbsp;·&nbsp; Lithium : 460 – 610 – 671 nm</span>`, fig: () => spectrum({ mode: 'absorption', lines: [410, 434, 486, 589, 656] }), opts: [`Hydrogène`, `Sodium`, `Lithium`], fixed: true, a: [0, 1], hint: `Un élément est présent seulement si TOUTES ses raies sont là.`, corr: [`Hydrogène : 410, 434, 486, 656 toutes présentes → <b>présent</b>.`, `Sodium : 589 présente → <b>présent</b>.`, `Lithium : 460, 610 et 671 absentes → absent.`] },
{ id: 'E4', t: 'E', lvl: 1, type: 'qcm', q: `Une radiation a pour longueur d'onde 350 nm. C'est…`, opts: [`de la lumière visible violette`, `un infrarouge`, `un ultraviolet`, `de la lumière visible rouge`], a: 2, hint: `Le visible va de 400 à 800 nm. 350, c'est de quel côté ?`, corr: [`350 nm &lt; 400 nm → <b>ultraviolet</b>, invisible pour l'œil.`] },
{ id: 'E5', t: 'E', lvl: 1, type: 'qcm', q: `Deux étoiles : Bételgeuse est rouge, Rigel est bleue. Laquelle a la surface la plus chaude ?`, opts: [`Bételgeuse, la rouge`, `Rigel, la bleue`, `Elles ont la même température`, `On ne peut pas savoir`], a: 1, hint: `Plus un corps est chaud, plus son spectre s'enrichit de quel côté ?`, corr: [`Plus un corps est chaud, plus son spectre s'enrichit vers le bleu-violet.`, `<b>Rigel</b>, la bleue, est la plus chaude.`] },
{ id: 'E6', t: 'E', lvl: 2, type: 'qcm', q: `On augmente la température du filament d'une lampe. Son spectre…`, opts: [`devient un spectre de raies`, `perd ses couleurs rouges`, `s'enrichit en radiations bleues et violettes`, `ne change pas`], a: 2, hint: `Un filament donne un spectre continu. Que fait la température sur ce spectre ?`, corr: [`Le spectre reste continu (corps chaud).`, `Il <b>s'enrichit vers le violet</b> quand la température augmente.`] },
{ id: 'E7', t: 'E', lvl: 2, type: 'qcm', q: `On envoie de la lumière blanche à travers un filtre, puis on observe le spectre ci-dessous. De quelle couleur est le filtre ?`, fig: () => spectrum({ bands: [[495, 555]] }), opts: [`Rouge`, `Bleu`, `Vert`, `Jaune`], a: 2, hint: `Ce qui reste coloré, c'est ce que le filtre laisse passer.`, corr: [`Les larges bandes noires sont les couleurs absorbées.`, `Il reste environ 500 à 555 nm : du vert. Le filtre est <b>vert</b>.`] },
{ id: 'E8', t: 'E', lvl: 1, type: 'qcm', q: `Un laser émet une lumière de longueur d'onde 633 nm. Cette lumière est…`, opts: [`polychromatique et rouge`, `monochromatique et rouge`, `monochromatique et bleue`, `invisible (infrarouge)`], a: 1, hint: `Combien de radiations ? Et 633 nm, c'est de quel côté du visible ?`, corr: [`Une seule longueur d'onde → <b>monochromatique</b>.`, `633 nm est entre 400 et 800, du côté des grandes longueurs d'onde → <b>rouge</b>.`] },
{ id: 'E9', t: 'E', lvl: 1, type: 'qcm', q: `Pourquoi un prisme sépare-t-il les couleurs de la lumière blanche ?`, opts: [`Il colore la lumière`, `Il absorbe certaines couleurs`, `Chaque couleur est réfractée d'un angle différent`, `Il chauffe la lumière`], a: 2, hint: `L'indice du verre est-il exactement le même pour toutes les couleurs ?`, corr: [`L'indice du verre dépend légèrement de la couleur.`, `Chaque radiation est donc <b>réfractée d'un angle différent</b> : c'est la dispersion.`] },
{ id: 'E10', t: 'E', lvl: 2, type: 'num', q: `Le sodium émet une radiation de longueur d'onde 5,89 × ${p10(-7)} m. Exprime-la en nanomètres. (1 nm = ${p10(-9)} m)`, a: 589, tol: 1, unit: 'nm', hint: `Pour passer des m aux nm, divise par ${p10(-9)} : les exposants se soustraient, −7 − (−9).`, corr: [`λ = ${F(`5,89 × ${p10(-7)}`, p10(-9))} = 5,89 × 10<sup>−7 − (−9)</sup> = 5,89 × ${p10(2)}`, `λ = <b>589 nm</b> (c'est la raie jaune du sodium).`] },
{ id: 'E11', t: 'E', lvl: 2, type: 'qcm', q: `Le spectre d'une lampe montre des raies à 405, 436, 546 et 577 nm. On sait que l'hydrogène a ses raies à 410, 434, 486 et 656 nm. La lampe contient-elle de l'hydrogène ?`, opts: [`Oui, les valeurs sont proches`, `Non, les raies ne sont pas aux mêmes longueurs d'onde`, `Oui, car il y a 4 raies dans les deux cas`, `On ne peut pas savoir`], a: 1, hint: `Les raies d'un élément sont toujours exactement aux mêmes longueurs d'onde.`, corr: [`Aucune raie ne correspond : 405 ≠ 410, 436 ≠ 434, et il n'y a ni 486 ni 656.`, `<b>Non</b>, ce n'est pas de l'hydrogène (c'est du mercure).`] },
/* G — couleurs */
{ id: 'G1', t: 'G', lvl: 1, type: 'qcm', q: `Un tee-shirt bleu est éclairé uniquement en lumière rouge. De quelle couleur paraît-il ?`, opts: [`Bleu`, `Rouge`, `Violet`, `Noir`], a: 3, hint: `Quelle couleur diffuse-t-il ? En reçoit-il ?`, corr: [`Il ne diffuse que le bleu, et il n'en reçoit pas.`, `Il absorbe le rouge : rien ne repart → <b>noir</b>.`] },
{ id: 'G2', t: 'G', lvl: 1, type: 'qcm', q: `On superpose une lumière rouge et une lumière verte sur un écran blanc. On voit du…`, opts: [`marron`, `jaune`, `cyan`, `blanc`], a: 1, hint: `Synthèse additive. Pense aux trois zones de recouvrement des cercles rouge, vert, bleu.`, corr: [`Synthèse additive : rouge + vert = <b>jaune</b>.`] },
{ id: 'G3', t: 'G', lvl: 2, type: 'qcm', q: `On regarde une tomate rouge à travers un filtre vert, en lumière blanche. La tomate paraît…`, opts: [`rouge`, `verte`, `jaune`, `noire`], a: 3, hint: `Quelle lumière la tomate envoie-t-elle ? Le filtre vert la laisse-t-il passer ?`, corr: [`La tomate diffuse du rouge.`, `Le filtre vert absorbe le rouge : rien ne passe → <b>noire</b>.`] }
];
const BLANC = ['A2', 'B2', 'M1', 'C2', 'D1', 'D4', 'E3', 'E7', 'L2', 'L7'];

/* ============ CARTES MÉMOIRE ============ */
const FL = [
[`Source primaire ?`, `Un objet qui <b>produit</b> sa propre lumière. Soleil, flamme, lampe allumée.`],
[`Source secondaire ?`, `Un objet qui <b>renvoie</b> dans toutes les directions la lumière qu'il reçoit. Lune, feuille, mur.`],
[`Condition pour voir un objet ?`, `De la lumière venant de cet objet doit <b>entrer dans l'œil</b>.`],
[`Énonce la propagation rectiligne.`, `Dans un milieu <b>transparent et homogène</b>, la lumière se propage en ligne droite.`],
[`Valeur de c ?`, `c = 3,00 × ${p10(8)} m/s (vide et air).`],
[`Formule vitesse / distance / temps, avec les unités ?`, `v = d / t &nbsp;·&nbsp; v en m/s, d en m, t en s.`],
[`Une année-lumière, c'est quoi ?`, `Une <b>distance</b> : celle que parcourt la lumière en un an.`],
[`${p10('a')} × ${p10('b')} = ?`, `10<sup>a + b</sup> — deux puissances qui se multiplient : on <b>additionne</b>.`],
[`(${p10('a')})<sup>b</sup> = ?`, `10<sup>a × b</sup> — exposant sur une parenthèse : on <b>multiplie</b>.`],
[`${p10('a')} ÷ ${p10('b')} = ?`, `10<sup>a − b</sup> — division : on <b>soustrait</b>.`],
[`La normale ?`, `La droite <b>perpendiculaire</b> à la surface, passant par le point d'incidence.`],
[`Par rapport à quoi mesure-t-on les angles ?`, `Toujours par rapport à la <b>normale</b>.`],
[`Loi de la réflexion ?`, `r = i₁ (et les rayons sont dans le même plan que la normale).`],
[`Loi de Snell-Descartes pour la réfraction ?`, `n₁ × sin(i₁) = n₂ × sin(i₂)`],
[`Indice optique n : unité ? valeur minimale ?`, `<b>Sans unité</b>. Toujours ≥ 1. Air : 1,00 · eau : 1,33 · verre : ≈ 1,5.`],
[`La lumière entre dans un milieu d'indice plus grand. Le rayon…`, `…<b>se rapproche</b> de la normale (i₂ &lt; i₁).`],
[`Lien entre indice et vitesse ?`, `n = c / v`],
[`Dispersion ?`, `Séparation des couleurs de la lumière blanche, par un prisme ou un réseau.`],
[`Couleur la plus déviée par un prisme ?`, `Le <b>violet</b>. Le rouge est le moins dévié.`],
[`Domaine visible ?`, `De <b>400 nm</b> (violet) à <b>800 nm</b> (rouge). Avant : UV. Après : IR.`],
[`Qui produit un spectre continu ?`, `Un corps <b>chaud</b> et dense : filament, braise. (Étoile : fond continu, mais avec des raies noires d'absorption dues à son atmosphère.)`],
[`Spectre de raies d'émission : aspect et source ?`, `Raies colorées sur fond noir. Un <b>gaz</b> excité.`],
[`Spectre de raies d'absorption : aspect et origine ?`, `Raies noires sur fond coloré. Lumière blanche ayant <b>traversé un gaz</b>.`],
[`Plus un corps est chaud, plus son spectre…`, `…s'enrichit <b>vers le violet</b>.`],
[`Lumière monochromatique ?`, `Une <b>seule</b> radiation, donc une seule longueur d'onde (ex : laser).`]
];

/* ============ PLAN DE RÉVISION ============ */
const PLAN = [
    [`Séance 1`, `Cours 1 à 4`, `Atelier « Puissances de 10 » + exercices Sources, Vitesse et Puissances`],
    [`Séance 2`, `Cours 5 à 7`, `Simulateur de réfraction (les 4 défis) + exercices Réflexion et Réfraction`],
    [`Séance 3`, `Cours 8 à 12`, `Ateliers « Spectres » et « Banc d'optique » + exercices Spectres, Couleurs et Lentilles`],
    [`La veille`, `Méthodes + contrôle blanc`, `Refais uniquement les exercices marqués « à retravailler », puis les cartes mémoire`],
    [`Le matin`, `Fiche récap`, `2 minutes : la fiche, puis les 8 vérifications`]
];

/* ============ COMPLÉMENTS ============ */
const KEEP = {
    sources: [`Source primaire : produit sa lumière. Source secondaire : renvoie celle qu'elle reçoit.`, `On voit un objet quand sa lumière entre dans l'œil.`],
    rectiligne: [`Milieu transparent et homogène → ligne droite.`, `Un rayon = un trait droit avec une flèche.`],
    vitesse: [`c = 3,00 × ${p10(8)} m/s.`, `v = d / t, avec d en m et t en s.`, `L'année-lumière est une distance.`],
    puissances: [`× entre deux puissances → j'additionne les exposants.`, `Exposant sur une parenthèse → je multiplie les exposants.`, `Les nombres ensemble, les puissances ensemble.`],
    vocabulaire: [`La normale est perpendiculaire à la surface, au point d'incidence.`, `Tous les angles se mesurent depuis la normale.`],
    reflexion: [`r = i₁.`, `Angle donné avec la surface → 90° − cet angle.`],
    refraction: [`n₁ × sin(i₁) = n₂ × sin(i₂).`, `Indice plus grand → le rayon se rapproche de la normale.`, `n est sans unité et toujours ≥ 1.`],
    dispersion: [`La lumière blanche est un mélange de toutes les couleurs.`, `Violet : le plus dévié. Rouge : le moins dévié.`],
    longueur: [`Visible : de 400 nm (violet) à 800 nm (rouge).`, `Avant 400 : UV. Après 800 : IR.`, `Monochromatique = une seule radiation.`],
    spectres: [`Continu → corps chaud. Raies colorées sur fond noir → gaz qui émet. Raies noires → gaz qui absorbe.`, `Plus chaud → plus de violet.`, `Un élément est présent si toutes ses raies sont là.`],
    couleurs: [`Rouge + vert + bleu = blanc.`, `Un filtre transmet sa couleur et absorbe le reste.`, `Un objet qui ne reçoit pas sa couleur paraît noir.`]
};
THEMES.O = { nom: `Méthode : l'ordre des étapes`, short: 'Méthode' };
EX.push(
{ id: 'B8', t: 'B', lvl: 2, type: 'qcm', q: `Pour calculer le temps mis par la lumière pour parcourir 150 millions de km, un élève écrit :<br>t = 150 000 000 ÷ (3,00 × ${p10(8)}) = 0,5 s.<br>Où est l'erreur ?`, opts: [`La distance n'a pas été convertie en mètres`, `Il fallait multiplier au lieu de diviser`, `La valeur de c est fausse`, `Il n'y a pas d'erreur`], a: 0, hint: `Regarde l'unité de chaque nombre avant le calcul.`, corr: [`c est en m/s : la distance doit être en mètres.`, `150 millions de km = 1,5 × ${p10(11)} m.`, `t = ${F(`1,5 × ${p10(11)}`, `3,00 × ${p10(8)}`)} = <b>500 s</b>, et non 0,5 s.`] },
{ id: 'M7', t: 'M', lvl: 2, type: 'qcm', q: `Un élève écrit : (${p10(3)})<sup>2</sup> = ${p10(5)}. Quelle règle a-t-il utilisée à tort ?`, opts: [`Celle de deux puissances qui se multiplient (addition des exposants)`, `Celle de la division (soustraction des exposants)`, `Aucune, son résultat est juste`, `Celle de l'écriture scientifique`], a: 0, hint: `Comment obtient-on 5 à partir de 3 et de 2 ?`, corr: [`3 + 2 = 5 : il a additionné, comme pour ${p10(3)} × ${p10(2)}.`, `Ici l'exposant est posé sur une parenthèse → on multiplie : 3 × 2 = 6.`, `(${p10(3)})<sup>2</sup> = <b>${p10(6)}</b>.`] },
{ id: 'D11', t: 'D', lvl: 3, type: 'qcm', q: `Air → eau (n = 1,33), i₁ = 40°. Un élève écrit :<br>sin(i₂) = sin(40°) ÷ 1,33 = sin(30°), donc i₂ = 30°.<br>Où est l'erreur ?`, opts: [`Il a divisé l'angle par 1,33 au lieu de diviser le sinus`, `Il a inversé n₁ et n₂`, `Il a oublié l'unité de l'indice`, `Il n'y a pas d'erreur`], a: 0, hint: `sin(40°) ÷ 1,33, est-ce la même chose que sin(40° ÷ 1,33) ?`, corr: [`On ne « rentre » pas une division dans un sinus.`, `sin(40°) = 0,643, puis 0,643 ÷ 1,33 = 0,483.`, `i₂ = sin<sup>−1</sup>(0,483) = <b>29°</b>, pas 30°.`] },
{ id: 'O1', t: 'O', lvl: 1, type: 'order', q: `Remets dans l'ordre les étapes de la rédaction d'un calcul.`, items: [`Recopier les données avec leurs unités`, `Écrire la formule avec des lettres`, `Convertir dans les bonnes unités`, `Remplacer les lettres par les nombres`, `Écrire le résultat avec son unité`, `Vérifier que c'est plausible`], hint: `On ne calcule jamais avant d'avoir converti, et on n'écrit jamais de nombres avant la formule.` },
{ id: 'O2', t: 'O', lvl: 2, type: 'order', q: `Remets dans l'ordre les étapes pour calculer un angle de réfraction i₂.`, items: [`Repérer n₁ (d'où vient la lumière) et n₂`, `Écrire n₁ × sin(i₁) = n₂ × sin(i₂)`, `Isoler sin(i₂)`, `Calculer la valeur de sin(i₂)`, `Utiliser sin⁻¹ pour obtenir i₂`, `Vérifier le sens de la déviation`], hint: `On étiquette, on écrit la loi, on isole, on calcule, on repasse à l'angle, on vérifie.` },
{ id: 'O3', t: 'O', lvl: 1, type: 'order', q: `Remets dans l'ordre les étapes pour tracer un rayon réfléchi.`, items: [`Repérer le point d'incidence I`, `Tracer la normale en pointillés`, `Mesurer l'angle d'incidence depuis la normale`, `Reporter le même angle de l'autre côté de la normale`, `Tracer le rayon réfléchi avec sa flèche`], hint: `La normale se trace avant tout le reste.` },
{ id: 'O4', t: 'O', lvl: 1, type: 'order', q: `Remets dans l'ordre les étapes pour savoir si un élément est présent dans un spectre.`, items: [`Lire la longueur d'onde de chaque raie du spectre`, `Comparer avec les raies de l'élément donné`, `Vérifier que TOUTES ses raies sont présentes`, `Conclure par une phrase`], hint: `On lit d'abord, on compare ensuite.` }
);

/* Indices des questions de cours (ne donnent jamais la réponse) */
const QH = {
    sources: `Imagine la pièce plongée dans le noir total : lequel de ces objets continuerait à briller ?`,
    rectiligne: `Il faut deux conditions : la lumière doit pouvoir traverser le milieu, et ce milieu doit être le même partout.`,
    vitesse: `Complète la phrase : « c'est ce que la lumière parcourt en un an ». On parcourt… quoi ?`,
    puissances: `Range d'abord : les nombres ensemble, les puissances ensemble. Puis regarde quel signe relie les deux puissances.`,
    vocabulaire: `Elle forme un angle droit avec quelque chose, et elle passe par l'endroit où le rayon touche la surface.`,
    reflexion: `La loi de la réflexion relie r et i₁ par une simple égalité.`,
    refraction: `Compare les deux indices : la lumière entre-t-elle dans un milieu d'indice plus grand ou plus petit ?`,
    dispersion: `Regarde le schéma du prisme en haut du chapitre : compare la direction de chaque couleur avec celle du rayon blanc.`,
    longueur: `Situe ce nombre par rapport aux deux bornes du visible : 400 et 800.`,
    spectres: `Regarde le fond. Un fond noir signifie que la source n'envoie que quelques radiations.`,
    couleurs: `Quelle couleur cet objet sait-il diffuser ? Est-elle présente dans la lumière qui l'éclaire ?`
};
