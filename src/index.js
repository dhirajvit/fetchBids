const axios = require('axios');

exports.reducer = reducer = function (accumulator, currentValue, index) {
  accumulator.average = ((accumulator.average * index) + currentValue.price) / (index + 1);// index 0 starting
  accumulator.max = accumulator.max > currentValue.price ? accumulator.max : currentValue.price;
  accumulator.min = accumulator.min < currentValue.price ? accumulator.min : currentValue.price;

  return accumulator
}

exports.calculateMedian = calculateMedian = function(bids){
  const bidslength = bids.length;
  if(bidslength % 2 === 0){
    return (bids[bidslength/2 - 1]['price'] + bids[bidslength/2]['price']) / 2
  }else{
    return bids[(bidslength - 1)/2]['price']
  }
}
exports.fetchBids = function () {
  var bidSummary = {
    average: 0,
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
      const bids = response.data.bids;
      bidSummary.min= bidSummary.max= bids[0].price;
      bidSummary= bids.reduce(reducer, bidSummary);
      bidSummary.median = calculateMedian(bids);
      return bidSummary;
    } else {
      throw new Error('no data found')
    }
  }).catch(function (e) {
    console.log(e);
    throw (e)
  })
}
