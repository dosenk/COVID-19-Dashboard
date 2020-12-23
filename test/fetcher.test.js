const regeneratorRuntime = require('regenerator-runtime');
const { GLOBAL_COVID_URL } = require('../src/Fetcher/constants');
const Fetcher = require('../src/Fetcher/index.Fetcher');

const mockData = { data: [{}] };

describe('testing Fetcher with response with OK status', () => {
  it('should return data', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockData),
      }),
    );

    const received = await Fetcher.fetchGlobalCovid();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(received).toEqual(mockData);
  });
});

describe('testing Fetcher with response Internal Server Error', () => {
  it('should throw an error with 500 status', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve(mockData),
      }),
    );

    try {
      await Fetcher.fetchGlobalCovid();
    } catch (e) {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(e.message).toEqual('500');
    }
  });
});

describe('testing Fetcher.fetchGlobalCovid()', () => {
  it('should be use right url', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(mockData),
      }),
    );

    try {
      await Fetcher.fetchGlobalCovid();
    } catch (e) {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(GLOBAL_COVID_URL);
    }
  });
});
