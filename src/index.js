const axios = require('axios');
var fs = require('fs');

exports.reducer = reducer = function (accumulator, currentValue) {
  const price = parseFloat(currentValue.price);
  accumulator.sum = accumulator.sum + price;
  accumulator.max = accumulator.max > price ? accumulator.max : price;
  accumulator.min = accumulator.min < price ? accumulator.min : price;
  return accumulator
}

exports.calculateMedian = calculateMedian = function (bids) {
  const bidslength = bids.length;
  if (bidslength % 2 === 0) {
    return (parseFloat((bids[bidslength / 2 - 1]['price'])) + parseFloat(bids[bidslength / 2]['price']) ) / 2
  } else {
    return parseFloat(bids[(bidslength - 1) / 2]['price'])
  }
}
exports.fetchBids = fetchBids = function () {
  var bidSummary = {
    sum: 0,
    min: 0,
    max: 0
  }

  return axios({ // return axios promise
    url: 'https://api.bitfinex.com/v1/book/BTCUSD?limit_bids=1000?limit_asks=1000',
    method: 'get',
  })
    .then(function (response) {
      if (response.status !== 200) {
        throw new Error('nok') // not ok
      }
      if (response.data && response.data.bids !== undefined) {// obj.create
        const bids = response.data.bids;
        bidSummary.min = bidSummary.max = parseFloat(bids[0].price);
        bidSummary = bids.reduce(reducer, bidSummary);
        bidSummary.average = bidSummary.sum / bids.length;
        bidSummary.median = calculateMedian(bids);
        delete bidSummary['sum']
        return bidSummary;
      } else {
        throw new Error('no data found')
      }
    })
    .catch(function (e) {
      console.log(e);
      throw (e)
    })
}
exports.readData = readData = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile('data.json', 'utf8', function readfile(err, data) {
      if (err) {
        reject(err);
      } else {
        obj = JSON.parse(data); //now it an object
        resolve(obj);
      }
    });
  })
}

exports.writeData = writeData = function (json) {
  return new Promise(function (resolve, reject) {
    fs.writeFile('data.json', json, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve('write to data.json done');
      }
    })
  })
}

exports.getBids = getBids = function () {
  var obj = {
    table: []
  };
  return Promise.all([fetchBids(), readData()])
    .then(function (values) {
      obj.table = values[1].table;
      obj.table.push(values[0]);
      var json = JSON.stringify(obj); //convert it back to json
      return json;
    })
    .catch(function (e) {
      throw(e)
    })
}

exports.writeBidsSummary = function () {
  var intervalId = setInterval(function () {
    getBids().then(function (json) {
      writeData(json)
        .then(function (success) {
          console.log(success); // Not sure if it is required
        })
        .catch(function (e) {
          console.log(e);
          console.log('process going to stop')
          clearInterval(intervalId)
        })
    })
      .catch(function(e){
        console.log(e);
        console.log('process going to stop')
        clearInterval(intervalId)
      });
  }, 10000);
}