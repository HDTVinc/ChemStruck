export interface ElementInfo {
  symbol: string;
  z: number;
  covalentRadius: number;
  valences: number[];
}

const DATA: Record<string, ElementInfo> = {
  B: { symbol: 'B', z: 5, covalentRadius: 0.84, valences: [3] },
  C: { symbol: 'C', z: 6, covalentRadius: 0.76, valences: [4] },
  N: { symbol: 'N', z: 7, covalentRadius: 0.71, valences: [3, 5] },
  O: { symbol: 'O', z: 8, covalentRadius: 0.66, valences: [2] },
  F: { symbol: 'F', z: 9, covalentRadius: 0.57, valences: [1] },
  P: { symbol: 'P', z: 15, covalentRadius: 1.07, valences: [3, 5] },
  S: { symbol: 'S', z: 16, covalentRadius: 1.05, valences: [2, 4, 6] },
  Cl: { symbol: 'Cl', z: 17, covalentRadius: 1.02, valences: [1] },
  Br: { symbol: 'Br', z: 35, covalentRadius: 1.2, valences: [1] },
  I: { symbol: 'I', z: 53, covalentRadius: 1.39, valences: [1] },
};

const BY_Z: Record<number, ElementInfo> = Object.fromEntries(
  Object.values(DATA).map((e) => [e.z, e]),
);

export class PeriodicTable {
  static bySymbol(symbol: string): ElementInfo {
    const e = DATA[symbol];
    if (!e) throw new Error(`Unknown element: ${symbol}`);
    return e;
  }

  static byAtomicNumber(z: number): ElementInfo {
    const e = BY_Z[z];
    if (!e) throw new Error(`Unknown atomic number: ${z}`);
    return e;
  }

  static symbol(z: number): string {
    return this.byAtomicNumber(z).symbol;
  }
}
