#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

// Address deploying from
web3.eth.defaultAccount = '0xf5136F6a8C2c8C559FD1468d81a3f7DC9d2dC26E';

// Rinkeby
// const contractAddress = '0xd275a265038c9ab985bc96a81aaabcceef8f57b9'

const contractAddress = '0xd275a265038c9ab985bc96a81aaabcceef8f57b9'

const abiArray = JSON.parse(fs.readFileSync(path.join(__dirname, '../build/contracts/ArtGallery.json'), 'utf8'))
const instance = web3.eth.contract(abiArray.abi).at(contractAddress);

instance.createArtwork(
    '0xf5136F6a8C2c8C559FD1468d81a3f7DC9d2dC26E',
    'Shawn Price',
    'Autumn',
    'Leaves in the trees.',
    2017,
    'QmT7Tko852jEgrFE9EWT1gHeBjydsobFcQssq8YizPFeGJ',
    'QmTMBboQj3Kum7sffXJ4kvnwwFKy8ycVCaQ9jjHcHHMvKY',
    1,
    {gas: 500000},
    (err, result) => {
        if (err) {
            console.log('Deployment Error', err)
            process.exit(1)
        }
        console.log('Deployment Result', result)
        process.exit(0)
    })

// instance.createArtwork(
//     '0xf5136F6a8C2c8C559FD1468d81a3f7DC9d2dC26E',
//     'Shawn Price',
//     'Forest',
//     'Light through the trees.',
//     2017,
//     'QmeXPv46foy8TXU8jBEeTtHT4agurxnnz6b2sPXdi7oSdp',
//     'QmUvCaGJRqnNm3Vd8MNDZxiCYCE7qCmBcGLmnP94AM6sxP',
//     50,
//     {gas: 4000000},
//     (err, result) => {
//         if (err) {
//             console.log('Deployment Error', err)
//             process.exit(1)
//         }
//         console.log('Deployment Result', result)
//         process.exit(0)
//     })
