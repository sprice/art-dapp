#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

// Address deploying from
web3.eth.defaultAccount = '0xb424bc1d2637270e3c1d8e34521fa800f3a83baf';

const contractAddress = '0xe9695889123c830fcba6bc6f612fa82bc1e2c356'

const abiArray = JSON.parse(fs.readFileSync(path.join(__dirname, '../build/contracts/ArtGallery.json'), 'utf8'))
const instance = web3.eth.contract(abiArray.abi).at(contractAddress);

instance.createArtwork(
    '0xb424bc1d2637270e3c1d8e34521fa800f3a83baf',
    'Shawn Price',
    'Autumn',
    'Leaves in the trees',
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
