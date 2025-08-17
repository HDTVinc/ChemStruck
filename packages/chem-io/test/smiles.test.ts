import { describe, it, expect } from 'vitest';
import { SmilesParser, SmilesWriter } from '../src';

const roundTrip = (s: string) => {
  const parser = new SmilesParser();
  const mol = parser.parse(s);
  const out = SmilesWriter.write(mol);
  expect(out).toBe(s);
};

describe('SMILES parse/write', () => {
  it('isobutane', () => roundTrip('CC(C)C'));
  it('ethanol', () => roundTrip('CCO'));
  it('cyclohexane', () => roundTrip('C1CCCCC1'));
  it('invalid valence', () => {
    const parser = new SmilesParser();
    expect(() => parser.parse('C[O+]')).toThrow();
  });
});
