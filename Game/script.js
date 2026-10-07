'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ================= GRAPH ALGORITHMS ================= */
const ids = g => Object.keys(g.n);
const key = (a, b) => [a, b].sort().join('');
const edge = (g, a, b) => g.e.find(e => key(e[0], e[1]) === key(a, b));
const nbrs = (g, v) => g.e.filter(e => e[0] === v || e[1] === v).map(e => e[0] === v ? e[1] : e[0]).sort();
const deg = (g, v) => nbrs(g, v).length;
const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));
const cost = (g, s) => s.slice(1).reduce((t, v, i) => t + ((edge(g, s[i], v) || [])[2] || 0), 0);
const adjOK = (g, s) => s.every((v, i) => !i || edge(g, s[i - 1], v));

// Dijkstra's shortest path
function dijkstra(g, s, t) {
  const d = {}, p = {}, q = new Set(ids(g));
  ids(g).forEach(v => d[v] = Infinity); d[s] = 0;
  while (q.size) {
    const u = [...q].reduce((a, b) => d[a] <= d[b] ? a : b);
    q.delete(u); if (u === t) break;
    nbrs(g, u).forEach(v => { const w = edge(g, u, v)[2]; if (d[u] + w < d[v]) { d[v] = d[u] + w; p[v] = u; } });
  }
  const path = [t]; while (path[0] !== s) path.unshift(p[path[0]]);
  return { dist: d[t], path };
}
// BFS (queue) and DFS (recursion), neighbours in alphabetical order
function bfs(g, s) { const o = [s], q = [s]; while (q.length) nbrs(g, q.shift()).forEach(v => { if (!o.includes(v)) { o.push(v); q.push(v); } }); return o; }
function dfs(g, s, o = []) { o.push(s); nbrs(g, s).forEach(v => o.includes(v) || dfs(g, v, o)); return o; }
// Hamiltonian path validation + brute-force minimum weight
const isHam = (g, s) => s.length === ids(g).length && new Set(s).size === s.length && adjOK(g, s);
function bestHam(g) {
  let b = Infinity;
  const go = s => { if (s.length === ids(g).length) { b = Math.min(b, cost(g, s)); return; } nbrs(g, s.at(-1)).forEach(v => s.includes(v) || go([...s, v])); };
  ids(g).forEach(v => go([v])); return b;
}
// Eulerian trail validation: every edge used exactly once
function isEuler(g, s) {
  if (s.length !== g.e.length + 1 || !adjOK(g, s)) return false;
  return new Set(s.slice(1).map((v, i) => key(s[i], v))).size === g.e.length;
}

/* ================= QUESTION BANK & RANDOM GRAPH GENERATOR ================= */
const fail = r => ({ ok: false, msg: r });
const win = { ok: true };
const rnd = n => Math.floor(Math.random() * n), pk = a => a[rnd(a.length)];
const shuf = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
const degs = g => ids(g).map(v => deg(g, v));
const connected = g => bfs(g, ids(g)[0]).length === ids(g).length;
const comps = g => { const s = new Set(); let r = 0; ids(g).forEach(v => { if (!s.has(v)) { r++; bfs(g, v).forEach(x => s.add(x)); } }); return r; };
const cp = (g, u, t, seen) => u === t ? 1 : nbrs(g, u).filter(v => !seen.includes(v)).reduce((a, v) => a + cp(g, v, t, [...seen, v]), 0);
const bd = (g, s, t) => { const d = { [s]: 0 }, q = [s]; while (q.length) { const u = q.shift(); nbrs(g, u).forEach(v => { if (d[v] == null) { d[v] = d[u] + 1; q.push(v); } }); } return d[t]; };

// Random graph: random labels, ring layout, random edges/weights; o.ham guarantees a Hamiltonian path, o.comps=2 splits it in two
function mk(n, m, w, o = {}) {
  const L = shuf([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']).slice(0, n).sort(), pos = shuf(L), a0 = Math.random() * 6.28, nd = {}, e = [];
  pos.forEach((v, i) => { const a = a0 + i / n * 6.2832; nd[v] = [Math.round(300 + 235 * Math.cos(a)), Math.round(200 + 150 * Math.sin(a))]; });
  const add = (a, b) => { if (a !== b && !e.some(x => key(x[0], x[1]) === key(a, b))) e.push(w ? [a, b, 1 + rnd(9)] : [a, b]); };
  const grp = o.comps === 2 ? [pos.slice(0, n >> 1), pos.slice(n >> 1)] : [pos]; let hp = null;
  if (o.ham) { hp = shuf(L); hp.forEach((v, i) => i && add(hp[i - 1], v)); }
  else grp.forEach(g => g.forEach((v, i) => i && add(v, g[rnd(i)])));
  for (let t = 0; e.length < m && t < 300; t++) { const g = pk(grp); add(pk(g), pk(g)); }
  return { n: nd, e, hp };
}
const tg = (f, ...a) => { let g; for (let i = 0; i < 99; i++) { g = mk(...a); if (f(g)) return g; } return g; };
// Random graph with at most 2 odd vertices (Euler trail guaranteed)
function eg(n) {
  for (;;) {
    const g = mk(n, n + 1 + rnd(3)); let o;
    while ((o = ids(g).filter(v => deg(g, v) % 2)).length > 2) { const p = o.flatMap((u, i) => o.slice(i + 1).filter(v => !edge(g, u, v)).map(v => [u, v]))[0]; if (!p) break; g.e.push(p); }
    if (ids(g).filter(v => deg(g, v) % 2).length <= 2) return g;
  }
}
// Challenge builders
const num = (g, task, a, hint, why) => ({ g, type: 'choice', task, hint, why, opts: shuf([a, ...shuf([1, 2, 3, -1, -2].map(d => a + d).filter(x => x >= 0)).slice(0, 3)]).map(String), check: s => s[0] === String(a) ? win : fail('Not quite - recount carefully.') });
const yn = (g, task, a, hint, why) => ({ g, type: 'choice', task, hint, why, opts: ['Yes', 'No'], check: s => s[0] === (a ? 'Yes' : 'No') ? win : fail('Re-check the definition and try again.') });
const vc = (g, task, a, hint, why) => ({ g, type: 'choice', task, hint, why, opts: shuf([a, ...shuf(ids(g).filter(v => v !== a)).slice(0, 3)]), check: s => s[0] === a ? win : fail('Trace the algorithm step by step again.') });
const sel = (g, task, a, hint, why) => ({ g, type: 'select', task, hint, why, check: s => same(s, a) ? win : fail('Some selections are missing or wrong.') });
const pth = (g, task, f, hint, why, o = {}) => ({ g, type: 'path', adj: true, task, hint, why, ...o, check: s => { const r = f(s); return r === true ? win : fail(typeof r === 'string' ? r : 'That route does not satisfy the mission.'); } });
const nn = d => 5 + d, X = g => pk(ids(g)), sp2 = g => shuf(ids(g));
const uq = f => g => { const s = degs(g); return s.filter(x => x === f(...s)).length === 1; };

// Question templates: id -> [topic pool, generator(difficulty)]  (33 templates x random graphs)
const T = {
  nV: ['basics', d => { const g = mk(nn(d), 6 + d); return num(g, 'How many vertices does this graph have?', ids(g).length, 'Each circle is a vertex - count them.', `Vertices are the points of a graph; this one has ${ids(g).length}.`); }],
  nE: ['basics', d => { const g = mk(nn(d), 6 + d); return num(g, 'How many edges does this graph have?', g.e.length, 'Each line between two vertices is an edge.', `Edges connect pairs of vertices; this graph has ${g.e.length}.`); }],
  adj: ['basics', d => { const g = mk(nn(d), 6 + d), x = X(g), a = nbrs(g, x); return sel(g, `Select all vertices adjacent to ${x}.`, a, 'Adjacent vertices share an edge with the chosen vertex.', `${x} is adjacent to ${a.join(', ')}.`); }],
  eAt: ['basics', d => { const g = mk(nn(d), 7 + d), x = X(g); return num(g, `How many edges are connected to vertex ${x}?`, deg(g, x), 'Count the lines touching the vertex.', `${x} touches ${deg(g, x)} edges, so its degree is ${deg(g, x)}.`); }],
  dsum: ['basics', d => { const g = mk(nn(d), 6 + d); return num(g, 'What is the sum of all vertex degrees?', 2 * g.e.length, 'Handshake Lemma: every edge contributes 2.', `Sum of degrees = 2 × edges = ${2 * g.e.length}.`); }],
  sV: ['basics', d => { const g = mk(nn(d), 6 + d), x = X(g); return sel(g, `Select vertex ${x}.`, [x], `Find the circle labelled ${x}.`, 'Every vertex has a unique label.'); }],
  dOf: ['deg', d => { const g = mk(nn(d), 7 + d), x = X(g); return num(g, `Find the degree of vertex ${x}.`, deg(g, x), 'Degree = number of edges at the vertex.', `${x} has degree ${deg(g, x)}.`); }],
  dMax: ['deg', d => { const g = tg(uq(Math.max), nn(d), 7 + d), m = Math.max(...degs(g)); return { ...sel(g, 'Find the vertex with the highest degree.', ids(g).filter(v => deg(g, v) === m), 'Compare the degrees of all vertices.', `The highest degree is ${m}.`), single: true }; }],
  dMin: ['deg', d => { const g = tg(uq(Math.min), nn(d), 7 + d), m = Math.min(...degs(g)); return { ...sel(g, 'Find the vertex with the lowest degree.', ids(g).filter(v => deg(g, v) === m), 'Compare the degrees of all vertices.', `The lowest degree is ${m}.`), single: true }; }],
  dK: ['deg', d => { const g = mk(nn(d), 7 + d), k = pk(degs(g)); return sel(g, `Select all vertices with degree ${k}.`, ids(g).filter(v => deg(g, v) === k), 'Count the edges at each vertex.', `Exactly those vertices have ${k} edges.`); }],
  dOdd: ['deg', d => { const g = tg(g => degs(g).some(x => x % 2), nn(d), 7 + d); return sel(g, 'Select all vertices with odd degree.', ids(g).filter(v => deg(g, v) % 2), 'Odd means 1, 3, 5, ... edges.', 'The number of odd-degree vertices is always even (Handshake Lemma).'); }],
  dEv: ['deg', d => { const g = tg(g => degs(g).some(x => x % 2 === 0), nn(d), 7 + d); return sel(g, 'Select all vertices with even degree.', ids(g).filter(v => deg(g, v) % 2 === 0), 'Even means 2, 4, 6, ... edges.', 'Even-degree vertices have an even number of edges.'); }],
  pA: ['conn', d => { const g = mk(nn(d), 6 + d), [s, t] = sp2(g); return pth(g, `Find a path from ${s} to ${t}.`, q => q[0] === s && q.at(-1) === t, 'Follow edges from the start; never revisit a vertex.', `A path exists, so ${s} and ${t} are connected.`); }],
  cn: ['conn', d => { const g = mk(nn(d), 5 + d, false, { comps: rnd(2) + 1 }), c = connected(g); return yn(g, 'Is this graph connected?', c, 'A connected graph has a path between every pair of vertices.', c ? 'Every vertex can reach every other vertex.' : `It splits into ${comps(g)} separate components.`); }],
  nP: ['conn', d => { const g = mk(nn(d), 6), [s, t] = sp2(g), c = cp(g, s, t, [s]); return num(g, `How many different simple paths lead from ${s} to ${t}?`, c, 'List the paths systematically, never repeating a vertex.', `There are ${c} simple paths from ${s} to ${t}.`); }],
  sU: ['conn', d => { const g = mk(nn(d), 7 + d), [s, t] = sp2(g), l = bd(g, s, t); return pth(g, `Find the shortest path (fewest edges) from ${s} to ${t}.`, q => q[0] === s && q.at(-1) === t && q.length - 1 === l, 'BFS explores level by level, so it finds fewest-edge paths.', `The shortest path has ${l} edges.`); }],
  rch: ['conn', d => { const g = mk(6, 5, false, { comps: 2 }), x = X(g); return sel(g, `Select every vertex reachable from ${x} (including ${x}).`, bfs(g, x), 'Follow edges outward; other components are unreachable.', 'Reachable vertices form the connected component of the start.'); }],
  cc: ['conn', d => { const g = mk(6, 4, false, { comps: rnd(2) + 1 }); return num(g, 'How many connected components does this graph have?', comps(g), 'Count the separate "islands" of vertices.', `The graph has ${comps(g)} component(s).`); }],
  sw: ['sp', d => { const g = mk(6 + (d > 0), 9 + d, true), [s, t] = sp2(g), r = dijkstra(g, s, t); return pth(g, `Find the minimum-cost path from ${s} to ${t}.`, q => q[0] === s && q.at(-1) === t ? (cost(g, q) === r.dist || `Your route costs ${cost(g, q)}; a cheaper one exists.`) : false, 'Compare total weights - fewer edges is not always cheaper.', `Dijkstra finds minimum cost ${r.dist} via ${r.path.join(' → ')}.`); }],
  sc: ['sp', d => { const g = mk(6 + (d > 0), 9 + d, true), [s, t] = sp2(g), r = dijkstra(g, s, t); return num(g, `What is the minimum cost to travel from ${s} to ${t}?`, r.dist, 'Always expand the cheapest unvisited vertex (Dijkstra).', `Minimum cost ${r.dist} via ${r.path.join(' → ')}.`); }],
  eT: ['eu', d => { const g = eg(nn(d)); return pth(g, 'Find an Eulerian path that uses every edge exactly once.', q => isEuler(g, q), 'Only odd-degree vertices can be the start and end of an Eulerian path.', 'An Eulerian path exists when a connected graph has 0 or 2 odd vertices.', { rep: true }); }],
  eY: ['eu', d => { const g = Math.random() < .5 ? eg(nn(d)) : mk(nn(d), 7 + d), o = degs(g).filter(x => x % 2).length; return yn(g, 'Does this graph have an Eulerian path?', o <= 2, 'Count odd-degree vertices: 0 or 2 means yes (connected graph).', `It has ${o} odd-degree vertices, so ${o <= 2 ? 'an Eulerian path exists' : 'no Eulerian path exists'}.`); }],
  eO: ['eu', d => { let g; do g = eg(nn(d)); while (degs(g).filter(x => x % 2).length !== 2); const o = ids(g).filter(v => deg(g, v) % 2); return sel(g, 'Select the two vertices where an Eulerian path must start and end.', o, 'Look for the odd-degree vertices.', `${o.join(' and ')} have odd degree.`); }],
  hP: ['ham', d => { const g = mk(nn(d), 7 + d, false, { ham: 1 }); return pth(g, 'Find a Hamiltonian path that visits every vertex exactly once.', q => isHam(g, q), 'Visit all vertices once; you may skip edges.', `A Hamiltonian path visits every vertex once, e.g. ${g.hp.join(' → ')}.`); }],
  hS: ['ham', d => { const g = mk(nn(d), 7 + d, false, { ham: 1 }), x = g.hp[0]; return pth(g, `Find a Hamiltonian path that starts at ${x}.`, q => isHam(g, q) && q[0] === x, 'Start at the given vertex and plan to reach every other vertex.', `One solution: ${g.hp.join(' → ')}.`); }],
  hE: ['ham', d => { const g = mk(nn(d), 7 + d, false, { ham: 1 }), x = g.hp.at(-1); return pth(g, `Find a Hamiltonian path that ends at ${x}.`, q => isHam(g, q) && q.at(-1) === x, 'Work backwards from the final vertex.', `One solution: ${g.hp.join(' → ')}.`); }],
  bF: ['bfs', d => { const g = mk(nn(d), 7 + d), s = X(g), o = bfs(g, s); return pth(g, `Perform BFS starting from vertex ${s}. Visit neighbours alphabetically.`, q => q.join() === o.join(), 'BFS uses a queue and explores level by level.', `BFS order: ${o.join(' → ')}.`, { adj: false }); }],
  bL: ['bfs', d => { const g = mk(nn(d), 7 + d), s = X(g), o = bfs(g, s); return vc(g, `Which vertex is visited last by BFS from ${s}? (alphabetical order)`, o.at(-1), 'Simulate the queue.', `BFS order: ${o.join(' → ')}.`); }],
  dF: ['dfs', d => { const g = mk(nn(d), 7 + d), s = X(g), o = dfs(g, s); return pth(g, `Perform DFS starting from vertex ${s}. Visit neighbours alphabetically.`, q => q.join() === o.join(), 'DFS goes as deep as possible before backtracking.', `DFS order: ${o.join(' → ')}.`, { adj: false }); }],
  dL: ['dfs', d => { const g = mk(nn(d), 7 + d), s = X(g), o = dfs(g, s); return vc(g, `Which vertex is visited last by DFS from ${s}? (alphabetical order)`, o.at(-1), 'Dive deep first, backtrack when stuck.', `DFS order: ${o.join(' → ')}.`); }],
  bH: ['boss', d => { const g = mk(6 + (d > 0), 9 + d, true, { ham: 1 }), b = bestHam(g); return pth(g, 'Find a Hamiltonian path with the minimum total weight.', q => isHam(g, q) ? (cost(g, q) === b || `Valid, but cost ${cost(g, q)} is not the minimum.`) : 'Visit every vertex exactly once.', 'Visit all vertices once, then compare total weights.', `Comparing all Hamiltonian paths, the minimum weight is ${b}.`); }],
  bS: ['boss', d => { const g = mk(8, 13, true), [s, t] = sp2(g), r = dijkstra(g, s, t); return pth(g, `BOSS: find the minimum-cost path from ${s} to ${t}.`, q => q[0] === s && q.at(-1) === t ? (cost(g, q) === r.dist || `Cost ${cost(g, q)} - a cheaper route exists.`) : false, 'Dijkstra: expand the cheapest frontier vertex.', `Minimum cost ${r.dist} via ${r.path.join(' → ')}.`); }]
};

// Level slots: [chapter-1 title, chapter-2 title, concept, topic pools]
const SL = [
  ['KNOW YOUR GRAPH', 'DEGREE DETECTIVE II', 'Vertices, Edges & Degree', c => c ? ['deg'] : ['basics', 'deg']],
  ['CONNECT THE DOTS', 'CONNECTION CRISIS', 'Connectivity & Paths', () => ['conn']],
  ['SHORTEST ROUTE', 'SHORTEST ROUTE II', 'Shortest Path', () => ['sp']],
  ["EULER'S TRAIL", 'EULER CHALLENGE II', 'Eulerian Path', () => ['eu']],
  ['HAMILTONIAN HUNT', 'HAMILTONIAN HUNT II', 'Hamiltonian Path', () => ['ham']],
  ['GRAPH TRAVERSAL', 'BFS CHALLENGE II', 'BFS / DFS', c => c ? ['bfs'] : ['bfs', 'dfs']],
  ['DEGREE DETECTIVE', 'DFS CHALLENGE II', 'Degree / DFS', c => c ? ['dfs'] : ['deg']],
  ['FINAL BOSS: GRAPH MASTER', 'GRAPH MASTER', 'Boss Challenge', () => ['boss']]
];
const ROMAN = ['', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
let usedQ = [], lastSig = '';
const LVC = [], cur = () => LVC[S.i];
// Select an unused template for the slot, build a fresh graph (never the same as the previous level), cache the level
function gen(i) {
  const ch = i >> 3, k = i & 7, s = SL[k], pools = s[3](ch > 0), all = Object.keys(T).filter(q => pools.includes(T[q][0]));
  let av = all.filter(q => !usedQ.includes(q)); if (!av.length) { usedQ = usedQ.filter(q => !all.includes(q)); av = all; }
  const q = pk(av); usedQ.push(q);
  let c, sg; for (let t = 0; t < 20; t++) { c = T[q][1](Math.min(2, ch)); sg = c.g.e.map(e => e.join('')).sort().join(); if (sg !== lastSig) break; }
  lastSig = sg;
  const t = ch === 0 ? s[0] : ch === 1 ? s[1] : (i % 8 === 7 ? 'GRAPH MASTER' : s[1].replace(/ II$/, '')) + ' ' + ROMAN[Math.min(ch, 9)];
  return { ...c, t, c: `CH ${ch + 1} · ${s[2]}` };
}

const ACH = [
  { id: 'rookie', i: '🏆', n: 'GRAPH ROOKIE', d: 'Complete Level 1', f: s => s.done.size >= 1 && s.done.has(0) },
  { id: 'path', i: '⚡', n: 'PATHFINDER', d: 'Complete 3 levels', f: s => s.done.size >= 3 },
  { id: 'logic', i: '🧠', n: 'LOGIC MASTER', d: 'Complete 5 levels', f: s => s.done.size >= 5 },
  { id: 'fire', i: '🔥', n: 'UNSTOPPABLE', d: 'Get a 5-answer streak', f: s => s.bestStreak >= 5 },
  { id: 'master', i: '👑', n: 'GRAPH MASTER', d: 'Complete all levels', f: s => s.done.size >= 8 }
];

/* ================= STATE ================= */
const SAVE = 'gtp-v1';
const saved = JSON.parse(localStorage.getItem(SAVE) || '{}');
const S = {
  best: saved.best || 0, unl: saved.unl || 1, xp: saved.xp || 0, done: new Set(saved.done || []), ach: new Set(saved.ach || []),
  score: 0, lives: 3, streak: 0, bestStreak: 0, hints: 0, right: 0, wrong: 0, i: 0, sel: [], mode: 'BFS', t0: 0, hintU: false, wrongL: false
};
const save = () => localStorage.setItem(SAVE, JSON.stringify({ best: S.best, unl: S.unl, xp: S.xp, done: [...S.done], ach: [...S.ach] }));

/* ================= UI HELPERS ================= */
function show(id) { $$('.screen').forEach(s => { s.classList.remove('out'); s.classList.toggle('active', s.id === id); }); window.scrollTo(0, 0); }
const open = id => $(id).classList.add('open');
const closeAll = () => $$('.overlay').forEach(o => o.classList.remove('open'));
function tween(el, to) {
  const from = +el.dataset.v || 0; el.dataset.v = to; const t0 = performance.now();
  (function f(t) { const k = Math.min(1, (t - t0) / 500); el.textContent = String(Math.round(from + (to - from) * k)).padStart(4, '0'); if (k < 1) requestAnimationFrame(f); })(t0);
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2600); }
function burst(n = 45) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i'); s.className = 'cf';
    s.style.cssText = `--dx:${(Math.random() - .5) * 700}px;--dy:${(Math.random() - .8) * 600}px;background:hsl(${Math.random() * 360},90%,60%)`;
    document.body.append(s); setTimeout(() => s.remove(), 1400);
  }
}
function menuStats() {
  let n = 0; while (S.done.has(n)) n++;
  const base = (n >> 3) << 3, c = [...Array(8).keys()].filter(j => S.done.has(base + j)).length;
  $('#sLevel').textContent = n + 1; $('#sBest').textContent = S.best; $('#sXp').textContent = S.xp;
  $('#sProg').textContent = Math.round(c / 8 * 100) + '%'; $('#sDone').textContent = S.done.size;
}
function hud() {
  $('#lvlTxt').textContent = String(S.i + 1).padStart(2, '0');
  tween($('#score'), S.score);
  $('#xp').textContent = `${S.xp} / ${(Math.floor(S.xp / 100) + 1) * 100}`;
  $('#lives').textContent = '❤️'.repeat(Math.max(0, S.lives)) || '💀';
  $('#streak').textContent = '🔥 ' + S.streak;
  const base = (S.i >> 3) << 3, R = [...Array(8).keys()];
  $('#bar').style.width = R.filter(j => S.done.has(base + j)).length / 8 * 100 + '%';
  $('#chips').innerHTML = R.map(j => { const i = base + j; return `<button class="chip ${i === S.i ? 'cur' : ''} ${S.done.has(i) ? 'done' : ''}" data-i="${i}" ${i < S.unl ? '' : 'disabled'}>${i + 1}</button>`; }).join('');
}

/* ================= GRAPH RENDERING ================= */
function draw() {
  const L = cur(), g = L.g;
  let h = '';
  g.e.forEach(([a, b, w]) => {
    const [x1, y1] = g.n[a], [x2, y2] = g.n[b];
    h += `<line class="edge" data-k="${key(a, b)}" pathLength="1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  });
  g.e.forEach(([a, b, w]) => {
    if (w === undefined) return;
    const x = (g.n[a][0] + g.n[b][0]) / 2, y = (g.n[a][1] + g.n[b][1]) / 2;
    h += `<rect class="wbg" x="${x - 13}" y="${y - 12}" width="26" height="22" rx="6"/><text class="wt" x="${x}" y="${y + 5}">${w}</text>`;
  });
  ids(g).forEach(v => { h += `<g class="node" data-v="${v}"><circle cx="${g.n[v][0]}" cy="${g.n[v][1]}" r="26"/><text x="${g.n[v][0]}" y="${g.n[v][1]}">${v}</text></g>`; });
  $('#svg').innerHTML = h;
  $('#opts').innerHTML = L.type === 'choice' ? L.opts.map(o => `<button class="btn sm" data-o="${o}">${o}</button>`).join('') : '';
  $('#mTitle').textContent = L.t; $('#mConcept').textContent = L.c;
  $('#btnMode').style.display = L.modes ? '' : 'none';
  $('#btnUndo').style.display = L.type === 'path' ? '' : 'none';
  $('#hintBox').textContent = '';
  paint();
}
function paint() {
  const L = cur();
  $('#mTask').textContent = L.task.replace('{m}', S.mode);
  $$('.node').forEach(n => n.classList.toggle('sel', L.type !== 'choice' && S.sel.includes(n.dataset.v)));
  $$('#opts button').forEach(b => b.classList.toggle('sel', S.sel[0] === b.dataset.o));
  const used = new Set(L.type === 'path' ? S.sel.slice(1).map((v, i) => key(S.sel[i], v)) : []);
  $$('.edge').forEach(e => e.classList.toggle('on', used.has(e.dataset.k)));
  $('#pathDisp').textContent = !S.sel.length ? (L.type === 'path' ? 'START →' : 'Nothing selected')
    : L.type === 'choice' ? 'Answer: ' + S.sel[0] : L.type === 'path' ? 'Current Path: ' + S.sel.join(' → ') : 'Selected: ' + S.sel.join(', ');
}
function loadLevel(i) {
  if (!LVC[i]) LVC[i] = gen(i);
  Object.assign(S, { i, sel: [], t0: Date.now(), hintU: false, wrongL: false, mode: 'BFS' });
  show('game'); draw(); hud();
}

/* ================= INTERACTION ================= */
function shake(v) { const n = $(`.node[data-v="${v}"]`); n.classList.remove('shake'); void n.offsetWidth; n.classList.add('shake'); }
function pick(v) {
  const L = cur();
  if (L.type === 'choice') return;
  if (L.type === 'select') {
    const k = S.sel.indexOf(v);
    if (k >= 0) S.sel.splice(k, 1); else if (L.single) S.sel = [v]; else S.sel.push(v);
  } else {
    if (L.adj && S.sel.length && !edge(L.g, S.sel.at(-1), v)) return shake(v);   // must follow an edge
    if (!L.rep && S.sel.includes(v)) return shake(v);                              // no repeated vertices
    S.sel.push(v);
  }
  paint();
}
function hint() {
  S.hintU = true; S.hints++; S.score = Math.max(0, S.score - 25);
  $('#hintBox').textContent = '💡 ' + cur().hint; hud();
}
function submit() {
  if (!S.sel.length) return toast('Build your answer first!');
  const L = cur(), r = L.check(S.sel, L.g, S.mode);
  if (r.ok) correct(L); else wrong(r.msg);
}
function correct(L) {
  const secs = (Date.now() - S.t0) / 1000;
  let pts = 100, extra = [];
  if (secs < 45) { pts += 50; extra.push('⚡ Speed +50'); }
  if (!S.hintU && !S.wrongL) { pts += 50; extra.push('✨ Perfect +50'); }
  S.score += pts; S.xp += S.done.has(S.i) ? 0 : 50; S.right++; S.streak++; S.bestStreak = Math.max(S.bestStreak, S.streak);
  S.done.add(S.i); S.unl = Math.max(S.unl, S.i + 2); S.best = Math.max(S.best, S.score);
  const newly = ACH.filter(a => !S.ach.has(a.id) && a.f(S));
  newly.forEach((a, k) => { S.ach.add(a.id); setTimeout(() => toast(`${a.i} Achievement unlocked: ${a.n}`), 900 + k * 2800); });
  save(); hud(); burst(S.i >= 4 ? 90 : 45);
  const ce = (S.i + 1) % 8 === 0;
  fb(true, '✓', 'PATH FOUND!', `Excellent! You discovered a valid solution. +${pts} pts · +50 XP ${extra.join(' · ')}`, L.why,
    ce ? 'CONTINUE' : 'NEXT LEVEL', () => ce ? chapter() : loadLevel(S.i + 1));
}
function wrong(msg) {
  S.score = Math.max(0, S.score - 20); S.lives--; S.streak = 0; S.wrong++; S.wrongL = true; hud();
  if (S.lives <= 0) return fb(false, '✕', 'OUT OF LIVES', 'The network overpowered you this time.', '', 'SEE RESULTS', () => finish(false));
  fb(false, '✕', 'PATH BLOCKED', "That's not the correct solution. Try another route. -20 pts", msg, 'TRY AGAIN', () => { S.sel = []; paint(); });
}
function fb(ok, icon, title, msg, why, btn, cb) {
  $('#fb .modal').className = 'modal glass ' + (ok ? 'ok' : 'bad');
  $('#fbIcon').textContent = icon; $('#fbTitle').textContent = title; $('#fbMsg').textContent = msg;
  $('#fbWhy').innerHTML = why ? (ok ? '<b>Why this works:</b> ' : '') + why : ''; $('#fbWhy').style.display = why ? '' : 'none';
  $('#fbBtn').textContent = btn; $('#fbBtn').onclick = () => { closeAll(); cb(); };
  open('#fb');
}
function finish(won) {
  $('#resTitle').textContent = won ? 'GRAPH MASTER!' : 'NETWORK LOST';
  $('#resSub').textContent = won ? 'You conquered the network.' : 'Regroup, explorer - the graph awaits.';
  const tot = S.right + S.wrong, acc = tot ? Math.round(S.right / tot * 100) : 0;
  const rows = [['Final Score', S.score], ['Levels Completed', S.done.size], ['XP Earned', S.xp], ['Best Streak', S.bestStreak], ['Hints Used', S.hints], ['Accuracy', acc + '%']];
  $('#resStats').innerHTML = rows.map(r => `<div><b>${r[1]}</b><small>${r[0]}</small></div>`).join('');
  show('result'); if (won) { burst(140); setTimeout(() => burst(100), 600); }
}
function newRun() {
  Object.assign(S, { score: 0, lives: 3, streak: 0, bestStreak: 0, hints: 0, right: 0, wrong: 0 });
}
function showAch() {
  $('#achList').innerHTML = ACH.map(a => `<div class="badge ${S.ach.has(a.id) ? 'on' : ''}"><b>${a.i} ${a.n}</b><span>${a.d} ${S.ach.has(a.id) ? '- UNLOCKED' : '🔒'}</span></div>`).join('');
  open('#ach');
}

/* ================= EVENTS ================= */
$('#btnStart').onclick = e => {
  const b = e.currentTarget, r = document.createElement('span'); b.classList.add('press'); r.className = 'rip'; b.append(r); setTimeout(() => r.remove(), 700);
  if (S.lives <= 0) newRun();
  let n = 0; while (S.done.has(n)) n++;
  $('#menu').classList.add('out'); $('#warp').classList.add('on');          // menu fades out, graph warp plays
  setTimeout(() => { b.classList.remove('press'); loadLevel(n); setTimeout(() => $('#warp').classList.remove('on'), 350); }, 1000);
};
$('#btnHow').onclick = () => open('#how');
$('#btnAch').onclick = showAch; $('#btnAch2').onclick = showAch;
$$('.close').forEach(b => b.onclick = closeAll);
$('#btnMenu').onclick = $('#btnMenu2').onclick = () => { menuStats(); show('menu'); };
$('#btnHint').onclick = hint;
$('#btnReset').onclick = () => { S.sel = []; paint(); };
$('#btnUndo').onclick = () => { S.sel.pop(); paint(); };
$('#btnSubmit').onclick = submit;
$('#btnMode').onclick = () => { S.mode = S.mode === 'BFS' ? 'DFS' : 'BFS'; S.sel = []; paint(); toast('Mode: ' + S.mode); };
$('#btnAgain').onclick = () => { S.done = new Set(); S.unl = 1; S.xp = 0; newRun(); LVC.length = 0; usedQ = []; save(); loadLevel(0); };
$('#svg').addEventListener('click', e => { const n = e.target.closest('.node'); if (n) pick(n.dataset.v); });
$('#chips').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c && !c.disabled) loadLevel(+c.dataset.i); });
$$('.overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o && o.id !== 'fb') o.classList.remove('open'); }));

/* ================= BACKGROUND NETWORK ANIMATION ================= */
(function () {
  const c = $('#bg'), x = c.getContext('2d'); let pts = [];
  const fit = () => { c.width = innerWidth; c.height = innerHeight; pts = Array.from({ length: Math.min(70, innerWidth / 18) }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 })); };
  addEventListener('resize', fit); fit();
  (function loop() {
    x.clearRect(0, 0, c.width, c.height);
    pts.forEach(p => { p.x = (p.x + p.vx + c.width) % c.width; p.y = (p.y + p.vy + c.height) % c.height; x.fillStyle = '#22e6ff'; x.fillRect(p.x, p.y, 2, 2); });
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 130) { x.strokeStyle = `rgba(168,85,247,${.35 * (1 - d / 130)})`; x.beginPath(); x.moveTo(pts[i].x, pts[i].y); x.lineTo(pts[j].x, pts[j].y); x.stroke(); }
    }
    requestAnimationFrame(loop);
  })();
})();

$('#opts').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { S.sel = [b.dataset.o]; paint(); } });
// Chapter transition: shown after every 8th level; the next chapter is generated on demand
function chapter() {
  const n = (S.i >> 3) + 2; S.lives = Math.min(3, S.lives + 1); hud();
  $('#chapNum').textContent = n === 3 ? 'CHAPTER 3 — GRAPH MASTER' : `CHAPTER ${n} UNLOCKED`;
  $('#chapSub').textContent = n === 3 ? 'THE NETWORK NEVER ENDS...' : 'THE NETWORK EXPANDS...';
  open('#chap'); burst(120);
  setTimeout(() => { $('#chap').classList.remove('open'); loadLevel(S.i + 1); }, 3200);
}
// Cinematic intro: node graph builds, title, typewriter tagline, then staggered menu reveal
(function () {
  const intro = $('#intro'), tag = 'THINK. CONNECT. TRAVERSE. CONQUER.', el = $('#introTag'); let done = false;
  const end = () => { if (done) return; done = true; intro.classList.add('hide'); setTimeout(() => { intro.remove(); document.body.classList.add('ready'); }, 700); };
  setTimeout(() => { let i = 0; const id = setInterval(() => { if (done) return clearInterval(id); el.textContent = tag.slice(0, ++i); if (i >= tag.length) clearInterval(id); }, 45); }, 4600);
  setTimeout(end, 7000); $('#introSkip').onclick = end;
})();
menuStats();
