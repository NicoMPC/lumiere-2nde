'use strict';
/* Moteur du site : sauvegarde locale, navigation, cours, ateliers, exercices, séries, récompenses. */

const KEY = 'lumiere-2nde-v1';
const SITE = 'https://nicompc.github.io/lumiere-2nde/';
const HASGEN = typeof GEN !== 'undefined' && typeof mulberry !== 'undefined';
const DEFIS = [
    { id: 'rf1', txt: `Règle air → eau avec i₁ = 40°. Tu dois lire i₂ ≈ 29°.` },
    { id: 'rf2', txt: `Trouve un réglage où le rayon n'est pas dévié du tout.` },
    { id: 'rf3', txt: `Fais s'écarter le rayon réfracté de la normale.` },
    { id: 'rf4', txt: `Sens eau → air : augmente i₁ jusqu'à faire disparaître le rayon réfracté.` },
    { id: 'guide', txt: `Mène 3 réfractions guidées jusqu'au bout.` },
    { id: 'schema', txt: `Réussis le schéma à trous sans aucune erreur.` },
    { id: 'star', txt: `Identifie 3 étoiles mystères (atelier Spectres).` },
    { id: 'pow', txt: `Enchaîne 5 bonnes réponses de suite (atelier Puissances).` }
].concat(window.EXTRA_DEFIS || []);
const BLANK = () => ({ read: {}, quick: {}, ex: {}, fl: {}, lab: {}, plan: {}, check: {}, best: null, powBest: 0, star: 0, guide: 0, express: 0, theme: 'dark', last: '', days: {}, daily: {}, badges: {}, run: null, hadRetry: false, exam: '2026-10-06' });
let S = BLANK();
try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && typeof d === 'object') S = Object.assign(S, d); } catch (e) { /* stockage indisponible : le site marche quand même */ }

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const app = $('#app');
const RAD = Math.PI / 180;
const num = s => { s = String(s).trim().replace(/\s/g, '').replace(',', '.').replace('−', '-'); return s === '' ? NaN : Number(s); };
const cl = (x, d = 2) => String(Number(Number(x).toFixed(d))).replace('.', ',');
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const rseed = () => Math.floor(Math.random() * 2147483647);
const plur = (n, w) => `${n} ${w}${n > 1 ? 's' : ''}`;
function shuffled(n, fixed) { const a = [...Array(n).keys()]; if (fixed) return a; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const mix = arr => shuffled(arr.length).map(i => arr[i]);
function dayNum() { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 6e4) / 864e5); }
const stOf = id => (S.ex[id] || {}).st || '';
const nOk = () => EX.filter(e => stOf(e.id) === 'ok').length;
const retryList = () => EX.filter(e => stOf(e.id) === 'retry');
const flKnown = i => !!(S.fl[i] && S.fl[i].b >= 1);
const flDue = i => !S.fl[i] || S.fl[i].d <= dayNum();

/* ================= SAUVEGARDE, PROGRESSION ================= */
function write() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
function save() { S.days[dayNum()] = 1; if (retryList().length) S.hadRetry = true; write(); progress(); checkBadges(); }
function stats() {
    return {
        cours: [CH.reduce((n, c) => n + (S.read[c.id] ? 1 : 0) + (S.quick[c.id] ? 1 : 0), 0), CH.length * 2],
        exos: [nOk(), EX.length],
        flash: [FL.filter((f, i) => flKnown(i)).length, FL.length],
        lab: [DEFIS.filter(d => S.lab[d.id]).length, DEFIS.length]
    };
}
function pctAll() { const s = stats(); return Math.round(100 * (s.cours[0] + s.exos[0] + s.flash[0] + s.lab[0]) / (s.cours[1] + s.exos[1] + s.flash[1] + s.lab[1])); }
function progress() { const p = pctAll(); $('#globalBar').style.width = p + '%'; $('#globalPct').textContent = p + ' %'; }
function daysLeft() {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(S.exam || ''); if (!m) return null;
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const d = Math.round((new Date(+m[1], +m[2] - 1, +m[3]) - t) / 864e5); return d < 0 ? null : d;
}
function applyTheme() { document.documentElement.dataset.theme = S.theme; $('meta[name=theme-color]').content = S.theme === 'dark' ? '#0b1020' : '#f5f6fb'; }
const crumb = (href, label, here) => `<div class="crumb"><a href="#${href}">← ${label}</a><span>›</span>${here}</div>`;
const meter = a => `<div class="meter"><i style="width:${Math.round(100 * a[0] / a[1])}%"></i></div><span class="meter-t">${a[0]} / ${a[1]}</span>`;

/* ================= EFFETS : toast, confettis, récompenses, partage ================= */
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400); }
function buzz(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } }
function confetti(x, y, n = 46) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cols = ['#8b5cf6', '#3b82f6', '#06b6d4', '#22c55e', '#eab308', '#f97316', '#ef4444'], box = document.createElement('div');
    box.className = 'confetti'; document.body.appendChild(box);
    x = x === undefined ? innerWidth / 2 : x; y = y === undefined ? innerHeight / 3 : y;
    for (let i = 0; i < n; i++) {
        const p = document.createElement('i'), a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 230, dx = Math.cos(a) * d, dy = Math.sin(a) * d;
        p.style.cssText = `left:${x}px;top:${y}px;background:${cols[i % cols.length]};${i % 3 ? '' : 'border-radius:50%;'}`;
        box.appendChild(p);
        if (p.animate) p.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${dx}px,${dy - 70}px) rotate(${Math.random() * 600}deg)`, opacity: 1, offset: .6 }, { transform: `translate(${dx * 1.1}px,${dy + 200}px) rotate(${Math.random() * 900}deg)`, opacity: 0 }], { duration: 1200 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    }
    setTimeout(() => box.remove(), 2100);
}
const BADGES = [
    { id: 'start', ic: '✨', t: 'Première étincelle', d: 'Un premier chapitre compris', ok: () => CH.some(c => S.read[c.id]) },
    { id: 'cours', ic: '📘', t: 'Le cours dans la poche', d: 'Tous les chapitres compris, toutes les questions réussies', ok: () => { const s = stats().cours; return s[0] === s[1]; } },
    { id: 'ex10', ic: '🚀', t: 'Décollage', d: '10 exercices réussis', ok: () => nOk() >= 10 },
    { id: 'ex25', ic: '🔥', t: 'Vitesse de croisière', d: '25 exercices réussis', ok: () => nOk() >= 25 },
    { id: 'theme', ic: '🎯', t: 'Thème bouclé', d: `Tous les exercices d'un thème réussis`, ok: () => Object.keys(THEMES).some(k => { const l = EX.filter(e => e.t === k); return l.length && l.every(e => stOf(e.id) === 'ok'); }) },
    { id: 'solo', ic: '🌟', t: 'Sans filet', d: '15 exercices réussis sans ouvrir l\'indice', ok: () => nSolo() >= 15 },
    { id: 'tenace', ic: '💪', t: 'Ténacité', d: 'La liste « à retravailler » entièrement vidée', ok: () => S.hadRetry && !retryList().length },
    { id: 'express', ic: '⚡', t: 'Réflexes', d: '20 questions express réussies', ok: () => S.express >= 20 },
    { id: 'pow', ic: '🔟', t: 'Puissance 10', d: '5 bonnes réponses de suite aux puissances', ok: () => S.powBest >= 5 },
    { id: 'pow10', ic: '💥', t: 'Série imbattable', d: '10 de suite aux puissances', ok: () => S.powBest >= 10 },
    { id: 'refr', ic: '📐', t: 'Rayons domptés', d: 'Les 4 défis du simulateur de réfraction', ok: () => ['rf1', 'rf2', 'rf3', 'rf4'].every(k => S.lab[k]) },
    { id: 'guide', ic: '🧭', t: 'Snell-Descartes validé', d: '3 réfractions guidées menées au bout', ok: () => !!S.lab.guide },
    { id: 'schema', ic: '🦅', t: 'Œil de lynx', d: 'Le schéma à trous sans une erreur', ok: () => !!S.lab.schema },
    { id: 'star', ic: '⭐', t: 'Chasse aux étoiles', d: '3 étoiles mystères identifiées', ok: () => !!S.lab.star },
    { id: 'flash', ic: '🧠', t: 'Mémoire vive', d: 'Toutes les cartes mémoire sues', ok: () => { const s = stats().flash; return s[0] === s[1]; } },
    { id: 'jour3', ic: '📅', t: 'Régularité', d: '3 jours de révision', ok: () => Object.keys(S.days).length >= 3 },
    { id: 'blanc', ic: '🎓', t: 'Au point', d: '16 ou plus au contrôle blanc', ok: () => S.best !== null && S.best >= 16 },
    { id: 'blanc20', ic: '💯', t: '20 sur 20', d: 'Le contrôle blanc parfait', ok: () => S.best === 20 },
    { id: 'exall', ic: '🌈', t: 'Lumière totale', d: 'Tous les exercices de la banque réussis', mega: true, ok: () => nOk() === EX.length }
];
const rwQueue = []; let rwBusy = false;
function checkBadges(silent) {
    const fresh = BADGES.filter(b => !S.badges[b.id] && b.ok());
    if (!fresh.length) return;
    fresh.forEach(b => S.badges[b.id] = Date.now()); write();
    if (silent) return;
    fresh.forEach(b => rwQueue.push(b)); nextReward();
}
function nextReward() {
    if (rwBusy || !rwQueue.length) return;
    const b = rwQueue.shift(); rwBusy = true; buzz([20, 40, 60]);
    if (b.mega) return megaReward(b);
    const r = $('#reward');
    r.innerHTML = `<div class="rw-ic">${b.ic}</div><a class="rw-t" href="#recompenses"><small>Nouvelle récompense</small><b>${b.t}</b><span>${b.d}</span></a><button class="btn ghost small" data-share>Partager</button>`;
    r.classList.add('on'); confetti(innerWidth / 2, 110);
    setTimeout(() => { r.classList.remove('on'); rwBusy = false; setTimeout(nextReward, 350); }, 4600);
}
function megaReward(b) {
    const o = document.createElement('div'); o.className = 'mega';
    o.innerHTML = `<div class="mega-in">${figPrisme(true)}<div class="mega-ic">${b.ic}</div><h2 class="grad">${b.t}</h2><p>Tous les exercices de la banque, réussis. Absolument tous.<br>Très peu de gens vont jusque-là.</p><div class="ex-actions center"><button class="btn primary big" id="mega-ok">Continuer</button><button class="btn ghost" data-share>Partager le site</button></div></div>`;
    document.body.appendChild(o);
    [0, 500, 1000, 1600].forEach((t, i) => setTimeout(() => confetti(innerWidth * (0.2 + 0.2 * i), innerHeight * 0.3, 60), t));
    $('#mega-ok', o).onclick = () => { o.remove(); rwBusy = false; nextReward(); };
}
function share() {
    const d = { title: 'La lumière — 2nde', text: 'Cours illustré, simulateurs et exercices corrigés pour réviser la lumière en 2nde.', url: SITE };
    if (navigator.share) navigator.share(d).catch(() => { });
    else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(SITE).then(() => toast('Lien copié : tu peux le coller où tu veux'), () => toast(SITE));
    else toast(SITE);
}
const shareBtn = (label = 'Partager ce site') => `<button class="btn ghost" data-share><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7 M12 3v13 M7 8l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${label}</button>`;
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-share]'); if (b) { e.preventDefault(); e.stopPropagation(); share(); } }, true);

const hintD = t => t ? `<details class="hintd"><summary>Indice</summary><p>${t}</p></details>` : '';
const nSolo = () => EX.filter(e => S.ex[e.id] && S.ex[e.id].st === 'ok' && !S.ex[e.id].h).length;
const GH = [`Relis l'énoncé : « passe de … dans … ». Le premier milieu cité est celui d'où vient la lumière.`, `Calculatrice en degrés. Tape le nombre, la touche ×, puis sin et l'angle.`, `Tu as n₁ × sin(i₁) = n₂ × sin(i₂). Pour garder sin(i₂) seul, que fais-tu du n₂ qui le multiplie ?`, `Tu connais le sinus et tu cherches l'angle : c'est la touche inverse de sin.`, `Compare les deux angles. Le plus petit des deux correspond au rayon le plus proche de la normale.`];
const SH = { dioptre: `C'est la frontière entre les deux milieux.`, normale: `Ce n'est pas un rayon : c'est une droite de construction, perpendiculaire à la surface.`, incident: `Suis les flèches : c'est le rayon qui arrive vers la surface.`, reflechi: `Il repart de la surface en restant du même côté que le rayon qui arrive.`, refracte: `Il a traversé la surface : cherche de l'autre côté.`, point: `C'est l'endroit où le rayon qui arrive touche la surface.` };

/* ================= EXERCICES ================= */
const OKS = ['Exact.', `Oui, c'est ça.`, 'Parfait.', 'Bien vu.', 'Impeccable.', `C'est juste.`, 'Tout bon.'];
let serie = 0;
function cheer() {
    serie++; let m = OKS[Math.floor(Math.random() * OKS.length)];
    if (serie === 3) m += ` Trois d'affilée.`; else if (serie === 5) m += ` Cinq d'affilée, ça roule.`; else if (serie === 10) m += ` Dix d'affilée. Rien à dire.`; else if (serie > 10 && serie % 5 === 0) m += ` ${serie} d'affilée.`;
    return `<b>${m}</b>`;
}
const corrOf = ex => ex.corr || (ex.type === 'order' ? ex.items : []);
function exHead(ex) { return `<div class="ex-head"><span class="tag">${(THEMES[ex.t] || { short: '' }).short}</span>${ex.lvl ? `<span class="lvl" title="difficulté">${'●'.repeat(ex.lvl)}${'○'.repeat(3 - ex.lvl)}</span>` : ''}<span class="ex-state"></span></div><div class="ex-q">${ex.q}</div>${ex.fig ? `<div class="fig">${ex.fig()}</div>` : ''}`; }
function makeItem(d) { if (d.id) return EX.find(e => e.id === d.id); return Object.assign(GEN[d.g](mulberry(d.seed)), { gen: true, id: 'g' + d.g }); }

/* mode : 'free' (banque, plusieurs essais) | 'once' (un essai, correction affichée) | 'exam' (un essai, correction à la fin) */
function renderEx(ex, host, opt = {}) {
    const mode = opt.mode || 'free', bank = !ex.gen;
    let sel = null, locked = false, tries = 0, hinted = false; const msel = new Set(); let seq = [];
    const setSt = v => { if (!bank) return; S.ex[ex.id] = (v === 'ok' && hinted) ? { st: v, h: 1 } : { st: v }; save(); };
    const isNum = ex.type === 'num' || ex.type === 'sci';
    let ans;
    if (ex.type === 'qcm' || ex.type === 'multi') ans = `<div class="opts">${shuffled(ex.opts.length, ex.fixed).map(i => `<button class="opt" data-i="${i}">${ex.opts[i]}</button>`).join('')}</div>${ex.type === 'multi' ? '<div class="note">Plusieurs réponses possibles.</div>' : ''}`;
    else if (ex.type === 'num') ans = `<div class="inp"><input type="text" inputmode="decimal" autocomplete="off" class="in-num" placeholder="ta réponse" aria-label="réponse"><span class="unit">${ex.unit || ''}</span></div>`;
    else if (ex.type === 'sci') ans = `<div class="inp sci"><input type="text" inputmode="decimal" autocomplete="off" class="in-m" placeholder="nombre" aria-label="nombre"><span class="x10">× 10</span><input type="text" inputmode="text" autocomplete="off" class="in-e" placeholder="exp." aria-label="exposant"><span class="unit">${ex.unit || ''}</span></div>`;
    else ans = `<div class="ord"></div>`;
    host.className = 'card ex';
    host.innerHTML = `${exHead(ex)}${ans}
      <div class="ex-actions"><button class="btn primary" data-a="check">Valider</button>${mode === 'exam' ? '' : '<button class="btn ghost" data-a="hint">Indice</button>'}${mode === 'free' ? '<button class="btn ghost" data-a="corr">Correction</button>' : ''}${isNum ? '<button class="btn ghost" data-a="calc">Calculatrice</button>' : ''}${mode === 'free' && bank ? '<button class="btn ghost" data-a="redo" hidden>Refaire</button>' : ''}</div>
      <div class="ex-fb" hidden></div><div class="ex-hint" hidden><b>Indice.</b> ${ex.hint || ''}</div>
      <div class="ex-corr" hidden><b>Correction</b><ol>${corrOf(ex).map(c => `<li>${c}</li>`).join('')}</ol></div>`;
    const fb = $('.ex-fb', host);
    function paint() {
        if (mode !== 'free' || !bank) return;
        const s = stOf(ex.id); host.dataset.st = s;
        $('.ex-state', host).textContent = s === 'ok' ? (S.ex[ex.id].h ? '✓ réussi avec l\'indice' : '★ réussi sans indice') : s === 'retry' ? 'à retravailler' : '';
        const r = $('[data-a=redo]', host); if (r) r.hidden = s !== 'ok';
    }
    paint();
    if (ex.type === 'order') {
        let pool = shuffled(ex.items.length); if (pool.every((v, i) => v === i)) pool = pool.slice(1).concat(pool[0]);
        const drawOrd = () => {
            $('.ord', host).innerHTML = `<ol class="ord-ans">${seq.map(i => `<li><button class="opt" data-rm="${i}">${ex.items[i]}</button></li>`).join('') || `<li class="ord-empty">Touche les étapes dans l'ordre. Touche une étape placée pour la retirer.</li>`}</ol><div class="ord-pool">${pool.filter(i => !seq.includes(i)).map(i => `<button class="chip" data-add="${i}">${ex.items[i]}</button>`).join('')}</div>`;
            $$('[data-add]', host).forEach(b => b.onclick = () => { if (!locked) { seq.push(+b.dataset.add); drawOrd(); } });
            $$('[data-rm]', host).forEach(b => b.onclick = () => { if (!locked) { seq = seq.filter(i => i !== +b.dataset.rm); drawOrd(); } });
        };
        drawOrd();
    }
    $$('.opt[data-i]', host).forEach(b => b.onclick = () => {
        if (locked) return; const i = +b.dataset.i;
        if (ex.type === 'qcm') { sel = i; $$('.opt', host).forEach(x => x.classList.remove('sel', 'bad', 'good')); b.classList.add('sel'); }
        else { msel.has(i) ? msel.delete(i) : msel.add(i); b.classList.toggle('sel'); b.classList.remove('bad', 'good'); }
    });
    const val = c => num($(c, host).value);
    const answered = () => ex.type === 'qcm' ? sel !== null : ex.type === 'multi' ? msel.size > 0 : ex.type === 'num' ? !isNaN(val('.in-num')) : ex.type === 'sci' ? !isNaN(val('.in-e')) : seq.length === ex.items.length;
    function isOk() {
        if (ex.type === 'qcm') return sel === ex.a;
        if (ex.type === 'multi') return msel.size === ex.a.length && ex.a.every(i => msel.has(i));
        if (ex.type === 'num') return Math.abs(val('.in-num') - ex.a) <= (ex.tol || 0) + 1e-9;
        if (ex.type === 'order') return seq.every((v, i) => v === i);
        const m = val('.in-m'), e = val('.in-e'), v = (isNaN(m) ? 1 : m) * Math.pow(10, e);
        return Math.abs(v / ex.a - 1) <= (ex.tol || 0.011);
    }
    function ansText() {
        if (ex.type === 'qcm') return ex.opts[sel];
        if (ex.type === 'multi') return [...msel].sort().map(i => ex.opts[i]).join(', ');
        if (ex.type === 'num') return `${$('.in-num', host).value} ${ex.unit || ''}`;
        if (ex.type === 'sci') return `${$('.in-m', host).value || '1'} × 10<sup>${$('.in-e', host).value}</sup> ${ex.unit || ''}`;
        return seq.map(i => ex.items[i]).join(' → ');
    }
    function check() {
        if (locked) return;
        if (!answered()) { toast(ex.type === 'order' ? 'Place toutes les étapes.' : ex.type === 'sci' ? `Écris au moins l'exposant.` : `Donne d'abord une réponse.`); return; }
        const ok = isOk(); tries++;
        fb.hidden = false; fb.className = 'ex-fb ' + (ok ? 'ok' : 'ko');
        host.classList.remove('pulse', 'shake'); void host.offsetWidth; host.classList.add(ok ? 'pulse' : 'shake'); buzz(ok ? 20 : [30, 50, 30]);
        if (ok) setSt('ok'); else { serie = 0; if (stOf(ex.id) !== 'ok') setSt('retry'); }
        let extra = '';
        if (!ok && ex.diag) { const d = ex.diag(ex.type === 'sci' ? { m: isNaN(val('.in-m')) ? 1 : val('.in-m'), e: val('.in-e') } : { v: val('.in-num') }); if (d) extra = ' ' + d; }
        if (!ok && ex.type === 'order') { let k = 0; while (k < seq.length && seq[k] === k) k++; if (k) extra = ` ${k === 1 ? 'La première étape est bien placée.' : `Les ${k} premières étapes sont bien placées.`}`; }
        if (mode !== 'free') {
            locked = true; $$('input,button.opt,.chip,[data-a=check],[data-a=hint]', host).forEach(x => x.disabled = true);
            $$('.opt.sel', host).forEach(x => x.classList.add(ok ? 'good' : 'bad'));
            if (mode === 'exam') fb.innerHTML = ok ? cheer() : `<b>Ce n'est pas ça.</b> La correction est à la fin.`;
            else { fb.innerHTML = ok ? cheer() : `<b>Pas cette fois.</b>${extra} Lis la correction ligne par ligne.`; $('.ex-corr', host).hidden = false; }
            opt.onDone && opt.onDone(ok, ansText()); return;
        }
        if (ok) {
            fb.innerHTML = cheer() + (hinted ? '' : ' <span class="solo">★ sans indice</span>'); $('.ex-corr', host).hidden = false;
            $$('.opt.sel', host).forEach(x => { x.classList.remove('sel'); x.classList.add('good'); });
        } else {
            fb.innerHTML = tries >= 2 ? `<b>Toujours pas.</b>${extra} Ouvre la correction, lis-la ligne par ligne : l'exercice reste dans ta liste « à retravailler ».` : `<b>Pas encore.</b>${extra} Ouvre l'indice, puis réessaie.`;
            $$('.opt.sel', host).forEach(x => x.classList.add('bad'));
        }
        paint();
    }
    $$('[data-a]', host).forEach(b => b.onclick = () => {
        const a = b.dataset.a;
        if (a === 'check') check();
        else if (a === 'hint') { const h = $('.ex-hint', host); h.hidden = !h.hidden; hinted = true; }
        else if (a === 'calc') { window.Calc && Calc.open(); }
        else if (a === 'redo') { delete S.ex[ex.id]; save(); renderEx(ex, host, opt); }
        else { const c = $('.ex-corr', host); c.hidden = !c.hidden; if (!c.hidden && !stOf(ex.id)) { setSt('retry'); paint(); } }
    });
    $$('input', host).forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') check(); }));
}
function reviewCard(ex, rec, host, showCorr) {
    host.className = 'card ex'; host.dataset.st = rec.ok ? 'ok' : 'retry';
    host.innerHTML = `${exHead(ex)}<div class="ex-fb ${rec.ok ? 'ok' : 'ko'}"><b>Ta réponse :</b> ${rec.ans}${rec.ok ? ' — juste.' : showCorr ? '' : ' — à revoir à la fin.'}</div>
      ${showCorr ? `<div class="ex-corr"><b>Correction</b><ol>${corrOf(ex).map(c => `<li>${c}</li>`).join('')}</ol></div>` : ''}`;
}

/* Série de questions : Précédent (relecture) / Suivant (verrouillé tant que non vérifié), reprise possible. */
function runner(box, o) {
    const R = o.resume || { kind: o.kind, items: o.items ? o.items.slice() : [], k: 0, recs: [] };
    if (o.extra) Object.assign(R, o.extra);
    const infinite = !!o.make; let view = Math.min(R.k, infinite ? R.k : R.items.length);
    const persist = () => { if (o.persist) { S.run = R; save(); } };
    const topHtml = () => o.top ? o.top(R) : `<span class="dots">${R.items.map((q, i) => `<i class="${i < R.k ? (R.recs[i].ok ? 'ok' : 'ko') : ''}${i === view ? ' cur' : ''}"></i>`).join('')}</span>`;
    function draw() {
        if (!infinite && view >= R.items.length) { if (o.persist) { S.run = null; save(); } return o.onEnd(R); }
        if (infinite && view >= R.items.length) R.items.push(o.make(R));
        const ex = makeItem(R.items[view]), done = view < R.k, last = !infinite && view === R.items.length - 1;
        box.innerHTML = `<div class="fc-top"><span>Question ${view + 1}${infinite ? '' : ' / ' + R.items.length}</span><span id="rq-top">${topHtml()}</span></div><div id="rq"></div>
          <div class="rq-nav"><button class="btn ghost" id="rq-prev" ${view === 0 ? 'disabled' : ''}>← Précédent</button><button class="btn primary" id="rq-next" ${done ? '' : 'disabled'}>${last ? (o.endLabel || 'Voir le résultat') : 'Suivant →'}</button></div>
          ${done ? '' : '<p class="note center" id="rq-lock">Valide ta réponse pour passer à la suite.</p>'}`;
        if (done) reviewCard(ex, R.recs[view], $('#rq'), o.mode !== 'exam');
        else renderEx(ex, $('#rq'), { mode: o.mode, onDone: (ok, ans) => {
            R.recs[view] = { ok, ans }; R.k = view + 1; o.onAnswer && o.onAnswer(ok, R); persist();
            $('#rq-next').disabled = false; const l = $('#rq-lock'); if (l) l.remove(); $('#rq-top').innerHTML = topHtml();
        } });
        $('#rq-prev').onclick = () => { if (view > 0) { view--; draw(); } };
        $('#rq-next').onclick = () => { if (view < R.k) { view++; draw(); window.scrollTo(0, 0); } };
    }
    persist(); draw();
}
function vExos(sub) {
    if (sub === 'express') return vExpress();
    const retry = retryList(), keys = Object.keys(THEMES);
    if (!sub || (sub !== 'R' && !THEMES[sub])) {
        const s = stats();
        app.innerHTML = `<h1>Exercices</h1><p class="sub">${EX.length} exercices corrigés, plus des questions express qui changent à chaque fois.</p>
        <div class="card total">${meter(s.exos)}<span class="solo" title="réussis sans indice">★ ${nSolo()}</span></div>
        <p class="note">★ = réussi sans ouvrir l'indice. L'indice ne donne jamais la réponse : s'en servir, c'est déjà travailler.</p>
        ${HASGEN ? `<a class="row hot2" href="#exos/express"><span class="num">⚡</span><span class="row-t"><b>Entraînement express</b><small>Petites questions mélangées, valeurs nouvelles à chaque fois · ${S.express} réussie${S.express > 1 ? 's' : ''}</small></span><span class="go">→</span></a>` : ''}
        ${retry.length ? `<a class="row hot" href="#exos/R"><span class="num">↻</span><span class="row-t"><b>À retravailler</b><small>${plur(retry.length, 'exercice')} à refaire</small></span><span class="go">→</span></a>` : ''}
        <div class="list">${keys.map(k => { const l = EX.filter(e => e.t === k), ok = l.filter(e => stOf(e.id) === 'ok').length; return `<a class="row" href="#exos/${k}"><span class="row-t"><b>${THEMES[k].nom}</b><small>${plur(l.length, 'exercice')}</small></span><span class="row-m">${meter([ok, l.length])}</span></a>`; }).join('')}</div>`;
        return;
    }
    const list = sub === 'R' ? retry : EX.filter(e => e.t === sub), nx = sub === 'R' ? null : keys[keys.indexOf(sub) + 1];
    app.innerHTML = `${crumb('exos', 'Exercices', sub === 'R' ? 'À retravailler' : THEMES[sub].nom)}<h1>${sub === 'R' ? 'À retravailler' : THEMES[sub].nom}</h1>
    ${list.length ? '' : '<p class="sub">Plus rien à refaire ici. Liste vidée.</p>'}<div id="exlist"></div>
    <div class="pn"><a class="btn ghost" href="#exos">← Tous les thèmes</a>${nx ? `<a class="btn ghost" href="#exos/${nx}">${THEMES[nx].nom} →</a>` : HASGEN ? '<a class="btn ghost" href="#exos/express">Entraînement express →</a>' : ''}</div>`;
    const box = $('#exlist');
    list.forEach(ex => { const d = document.createElement('div'); box.appendChild(d); renderEx(ex, d); });
}
function vExpress() {
    app.innerHTML = `${crumb('exos', 'Exercices', 'Express')}<h1>Entraînement express</h1><p class="sub">Des petites questions, jamais deux fois les mêmes valeurs. Une tentative, puis la correction.</p><div id="run"></div>`;
    if (!HASGEN) { $('#run').innerHTML = '<p class="sub">Indisponible pour le moment.</p>'; return; }
    let lastG = -1;
    runner($('#run'), { kind: 'express', mode: 'once', make: () => { let g; do g = ri(0, GEN.length - 1); while (GEN.length > 1 && g === lastG); lastG = g; return { g, seed: rseed() }; },
        top: () => `Réussies : <b>${S.express}</b>`, onAnswer: ok => { if (ok) { S.express++; save(); } } });
}

/* ================= ACCUEIL ================= */
function nextAction() {
    const s = stats(), unread = CH.findIndex(c => !S.read[c.id]), any = s.cours[0] + s.exos[0] + s.flash[0] + s.lab[0] > 0;
    const due = FL.filter((f, i) => S.fl[i] && flDue(i)).length, retry = retryList().length, keys = Object.keys(THEMES);
    if (any && S.daily[dayNum()] === undefined) return { href: '#jour', t: 'Le défi du jour', s: '5 questions mélangées, 3 minutes' };
    if (unread >= 0) return { href: '#cours/' + (unread + 1), t: unread ? 'Continuer le cours' : 'Commencer le cours', s: `Chapitre ${unread + 1} — ${CH[unread].title}` };
    if (retry) return { href: '#exos/R', t: 'Reprendre ce qui reste à retravailler', s: plur(retry, 'exercice') };
    if (due) return { href: '#controle/cartes', t: 'Les cartes du jour', s: `${plur(due, 'carte')} à revoir` };
    const th = keys.find(k => EX.some(e => e.t === k && stOf(e.id) !== 'ok'));
    if (S.best === null) return { href: '#controle/blanc', t: 'Le contrôle blanc', s: `${BLANC.length} questions, noté sur 20` };
    if (th) return { href: '#exos/' + th, t: 'Encore quelques exercices', s: THEMES[th].nom };
    return { href: '#controle/fiche', t: 'Relire la fiche récap', s: `Tout l'essentiel sur un écran` };
}
function vHome() {
    const s = stats(), d = daysLeft(), p = pctAll(), h = new Date().getHours(), na = nextAction();
    const hello = h < 5 ? 'Encore debout ?' : h < 12 ? 'Bonjour.' : h < 18 ? 'Bon après-midi.' : 'Bonsoir.';
    let msg;
    if (d === 0) msg = `C'est aujourd'hui. La fiche récap, les vérifications, et tu y vas. Le travail est fait.`;
    else if (p === 0) msg = `${d ? `Le contrôle est dans ${plur(d, 'jour')}. ` : ''}Tout est ici : le cours, les méthodes, les exercices. On commence par le début, tranquillement.`;
    else if (d === 1) msg = `C'est demain. Déjà ${p} % du parcours. Aujourd'hui : méthodes, contrôle blanc, cartes mémoire.`;
    else if (p < 30) msg = `Déjà ${p} % du parcours. Un petit pas de plus aujourd'hui, et ça avance vite.`;
    else if (p < 70) msg = `${p} % du parcours. Le plus dur est derrière toi, continue sur ta lancée.`;
    else if (p < 100) msg = `${p} % ! Il ne reste presque rien. Garde les cartes mémoire et le contrôle blanc pour la fin.`;
    else msg = `Tout est fait. Vraiment tout. Chapeau.`;
    const nd = Object.keys(S.days).length, due = FL.filter((f, i) => S.fl[i] && flDue(i)).length, got = BADGES.filter(b => S.badges[b.id]);
    const tile = (href, t, sub, m, cls) => `<a class="tile ${cls}" href="#${href}"><h3>${t}</h3><p>${sub}</p>${m ? `<div class="tile-m">${meter(m)}</div>` : ''}</a>`;
    app.innerHTML = `
    <section class="hero">
      ${figPrisme(true)}
      <h1>La lumière.<br><span class="grad">Tout comprendre.</span></h1>
      <div class="hello"><div class="lumi-w">${lumi(p >= 70 ? 'wow' : 'ok')}</div><div class="bubble"><b>${hello}</b> ${msg}</div></div>
      <a class="next" href="${na.href}"><small>Prochaine étape</small><b>${na.t}</b><span>${na.s}</span><i>→</i></a>
      <div class="chips-info">
        ${d !== null ? `<a class="count" href="#controle">${d === 0 ? `Contrôle aujourd'hui` : d === 1 ? 'Contrôle demain' : `Contrôle dans ${d} jours`}</a>` : '<a class="count" href="#controle">Régler la date du contrôle</a>'}
        ${nd > 1 ? `<span class="count c2">${nd}ᵉ jour de révision</span>` : ''}
        ${due ? `<a class="count c3" href="#controle/cartes">${plur(due, 'carte')} à revoir</a>` : ''}
        ${S.last ? `<a class="count c4" href="${S.last}">Reprendre où j'en étais</a>` : ''}
      </div>
    </section>
    <section class="tiles">
      ${tile('cours', 'Cours', `${CH.length} notions illustrées, une question pour vérifier chacune`, s.cours, 't1')}
      ${tile('atelier', 'Atelier', 'Fais bouger les rayons, les spectres, les couleurs', s.lab, 't2')}
      ${tile('methodes', 'Méthodes', 'Les recettes : « si je vois ça, je fais ça »', null, 't3')}
      ${tile('exos', 'Exercices', `${EX.length} exercices corrigés et des questions express`, s.exos, 't4')}
      ${tile('jour', 'Défi du jour', S.daily[dayNum()] !== undefined ? `Fait aujourd'hui : ${S.daily[dayNum()]} / 5` : '5 questions mélangées, 3 minutes', null, 't6')}
      ${tile('controle', 'Avant le contrôle', 'Fiche récap, cartes mémoire, contrôle blanc', s.flash, 't5')}
    </section>
    <a class="strip" href="#recompenses"><span><b>Récompenses</b> ${got.length} / ${BADGES.length}</span><span class="strip-ic">${got.slice(-7).map(b => b.ic).join(' ') || 'La première arrive vite'}</span><i>→</i></a>
    <p class="center share-line">Ça peut servir à quelqu'un de ta classe ? ${shareBtn('Partager')}</p>`;
}
function vBadges() {
    const got = BADGES.filter(b => S.badges[b.id]).length;
    app.innerHTML = `${crumb('accueil', 'Accueil', 'Récompenses')}<h1>Récompenses</h1><p class="sub">${got} sur ${BADGES.length}. Elles se débloquent toutes seules en travaillant.</p>
    <div class="badges">${BADGES.map(b => `<div class="badge-c ${S.badges[b.id] ? 'on' : ''} ${b.mega ? 'mega-b' : ''}"><div class="b-ic">${S.badges[b.id] ? b.ic : '?'}</div><b>${b.t}</b><small>${b.d}</small></div>`).join('')}</div>
    <p class="center">${shareBtn()}</p>`;
}

/* ================= COURS ================= */
function vCours(sub) {
    if (!sub || !CH[+sub - 1]) {
        app.innerHTML = `<h1>Le cours</h1><p class="sub">${CH.length} notions. Lis, manipule le schéma, réponds à la question.</p>
        <div class="list">${CH.map((c, k) => `<a class="row" href="#cours/${k + 1}"><span class="num">${k + 1}</span><span class="row-t"><b>${c.title}</b><small>${c.sub}</small></span><span class="row-s">${S.read[c.id] ? '<i class="pill ok">compris</i>' : ''}${S.quick[c.id] ? '<i class="pill ok">question ✓</i>' : ''}</span></a>`).join('')}</div>`;
        return;
    }
    const k = +sub - 1, c = CH[k], keep = (typeof KEEP !== 'undefined' && KEEP[c.id]) || null;
    app.innerHTML = `${crumb('cours', 'Cours', `${k + 1} / ${CH.length}`)}
    <article class="chapter"><h1><span class="num">${k + 1}</span>${c.title}</h1><p class="sub">${c.sub}</p>
    ${c.html()}
    ${keep ? `<div class="keep"><div class="keep-h">Je retiens</div><ul>${keep.map(x => `<li>${x}</li>`).join('')}</ul></div>` : ''}
    <div class="card quick" id="quick"></div>
    <div class="chap-actions"><button class="btn ${S.read[c.id] ? 'done' : 'primary'}" id="readBtn">${S.read[c.id] ? '✓ Compris' : `J'ai compris`}</button></div>
    <div class="pn">${k > 0 ? `<a class="btn ghost" href="#cours/${k}">← ${CH[k - 1].title}</a>` : '<span></span>'}${k < CH.length - 1 ? `<a class="btn ghost" href="#cours/${k + 2}">${CH[k + 1].title} →</a>` : `<a class="btn ghost" href="#methodes">Les méthodes →</a>`}</div>
    </article>`;
    $('#readBtn').onclick = e => {
        S.read[c.id] = !S.read[c.id]; save(); e.target.className = 'btn ' + (S.read[c.id] ? 'done pulse' : 'primary'); e.target.textContent = S.read[c.id] ? '✓ Compris' : `J'ai compris`;
        if (S.read[c.id]) toast(k < CH.length - 1 ? 'Noté. Chapitre suivant quand tu veux.' : 'Cours terminé. Place aux méthodes.');
    };
    const host = $('#quick'), q = c.quick;
    host.innerHTML = `<div class="quick-h">Vérifie en 10 secondes</div><div class="ex-q">${q.q}</div><div class="opts">${shuffled(q.opts.length).map(i => `<button class="opt" data-i="${i}">${q.opts[i]}</button>`).join('')}</div><div class="ex-fb" hidden></div>`;
    if (QH[c.id]) $('.opts', host).insertAdjacentHTML('afterend', hintD(QH[c.id]));
    const fb = $('.ex-fb', host), good = t => { $(`.opt[data-i="${q.a}"]`, host).classList.add('good'); fb.hidden = false; fb.className = 'ex-fb ok'; fb.innerHTML = (t || '<b>Exact.</b>') + ' ' + q.why; };
    $$('.opt', host).forEach(b => b.onclick = () => {
        $$('.opt', host).forEach(x => x.classList.remove('good', 'bad'));
        host.classList.remove('pulse', 'shake'); void host.offsetWidth;
        if (+b.dataset.i === q.a) { good(cheer()); host.classList.add('pulse'); if (!S.quick[c.id]) { S.quick[c.id] = true; save(); } }
        else { serie = 0; host.classList.add('shake'); b.classList.add('bad'); fb.hidden = false; fb.className = 'ex-fb ko'; fb.innerHTML = 'Pas encore. Relis les encadrés au-dessus, puis réessaie.'; }
    });
    if (S.quick[c.id]) good();
    chapterFx(c);
}
/* Figures manipulables de certains chapitres */
function chapterFx(c) {
    const fig = $('.chapter .fig'); if (!fig) return;
    if (c.id === 'sources') {
        fig.insertAdjacentHTML('beforeend', `<div class="fx"><button class="btn ghost small" id="fx-sun">Éteindre le Soleil</button><p class="cap" id="fx-cap">Le Soleil éclaire la Lune, qui renvoie sa lumière vers l'œil.</p></div>`);
        $('#fx-sun').onclick = e => { const off = $('svg', fig).classList.toggle('off'); e.target.textContent = off ? 'Rallumer le Soleil' : 'Éteindre le Soleil'; $('#fx-cap').textContent = off ? `Soleil éteint : la Lune n'a plus rien à renvoyer. On ne la voit plus.` : `Le Soleil éclaire la Lune, qui renvoie sa lumière vers l'œil.`; };
    } else if (c.id === 'rectiligne') {
        fig.innerHTML = `<div id="fx-svg">${figOmbre(130)}</div><label class="rng">Déplace l'objet<input type="range" id="fx-r" min="75" max="215" value="130"></label><p class="cap" id="fx-cap"></p>`;
        const u = () => { const x = +$('#fx-r').value; $('#fx-svg').innerHTML = figOmbre(x); $('#fx-cap').textContent = x < 110 ? `Objet près de la source : l'ombre est immense.` : x > 180 ? `Objet près de l'écran : l'ombre a presque sa taille.` : `Les rayons qui frôlent l'objet dessinent le bord de l'ombre.`; };
        $('#fx-r').oninput = u; u();
    } else if (c.id === 'reflexion') {
        fig.innerHTML = `<div id="fx-svg"></div><label class="rng">Angle d'incidence i₁ = <b id="fx-v"></b><input type="range" id="fx-r" min="5" max="80" value="35"></label><p class="cap">Quel que soit l'angle, r reste égal à i₁.</p>`;
        const u = () => { const i = +$('#fx-r').value; $('#fx-svg').innerHTML = rayDiagram({ mirror: true, i, anim: true }); $('#fx-v').textContent = `${i}° → r = ${i}°`; };
        $('#fx-r').oninput = u; u();
    } else if (c.id === 'longueur') {
        const f = $('.chapter .specnames'); if (!f) return;
        f.parentNode.insertAdjacentHTML('afterend', `<div class="card lab"><label class="rng">Longueur d'onde λ = <b id="fx-v"></b><input type="range" id="fx-r" min="300" max="900" step="5" value="550"></label><div class="swatch" id="fx-sw"></div><p class="cap" id="fx-cap"></p></div>`);
        const u = () => { const w = +$('#fx-r').value, n = colorName(w), vis = w >= 400 && w <= 800; $('#fx-v').textContent = w + ' nm'; const sw = $('#fx-sw'); sw.style.background = vis ? wl2rgb(w, 1, true) : 'repeating-linear-gradient(45deg,#1b1b1b,#1b1b1b 8px,#2a2a2a 8px,#2a2a2a 16px)'; sw.textContent = vis ? n : 'invisible'; sw.style.color = vis ? '#000' : '#bbb'; $('#fx-cap').textContent = vis ? `Entre 400 et 800 nm : visible, c'est du ${n}.` : w < 400 ? `Moins de 400 nm : ultraviolet. L'œil ne le voit pas.` : `Plus de 800 nm : infrarouge. L'œil ne le voit pas.`; };
        $('#fx-r').oninput = u; u();
    }
}

/* ================= ATELIER ================= */
const LABS = [
    { k: 'refraction', title: 'Simulateur de réfraction', d: `Change les milieux et l'angle, le rayon et le calcul suivent`, fn: labRefraction },
    { k: 'guide', title: 'Réfraction guidée', d: 'Snell-Descartes en 5 étapes, validées une par une', fn: labGuide },
    { k: 'schema', title: 'Schéma à trous', d: 'Touche le bon élément sur le schéma', fn: labSchema },
    { k: 'puissances', title: 'Puissances de 10', d: 'Additionner ou multiplier les exposants ? Entraînement sans fin', fn: labPow },
    { k: 'spectres', title: 'Spectres', d: 'Corps chaud, gaz, filtre. Et les étoiles mystères', fn: labSpectres },
    { k: 'voyage', title: 'Le voyage de la lumière', d: 'Combien de temps pour atteindre la Lune, le Soleil, une étoile ?', fn: labVoyage },
    { k: 'couleurs', title: 'Couleurs', d: `Allume les lumières, choisis l'objet, regarde ce qu'on voit`, fn: labCouleurs }
].concat(window.EXTRA_LABS || []);
function vAtelier(sub) {
    const i = LABS.findIndex(l => l.k === sub);
    if (i >= 0) {
        LABS[i].fn(); const n = LABS[(i + 1) % LABS.length];
        app.insertAdjacentHTML('beforeend', `<div class="pn"><a class="btn ghost" href="#atelier">← Tous les ateliers</a><a class="btn ghost" href="#atelier/${n.k}">${n.title} →</a></div>`);
        return;
    }
    app.innerHTML = `<h1>L'atelier</h1><p class="sub">Ici on manipule. Ce sont les mêmes lois que dans le cours, mais tu les vois bouger.</p>
    <div class="list">${LABS.map(l => `<a class="row" href="#atelier/${l.k}"><span class="row-t"><b>${l.title}</b><small>${l.d}</small></span><span class="go">→</span></a>`).join('')}</div>
    <div class="card"><h3>Défis</h3><ul class="defis">${DEFIS.map(d => `<li class="${S.lab[d.id] ? 'ok' : ''}">${d.txt}</li>`).join('')}</ul></div>`;
}
function winDefi(id) { if (!S.lab[id]) { S.lab[id] = true; save(); toast('Défi réussi'); confetti(innerWidth / 2, innerHeight / 2, 24); return true; } return false; }

function labRefraction() {
    const o = MILIEUX.map((m, k) => `<option value="${k}">${m[0]} (n = ${fr(m[1])})</option>`).join('');
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Réfraction')}<h1>Simulateur de réfraction</h1><p class="sub">Change les milieux et l'angle : le rayon et le calcul se mettent à jour.</p>
    <div class="lab-grid"><div class="card lab"><div class="fig" id="rf-fig"></div>
      <div class="ctrl"><label>Milieu 1 <small>d'où vient la lumière</small><select id="rf-1">${o}</select></label><label>Milieu 2 <small>où elle entre</small><select id="rf-2">${o}</select></label></div>
      <label class="rng">Angle d'incidence i₁ = <b id="rf-iv"></b><input type="range" id="rf-i" min="0" max="89" value="20"></label>
      <div class="readout" id="rf-out"></div></div>
    <div><div class="card"><h3>Le calcul, en direct</h3><div id="rf-calc" class="calc"></div></div>
    <div class="card"><h3>4 défis</h3><ul class="defis" id="rf-defis"></ul>${hintD(`Défi 2 : pense au cas particulier du cours, celui de la normale. Défi 3 : dans quel sens faut-il traverser pour entrer dans un indice plus petit ? Défi 4 : surveille la valeur de sin(i₂) dans le calcul pendant que tu augmentes l'angle.`)}</div></div></div>`;
    const s1 = $('#rf-1'), s2 = $('#rf-2'), rg = $('#rf-i'); s2.value = 1;
    const defis = () => $('#rf-defis').innerHTML = DEFIS.slice(0, 4).map(d => `<li class="${S.lab[d.id] ? 'ok' : ''}">${d.txt}</li>`).join('');
    function u() {
        const a = +s1.value, b = +s2.value, i = +rg.value, n1 = MILIEUX[a][1], n2 = MILIEUX[b][1];
        const s = n1 * Math.sin(i * RAD) / n2, tot = s > 1, i2 = tot ? null : Math.asin(s) / RAD;
        $('#rf-fig').innerHTML = rayDiagram({ n1, n2, i, m1: MILIEUX[a][0], m2: MILIEUX[b][0], anim: true });
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

function labGuide() {
    const P = [[0, 1, 60], [0, 2, 60], [1, 0, 40], [2, 0, 35], [0, 3, 60], [1, 2, 60]];
    const art = m => (m === 'air' || m === 'eau' ? `l'` : 'le ') + m;
    let sc, step, done;
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Réfraction guidée')}<h1>Réfraction guidée</h1><p class="sub">La recette de Snell-Descartes, une étape à la fois. Chaque étape doit être validée pour ouvrir la suivante.</p><div id="gd"></div>`;
    function newSc() {
        const p = P[ri(0, P.length - 1)], i = 5 * ri(4, p[2] / 5), n1 = MILIEUX[p[0]][1], n2 = MILIEUX[p[1]][1], x = n1 * Math.sin(i * RAD), s = x / n2;
        sc = { m1: MILIEUX[p[0]][0], m2: MILIEUX[p[1]][0], i, n1, n2, x, s, i2: Math.asin(s) / RAD }; step = 0; done = []; draw();
    }
    const near = (v, t, tol) => Math.abs(v - t) <= tol;
    const STEPS = () => [
        { q: `Le milieu 1 est celui d'où <u>vient</u> la lumière. Que vaut n₁ ?`, pick: [fr(Math.min(sc.n1, sc.n2)), fr(Math.max(sc.n1, sc.n2))], ok: v => v === fr(sc.n1), wrong: () => `n₁ est l'indice du milieu d'où vient la lumière : ici ${art(sc.m1)}.`, show: `n₁ = ${fr(sc.n1)} (${sc.m1}), n₂ = ${fr(sc.n2)} (${sc.m2})` },
        { q: `Calcule n₁ × sin(i₁) = ${fr(sc.n1)} × sin(${sc.i}°).`, ok: v => near(v, sc.x, 0.006), wrong: v => near(v, sc.n1 * Math.sin(sc.i), 0.006) ? `Ta calculatrice est en radians. Passe-la en degrés.` : near(v, Math.sin(sc.i * RAD), 0.006) && sc.n1 !== 1 ? `Tu as oublié de multiplier par n₁.` : `Tape ${fr(sc.n1)} × sin(${sc.i}), en degrés, et garde 3 chiffres après la virgule.`, show: `n₁ × sin(i₁) = ${fr(sc.x, 3)}` },
        { q: `Isole sin(i₂) : divise le résultat par n₂ = ${fr(sc.n2)}.`, ok: v => near(v, sc.s, 0.006), wrong: v => near(v, sc.x * sc.n2, 0.006) && sc.n2 !== 1 ? `Il faut diviser par n₂, pas multiplier.` : `sin(i₂) = ${fr(sc.x, 3)} ÷ ${fr(sc.n2)}.`, show: `sin(i₂) = ${fr(sc.s, 3)}` },
        { q: `Repasse à l'angle avec la touche sin⁻¹ : que vaut i₂, en degrés ?`, ok: v => near(v, sc.i2, 0.6), wrong: v => near(v, sc.s, 0.02) ? `Ça, c'est encore le sinus. Il reste à taper sin⁻¹(${fr(sc.s, 3)}).` : `Tape sin⁻¹(${fr(sc.s, 3)}), calculatrice en degrés.`, show: `i₂ = ${fr(sc.i2, 1)}°`, unit: '°' },
        { q: `Vérification : i₁ = ${sc.i}° et i₂ = ${fr(sc.i2, 1)}°. Par rapport à la normale, le rayon s'est…`, pick: ['rapproché', 'écarté'], ok: v => v === (sc.n2 > sc.n1 ? 'rapproché' : 'écarté'), wrong: () => `Compare i₂ et i₁ : un angle plus petit, c'est un rayon plus près de la normale.`, show: `n₂ ${sc.n2 > sc.n1 ? '>' : '<'} n₁ : le rayon s'est ${sc.n2 > sc.n1 ? 'rapproché' : 'écarté'} de la normale. Cohérent. ✔` }
    ];
    function draw(msg) {
        const st = STEPS(), end = step >= st.length, cur = st[step];
        $('#gd').innerHTML = `<div class="card lab"><p class="ex-q">Un rayon passe de ${art(sc.m1)} (n = ${fr(sc.n1)}) dans ${art(sc.m2)} (n = ${fr(sc.n2)}) avec un angle d'incidence i₁ = ${sc.i}°. Calcule l'angle de réfraction i₂.</p>
          <ol class="gd-steps">${done.map(d => `<li class="ok">${d}</li>`).join('')}${end ? '' : `<li class="cur"><div>${cur.q}</div>${hintD(GH[step])}${cur.pick ? `<div class="chips">${cur.pick.map(o => `<button class="chip" data-v="${o}">${o}</button>`).join('')}</div>` : `<div class="inp"><input type="text" inputmode="decimal" autocomplete="off" id="gd-in" placeholder="ta réponse"><span class="unit">${cur.unit || ''}</span><button class="btn primary" id="gd-ok">Valider</button><button class="btn ghost" id="gd-calc">Calculatrice</button></div>`}${msg ? `<div class="ex-fb ko">${msg}</div>` : ''}</li>`}</ol>
          ${end ? `<div class="fig">${rayDiagram({ n1: sc.n1, n2: sc.n2, i: sc.i, m1: sc.m1, m2: sc.m2, reflect: false, anim: true })}</div><div class="ex-fb ok"><b>Réfraction menée au bout.</b> ${S.guide < 3 ? `${S.guide} sur 3 pour le défi.` : 'Les 5 étapes, dans cet ordre, à chaque fois.'}</div><div class="ex-actions"><button class="btn primary" id="gd-new">Scénario suivant</button></div>` : `<p class="note">Étape ${step + 1} sur ${st.length}</p>`}</div>`;
        if (end) { $('#gd-new').onclick = newSc; return; }
        const go = v => {
            if (cur.ok(v)) { done.push(cur.show); step++; serie++; if (step >= st.length) { S.guide++; save(); if (S.guide >= 3) winDefi('guide'); } draw(); }
            else { serie = 0; draw(cur.wrong(v)); const g = $('#gd .gd-steps .cur'); g && g.classList.add('shake'); }
        };
        if (cur.pick) $$('#gd [data-v]').forEach(b => b.onclick = () => go(b.dataset.v));
        else { const inp = $('#gd-in'); const sub = () => { const v = num(inp.value); if (isNaN(v)) { toast('Écris un nombre.'); return; } go(v); }; $('#gd-ok').onclick = sub; inp.addEventListener('keydown', e => { if (e.key === 'Enter') sub(); }); $('#gd-calc').onclick = () => window.Calc && Calc.open(); }
    }
    newSc();
}

function labSchema() {
    const NAMES = { dioptre: 'le dioptre (la surface de séparation)', normale: 'la normale', incident: 'le rayon incident', reflechi: 'le rayon réfléchi', refracte: 'le rayon réfracté', point: `le point d'incidence I` };
    let order, k, errs, cfg;
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Schéma à trous')}<h1>Schéma à trous</h1><p class="sub">Touche l'élément demandé, directement sur le schéma.</p><div class="card lab"><div class="sc-ask" id="sc-ask"></div><div class="fig" id="sc-fig"></div><div id="sc-fb"></div></div>`;
    function start() { order = mix(Object.keys(NAMES)); k = 0; errs = 0; const up = Math.random() < 0.6; cfg = up ? { n1: 1, n2: 1.33, i: ri(30, 55), m1: 'air', m2: 'eau' } : { n1: 1.33, n2: 1, i: ri(22, 38), m1: 'eau', m2: 'air' }; $('#sc-fig').innerHTML = rayDiagram(Object.assign({ hit: true, angles: false }, cfg)); bind(); draw(); }
    function bind() {
        $$('#sc-fig .hit').forEach(h => h.onclick = () => {
            if (k >= order.length) return; const t = h.dataset.k;
            if (t === order[k]) { h.classList.add('found'); k++; draw(cheer(), 'ok'); }
            else { errs++; serie = 0; h.classList.add('miss'); setTimeout(() => h.classList.remove('miss'), 500); draw(`Ça, c'est ${NAMES[t]}. Cherche encore.`, 'ko'); }
        });
    }
    function draw(msg, cls) {
        const end = k >= order.length;
        $('#sc-ask').innerHTML = end ? '' : `<small>${k + 1} / ${order.length}</small>Touche <b>${NAMES[order[k]]}</b>${hintD(SH[order[k]])}`;
        $('#sc-fb').innerHTML = end ? `<div class="ex-fb ok"><b>${errs ? 'Terminé.' : 'Sans une seule erreur.'}</b> ${errs ? `${plur(errs, 'hésitation')} : refais un tour pour viser le sans-faute.` : 'Le vocabulaire du schéma est acquis.'}</div><div class="ex-actions"><button class="btn primary" id="sc-new">Nouveau schéma</button></div>` : msg ? `<div class="ex-fb ${cls}">${msg}</div>` : '';
        if (end) { if (!errs) winDefi('schema'); $('#sc-new').onclick = start; }
    }
    start();
}

function labSpectres() {
    let src = 'chaud', T = 3000, gas = 'H', mode = 'emission', filt = 'R', star = null, pick = new Set();
    const FILT = { R: ['rouge', [[620, 800]]], V: ['vert', [[495, 555]]], B: ['bleu', [[430, 495]]] };
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
            t.innerHTML = `<p><b>Spectre de raies d'${mode === 'emission' ? 'émission' : 'absorption'}</b> — ${GAZ[gas].nom}.<br>${GAZ[gas].raies.length > 1 ? 'Raies' : 'Raie'} à ${GAZ[gas].raies.join(' – ')} nm. ${mode === 'emission' ? 'Passe en « lumière blanche à travers le gaz » : les raies noires tombent exactement aux mêmes endroits.' : 'Les raies noires sont aux mêmes longueurs d\'onde que les raies d\'émission.'}</p>`;
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
        const lines = star.flatMap(k => GAZ[k].raies), won = res === true;
        $('#st-box').innerHTML = `<div class="fig"><div class="cap l">Spectre de l'étoile</div>${spectrum({ mode: 'absorption', lines })}</div>
          <div class="refs">${POOL.map(k => `<div class="ref"><span>${GAZ[k].nom}</span>${spectrum({ mode: 'emission', lines: GAZ[k].raies, axis: false, h: 18 })}</div>`).join('')}</div>
          <div class="chips">${POOL.map(k => `<button class="chip ${pick.has(k) ? 'on' : ''}" data-k="${k}" ${won ? 'disabled' : ''}>${GAZ[k].nom}</button>`).join('')}</div>
          ${won ? '' : hintD(`Prends les éléments un par un. Repère la première raie de l'élément et cherche-la dans le spectre de l'étoile : si elle manque, élimine-le.`)}<div class="ex-actions">${won ? '<button class="btn primary" id="st-new">Nouvelle étoile</button>' : '<button class="btn primary" id="st-ok">Vérifier</button>'}<span class="meter-t">${plur(S.star, 'étoile')} identifiée${S.star > 1 ? 's' : ''}</span></div>
          ${won ? `<div class="ex-fb ok">${cheer()} ${star.map((k, n) => n ? GAZ[k].nom.toLowerCase() : GAZ[k].nom).join(' et ')} : toutes ${star.length > 1 ? 'leurs' : 'ses'} raies sont dans le spectre.</div>` : res === false ? '<div class="ex-fb ko"><b>Pas encore.</b> Un élément est présent seulement si <u>toutes</u> ses raies sont là. Vérifie raie par raie.</div>' : ''}`;
        $$('[data-k]', $('#st-box')).forEach(b => b.onclick = () => { pick.has(b.dataset.k) ? pick.delete(b.dataset.k) : pick.add(b.dataset.k); b.classList.toggle('on'); });
        if (won) { $('#st-new').onclick = newStar; return; }
        $('#st-ok').onclick = () => {
            if (!pick.size) { toast('Coche au moins un élément.'); return; }
            const ok = pick.size === star.length && star.every(k => pick.has(k));
            if (ok) { S.star++; save(); if (S.star >= 3) winDefi('star'); } else serie = 0;
            drawStar(ok);
        };
    }
    draw(); newStar();
}

function labPow() {
    let streak = 0;
    app.innerHTML = `${crumb('atelier', 'Atelier', 'Puissances de 10')}<h1>Puissances de 10</h1><p class="sub">La seule question à se poser : qu'est-ce qui relie les deux puissances ?</p>
    <div class="card"><table class="tbl"><tr><th>Je vois</th><th>Exposants</th><th>Exemple</th></tr>
      <tr><td>${p10('a')} <b>×</b> ${p10('b')}</td><td class="c-add"><b>+</b></td><td>${p10(2)} × ${p10(4)} = ${p10(6)}</td></tr>
      <tr><td>${p10('a')} <b>÷</b> ${p10('b')}</td><td class="c-sub"><b>−</b></td><td>${p10(11)} ÷ ${p10(8)} = ${p10(3)}</td></tr>
      <tr><td>(${p10('a')})<sup><b>b</b></sup></td><td class="c-mul"><b>×</b></td><td>(${p10(2)})<sup>4</sup> = ${p10(8)}</td></tr></table>
      <p class="note">Avec des nombres devant : les nombres ensemble, les puissances ensemble. (2 × ${p10(2)}) × (2 × ${p10(4)}) = 4 × ${p10(6)}.<br>S'il n'y a pas de nombre devant, laisse la première case vide.</p></div>
    <div id="run"></div>`;
    if (!HASGEN || typeof GEN_POW === 'undefined') { $('#run').innerHTML = '<p class="sub">Entraînement indisponible pour le moment.</p>'; return; }
    runner($('#run'), { kind: 'pow', mode: 'once', make: () => ({ g: GEN_POW, seed: rseed() }),
        top: () => `Série : <b>${streak}</b> · Record : <b>${S.powBest}</b>`,
        onAnswer: ok => { if (ok) { streak++; if (streak > S.powBest) S.powBest = streak; save(); if (streak >= 5) winDefi('pow'); } else streak = 0; } });
}

function labVoyage() {
    const D = [['la Lune', 3.84, 8], ['le Soleil', 1.5, 11], ['Jupiter', 7.8, 11], ['Neptune', 4.5, 12], ['Proxima du Centaure', 3.98, 16]];
    let k = 1;
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
    <div class="lab-grid"><div class="card lab"><h3>1. La lumière qui éclaire</h3><div class="chips" id="cl-l"></div><div class="fig" id="cl-rgb"></div><div class="readout" id="cl-lt"></div></div>
    <div class="card lab"><h3>2. L'objet éclairé</h3><div class="chips" id="cl-o"></div><div class="fig" id="cl-shirt"></div><div class="readout" id="cl-txt"></div></div></div>`;
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
      <ol class="steps-l">${r.steps.map(s => `<li>${s}</li>`).join('')}</ol>${r.fig ? `<div class="fig">${r.fig()}</div>` : ''}${r.ex ? `<div class="exb">${r.ex}</div>` : ''}${r.trap ? `<div class="trap">${r.trap}</div>` : ''}</details>`).join('')}
    <div class="card"><h3>Avant de rendre la copie : ${VERIFS.length} vérifications</h3><ul class="checks">${VERIFS.map(v => `<li>${v}</li>`).join('')}</ul></div>
    <div class="pn"><a class="btn primary" href="#exos">S'entraîner →</a>${THEMES.O ? `<a class="btn ghost" href="#exos/O">Remettre les étapes dans l'ordre →</a>` : ''}</div>`;
    $$('.aig-row').forEach(b => b.onclick = () => { const d = $('#rc' + b.dataset.r); if (!d) return; d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
}

/* ================= DÉFI DU JOUR ================= */
function vJour() {
    const today = dayNum();
    app.innerHTML = `${crumb('accueil', 'Accueil', 'Défi du jour')}<h1>Le défi du jour</h1><p class="sub" id="jr-sub">5 questions mélangées. Une tentative chacune, puis la correction.</p><div id="run"></div>`;
    const box = $('#run');
    const end = n => {
        const s = $('#jr-sub'); s && s.remove();
        box.innerHTML = `<div class="card center"><div class="note-big">${n}<small> / 5</small></div><p>${n === 5 ? 'Sans faute. Rien à ajouter.' : n >= 3 ? 'Solide. Les corrections que tu viens de lire feront le reste.' : 'Ce défi sert justement à repérer ce qui reste à consolider. Les corrections sont le plus important.'}</p><p class="note">Nouveau défi demain. Revenir chaque jour, même trois minutes, c'est ce qui fait retenir.</p>
          <div class="ex-actions center">${HASGEN ? '<a class="btn primary" href="#exos/express">Encore ? Entraînement express</a>' : ''}<a class="btn ghost" href="#accueil">Accueil</a>${shareBtn('Partager')}</div></div>`;
    };
    if (S.daily[today] !== undefined) return end(S.daily[today]);
    const resume = S.run && S.run.kind === 'jour' && S.run.day === today ? S.run : null; let items;
    if (!resume) {
        items = mix(retryList().filter(e => e.type !== 'order')).slice(0, 2).map(e => ({ id: e.id }));
        if (HASGEN) { const g = shuffled(GEN.length); let j = 0; while (items.length < 5) items.push({ g: g[j++ % g.length], seed: rseed() }); }
        else { const rest = mix(EX.filter(e => stOf(e.id) !== 'ok' && e.type !== 'order' && !items.some(i => i.id === e.id))); while (items.length < 5 && rest.length) items.push({ id: rest.pop().id }); }
        items = mix(items);
    }
    runner(box, { kind: 'jour', mode: 'once', items, resume, persist: true, extra: { day: today }, onEnd: R => {
        const n = R.recs.filter(r => r.ok).length; S.daily[today] = n; save(); end(n); window.scrollTo(0, 0); if (n >= 4) confetti();
    } });
}

/* ================= AVANT LE CONTRÔLE ================= */
function vCtrl(sub) {
    if (sub === 'fiche') return vFiche();
    if (sub === 'cartes') return vCartes();
    if (sub === 'blanc') return vBlanc();
    const s = stats(), d = daysLeft(), due = FL.filter((f, i) => flDue(i)).length;
    app.innerHTML = `<h1>Avant le contrôle</h1><p class="sub">${d === null ? 'Indique la date de ton contrôle pour avoir le compte à rebours.' : d === 0 ? `C'est aujourd'hui. La fiche, les vérifications, et c'est parti.` : d === 1 ? `C'est demain. Méthodes, contrôle blanc, cartes mémoire.` : `Encore ${d} jours. Voilà comment t'organiser.`}</p>
    <div class="card date"><label for="examDate">Date de mon contrôle</label><input type="date" id="examDate" value="${S.exam || ''}"></div>
    <div class="list">
      <a class="row" href="#controle/fiche"><span class="row-t"><b>La fiche récap</b><small>Tout l'essentiel sur un écran</small></span><span class="go">→</span></a>
      <a class="row" href="#controle/cartes"><span class="row-t"><b>Cartes mémoire</b><small>${due ? `${plur(due, 'carte')} à voir aujourd'hui` : `Rien à revoir aujourd'hui`} · elles reviennent au bon moment</small></span><span class="row-m">${meter(s.flash)}</span></a>
      <a class="row" href="#controle/blanc"><span class="row-t"><b>Contrôle blanc</b><small>${BLANC.length} questions, noté sur 20${S.best !== null ? ` · meilleure note : ${S.best} / 20` : ''}</small></span><span class="go">→</span></a>
      <a class="row" href="#jour"><span class="row-t"><b>Défi du jour</b><small>${S.daily[dayNum()] !== undefined ? `Fait : ${S.daily[dayNum()]} / 5` : '5 questions mélangées'}</small></span><span class="go">→</span></a>
      <a class="row" href="fiche-lumiere.pdf" target="_blank" rel="noopener"><span class="row-t"><b>La fiche à imprimer</b><small>Cours + méthodes en PDF</small></span><span class="go">↓</span></a>
    </div>
    <div class="card"><h3>Plan de révision</h3><ul class="plan">${PLAN.map((p, i) => `<li><label><input type="checkbox" data-p="${i}" ${S.plan[i] ? 'checked' : ''}><span><b>${p[0]} — ${p[1]}</b><small>${p[2]}</small></span></label></li>`).join('')}</ul></div>
    <div class="card"><h3>Où j'en suis</h3>
      <div class="statl"><span>Cours</span>${meter(s.cours)}</div><div class="statl"><span>Défis de l'atelier</span>${meter(s.lab)}</div>
      <div class="statl"><span>Exercices réussis</span>${meter(s.exos)}</div><div class="statl"><span>Cartes sues</span>${meter(s.flash)}</div></div>
    <p class="center">${shareBtn('Partager le site à ma classe')}</p>
    <p class="reset"><button class="btn ghost small" id="reset">Effacer ma progression</button></p>`;
    $('#examDate').onchange = e => { S.exam = e.target.value; save(); toast(S.exam ? 'Date enregistrée' : 'Date retirée'); route(true); };
    $$('[data-p]').forEach(c => c.onchange = () => { S.plan[c.dataset.p] = c.checked; save(); });
    let armed = false;
    $('#reset').onclick = e => {
        if (!armed) { armed = true; e.target.textContent = 'Tout effacer, vraiment ? Appuie encore une fois'; e.target.classList.add('danger'); return; }
        const th = S.theme, ex = S.exam; try { localStorage.removeItem(KEY); } catch (er) { }
        S = BLANK(); S.theme = th; S.exam = ex; write(); progress(); route(true); toast('Progression effacée');
    };
}
function vFiche() {
    const b = (t, h) => `<div class="fbox"><h4>${t}</h4>${h}</div>`;
    const extra = (window.EXTRA_FICHE || []).map(x => b(x[0], x[1])).join('');
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Fiche récap')}<h1>La fiche récap</h1>
    <div class="fiche">
      ${b('Les valeurs', `c = 3,00 × ${p10(8)} m/s<br>Visible : 400 nm (violet) → 800 nm (rouge)<br>1 nm = ${p10(-9)} m<br>n : air 1,00 · eau 1,33 · verre ≈ 1,5`)}
      ${b('Les formules', `v = ${F('d', 't')} &nbsp; d = v × t &nbsp; t = ${F('d', 'v')}<br>r = i₁<br>n₁ × sin(i₁) = n₂ × sin(i₂)<br>n = ${F('c', 'v')}`)}
      ${b('Puissances de 10', `${p10('a')} × ${p10('b')} = 10<sup>a+b</sup><br>${p10('a')} ÷ ${p10('b')} = 10<sup>a−b</sup><br>(${p10('a')})<sup>b</sup> = 10<sup>a×b</sup>`)}
      ${b('Les mots', `<b>Source primaire</b> : produit sa lumière.<br><b>Objet diffusant</b> : renvoie la lumière reçue.<br><b>Normale</b> : perpendiculaire à la surface en I.<br><b>Dioptre</b> : surface entre deux milieux.<br><b>Réfraction</b> : changement de direction en changeant de milieu.<br><b>Dispersion</b> : séparation des couleurs.<br><b>Monochromatique</b> : une seule radiation.`)}
      ${b('Le sens du rayon', `Indice plus grand → se rapproche de la normale.<br>Indice plus petit → s'écarte de la normale.<br>i₁ = 0° → pas dévié.`)}
      ${b('Les spectres', `<b>Continu</b> : corps chaud. Plus chaud → plus de violet.<br><b>Raies d'émission</b> (fond noir) : gaz excité.<br><b>Raies d'absorption</b> (raies noires) : lumière blanche à travers un gaz.<br><b>Bandes noires larges</b> : filtre, solution.<br>Un élément est présent si <u>toutes</u> ses raies y sont.`)}
      ${b('Le prisme', `Violet : le plus dévié.<br>Rouge : le moins dévié.`)}
      ${b('Couleurs', `Rouge + vert + bleu = blanc.<br>Filtre rouge, vert ou bleu : transmet sa couleur, absorbe les deux autres.<br>Objet rouge, vert ou bleu : diffuse sa couleur. Sans elle → noir.`)}
      ${extra}
    </div>
    <div class="card"><h3>Les ${VERIFS.length} vérifications</h3><ul class="plan">${VERIFS.map((v, i) => `<li><label><input type="checkbox" data-c="${i}" ${S.check[i] ? 'checked' : ''}><span>${v}</span></label></li>`).join('')}</ul></div>
    <div class="pn"><a class="btn ghost" href="#controle">← Avant le contrôle</a><a class="btn ghost" href="#controle/cartes">Cartes mémoire →</a></div>`;
    $$('[data-c]').forEach(c => c.onchange = () => { S.check[c.dataset.c] = c.checked; save(); });
}
/* Cartes mémoire en répétition espacée : une carte sue revient dans 1, 2 puis 4 jours. */
function vCartes() {
    const GAP = [0, 1, 2, 4], today = dayNum(), all = () => FL.map((f, i) => i);
    let queue = mix(all().filter(flDue)), k = 0, flip = false, again = new Set(), free = false;
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Cartes mémoire')}<h1>Cartes mémoire</h1><p class="sub">Réponds dans ta tête, puis retourne la carte. Une carte sue revient dans 1, 2 puis 4 jours ; les autres reviennent tout de suite.</p><div id="fc"></div>`;
    function draw() {
        const box = $('#fc'), known = all().filter(flKnown).length;
        if (k >= queue.length) {
            box.innerHTML = `<div class="card center"><h3>${known} / ${FL.length} cartes sues</h3><p>${queue.length ? 'Séance terminée.' : `Rien à revoir aujourd'hui.`} Les prochaines cartes reviennent demain : c'est l'espacement qui fait retenir.</p><div class="ex-actions center"><button class="btn ghost" id="fc-all">M'entraîner quand même sur toutes</button><a class="btn primary" href="#controle">Terminé</a></div></div>`;
            $('#fc-all').onclick = () => { queue = mix(all()); k = 0; flip = false; again = new Set(); free = true; draw(); };
            if (queue.length && !free && known === FL.length) confetti();
            return;
        }
        const i = queue[k], c = FL[i];
        box.innerHTML = `<div class="fc-top"><span>Carte ${k + 1} / ${queue.length}</span><span>${known} sue${known > 1 ? 's' : ''}</span></div>
          <button class="flash3d" id="fc-card" aria-label="Retourner la carte"><span class="f-in"><span class="face front"><small>Question</small><span>${c[0]}</span><em>Touche pour retourner</em></span><span class="face back"><small>Réponse</small><span>${c[1]}</span></span></span></button>
          <div class="fc-act" hidden><button class="btn ghost" id="fc-no">À revoir</button><button class="btn primary" id="fc-yes">Je savais</button></div>
          <p class="note center" id="fc-lock">Retourne la carte pour continuer.</p>`;
        $('#fc-card').onclick = () => { if (flip) return; flip = true; $('#fc-card').classList.add('flip'); $('.fc-act').hidden = false; $('#fc-lock').remove(); };
        $('#fc-no').onclick = () => { if (!flip) return; S.fl[i] = { b: 0, d: today }; save(); if (!again.has(i)) { again.add(i); queue.push(i); } k++; flip = false; draw(); };
        $('#fc-yes').onclick = () => {
            if (!flip) return; const early = S.fl[i] && !flDue(i);
            if (!early) { const b = Math.min(3, ((S.fl[i] || {}).b || 0) + 1); S.fl[i] = { b, d: today + GAP[b] }; save(); }
            k++; flip = false; draw();
        };
    }
    draw();
}
function vBlanc() {
    const ids = BLANC.filter(id => EX.some(e => e.id === id)), key = ids.join();
    app.innerHTML = `${crumb('controle', 'Avant le contrôle', 'Contrôle blanc')}<h1>Contrôle blanc</h1><div id="bl"></div>`;
    const box = $('#bl'), saved = () => S.run && S.run.kind === 'blanc' && S.run.key === key ? S.run : null;
    function intro() {
        const r = saved();
        box.innerHTML = `<div class="card"><p><b>${ids.length} questions, ${cl(20 / ids.length)} points chacune.</b> Une seule tentative par question, pas d'indice. Tu peux revoir tes réponses avec « Précédent ». Les corrections sont à la fin.</p><p>Prends une feuille, ta calculatrice (en degrés), et fais comme le jour J : rédige.</p>${S.best !== null ? `<p class="note">Meilleure note : ${S.best} / 20</p>` : ''}
          <div class="ex-actions">${r ? `<button class="btn primary big" id="bl-res">Reprendre à la question ${Math.min(r.k + 1, ids.length)}</button><button class="btn ghost" id="bl-go">Recommencer à zéro</button>` : '<button class="btn primary big" id="bl-go">Commencer</button>'}</div></div>`;
        $('#bl-go').onclick = () => start(null);
        if (r) $('#bl-res').onclick = () => start(r);
    }
    function start(resume) { runner(box, { kind: 'blanc', mode: 'exam', items: ids.map(id => ({ id })), resume, persist: true, extra: { key }, endLabel: 'Voir ma note', onEnd: end }); window.scrollTo(0, 0); }
    function end(R) {
        const qs = ids.map(id => EX.find(e => e.id === id)), res = R.recs.map(r => r.ok), note = Math.round(res.filter(Boolean).length * 20 / ids.length);
        if (S.best === null || note > S.best) S.best = note; save();
        box.innerHTML = `<div class="card center"><div class="note-big">${note}<small> / 20</small></div><p>${note >= 16 ? 'Le chapitre est maîtrisé. Tu peux y aller en confiance.' : note >= 10 ? 'La base est là. Reprends les questions ci-dessous marquées « à revoir ».' : 'Reprends les corrections ci-dessous une par une, puis les recettes correspondantes. C\'est pour ça qu\'on fait un contrôle blanc avant le vrai.'}</p><div class="ex-actions center"><button class="btn ghost" id="bl-re">Recommencer</button>${shareBtn('Partager')}</div></div>
          ${qs.map((q, i) => `<details class="card rc ${res[i] ? 'r-ok' : 'r-ko'}"><summary><span class="num">${i + 1}</span><span><b>${res[i] ? 'Réussi' : 'À revoir'}</b><small>${q.q.replace(/<[^>]+>/g, ' ').slice(0, 90)}…</small></span></summary><div class="ex-q">${q.q}</div>${q.fig ? `<div class="fig">${q.fig()}</div>` : ''}<p class="note">Ta réponse : ${R.recs[i].ans}</p><ol class="steps-l">${corrOf(q).map(c => `<li>${c}</li>`).join('')}</ol></details>`).join('')}
          <div class="pn"><a class="btn ghost" href="#exos/R">Mes exercices à retravailler →</a></div>`;
        $('#bl-re').onclick = intro; window.scrollTo(0, 0); if (note >= 16) confetti();
    }
    intro();
}

/* ================= NAVIGATION ================= */
const ROUTES = { accueil: vHome, cours: vCours, atelier: vAtelier, methodes: vMeth, exos: vExos, controle: vCtrl, jour: vJour, recompenses: vBadges };
const SCROLL = {}; let byClick = false, cur = location.hash;
try { history.scrollRestoration = 'manual'; } catch (e) { }
document.addEventListener('click', e => { if (e.target.closest && e.target.closest('a[href^="#"]')) byClick = true; }, true);
window.addEventListener('scroll', () => { SCROLL[cur] = window.scrollY; }, { passive: true });
function route(keep) {
    const [r, sub] = (location.hash.slice(1) || 'accueil').split('/');
    const name = ROUTES[r] ? r : 'accueil', y = keep === true ? window.scrollY : byClick ? 0 : (SCROLL[location.hash] || 0);
    byClick = false; cur = location.hash;
    app.innerHTML = '';
    ROUTES[name](sub);
    const tab = name === 'jour' ? 'controle' : name;
    $$('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.r === tab));
    if (keep !== true) { app.classList.remove('in'); void app.offsetWidth; app.classList.add('in'); }
    window.scrollTo(0, y);
    if (name !== 'accueil' && name !== 'recompenses' && S.last !== location.hash) { S.last = location.hash; save(); }
}
$('#themeBtn').onclick = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(); save(); };
window.addEventListener('hashchange', () => route());
document.addEventListener('keydown', e => {
    if (e.target.matches && e.target.matches('input,select,textarea')) return;
    const card = $('#fc-card'); if (!card) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); card.click(); }
    else if (e.key === 'ArrowRight') $('#fc-yes').click();
    else if (e.key === 'ArrowLeft') $('#fc-no').click();
});
applyTheme(); progress(); checkBadges(true); route();
