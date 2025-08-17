import { Atom, AtomIndex } from './Atom';
import { Bond, BondOrder, BondStereo } from './Bond';

export class Molecule {
  atoms: Atom[] = [];
  bonds: Bond[] = [];

  addAtom(atom: Atom): AtomIndex {
    this.atoms.push(atom);
    return this.atoms.length - 1;
  }

  addBond(a1: AtomIndex, a2: AtomIndex, order: BondOrder = 1, stereo: BondStereo = null): number {
    const bond = new Bond(a1, a2, order, stereo);
    this.bonds.push(bond);
    return this.bonds.length - 1;
  }

  removeBond(index: number): void {
    this.bonds.splice(index, 1);
  }

  removeAtom(index: AtomIndex): void {
    this.atoms.splice(index, 1);
    this.bonds = this.bonds
      .filter((b) => b.a1 !== index && b.a2 !== index)
      .map((b) => {
        const a1 = b.a1 > index ? b.a1 - 1 : b.a1;
        const a2 = b.a2 > index ? b.a2 - 1 : b.a2;
        return new Bond(a1, a2, b.order, b.stereo);
      });
  }

  getNeighbors(index: AtomIndex): AtomIndex[] {
    const result: AtomIndex[] = [];
    for (const b of this.bonds) {
      if (b.a1 === index) result.push(b.a2);
      else if (b.a2 === index) result.push(b.a1);
    }
    return result;
  }

  fragments(): AtomIndex[][] {
    const visited = new Set<AtomIndex>();
    const frags: AtomIndex[][] = [];
    for (let i = 0; i < this.atoms.length; i++) {
      if (visited.has(i)) continue;
      const stack = [i];
      const frag: AtomIndex[] = [];
      visited.add(i);
      while (stack.length) {
        const a = stack.pop()!;
        frag.push(a);
        for (const n of this.getNeighbors(a)) {
          if (!visited.has(n)) {
            visited.add(n);
            stack.push(n);
          }
        }
      }
      frags.push(frag);
    }
    return frags;
  }

  clone(): Molecule {
    const m = new Molecule();
    m.atoms = this.atoms.map(
      (a) => new Atom(a.z, a.isotope, a.charge, a.valenceSlots, a.mapIdx),
    );
    m.bonds = this.bonds.map((b) => new Bond(b.a1, b.a2, b.order, b.stereo));
    return m;
  }

  private canonicalForm(): string {
    const atoms = this.atoms.map((a, idx) => ({
      idx,
      label: `${a.z}:${a.charge}`,
    }));
    atoms.sort((a, b) => a.label.localeCompare(b.label));
    const map = new Map<number, number>();
    atoms.forEach((a, i) => map.set(a.idx, i));
    const bonds = this.bonds
      .map((b) => {
        let a1 = map.get(b.a1)!;
        let a2 = map.get(b.a2)!;
        if (a1 > a2) [a1, a2] = [a2, a1];
        return { a1, a2, order: b.order };
      })
      .sort((x, y) => x.a1 - y.a1 || x.a2 - y.a2 || (x.order as number) - (y.order as number));
    const atomList = atoms.map((a) => a.label).join(',');
    const bondList = bonds.map((b) => `${b.a1}-${b.a2}-${b.order}`).join(',');
    return `${atomList}|${bondList}`;
  }

  equalsIso(other: Molecule): boolean {
    return this.canonicalForm() === other.canonicalForm();
  }
}

export { Atom } from './Atom';
export { Bond } from './Bond';
