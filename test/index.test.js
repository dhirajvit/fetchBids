const assert = require('assert');
const reducer = require('../src').reducer;
const median = require('../src').calculateMedian;

describe('test ', function () {
  var bidSummary, bids;
  beforeEach(function () {
    bidSummary = {
      average: 0,
      median: 0,
      min: 0,
      max: 0
    }
    bids = [{"price": 1}, {"price": 2}, {"price": 3}]
  })
  it('fetch Bids require statements', function () {
    assert(require('../src').fetchBids !== undefined)
  })
  it('reducer test average calculation', function () {
    assert(bids.reduce(reducer, bidSummary).average === 2)
  })
  it('reducer test max calculation', function () {
    bids = [{"price": 1}, {"price": 2}, {"price": 3}, {"price": 1}]
    bidSummary.min= bidSummary.max= bids[0].price;
    assert(bids.reduce(reducer, bidSummary).max === 3)

  })
  it('calculate Mediam test median calculation', function () {
    bids = [{"price": 1}, {"price": 2}, {"price": 3}, {"price": 4}]
    assert(median(bids) === 2.5)
    bids = [{"price": 1}, {"price": 2}, {"price": 3}, {"price": 4}, {"price": 5}]
    assert(median(bids) === 3)
  })
  it('calculate Mediam test median calculation. edge case', function () {
    bids = [{"price": 0}]
    assert(median(bids) === 0)
    bids = [{"price": 1}]
    assert(median(bids) === 1)
    bids = [{"price": 1}, {"price": 2}]
    assert(median(bids) === 1.5)
  })

})