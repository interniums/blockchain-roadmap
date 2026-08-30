/**
 * The reading surface's one piece of real logic.
 *
 * The rail highlights the section you are in, and that behaviour cannot be exercised in a headless
 * pane: a page the compositor never paints dispatches no `scroll` events, and `requestAnimationFrame`
 * and `IntersectionObserver` both stay suspended. So the choice is a pure function and it is tested
 * here, against heading offsets measured off a real lesson.
 */
import { currentSection, SECTION_LINE } from '../src/app/t/[track]/[module]/[lesson]/_lesson/currentSection';
let fail = 0;
const t = (n: string, c: boolean, x = '') => { if (!c) { fail++; console.log(`  FAIL  ${n} ${x}`); } else console.log(`  ok    ${n} ${x}`); };
const LINE = 900 * SECTION_LINE;

console.log('--- which section the reader is in ---');
// Measured off `fundamentals-crypto-what-a-signature-proves` at 1440x900: eight headings, with a
// 1668px gap between two of them — which is exactly the case a visibility-based rail got wrong.
const HEADINGS = [317, 1280, 2040, 2491, 3237, 4905, 5891, 6289];
const at = (scrollY: number) => HEADINGS.map((y) => y - scrollY);
t('top of the page is section 1', currentSection(at(0), LINE) === 0);
t('still section 1 mid-first-section', currentSection(at(900), LINE) === 0);
t('section 2 once its heading passes', currentSection(at(1400), LINE) === 1, `(got ${currentSection(at(1400), LINE)})`);
t('section 3', currentSection(at(2100), LINE) === 2, `(got ${currentSection(at(2100), LINE)})`);
t('the long gap does not reset it', currentSection(at(2600), LINE) === 3, `(got ${currentSection(at(2600), LINE)})`);
t('deep in a 1600px section', currentSection(at(4000), LINE) === 4, `(got ${currentSection(at(4000), LINE)})`);
t('last section at the bottom', currentSection(at(6300), LINE) === 7, `(got ${currentSection(at(6300), LINE)})`);
t('never returns past the end', currentSection(at(99999), LINE) === 7);
t('empty list is -1', currentSection([], LINE) === -1);
t('single section is always itself', currentSection([-4000], LINE) === 0);
t('a heading exactly on the line counts as passed', currentSection([LINE, LINE + 1], LINE) === 0);
console.log(`\n${fail === 0 ? 'ALL PASS' : fail + ' FAILURES'}`);
process.exit(fail ? 1 : 0);
