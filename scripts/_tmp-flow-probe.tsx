import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Flow } from '../src/components/lesson/diagrams';

const nodes = [
  { id: 'a', label: 'submit tx', col: 0 },
  { id: 'b', label: 'mempool wait', note: 'seen by searchers', col: 1 },
  { id: 'c', label: 'bundle built', note: 'backrun attached and sealed', col: 2 },
  { id: 'd', label: 'block included', col: 3 },
  { id: 'e', label: 'settlement', note: 'fee paid', col: 4 },
];
const edges = [
  { from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }, { from: 'd', to: 'e' },
  { from: 'e', to: 'a', label: 'retry', tone: 'good' as const },
];
const html = renderToStaticMarkup(React.createElement(Flow as any, { nodes, edges, dir: 'down' }));
console.log(html.match(/viewBox="[^"]*"/)?.[0]);
for (const m of html.matchAll(/<path d="(M[^"]*)"/g)) console.log('PATH', m[1]);
for (const m of html.matchAll(/<rect[^>]*x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g))
  console.log('RECT', m[1], m[2], m[3], m[4]);
for (const m of html.matchAll(/<text[^>]*x="([\d.]+)"[^>]*>([^<]*)</g)) console.log('TEXT', m[1], JSON.stringify(m[2]));
