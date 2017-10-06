const getNetwork = (web3) => new Promise(function(resolve, reject) {
    if (!web3) return reject(new Error('Missing required web3 instance'))
    web3.version.getNetwork((err, netId) => {
      let network = {}
      network.id = netId
      network.status = 'active'
      switch (netId) {
        case '1':
          network.name = 'mainnet'
          network.etherscan = 'https://etherscan.io/'
          break
        case '2':
          network.name = 'morden'
          network.status = 'deprecated'
          break
        case '3':
          network.name = 'ropsten'
          network.etherscan = 'https://ropsten.etherscan.io/'
          break
        case '4':
          network.name = 'rinkeby'
          network.etherscan = 'https://rinkeby.etherscan.io/'
          break
        case '42':
          network.name = 'kovan'
          network.etherscan = 'https://kovan.etherscan.io/'
          break
        default:
          network.name = 'unknown'
          network.etherscan = 'https://etherscan.io/'
      }
      return resolve(network)
    })
})

export default getNetwork
