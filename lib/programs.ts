// Coerce an admin payload into a valid ProgramPlan write object.
const INT_FIELDS = ['fee', 'was', 'sizeOrder', 'typeOrder'] as const;
const STR_FIELDS = [
  'programType',
  'typeLabel',
  'size',
  'target',
  'drawdown',
  'dailyLoss',
  'profitSplit',
  'minDays',
  'timeLimit',
  'newsEas',
  'payouts',
] as const;

export function pickProgramFields(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of STR_FIELDS) {
    if (body[f] !== undefined && body[f] !== null) out[f] = String(body[f]);
  }
  for (const f of INT_FIELDS) {
    if (body[f] !== undefined && body[f] !== null && body[f] !== '') {
      out[f] = Math.round(Number(body[f])) || 0;
    }
  }
  return out;
}
