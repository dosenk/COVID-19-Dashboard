const { BY_100K_CONFIRMED } = require('../src/Constants/dataTypes');
const utils = require('../src/Observer/utils.Observer');

describe('testing convertGlobalData()', () => {
  const { convertGlobalData } = utils;

  const globalData = {
    data: [
      {
        confirmed: 500000,
        recovered: 200000,
        deaths: 100000,
        new_deaths: 50000,
        new_recovered: 20000,
        new_confirmed: 10000,
        date: '2020-12-16',
      },
    ],
  };

  it('should be defined', () => {
    expect(convertGlobalData).toBeDefined();
    expect(utils.convertTimelineObj).not.toBeDefined();
  });

  it('should throw an error', () => {
    expect(() => convertGlobalData({})).toThrow();
    expect(() => convertGlobalData({ data: [] })).toThrow();
  });

  it('should return an array', () => {
    expect(convertGlobalData(globalData)).toEqual(expect.any(Array));
    expect(convertGlobalData(globalData)).toHaveLength(globalData.data.length);
  });

  it('should return expected', () => {
    const result = convertGlobalData(globalData);

    expect(result[0]).not.toHaveProperty('confirmed');
    expect(result[0]).toHaveProperty(BY_100K_CONFIRMED);
  });
});
