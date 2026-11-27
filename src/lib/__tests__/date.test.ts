import { endOfDay, startOfDay, subDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { getOffsetDateRange, parseDateRange, parseDateValue } from '../date';

describe('parseDateValue', () => {
  test('parses negative day values', () => {
    expect(parseDateValue('-1day')).toEqual({ num: -1, unit: 'day' });
  });
});

describe('parseDateRange', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('parses -1day as the previous calendar day with hour unit', () => {
    const fixedNow = new Date(2026, 10, 27, 15, 30, 0);
    jest.setSystemTime(fixedNow);

    const range = parseDateRange('-1day');
    const expectedDay = subDays(fixedNow, 1);

    expect(range).toEqual({
      startDate: startOfDay(expectedDay),
      endDate: endOfDay(expectedDay),
      unit: 'hour',
      offset: 0,
      num: 1,
      value: '-1day',
    });
  });

  test('parses -1day in the specified timezone when date differs from UTC', () => {
    // 2026-11-27T02:00:00Z is 2026-11-26 21:00 in America/New_York
    const fixedUtc = new Date('2026-11-27T02:00:00.000Z');
    jest.setSystemTime(fixedUtc);

    const tz = 'America/New_York';
    const range = parseDateRange('-1day', 'en-US', tz);
    const zonedYesterday = subDays(utcToZonedTime(fixedUtc, tz), 1);

    expect(range.startDate).toEqual(startOfDay(zonedYesterday));
    expect(range.endDate).toEqual(endOfDay(zonedYesterday));
    expect(range.startDate.getFullYear()).toBe(2026);
    expect(range.startDate.getMonth()).toBe(10); // November
    expect(range.startDate.getDate()).toBe(25);
    expect(range.unit).toBe('hour');
    expect(range.num).toBe(1);
    expect(range.value).toBe('-1day');
  });

  test('getOffsetDateRange steps -1day backward and forward by 1 calendar day', () => {
    const fixedNow = new Date(2026, 10, 27, 15, 30, 0);
    jest.setSystemTime(fixedNow);

    const yesterday = parseDateRange('-1day');
    const twoDaysAgo = getOffsetDateRange(yesterday, -1);
    const today = getOffsetDateRange(yesterday, 1);

    expect(twoDaysAgo.startDate).toEqual(startOfDay(subDays(fixedNow, 2)));
    expect(twoDaysAgo.endDate).toEqual(endOfDay(subDays(fixedNow, 2)));

    expect(today.startDate).toEqual(startOfDay(fixedNow));
    expect(today.endDate).toEqual(endOfDay(fixedNow));
  });
});
