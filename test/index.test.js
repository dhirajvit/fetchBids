const assert = require('assert');
// const fetchBids = require('../src').fetchBids;

describe('test ', function () {
  beforeEach(function(){})
  it('fetch Bids require statements', function () {
  assert(require('../src').fetchBids !== undefined)
    const fetchBids = require('../src').fetchBids;
  assert(fetchBids() === 0)
  })
})