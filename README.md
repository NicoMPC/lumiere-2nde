# La lumière — 2nde

Site de révision du chapitre « lumière » (physique-chimie, 2nde, programme 2019) :
cours illustré avec schémas à manipuler, méthodes pas à pas, exercices corrigés
avec indices, calculatrice, fiche récap, cartes mémoire et contrôle blanc.

- En ligne : https://nicompc.github.io/lumiere-2nde/
- Dépôt : https://github.com/NicoMPC/lumiere-2nde (public, GitHub Pages sur `main`)
- Construit les 1er et 2 octobre 2026 pour préparer un contrôle, puis ouvert à
  toute la classe : aucun prénom, formulations neutres.

HTML / CSS / JavaScript sans dépendance, sans serveur, sans étape de build.
La progression est enregistrée dans le navigateur (`localStorage`, clé
`lumiere-2nde-v1`) : rien n'est envoyé nulle part, et elle ne suit pas d'un
appareil à l'autre.

## Ce qu'il y a dedans

Quatre onglets et une calculatrice. Chaque élément répond à une seule
question : « est-ce que ça fait gagner des points au contrôle ? »

| Onglet | Contenu |
|---|---|
| **Cours** | 12 chapitres courts : définitions au mot près, schéma, exemple, piège, « Je retiens », puis une question qui valide le chapitre. Les manipulations (simulateur de réfraction, réfraction guidée, schéma à trous, puissances de 10, spectres, banc d'optique) s'ouvrent depuis le chapitre concerné. |
| **Méthodes** | Un aiguillage « quel exercice ai-je devant moi ? » et 9 recettes en étapes « si… alors… », plus les vérifications avant de rendre la copie. |
| **Exercices** | 64 exercices par thème, réponse vérifiée, indice, correction détaillée, liste « à retravailler », bouton « Refaire ». |
| **Contrôle** | Date du contrôle (réglable), fiche récap, cartes mémoire (répétition espacée 1 / 2 / 4 jours), contrôle blanc noté sur 20, fiche PDF à imprimer. |
| **Calculette** | Scientifique, en degrés uniquement, touche ×10ˣ, sin⁻¹, messages d'erreur pédagogiques. |

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page : en-tête, barre d'onglets, zone `#app`. |
| `css/style.css` | Tout le style. Thème clair par défaut, thème sombre via `data-theme`. |
| `css/calc.css` | Style de la calculatrice. |
| `js/gfx.js` | Aides d'affichage et figures SVG générées : `F` (fraction), `p10`, `spectrum`, `rayDiagram`, `figPrisme`, `figOmbre`, `lumi`… |
| `js/data.js` | Le contenu : `CH` (chapitres), `RC` (recettes), `AIGUILLAGE`, `EX` (exercices), `THEMES`, `FL` (cartes), `KEEP` (« Je retiens »), `QH` (indices des questions de cours), `BLANC` (contrôle blanc). |
| `js/lentilles.js` | Le chapitre lentilles : pousse dans `CH`, `RC`, `EX`, `FL`… et définit `figLens` et l'atelier « banc d'optique ». |
| `js/gen.js` | 15 générateurs de questions à valeurs aléatoires (`GEN`), déterministes par graine. Seul `GEN[GEN_POW]` est utilisé aujourd'hui (entraînement aux puissances de 10). |
| `js/calc.js` | La calculatrice (`Calc.open()`, `Calc.toggle()`, analyseur maison, pas de `eval`). |
| `js/app.js` | Le moteur : sauvegarde, navigation par `#hash`, rendu des exercices, séries avec Précédent / Suivant, cartes mémoire, contrôle blanc. |
| `fiche-lumiere.pdf` | La fiche imprimable (10 pages). |
| `og.png` | Image d'aperçu du lien partagé. |
| `tests/verif-contenu.js` | Vérification du contenu (voir plus bas). |

Ordre de chargement des scripts : `gfx.js`, `data.js`, `gen.js`, `lentilles.js`,
`calc.js`, `app.js`.

## Modifier le contenu

**Ajouter un exercice** : une ligne dans `EX` (`js/data.js`).

```js
{ id: 'D12', t: 'D', lvl: 2, type: 'num', q: `Énoncé…`, a: 28.9, tol: 1, unit: '°',
  hint: `Un indice qui guide.`, corr: [`Étape 1`, `Étape 2`, `Résultat en <b>gras</b>`] }
```

Types : `qcm` (`opts`, `a` = index, `fixed: true` pour ne pas mélanger les
options), `multi` (`a` = tableau d'index), `num` (`a`, `tol` absolue, `unit`),
`sci` (réponse sous la forme nombre × 10^exposant, `tol` relative, 0,011 par
défaut), `order` (`items` dans le bon ordre). `t` est une clé de `THEMES`.
Ajouter aussi la valeur attendue dans `tests/verif-contenu.js` pour un
exercice numérique.

**Ajouter un chapitre** : un objet dans `CH` (`id`, `title`, `sub`,
`html: () => …`, `quick: { q, opts, a, why }`), plus `KEEP[id]` et `QH[id]`.
Le chapitre « couleurs » est replacé en dernier au démarrage (`app.js`).

**Ajouter une recette** : un objet dans `RC`, et une ligne dans `AIGUILLAGE`
qui pointe sur son index.

**La fiche PDF** : sa source est
`eleves/Abigail-2nde/fiches/2026-10-01-masterclass-lumiere.html` (dans le
dossier de cours, hors de ce dépôt). Après modification :

```bash
google-chrome --headless=new --no-pdf-header-footer \
  --print-to-pdf=fiche-lumiere.pdf "file://…/2026-10-01-masterclass-lumiere.html"
```

## Règles de contenu

- **Vocabulaire du programme officiel** : source secondaire (ou objet
  diffusant), indice optique (aussi appelé indice de réfraction), vitesse de
  propagation, rayonnement monochromatique, système dispersif, spectre continu
  d'origine thermique. Domaine visible : 400 à 800 nm. c = 3,00 × 10⁸ m/s.
- **Un indice ne donne jamais la réponse** : il rappelle la méthode, pose la
  question qui débloque ou fait faire la première étape. Il y en a un partout
  sauf au contrôle blanc et sur les cartes mémoire.
- **Chaque calcul est vérifié** avant d'être écrit (`tests/verif-contenu.js`).
- **Jamais de prénom**, et jamais de rappel d'échec : on écrit « à
  retravailler », pas « raté ».
- **Hors programme signalé** : le chapitre « couleurs et filtres » est marqué
  « complément ». Les spectres d'absorption, non cités par le programme mais
  traités dans presque tous les cours, sont gardés tels quels.
- « Suivant » reste verrouillé tant que la réponse n'est pas validée.

## Suivi de la progression

`js/suivi.js` (identique à celui de `maths-4e`, dont le README décrit le
fonctionnement) envoie un résumé de la progression vers le tableau de suivi
du professeur, uniquement si le site a été ouvert une fois avec un lien
personnel `…/?k=code`. Il ne fait que lire la progression (`snapshot()` dans
`app.js`) : la clé `lumiere-2nde-v1` n'est jamais modifiée par le suivi.

## Vérifier avant de publier

```bash
node tests/verif-contenu.js          # recalcule chaque réponse numérique, contrôle la structure
for f in js/*.js; do node --check "$f"; done
```

Pour le rendu, des captures sans interface suffisent :

```bash
google-chrome --headless=new --hide-scrollbars --window-size=360,1200 \
  --virtual-time-budget=4000 --screenshot=/tmp/c.png "file://$PWD/index.html#cours/7"
```

À regarder à 360 px (téléphone), 320 px (petit téléphone) et 1280 px (PC).

## Publier

```bash
git add -A && git commit -m "…" && git push
```

GitHub Pages reconstruit en une à deux minutes.

## Ce qui a été essayé puis retiré

La version 2 avait des badges, un entraînement « express », un défi du jour,
des défis à cocher dans les ateliers, un plan de révision et deux ateliers de
plus (voyage de la lumière, couleurs). Tout cela a été retiré : trop de portes
d'entrée pour quelques jours de révision. Le code des générateurs de
`js/gen.js` est resté parce qu'il sert à l'entraînement aux puissances de 10.

## Limites connues

- Testé dans Chrome en taille téléphone, jamais sur un vrai téléphone.
- Le clavier physique de la calculatrice n'a pas été essayé en conditions
  réelles ; la saisie se fait en fin d'expression (pas de curseur).
- Le schéma du banc d'optique est petit sur téléphone, et sa hauteur n'est pas
  à la même échelle que les distances (les valeurs affichées sont exactes).
- La progression vit dans le navigateur : vider les données du site l'efface.
