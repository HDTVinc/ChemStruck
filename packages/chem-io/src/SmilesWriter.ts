import { Molecule, PeriodicTable } from '@chem/core';

interface RingDigitInfo {
  neighbor: number;
  digit: number;
}

function assignRingDigits(mol: Molecule) {
  const digits = new Map<number, RingDigitInfo[]>();
  const skip = new Set<string>();
  let next = 1;
  const visited = new Set<number>();

  const dfs = (idx: number, parent: number | null) => {
    visited.add(idx);
    for (const n of mol.getNeighbors(idx)) {
      if (n === parent) continue;
      if (!visited.has(n)) {
        dfs(n, idx);
      } else if (idx < n) {
        const key = `${idx}-${n}`;
        if (!skip.has(key)) {
          const digit = next++;
          if (!digits.has(idx)) digits.set(idx, []);
          if (!digits.has(n)) digits.set(n, []);
          digits.get(idx)!.push({ neighbor: n, digit });
          digits.get(n)!.push({ neighbor: idx, digit });
          skip.add(key);
        }
      }
    }
  };
  if (mol.atoms.length > 0) dfs(0, null);
  return { digits, skip };
}

export class SmilesWriter {
  static write(mol: Molecule): string {
    if (mol.atoms.length === 0) return '';
    const { digits, skip } = assignRingDigits(mol);
    const visited = new Set<number>();

    const atomToString = (idx: number): string => {
      const atom = mol.atoms[idx];
      const sym = PeriodicTable.symbol(atom.z);
      let s = sym;
      if (atom.charge !== 0) s = `[${sym}${atom.charge > 0 ? '+' : '-'}]`;
      const d = digits.get(idx) ?? [];
      if (d.length) s += d.map((r) => r.digit).join('');
      return s;
    };

    const dfsWrite = (idx: number, parent: number | null): string => {
      visited.add(idx);
      let result = atomToString(idx);
      let neighbors = mol.getNeighbors(idx).filter((n) => n !== parent);
      neighbors = neighbors.filter((n) => !(idx < n && skip.has(`${idx}-${n}`)));
      neighbors.sort((a, b) => a - b);
      const chain = neighbors.pop();
      for (const n of neighbors) {
        if (visited.has(n)) continue;
        result += `(${dfsWrite(n, idx)})`;
      }
      if (chain !== undefined && !visited.has(chain)) {
        result += dfsWrite(chain, idx);
      }
      return result;
    };

    return dfsWrite(0, null);
  }
}
