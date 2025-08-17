import type { Molecule } from './Molecule';
import { PeriodicTable } from './PeriodicTable';

export class ValenceRules {
  static sanitize(mol: Molecule): void {
    mol.atoms.forEach((atom, idx) => {
      const element = PeriodicTable.byAtomicNumber(atom.z);
      const used = mol.bonds.reduce((sum, b) => {
        if (b.a1 === idx || b.a2 === idx) {
          return sum + (b.order === 'aromatic' ? 1 : b.order);
        }
        return sum;
      }, 0);
      const allowed = element.valences.map((v) => v + atom.charge);
      const maxAllowed = Math.max(...allowed);
      let ok = false;
      if (atom.charge !== 0) {
        ok = allowed.includes(used);
      } else {
        ok = used <= maxAllowed;
      }
      if (!ok) {
        throw new Error(`Impossible valence for ${element.symbol}`);
      }
      atom.valenceSlots = maxAllowed - used;
    });
  }
}
