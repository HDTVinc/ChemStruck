import {
  Atom,
  Molecule,
  PeriodicTable,
  ValenceRules,
} from '@chem/core';

export class SmilesParser {
  parse(smiles: string): Molecule {
    const mol = new Molecule();
    const stack: number[] = [];
    const ring: Map<number, number> = new Map();
    let current: number | null = null;
    let i = 0;

    const readAtom = (): number => {
      if (smiles[i] === '[') {
        const end = smiles.indexOf(']', i);
        if (end === -1) throw new Error('Unclosed bracket');
        const inside = smiles.slice(i + 1, end);
        const m = inside.match(/^(Cl|Br|[BCNOFPSI])([+-])?$/);
        if (!m) throw new Error(`Unsupported atom: ${inside}`);
        const sym = m[1];
        const charge = m[2] === '+' ? 1 : m[2] === '-' ? -1 : 0;
        const atom = new Atom(PeriodicTable.bySymbol(sym).z, 0, charge);
        const idx = mol.addAtom(atom);
        i = end + 1;
        return idx;
      }
      let sym: string | null = null;
      if (smiles.startsWith('Cl', i) || smiles.startsWith('Br', i)) {
        sym = smiles.slice(i, i + 2);
        i += 2;
      } else {
        sym = smiles[i];
        i += 1;
      }
      const allowed = ['B', 'C', 'N', 'O', 'F', 'P', 'S', 'Cl', 'Br', 'I'];
      if (!allowed.includes(sym)) throw new Error(`Unsupported atom: ${sym}`);
      const atom = new Atom(PeriodicTable.bySymbol(sym).z);
      const idx = mol.addAtom(atom);
      return idx;
    };

    while (i < smiles.length) {
      const ch = smiles[i];
      if (ch === '(') {
        if (current === null) throw new Error('Branch with no starting atom');
        stack.push(current);
        i++;
        continue;
      }
      if (ch === ')') {
        current = stack.pop() ?? null;
        i++;
        continue;
      }
      if (ch === '[' || /[A-Za-z]/.test(ch)) {
        const idx = readAtom();
        if (current !== null) mol.addBond(current, idx, 1);
        current = idx;
        continue;
      }
      if (/[1-9]/.test(ch)) {
        const d = parseInt(ch, 10);
        if (current === null) throw new Error('Ring digit with no atom');
        const other = ring.get(d);
        if (other === undefined) ring.set(d, current);
        else {
          mol.addBond(current, other, 1);
          ring.delete(d);
        }
        i++;
        continue;
      }
      throw new Error(`Unexpected character: ${ch}`);
    }

    if (stack.length) throw new Error('Unclosed branch');
    if (ring.size) throw new Error('Unclosed ring');

    ValenceRules.sanitize(mol);
    return mol;
  }
}
