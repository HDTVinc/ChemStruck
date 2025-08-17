export class Atom {
  constructor(
    public z: number,
    public isotope = 0,
    public charge = 0,
    public valenceSlots = 0,
    public mapIdx?: number,
  ) {}
}

export type AtomIndex = number;
