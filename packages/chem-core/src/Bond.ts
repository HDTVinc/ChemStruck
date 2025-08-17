import type { AtomIndex } from './Atom';

export type BondOrder = 1 | 2 | 3 | 'aromatic';
export type BondStereo = 'up' | 'down' | 'wavy' | null;

export class Bond {
  constructor(
    public a1: AtomIndex,
    public a2: AtomIndex,
    public order: BondOrder,
    public stereo: BondStereo = null,
  ) {}
}
