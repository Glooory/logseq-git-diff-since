export const timeUnits = ['commit', 'day', 'week', 'month'];
export const defaultTimeUnit = timeUnits[1];

export const timeConfigs = {
  commit: {
    unit: 'commit',
    values: ['last'],
  },
  day: {
    unit: 'day',
    values: Array(31).fill(1).map((v, i) => i + 1),
  },
  week: {
    unit: 'week',
    values: Array(3 * 4).fill(1).map((v, i) => i + 1),
  },
  month: {
    unit: 'month',
    values: Array(3).fill(1).map((v, i) => i + 1),
  },
};
