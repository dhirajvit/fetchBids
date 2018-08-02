const assert = require('assert');
const reducer = require('../src').reducer;

describe('test ', function () {
  var bidSummary, bidsArray;
  beforeEach(function () {
    bidSummary = {
      average: 0,
      median: 0,
      min: 0,
      max: 0
    }
    bidsArray = [{"price": 1}, {"price": 2}, {"price": 3}]
  })
  it('fetch Bids require statements', function () {
    assert(require('../src').fetchBids !== undefined)
  })
  it('reducer test average calculation', function () {
    assert(bidsArray.reduce(reducer, bidSummary).average === 2)
  })
})