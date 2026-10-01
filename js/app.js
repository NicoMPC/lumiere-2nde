'use strict';
/* Moteur du site : sauvegarde locale, navigation, cours, ateliers, exercices, révision. */

const KEY = 'lumiere-2nde-v1';
const CONTROLE = new Date(2026, 9, 6); // mardi 6 octobre 2026
const DEFIS = [
    { id: 'rf1', txt: `Règle air → eau avec i₁ = 40°. Tu dois lire i₂ ≈ 29°.` },
    { id: 'rf2', txt: `Trouve un réglage où le rayon n'est pas dévié du tout.` },
    { id: 'rf3', txt: `Fais s'écarter le rayon réfracté de la normale.` },
    { id: 'rf4', txt: `Sens eau → air : augmente i₁ jusqu'à faire disparaître le rayon réfracté.` },
    { id: 'star', txt: `Identifie 3 étoiles mystères (atelier Spectres).` },
    { id: 'pow', txt: `Enchaîne 5 bonnes réponses de suite (atelier Puissances).` }
];
let S = { read: {}, quick: {}, ex: {}, flash: {}, lab: {}, plan: {}, check: {}, best: null, powBest: 0, star: 0, theme: 'dark', last: '' };
try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && typeof d === 'object') S = Object.assign(S, d); } catch (e) { /* stockage indisponible : le site marche quand même */ }

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $('#app');
const num = s => { s = String(s).trim().replace(/\s/g, '').replace(',', '.').replace('−', '-'); return s === '' ? NaN : Number(s); };
const RAD = Math.PI / 180;
function shuffled(n, fixed) { const a = [...Array(n).keys()]; if (fixed) return a; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } progress(); }
function stats() {
    return {
        cours: [CH.reduce((n, c) => n + (S.read[c.id] ? 1 : 0) + (S.quick[c.id] ? 1 : 0), 0), CH.length * 2],
        exos: [EX.filter(e => S.ex[e.id] && S.ex[e.id].st === 'ok').length, EX.length],
        flash: [FL.filter((f, i) => S.flash[i] === 'ok').length, FL.length],
        lab: [DEFIS.filter(d => S.lab[d.id]).length, DEFIS.length]
    };
}
function progress() {
    const s = stats(), done = s.cours[0] + s.exos[0] + s.flash[0] + s.lab[0], tot = s.cours[1] + s.exos[1] + s.flash[1] + s.lab[1];
    const p = Math.round(100 * done / tot);
    $('#globalBar').style.width = p + '%';
    $('#globalPct').textContent = p + ' %';
}
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }
function applyTheme() { document.documentElement.dataset.theme = S.theme; $('meta[name=theme-color]').content = S.theme === 'dark' ? '#0b1020' : '#f5f6fb'; }
const crumb = (href, label, here) => `<div class="crumb"><a href="#${href}">${label}</a><span>›</span>${here}</div>`;
const meter = a => `<div class="meter"><i style="width:${Math.round(100 * a[0] / a[1])}%"></i></div><span class="meter-t">${a[0]} / ${a[1]}</span>`;
function daysLeft() { const t = new Date(); t.setHours(0, 0, 0, 0); const d = Math.round((CONTROLE - t) / 864e5); return d < 0 ? null : d; }

/* ================= ACCUEIL ================= */
function vHome() {
    const s = stats(), d = daysLeft();
    const tile = (href, t, sub, m, cls) => `<a class="tile ${cls}" href="#${href}"><h3>${t}</h3><p>${sub}</p>${m ? `<div class="tile-m">${meter(m)}</div>` : ''}</a>`;
    app.innerHTML = `
    <section class="hero">
      ${figPrisme(true)}
      <h1>La lumière.<br><span class="grad">Tout comprendre.</span></h1>
      <p class="lead">Le cours, clair. Les méthodes, pas à pas. Des exercices corrigés. Tout ce que tu fais ici est enregistré sur ton appareil : tu peux revenir quand tu veux.</p>
      <div class="hero-cta">
        <a class="btn primary big" href="${S.last || '#cours/1'}">${S.last ? `Reprendre où j'en étais` : 'Commencer'}</a>
        ${d !== null ? `<span class="count">${d === 0 ? `Contrôle aujourd'hui` : d === 1 ? 'Contrôle demain' : `Contrôle dans ${d} jours`}</span>` : ''}
      </div>
    </section>
    <section class="tiles">
      ${tile('cours', 'Cours', '11 notions illustrées, une question pour vérifier chacune', s.cours, 't1')}
      ${tile('atelier', 'Atelier', 'Fais bouger les rayons, les spectres, les couleurs', s.lab, 't2')}
      ${tile('methodes', 'Méthodes', 'Les recettes : « si je vois ça, je fais ça »', null, 't3')}
      ${tile('exos', 'Exercices', `${EX.length} exercices avec indice et correction détaillée`, s.exos, 't4')}
      ${tile('controle', 'Avant le contrôle', 'Fiche récap, cartes mémoire, contrôle blanc', s.flash, 't5')}
    </section>`;
}

/* ================= COURS ================= */
function vCours(sub) {
    if (!sub || !CH[+sub - 1]) {
        app.innerHTML = `<h1>Le cours</h1><p class="sub">11 notions. Lis, regarde le schéma, réponds à la question.</p>
        <div class="list">${CH.map((c, k) => `<a class="row" href="#cours/${k + 1}"><span class="num">${k + 1}</span><span class="row-t"><b>${c.title}</b><small>${c.sub}</small></span><span class="row-s">${S.read[c.id] ? '<i class="pill ok">compris</i>' : ''}${S.quick[c.id] ? '<i class="pill ok">question ✓</i>' : ''}</span></a>`).join('')}</div>`;
        return;
    }
    const k = +sub - 1, c = CH[k];
    app.innerHTML = `${crumb('cours', 'Cours', `${k + 1} / ${CH.length}`)}
    <article class="chapter"><h1><span class="num">${k + 1}</span>${c.title}</h1><p class="sub">${c.sub}</p>
    ${c.html()}
    <div class="card quick" id="quick"></div>
    <div class="chap-actions"><button class="btn ${S.read[c.id] ? 'done' : 'primary'}" id="readBtn">${S.read[c.id] ? '✓ Compris' : `J'ai compris`}</button></div>
    <div class="pn">${k > 0 ? `<a class="btn ghost" href="#cours/${k}">← ${CH[k - 1].title}</a>` : '<span></span>'}${k < CH.length - 1 ? `<a class="btn ghost" href="#cours/${k + 2}">${CH[k + 1].title} →</a>` : `<a class="btn ghost" href="#methodes">Les méthodes →</a>`}</div>
    </article>`;
    $('#readBtn').onclick = e => { S.read[c.id] = !S.read[c.id]; save(); e.target.className = 'btn ' + (S.read[c.id] ? 'done' : 'primary'); e.target.textContent = S.read[c.id] ? '✓ Compris' : `J'ai compris`; };
    const host = $('#quick'), q = c.quick;
    host.innerHTML = `<div class="quick-h">Vérifie en 10 secondes</div><div class="ex-q">${q.q}</div><div class="opts">${shuffled(q.opts.length).map(i => `<button class="opt" data-i="${i}">${q.opts[i]}</button>`).join('')}</div><div class="ex-fb" hidden></div>`;
    const fb = $('.ex-fb', host), good = () => { $(`.opt[data-i="${q.a}"]`, host).classList.add('good'); fb.hidden = false; fb.className = 'ex-fb ok'; fb.innerHTML = '<b>Exact.</b> ' + q.why; };
    $$('.opt', host).forEach(b => b.onclick = () => {
        $$('.opt', host).forEach(x => x.classList.remove('good', 'bad'));
        if (+b.dataset.i === q.a) { good(); if (!S.quick[c.id]) { S.quick[c.id] = true; save(); } }
        else { b.classList.add('bad'); fb.hidden = false; fb.className = 'ex-fb ko'; fb.innerHTML = 'Pas encore. Relis les encadrés au-dessus, puis réessaie.'; }
    });
    if (S.quick[c.id]) good();
}

/* ================= EXERCICES ================= */
function renderEx(ex, host, opt = {}) {
    const exam = !!opt.exam;
    let sel = null, locked = false; const msel = new Set();
    const st = () => (S.ex[ex.id] || {}).st || '';
    const setSt = v => { S.ex[ex.id] = { st: v }; save(); if (!exam) paint(); };
    let ans;
    if (ex.type === 'qcm' || ex.type === 'multi') ans = `<div class="opts">${shuffled(ex.opts.length, ex.fixed).map(i => `<button class="opt" data-i="${i}">${ex.opts[i]}</button>`).join('')}</div>${ex.type === 'multi' ? '<div class="note">Plusieurs réponses possibles.</div>' : ''}`;
    else if (ex.type === 'num') ans = `<div class="inp"><input type="text" inputmode="decimal" autocomplete="off" class="in-num" placeholder="ta réponse" aria-label="réponse"><span class="unit">${ex.unit || ''}</span></div>`;
    else ans = `<div class="inp sci"><input type="text" inputmode="decimal" autocomplete="off" class="in-m" placeholder="nombre" aria-label="nombre"><span class="x10">× 10</span><input type="text" inputmode="numeric" autocomplete="off" class="in-e" placeholder="exp." aria-label="exposant"><span class="unit">${ex.unit || ''}</span></div>`;
    host.className = 'card ex';
    host.innerHTML = `<div class="ex-head"><span class="tag">${THEMES[ex.t].short}</span><span class="lvl" title="difficulté">${'●'.repeat(ex.lvl)}${'○'.repeat(3 - ex.lvl)}</span><span class="ex-state"></span></div>
      <div class="ex-q">${ex.q}</div>${ex.fig ? `<div class="fig">${ex.fig()}</div>` : ''}${ans}
      <div class="ex-actions"><button class="btn primary" data-a="check">Valider</button>${exam ? '' : '<button class="btn ghost" data-a="hint">Indice</button><button class="btn ghost" data-a="corr">Correction</button>'}</div>
      <div class="ex-fb" hidden></div><div class="ex-hint" hidden><b>Indice.</b> ${ex.hint}</div>
      <div class="ex-corr" hidden><b>Correction</b><ol>${ex.corr.map(c => `<li>${c}</li>`).join('')}</ol></div>`;
    const fb = $('.ex-fb', host);
    function paint() { host.dataset.st = st(); $('.ex-state', host).textContent = st() === 'ok' ? '✓ réussi' : st() === 'retry' ? 'à retravailler' : ''; }
    if (!exam) paint();
    $$('.opt', host).forEach(b => b.onclick = () => {
        if (locked) return; const i = +b.dataset.i;
        if (ex.type === 'qcm') { sel = i; $$('.opt', host).forEach(x => x.classList.remove('sel', 'bad', 'good')); b.classList.add('sel'); }
        else { msel.has(i) ? msel.delete(i) : msel.add(i); b.classList.toggle('sel'); b.classList.remove('bad', 'good'); }
    });
    const answered = () => ex.type === 'qcm' ? sel !== null : ex.type === 'multi' ? msel.size > 0 : ex.type === 'num' ? !isNaN(num($('.in-num', host).value)) : !isNaN(num($('.in-e', host).value));
    function isOk() {
        if (ex.type === 'qcm') return sel === ex.a;
        if (ex.type === 'multi') return msel.size === ex.a.length && ex.a.every(i => msel.has(i));
        if (ex.type === 'num') return Math.abs(num($('.in-num', host).value) - ex.a) <= (ex.tol || 0) + 1e-9;
        const m = num($('.in-m', host).value), e = num($('.in-e', host).value), v = (isNaN(m) ? 1 : m) * Math.pow(10, e);
        return Math.abs(v / ex.a - 1) <= (ex.tol || 0.011);
    }
    function check() {
        if (locked) return;
        if (!answered()) { toast(`Donne d'abord une réponse.`); return; }
        const ok = isOk();
        fb.hidden = false; fb.className = 'ex-fb ' + (ok ? 'ok' : 'ko');
        if (exam) {
            locked = true; $$('input,button.opt,[data-a=check]', host).forEach(x => x.disabled = true);
            fb.innerHTML = ok ? '<b>Exact.</b>' : '<b>Ce n\'est pas ça.</b> La correction est à la fin.';
            if (ok) setSt('ok'); else if (st() !== 'ok') setSt('retry');
            opt.onDone && opt.onDone(ok); return;
        }
        if (ok) {
            fb.innerHTML = '<b>Exact.</b>'; $('.ex-corr', host).hidden = false; setSt('ok');
            $$('.opt.sel', host).forEach(x => { x.classList.remove('sel'); x.classList.add('good'); });
        } else {
            fb.innerHTML = '<b>Pas encore.</b> Ouvre l\'indice, puis réessaie.';
            $$('.opt.sel', host).forEach(x => x.classList.add('bad'));
            if (st() !== 'ok') setSt('retry');
        }
    }
    $$('[data-a]', host).forEach(b => b.onclick = () => {
        const a = b.dataset.a;
        if (a === 'check') check();
        else if (a === 'hint') { const h = $('.ex-hint', host); h.hidden = !h.hidden; }
        else { const c = $('.ex-corr', host); c.hidden = !c.hidden; if (!c.hidden && !st()) setSt('retry'); }
    });
    $$('input', host).forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') check(); }));
}
function vExos(sub) {
    const retry = EX.filter(e => S.ex[e.id] && S.ex[e.id].st === 'retry');
    if (!sub || (sub !== 'R' && !THEMES[sub])) {
        const s = stats();
        app.innerHTML = `<h1>Exercices</h1><p class="sub">${EX.length} exercices. Chaque réponse est vérifiée, avec un indice et une correction détaillée.</p>
        <div class="card total">${meter(s.exos)}</div>
        ${retry.length ? `<a class="row hot" href="#exos/R"><span class="num">↻</span><span class="row-t"><b>À retravailler</b><small>${retry.length} exercice${retry.length > 1 ? 's' : ''} à refaire</small></span></a>` : ''}
        <div class="list">${Object.entries(THEMES).map(([k, t]) => { const l = EX.filter(e => e.t === k), ok = l.filter(e => S.ex[e.id] && S.ex[e.id].st === 'ok').length; return `<a class="row" href="#exos/${k}"><span class="row-t"><b>${t.nom}</b><small>${l.length} exercices</small></span><span class="row-m">${meter([ok, l.length])}</span></a>`; }).join('')}</div>`;
        return;
    }
    const list = sub === 'R' ? retry : EX.filter(e => e.t === sub);
    app.innerHTML = `${crumb('exos', 'Exercices', sub === 'R' ? 'À retravailler' : THEMES[sub].nom)}<h1>${sub === 'R' ? 'À retravailler' : THEMES[sub].nom}</h1>
    ${list.length ? '' : '<p class="sub">Plus rien à refaire ici.</p>'}<div id="exlist"></div>
    <p><a class="btn ghost" href="#exos">← Tous les thèmes</a></p>`;
    const box = $('#exlist');
    list.forEach(ex => { const d = document.createElement('div'); box.appendChild(d); renderEx(ex, d); });
}

/* ================= ATELIER ================= */
function vAtelier(sub) {
    const labs = { refraction: labRefraction, spectres: labSpectres, puissances: labPow, voyage: labVoyage, couleurs: labCouleurs };
    if (labs[sub]) return labs[sub]();
    const t = (k, title, d) => `<a class="row" href="#atelier/${k}"><span class="row-t"><b>${title}</b><small>${d}</small></span><span class="go">→</span></a>`;
    app.innerHTML = `<h1>L'atelier</h1><p class="sub">Ici on manipule. Ce sont les mêmes lois que dans le cours, mais tu les vois bouger.</p>
    <div class="list">
      ${t('refraction', 'Simulateur de réfraction', 'Change les milieux et l\'angle, le rayon et le calcul suivent')}
      ${t('puissances', 'Puissances de 10', 'Additionner ou multiplier les exposants ? Entraînement sans fin')}
      ${t('spectres', 'Spectres', 'Corps chaud, gaz, filtre. Et les étoiles mystères')}
      ${t('voyage', 'Le voyage de la lumière', 'Combien de temps pour atteindre la Lune, le Soleil, une étoile ?')}
      ${t('couleurs', 'Couleurs', 'Allume les lumières, choisis l\'objet, regarde ce qu\'on voit')}
    </div>
    <div class="card"><h3>Défis</h3><ul class="defis">${DEFIS.map(d => `<li class="${S.lab[d.id] ? 'ok' : ''}">${d.txt}</li>`).join('')}</ul></div>`;
}
function winDefi(id) { if (!S.lab[id]) { S.lab[id] = true; save(); toast('Défi réussi'); return true; } return false; }

function labRefraction() {
    const o = MILIEUX.map((m, k) => `<option value="${k}">${m[0]} (n = ${fr(m[1])})</option>`).join('');
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Réfraction')}<h1>Simulateur de réfraction</h1><p class="sub">Change les milieux et l'angle : le rayon et le calcul se mettent à jour.</p>
    <div class="card lab"><div class="fig" id="rf-fig"></div>
      <div class="ctrl"><label>Milieu 1 <small>d'où vient la lumière</small><select id="rf-1">${o}</select></label><label>Milieu 2 <small>où elle entre</small><select id="rf-2">${o}</select></label></div>
      <label class="rng">Angle d'incidence i₁ = <b id="rf-iv"></b><input type="range" id="rf-i" min="0" max="89" value="20"></label>
      <div class="readout" id="rf-out"></div></div>
    <div class="card"><h3>Le calcul, en direct</h3><div id="rf-calc" class="calc"></div></div>
    <div class="card"><h3>4 défis</h3><ul class="defis" id="rf-defis"></ul></div>`;
    const s1 = $('#rf-1'), s2 = $('#rf-2'), rg = $('#rf-i'); s2.value = 1;
    const defis = () => $('#rf-defis').innerHTML = DEFIS.slice(0, 4).map(d => `<li class="${S.lab[d.id] ? 'ok' : ''}">${d.txt}</li>`).join('');
    function u() {
        const a = +s1.value, b = +s2.value, i = +rg.value, n1 = MILIEUX[a][1], n2 = MILIEUX[b][1];
        const s = n1 * Math.sin(i * RAD) / n2, tot = s > 1, i2 = tot ? null : Math.asin(s) / RAD;
        $('#rf-fig').innerHTML = rayDiagram({ n1, n2, i, m1: MILIEUX[a][0], m2: MILIEUX[b][0] });
        $('#rf-iv').textContent = i + '°';
        let v;
        if (n1 === n2) v = 'Même indice des deux côtés : pas de déviation.';
        else if (i === 0) v = 'Le rayon arrive sur la normale : pas de déviation.';
        else if (tot) v = 'Plus de rayon réfracté : toute la lumière est réfléchie. C\'est le cas où la calculatrice affiche « erreur ».';
        else if (n2 > n1) v = 'n₂ > n₁ : le rayon <b>se rapproche</b> de la normale.';
        else v = 'n₂ < n₁ : le rayon <b>s\'écarte</b> de la normale.';
        $('#rf-out').innerHTML = `<div class="vals"><span>i₁ = <b>${i}°</b></span><span>r = <b>${i}°</b></span><span>i₂ = <b>${tot ? '—' : fr(i2, 1) + '°'}</b></span></div><p>${v}</p>`;
        $('#rf-calc').innerHTML = `<div>n₁ × sin(i₁) = n₂ × sin(i₂)</div>
          <div>sin(i₂) = ${F(`${fr(n1)} × sin(${i}°)`, fr(n2))} = ${F(fr(n1 * Math.sin(i * RAD), 3), fr(n2))} = <b>${fr(s, 3)}</b></div>
          <div>${tot ? 'Ce nombre est plus grand que 1 : aucun angle n\'a ce sinus.' : `i₂ = sin<sup>−1</sup>(${fr(s, 3)}) = <b>${fr(i2, 1)}°</b>`}</div>`;
        let w = false;
        if (a === 0 && b === 1 && i === 40) w = winDefi('rf1') || w;
        if (i === 0 || n1 === n2) w = winDefi('rf2') || w;
        if (n2 < n1 && i > 0 && !tot) w = winDefi('rf3') || w;
        if (a === 1 && b === 0 && tot) w = winDefi('rf4') || w;
        if (w) defis();
    }
    [s1, s2].forEach(e => e.onchange = u); rg.oninput = u; defis(); u();
}

function labSpectres() {
    let src = 'chaud', T = 3000, gas = 'H', mode = 'emission', filt = 'R', star = null, pick = new Set();
    const FILT = { R: ['rouge', [[620, 800]]], V: ['vert', [[495, 570]]], B: ['bleu', [[430, 495]]] };
    const COMBOS = [['H'], ['Na'], ['Hg'], ['Li'], ['H', 'Na'], ['H', 'Li'], ['Na', 'Hg'], ['Hg', 'Li'], ['H', 'Hg'], ['Na', 'Li']];
    const POOL = ['H', 'Na', 'Hg', 'Li'];
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Spectres')}<h1>Spectres</h1><p class="sub">Choisis la source de lumière et regarde son spectre.</p>
    <div class="card lab"><div class="seg" id="sp-src"><button data-v="chaud">Corps chaud</button><button data-v="gaz">Gaz</button><button data-v="filtre">Filtre</button></div>
      <div id="sp-ctrl"></div><div class="fig" id="sp-fig"></div><div class="readout" id="sp-txt"></div></div>
    <div class="card lab"><h3>Étoile mystère</h3><p>Voici le spectre de la lumière d'une étoile. Compare avec les spectres de référence et coche les éléments présents dans son atmosphère.</p>
      <div id="st-box"></div></div>`;
    function draw() {
        $$('#sp-src button').forEach(b => b.classList.toggle('on', b.dataset.v === src));
        const c = $('#sp-ctrl'), f = $('#sp-fig'), t = $('#sp-txt');
        if (src === 'chaud') {
            c.innerHTML = `<label class="rng">Température = <b id="sp-Tv"></b><input type="range" min="1500" max="9000" step="100" value="${T}" id="sp-T"></label>`;
            const hot = () => {
                $('#sp-Tv').textContent = T + ' K';
                f.innerHTML = spectrum({ T, title: 'spectre continu' });
                t.innerHTML = `<p><b>Spectre continu</b>, d'origine thermique. ${T < 3000 ? 'Corps peu chaud : surtout du rouge.' : T < 5500 ? 'En chauffant, le vert puis le bleu apparaissent.' : 'Corps très chaud : le spectre est riche en bleu et en violet.'}</p>`;
            };
            $('#sp-T').oninput = e => { T = +e.target.value; hot(); };
            hot();
        } else if (src === 'gaz') {
            c.innerHTML = `<div class="chips">${Object.keys(GAZ).map(k => `<button class="chip ${k === gas ? 'on' : ''}" data-g="${k}">${GAZ[k].nom}</button>`).join('')}</div>
              <div class="seg small"><button data-m="emission" class="${mode === 'emission' ? 'on' : ''}">Le gaz émet</button><button data-m="absorption" class="${mode === 'absorption' ? 'on' : ''}">Lumière blanche à travers le gaz</button></div>`;
            $$('[data-g]', c).forEach(b => b.onclick = () => { gas = b.dataset.g; draw(); });
            $$('[data-m]', c).forEach(b => b.onclick = () => { mode = b.dataset.m; draw(); });
            f.innerHTML = spectrum({ mode, lines: GAZ[gas].raies });
            t.innerHTML = `<p><b>Spectre de raies d'${mode === 'emission' ? 'émission' : 'absorption'}</b> — ${GAZ[gas].nom}.<br>Raies à ${GAZ[gas].raies.join(' – ')} nm. ${mode === 'emission' ? 'Passe en « lumière blanche à travers le gaz » : les raies noires tombent exactement aux mêmes endroits.' : 'Les raies noires sont aux mêmes longueurs d\'onde que les raies d\'émission.'}</p>`;
        } else {
            c.innerHTML = `<div class="chips">${Object.keys(FILT).map(k => `<button class="chip ${k === filt ? 'on' : ''}" data-f="${k}">Filtre ${FILT[k][0]}</button>`).join('')}</div>`;
            $$('[data-f]', c).forEach(b => b.onclick = () => { filt = b.dataset.f; draw(); });
            f.innerHTML = spectrum({ bands: FILT[filt][1] });
            t.innerHTML = `<p><b>Spectre de bandes d'absorption.</b> Le filtre ${FILT[filt][0]} laisse passer le ${FILT[filt][0]} et absorbe le reste : de larges bandes noires.</p>`;
        }
    }
    $$('#sp-src button').forEach(b => b.onclick = () => { src = b.dataset.v; draw(); });
    function newStar() { star = COMBOS[Math.floor(Math.random() * COMBOS.length)]; pick = new Set(); drawStar(); }
    function drawStar(res) {
        const lines = star.flatMap(k => GAZ[k].raies);
        $('#st-box').innerHTML = `<div class="fig"><div class="cap l">Spectre de l'étoile</div>${spectrum({ mode: 'absorption', lines })}</div>
          <div class="refs">${POOL.map(k => `<div class="ref"><span>${GAZ[k].nom}</span>${spectrum({ mode: 'emission', lines: GAZ[k].raies, axis: false, h: 18 })}</div>`).join('')}</div>
          <div class="chips">${POOL.map(k => `<button class="chip ${pick.has(k) ? 'on' : ''}" data-k="${k}">${GAZ[k].nom}</button>`).join('')}</div>
          <div class="ex-actions"><button class="btn primary" id="st-ok">Vérifier</button><button class="btn ghost" id="st-new">Nouvelle étoile</button><span class="meter-t">${S.star} étoile${S.star > 1 ? 's' : ''} identifiée${S.star > 1 ? 's' : ''}</span></div>
          ${res === true ? `<div class="ex-fb ok"><b>Exact.</b> ${star.map(k => GAZ[k].nom).join(' et ')} : toutes ses raies sont dans le spectre.</div>` : res === false ? '<div class="ex-fb ko"><b>Pas encore.</b> Un élément est présent seulement si <u>toutes</u> ses raies sont là. Vérifie raie par raie.</div>' : ''}`;
        $$('[data-k]', $('#st-box')).forEach(b => b.onclick = () => { pick.has(b.dataset.k) ? pick.delete(b.dataset.k) : pick.add(b.dataset.k); b.classList.toggle('on'); });
        $('#st-new').onclick = newStar;
        $('#st-ok').onclick = () => {
            if (!pick.size) { toast('Coche au moins un élément.'); return; }
            const ok = pick.size === star.length && star.every(k => pick.has(k));
            if (ok && res !== true) { S.star++; if (S.star >= 3) S.lab.star = true; save(); }
            drawStar(ok);
        };
    }
    draw(); newStar();
}

function labPow() {
    let cur, streak = 0;
    const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    function gen() {
        const t = R(0, 4); let x, y, a, b;
        if (t === 0) { a = R(2, 5); b = R(2, 5); x = R(2, 9); y = R(2, 9); return { t, x, y, q: `(${a} × ${p10(x)}) × (${b} × ${p10(y)})`, m: a * b, e: x + y, steps: [`Nombres ensemble : ${a} × ${b} = ${a * b}.`, `Puissances ensemble : ${p10(x)} × ${p10(y)} = 10<sup>${x} + ${y}</sup> = ${p10(x + y)}.`, `Résultat : <b>${a * b} × ${p10(x + y)}</b>${a * b >= 10 ? ` = ${fr(a * b / 10, 1)} × ${p10(x + y + 1)} en écriture scientifique` : ''}.`] }; }
        if (t === 1) { [a, b] = [[6, 2], [8, 2], [9, 3], [8, 4], [6, 3], [4, 2]][R(0, 5)]; x = R(5, 12); y = R(1, x - 1); return { t, x, y, q: `(${a} × ${p10(x)}) ÷ (${b} × ${p10(y)})`, m: a / b, e: x - y, steps: [`Nombres ensemble : ${a} ÷ ${b} = ${a / b}.`, `Puissances ensemble : ${p10(x)} ÷ ${p10(y)} = 10<sup>${x} − ${y}</sup> = ${p10(x - y)}.`, `Résultat : <b>${a / b} × ${p10(x - y)}</b>.`] }; }
        if (t === 2) { x = R(2, 5); y = R(2, 4); return { t, x, y, q: `(${p10(x)})<sup>${y}</sup>`, m: 1, e: x * y, steps: [`Un exposant posé sur une parenthèse : ${p10(x)} répété ${y} fois.`, `On multiplie les exposants : ${x} × ${y} = ${x * y}.`, `Résultat : <b>${p10(x * y)}</b>.`] }; }
        if (t === 3) { x = R(2, 9); y = R(2, 9); return { t, x, y, q: `${p10(x)} × ${p10(y)}`, m: 1, e: x + y, steps: [`Deux puissances qui se multiplient → on additionne : ${x} + ${y} = ${x + y}.`, `Résultat : <b>${p10(x + y)}</b>.`] }; }
        x = R(5, 12); y = R(1, x - 1); return { t, x, y, q: `${p10(x)} ÷ ${p10(y)}`, m: 1, e: x - y, steps: [`Deux puissances qui se divisent → on soustrait : ${x} − ${y} = ${x - y}.`, `Résultat : <b>${p10(x - y)}</b>.`] };
    }
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Puissances de 10')}<h1>Puissances de 10</h1><p class="sub">La seule question à se poser : qu'est-ce qui relie les deux puissances ?</p>
    <div class="card"><table class="tbl"><tr><th>Je vois</th><th>Sur les exposants</th><th>Exemple</th></tr>
      <tr><td>${p10('a')} <b>×</b> ${p10('b')}</td><td class="c-add"><b>+</b></td><td>${p10(2)} × ${p10(4)} = ${p10(6)}</td></tr>
      <tr><td>${p10('a')} <b>÷</b> ${p10('b')}</td><td class="c-sub"><b>−</b></td><td>${p10(11)} ÷ ${p10(8)} = ${p10(3)}</td></tr>
      <tr><td>(${p10('a')})<sup><b>b</b></sup></td><td class="c-mul"><b>×</b></td><td>(${p10(2)})<sup>4</sup> = ${p10(8)}</td></tr></table>
      <p class="note">Avec des nombres devant : les nombres ensemble, les puissances ensemble. (2 × ${p10(2)}) × (2 × ${p10(4)}) = 4 × ${p10(6)}.</p></div>
    <div class="card lab" id="pw"></div>`;
    function show(res, msg) {
        $('#pw').innerHTML = `<div class="pw-top"><span>Série en cours : <b>${streak}</b></span><span>Record : <b>${S.powBest}</b></span></div>
          <div class="pw-q">${cur.q} = ?</div>
          <div class="inp sci"><input type="text" inputmode="decimal" autocomplete="off" class="in-m" placeholder="nombre" aria-label="nombre"><span class="x10">× 10</span><input type="text" inputmode="numeric" autocomplete="off" class="in-e" placeholder="exp." aria-label="exposant"></div>
          <div class="note">S'il n'y a pas de nombre devant, laisse la première case vide.</div>
          <div class="ex-actions"><button class="btn primary" id="pw-ok">Vérifier</button><button class="btn ghost" id="pw-next">Question suivante</button></div>
          ${res === undefined ? '' : `<div class="ex-fb ${res ? 'ok' : 'ko'}">${msg}</div><div class="ex-corr"><ol>${cur.steps.map(s => `<li>${s}</li>`).join('')}</ol></div>`}`;
        $('#pw-next').onclick = () => { cur = gen(); show(); };
        if (res !== undefined) { $('#pw-ok').disabled = true; $$('#pw input').forEach(i => i.disabled = true); return; }
        const go = () => {
            const m = num($('#pw .in-m').value), e = num($('#pw .in-e').value);
            if (isNaN(e)) { toast(`Écris l'exposant.`); return; }
            const v = Math.log10((isNaN(m) ? 1 : m)) + e, ok = Math.abs(v - (Math.log10(cur.m) + cur.e)) < 1e-9;
            let mg = '<b>Exact.</b>';
            if (ok) { streak++; if (streak > S.powBest) S.powBest = streak; if (streak >= 5) S.lab.pow = true; save(); }
            else {
                streak = 0; mg = '<b>Pas encore.</b> ';
                if ((cur.t === 0 || cur.t === 3) && e === cur.x * cur.y) mg += `Tu as multiplié les exposants : ça, c'est la règle d'un exposant posé sur une parenthèse. Ici il y a un × entre deux puissances → on additionne.`;
                else if (cur.t === 2 && e === cur.x + cur.y) mg += `Tu as additionné les exposants : ça, c'est la règle de deux puissances qui se multiplient. Ici l'exposant est posé sur une parenthèse → on multiplie.`;
                else if ((cur.t === 1 || cur.t === 4) && e === cur.x + cur.y) mg += `C'est une division : on soustrait les exposants.`;
                else mg += `Regarde les étapes.`;
            }
            show(ok, mg);
        };
        $('#pw-ok').onclick = go;
        $$('#pw input').forEach(i => i.addEventListener('keydown', ev => { if (ev.key === 'Enter') go(); }));
    }
    cur = gen(); show();
}

function labVoyage() {
    const D = [['la Lune', 3.84, 8], ['le Soleil', 1.5, 11], ['Jupiter', 7.8, 11], ['Neptune', 4.5, 12], ['Proxima du Centaure', 3.98, 16]];
    let k = 1;
    const cl = x => String(Number(x.toFixed(2))).replace('.', ',');
    const dur = s => s < 60 ? `${cl(s)} s` : s < 3600 ? `${Math.floor(s / 60)} min ${Math.round(s % 60)} s` : s < 86400 ? `${Math.floor(s / 3600)} h ${Math.round(s % 3600 / 60)} min` : s < 3.156e7 ? `${Math.round(s / 86400)} jours` : `${cl(s / 3.156e7)} ans`;
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Voyage')}<h1>Le voyage de la lumière</h1><p class="sub">Choisis une destination. Le calcul est toujours le même : t = d ÷ c.</p>
    <div class="card lab"><div class="chips" id="vy-c"></div><div class="track"><span class="from">Terre</span><i id="vy-dot"></i><span class="to" id="vy-to"></span></div><div class="big-res" id="vy-res"></div></div>
    <div class="card"><h3>Le calcul rédigé</h3><div class="calc" id="vy-calc"></div></div>`;
    function u() {
        const [nom, m, e] = D[k], t = m / 3 * Math.pow(10, e - 8);
        $('#vy-c').innerHTML = D.map((d, i) => `<button class="chip ${i === k ? 'on' : ''}" data-i="${i}">${d[0]}</button>`).join('');
        $$('#vy-c .chip').forEach(b => b.onclick = () => { k = +b.dataset.i; u(); });
        $('#vy-to').textContent = nom;
        const dot = $('#vy-dot'); dot.classList.remove('go'); void dot.offsetWidth; dot.classList.add('go');
        $('#vy-res').innerHTML = `<b>${dur(t)}</b><span>pour parcourir ${cl(m)} × ${p10(e)} m</span>`;
        $('#vy-calc').innerHTML = `<div>Données : d = ${cl(m)} × ${p10(e)} m &nbsp;·&nbsp; c = 3,00 × ${p10(8)} m/s</div>
          <div>t = ${F('d', 'c')} = ${F(`${cl(m)} × ${p10(e)}`, `3,00 × ${p10(8)}`)}</div>
          <div>= ${F(cl(m), '3,00')} × ${F(p10(e), p10(8))} <span class="hintline">nombres ensemble, puissances ensemble</span></div>
          <div>= ${cl(m / 3)} × 10<sup>${e} − 8</sup> = ${cl(m / 3)} × ${p10(e - 8)} s</div>
          <div>t = <b>${dur(t)}</b></div>`;
    }
    u();
}

function labCouleurs() {
    const OBJ = { blanc: [1, 1, 1], rouge: [1, 0, 0], vert: [0, 1, 0], bleu: [0, 0, 1], jaune: [1, 1, 0], cyan: [0, 1, 1], magenta: [1, 0, 1], noir: [0, 0, 0] };
    const NAME = { '111': 'blanc', '100': 'rouge', '010': 'vert', '001': 'bleu', '110': 'jaune', '011': 'cyan', '101': 'magenta', '000': 'noir' };
    const PRIM = ['rouge', 'vert', 'bleu'];
    let L = [1, 1, 1], ob = 'bleu';
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Couleurs')}<h1>Couleurs</h1><p class="sub">Allume ou éteins les trois lumières, choisis un objet, regarde ce qu'il devient.</p>
    <div class="card lab"><h3>1. La lumière qui éclaire</h3><div class="chips" id="cl-l"></div><div class="fig" id="cl-rgb"></div><div class="readout" id="cl-lt"></div></div>
    <div class="card lab"><h3>2. L'objet éclairé</h3><div class="chips" id="cl-o"></div><div class="fig" id="cl-shirt"></div><div class="readout" id="cl-txt"></div></div>`;
    const list = t => PRIM.filter((p, i) => t[i]).join(' + ') || 'rien';
    function u() {
        $('#cl-l').innerHTML = PRIM.map((p, i) => `<button class="chip c-${p} ${L[i] ? 'on' : ''}" data-i="${i}">${p}</button>`).join('');
        $$('#cl-l .chip').forEach(b => b.onclick = () => { L[+b.dataset.i] ^= 1; u(); });
        $('#cl-o').innerHTML = Object.keys(OBJ).map(o => `<button class="chip ${o === ob ? 'on' : ''}" data-o="${o}">${o}</button>`).join('');
        $$('#cl-o .chip').forEach(b => b.onclick = () => { ob = b.dataset.o; u(); });
        const seen = L.map((v, i) => v & OBJ[ob][i]), ln = NAME[L.join('')], sn = NAME[seen.join('')];
        $('#cl-rgb').innerHTML = figRGB(L);
        $('#cl-lt').innerHTML = `<p>Lumière : <b>${ln === 'noir' ? 'aucune (obscurité)' : ln}</b>${L.reduce((a, b) => a + b) > 1 ? ` (${list(L)})` : ''}.</p>`;
        $('#cl-shirt').innerHTML = figTshirt(sn === 'noir' ? '#0c0c0c' : `rgb(${seen.map(v => v * 255).join(',')})`);
        $('#cl-txt').innerHTML = `<p>L'objet ${ob} diffuse : <b>${list(OBJ[ob])}</b>.<br>Il reçoit : <b>${list(L)}</b>.<br>Ce qui repart vers l'œil : <b>${list(seen)}</b> → il paraît <b>${sn}</b>.</p>`;
    }
    u();
}

/* ================= MÉTHODES ================= */
function vMeth() {
    app.innerHTML = `<h1>Les méthodes</h1><p class="sub">Des recettes. Tu repères le type d'exercice, tu déroules les étapes dans l'ordre, tu vérifies.</p>
    <div class="card"><h3>Quel exercice ai-je devant moi ?</h3><div class="aig">${AIGUILLAGE.map(a => `<button class="aig-row" data-r="${a[1]}"><span>${a[0]}</span><b>Recette ${a[1]} →</b></button>`).join('')}</div></div>
    ${RC.map((r, k) => `<details class="card rc" id="rc${k}"><summary><span class="num">${k}</span><span><b>${r.title}</b><small>${r.when}</small></span></summary>
      <ol class="steps-l">${r.steps.map(s => `<li>${s}</li>`).join('')}</ol>${r.ex ? `<div class="exb">${r.ex}</div>` : ''}${r.trap ? `<div class="trap">${r.trap}</div>` : ''}</details>`).join('')}
    <div class="card"><h3>Avant de rendre la copie : 8 vérifications</h3><ul class="checks">${VERIFS.map(v => `<li>${v}</li>`).join('')}</ul></div>
    <p><a class="btn primary" href="#exos">S'entraîner →</a></p>`;
    $$('.aig-row').forEach(b => b.onclick = () => { const d = $('#rc' + b.dataset.r); d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}

/* ================= AVANT LE CONTRÔLE ================= */
function vCtrl(sub) {
    if (sub === 'fiche') return vFiche();
    if (sub === 'cartes') return vCartes();
    if (sub === 'blanc') return vBlanc();
    const s = stats(), d = daysLeft();
    app.innerHTML = `<h1>Avant le contrôle</h1><p class="sub">${d === null ? 'Pour réviser efficacement.' : d === 0 ? `C'est aujourd'hui. La fiche, les 8 vérifications, et c'est parti.` : d === 1 ? `C'est demain. Méthodes, contrôle blanc, cartes mémoire.` : `Encore ${d} jours. Voilà comment t'organiser.`}</p>
    <div class="list">
      <a class="row" href="#controle/fiche"><span class="row-t"><b>La fiche récap</b><small>Tout l'essentiel sur un écran</small></span><span class="go">→</span></a>
      <a class="row" href="#controle/cartes"><span class="row-t"><b>Cartes mémoire</b><small>${FL.length} questions de cours, recto verso</small></span><span class="row-m">${meter(s.flash)}</span></a>
      <a class="row" href="#controle/blanc"><span class="row-t"><b>Contrôle blanc</b><small>10 questions, noté sur 20${S.best !== null ? ` · meilleure note : ${S.best} / 20` : ''}</small></span><span class="go">→</span></a>
      <a class="row" href="fiche-lumiere.pdf" target="_blank" rel="noopener"><span class="row-t"><b>La fiche à imprimer</b><small>Cours + méthodes en PDF, 9 pages</small></span><span class="go">↓</span></a>
    </div>
    <div class="card"><h3>Plan de révision</h3><ul class="plan">${PLAN.map((p, i) => `<li><label><input type="checkbox" data-p="${i}" ${S.plan[i] ? 'checked' : ''}><span><b>${p[0]} — ${p[1]}</b><small>${p[2]}</small></span></label></li>`).join('')}</ul></div>
    <div class="card"><h3>Où j'en suis</h3>
      <div class="statl"><span>Cours</span>${meter(s.cours)}</div><div class="statl"><span>Défis de l'atelier</span>${meter(s.lab)}</div>
      <div class="statl"><span>Exercices réussis</span>${meter(s.exos)}</div><div class="statl"><span>Cartes sues</span>${meter(s.flash)}</div></div>
    <p class="reset"><button class="btn ghost small" id="reset">Effacer ma progression</button></p>`;
    $$('[data-p]').forEach(c => c.onchange = () => { S.plan[c.dataset.p] = c.checked; save(); });
    let armed = false;
    $('#reset').onclick = e => {
        if (!armed) { armed = true; e.target.textContent = 'Tout effacer, vraiment ? Appuie encore une fois'; e.target.classList.add('danger'); return; }
        const th = S.theme; try { localStorage.removeItem(KEY); } catch (er) { }
        S = { read: {}, quick: {}, ex: {}, flash: {}, lab: {}, plan: {}, check: {}, best: null, powBest: 0, star: 0, theme: th, last: '' }; save(); route(); toast('Progression effacée');
    };
}
function vFiche() {
    const b = (t, h) => `<div class="fbox"><h4>${t}</h4>${h}</div>`;
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Fiche récap')}<h1>La fiche récap</h1>
    <div class="fiche">
      ${b('Les valeurs', `c = 3,00 × ${p10(8)} m/s<br>Visible : 400 nm (violet) → 800 nm (rouge)<br>1 nm = ${p10(-9)} m<br>n : air 1,00 · eau 1,33 · verre ≈ 1,5`)}
      ${b('Les formules', `v = ${F('d', 't')} &nbsp; d = v × t &nbsp; t = ${F('d', 'v')}<br>r = i₁<br>n₁ × sin(i₁) = n₂ × sin(i₂)<br>n = ${F('c', 'v')}`)}
      ${b('Puissances de 10', `${p10('a')} × ${p10('b')} = 10<sup>a+b</sup><br>${p10('a')} ÷ ${p10('b')} = 10<sup>a−b</sup><br>(${p10('a')})<sup>b</sup> = 10<sup>a×b</sup>`)}
      ${b('Les mots', `<b>Source primaire</b> : produit sa lumière.<br><b>Objet diffusant</b> : renvoie la lumière reçue.<br><b>Normale</b> : perpendiculaire à la surface en I.<br><b>Dioptre</b> : surface entre deux milieux.<br><b>Réfraction</b> : changement de direction en changeant de milieu.<br><b>Dispersion</b> : séparation des couleurs.<br><b>Monochromatique</b> : une seule radiation.`)}
      ${b('Le sens du rayon', `Indice plus grand → se rapproche de la normale.<br>Indice plus petit → s'écarte de la normale.<br>i₁ = 0° → pas dévié.`)}
      ${b('Les spectres', `<b>Continu</b> : corps chaud. Plus chaud → plus de violet.<br><b>Raies d'émission</b> (fond noir) : gaz excité.<br><b>Raies d'absorption</b> (raies noires) : lumière blanche à travers un gaz.<br><b>Bandes noires larges</b> : filtre, solution.<br>Un élément est présent si <u>toutes</u> ses raies y sont.`)}
      ${b('Le prisme', `Violet : le plus dévié.<br>Rouge : le moins dévié.`)}
      ${b('Couleurs', `Rouge + vert + bleu = blanc.<br>Filtre : transmet sa couleur, absorbe le reste.<br>Objet : diffuse sa couleur. Sans elle → noir.`)}
    </div>
    <div class="card"><h3>Les 8 vérifications</h3><ul class="plan">${VERIFS.map((v, i) => `<li><label><input type="checkbox" data-c="${i}" ${S.check[i] ? 'checked' : ''}><span>${v}</span></label></li>`).join('')}</ul></div>
    <p><a class="btn ghost" href="#controle">← Avant le contrôle</a></p>`;
    $$('[data-c]').forEach(c => c.onchange = () => { S.check[c.dataset.c] = c.checked; save(); });
}
function vCartes() {
    let order = FL.map((f, i) => i).sort((a, b) => (S.flash[a] === 'ok') - (S.flash[b] === 'ok')), k = 0, flip = false;
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Cartes mémoire')}<h1>Cartes mémoire</h1><p class="sub">Réponds dans ta tête, puis retourne la carte.</p><div id="fc"></div>`;
    function draw() {
        const box = $('#fc'), known = FL.filter((f, i) => S.flash[i] === 'ok').length;
        if (k >= order.length) {
            const left = FL.map((f, i) => i).filter(i => S.flash[i] !== 'ok');
            box.innerHTML = `<div class="card center"><h3>${known} / ${FL.length} cartes sues</h3>${left.length ? `<p>Il en reste ${left.length} à revoir.</p><button class="btn primary" id="fc-again">Revoir celles-là</button>` : `<p>Tu les connais toutes.</p><button class="btn ghost" id="fc-all">Tout refaire</button>`}</div>`;
            if (left.length) $('#fc-again').onclick = () => { order = left; k = 0; flip = false; draw(); };
            else $('#fc-all').onclick = () => { order = FL.map((f, i) => i); k = 0; flip = false; draw(); };
            return;
        }
        const i = order[k], c = FL[i];
        box.innerHTML = `<div class="fc-top"><span>Carte ${k + 1} / ${order.length}</span><span>${known} sues</span></div>
          <button class="flash ${flip ? 'back' : ''}" id="fc-card"><small>${flip ? 'Réponse' : 'Question'}</small><div>${flip ? c[1] : c[0]}</div>${flip ? '' : '<em>Touche pour retourner</em>'}</button>
          <div class="fc-act" ${flip ? '' : 'hidden'}><button class="btn ghost" id="fc-no">À revoir</button><button class="btn primary" id="fc-yes">Je savais</button></div>`;
        $('#fc-card').onclick = () => { flip = !flip; draw(); };
        if (flip) { $('#fc-no').onclick = () => { S.flash[i] = 'again'; save(); k++; flip = false; draw(); }; $('#fc-yes').onclick = () => { S.flash[i] = 'ok'; save(); k++; flip = false; draw(); }; }
    }
    draw();
}
function vBlanc() {
    const qs = BLANC.map(id => EX.find(e => e.id === id)); let k = -1; const res = [];
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Contrôle blanc')}<h1>Contrôle blanc</h1><div id="bl"></div>`;
    const box = $('#bl');
    function intro() {
        box.innerHTML = `<div class="card"><p><b>10 questions, 2 points chacune.</b> Une seule tentative par question, pas d'indice. Les corrections sont à la fin.</p><p>Prends une feuille, ta calculatrice (en degrés), et fais comme le jour J : rédige.</p>${S.best !== null ? `<p class="note">Meilleure note : ${S.best} / 20</p>` : ''}<button class="btn primary big" id="bl-go">Commencer</button></div>`;
        $('#bl-go').onclick = next;
    }
    function next() {
        k++;
        if (k >= qs.length) return end();
        box.innerHTML = `<div class="fc-top"><span>Question ${k + 1} / ${qs.length}</span><span>${res.filter(Boolean).length * 2} pts</span></div><div id="bl-q"></div><div class="ex-actions"><button class="btn primary" id="bl-next" hidden>${k === qs.length - 1 ? 'Voir ma note' : 'Question suivante'}</button></div>`;
        renderEx(qs[k], $('#bl-q'), { exam: true, onDone: ok => { res.push(ok); $('#bl-next').hidden = false; } });
        $('#bl-next').onclick = next; window.scrollTo(0, 0);
    }
    function end() {
        const note = res.filter(Boolean).length * 2;
        if (S.best === null || note > S.best) { S.best = note; save(); }
        box.innerHTML = `<div class="card center"><div class="note-big">${note}<small> / 20</small></div><p>${note >= 16 ? 'Tu es prête.' : note >= 10 ? 'La base est là. Reprends les questions ci-dessous marquées « à revoir ».' : 'Reprends les corrections ci-dessous une par une, puis les recettes correspondantes.'}</p><button class="btn ghost" id="bl-re">Recommencer</button></div>
          ${qs.map((q, i) => `<details class="card rc ${res[i] ? 'r-ok' : 'r-ko'}"><summary><span class="num">${i + 1}</span><span><b>${res[i] ? 'Réussi' : 'À revoir'}</b><small>${q.q.replace(/<[^>]+>/g, ' ').slice(0, 90)}…</small></span></summary><div class="ex-q">${q.q}</div>${q.fig ? `<div class="fig">${q.fig()}</div>` : ''}<ol class="steps-l">${q.corr.map(c => `<li>${c}</li>`).join('')}</ol></details>`).join('')}
          <p><a class="btn ghost" href="#exos/R">Mes exercices à retravailler →</a></p>`;
        $('#bl-re').onclick = () => { k = -1; res.length = 0; intro(); }; window.scrollTo(0, 0);
    }
    intro();
}

/* ================= NAVIGATION ================= */
const ROUTES = { accueil: vHome, cours: vCours, atelier: vAtelier, methodes: vMeth, exos: vExos, controle: vCtrl };
function route() {
    const [r, sub] = (location.hash.slice(1) || 'accueil').split('/');
    const name = ROUTES[r] ? r : 'accueil';
    app.innerHTML = '';
    ROUTES[name](sub);
    $$('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.r === name));
    window.scrollTo(0, 0);
    if (name !== 'accueil' && S.last !== location.hash) { S.last = location.hash; save(); }
}
$('#themeBtn').onclick = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); };
window.addEventListener('hashchange', route);
applyTheme(); progress(); route();
