const axios = require('axios');

exports.reducer = reducer = function (accumulator, currentValue, index) {
  accumulator.average = ((accumulator.average * index) + currentValue.price) / (index + 1);// index 0 starting
  accumulator.max = accumulator.max > currentValue.price ? accumulator.max : currentValue.price;
  accumulator.min = accumulator.min < currentValue.price ? accumulator.min : currentValue.price;
  return accumulator
}

exports.fetchBids = function () {
  var bidSummary = {
    average: 0,
    median: 0,
    min: 0,
    max: 0
  }

  axios({
    url: 'https://api.bitfinex.com/v1/book/BTCUSD?limit_bids=1000?limit_asks=1000',
    method: 'get',
  }).then(function (response) {
    if (response.status !== 200) {
      throw new Error('nok') // not ok
    }
    if (response.data && response.data.bids !== undefined) {// obj.create
      bidSummary.min= bidSummary.max= response.data.bids[0].price;
      return response.data.bids.reduce(reducer, bidSummary)
    } else {
      throw new Error('no data found')
    }
  }).catch(function (e) {
    console.log(e);
    throw (e)
  })
}
