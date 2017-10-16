#!/usr/bin/env node
const fs = require('fs')
const async = require('async')
const path = require('path')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

// Address deploying from
// Rinkeby address
web3.eth.defaultAccount = '0xf5136F6a8C2c8C559FD1468d81a3f7DC9d2dC26E';

// web3.eth.defaultAccount = '0x50cd7bd415f4e47ca7f61b59401b39ca00edfb83';

// Rinkeby contract
const contractAddress = '0xd275a265038c9ab985bc96a81aaabcceef8f57b9'

// const contractAddress = '0x5dfae6113e074e5f178759de6bf2a456a59f2474'

const abiArray = JSON.parse(fs.readFileSync(path.join(__dirname, '../build/contracts/ArtGallery.json'), 'utf8'))
const instance = web3.eth.contract(abiArray.abi).at(contractAddress);

let list = []
for (let i = 0; i < 50; i++) {
    if (i === 4) continue
    if (i === 9) continue
    list.push(i)
}
let artId = 2


artId = artId - 1
const amount = 10000000000000000
const forSaleDate = parseInt(new Date().getTime() / 1000, 10)


// instance.signWork(
//     artId,
//     {gas: 500000},
//     (err, result) => {
//         if (err) {
//             console.log('Deployment Error', err)
//             process.exit(1)
//         }
//         console.log('Deployment Result', result)
//         process.exit(0)
//     })


async.eachSeries(list, (item, callback) => {
    instance.listWorkForSale(
        artId,
        item,
        amount,
        forSaleDate,
        {gas: 500000},
        (err, result) => {
            callback(err, result)
        })
}, (err, result) => {
    if (err) {
        console.log('Deployment Error', err)
        process.exit(1)
    }
    console.log('Deployment Result', result)
    process.exit(0)
})
