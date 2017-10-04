const getNetwork = (web3) => new Promise(function(resolve, reject) {
    if (!web3) return reject(new Error('Missing required web3 instance'))
    web3.version.getNetwork((err, netId) => {
      let network = {}
      network.id = netId
      network.status = 'active'
      switch (netId) {
        case '1':
          network.name = 'mainnet'
          break
        case '2':
          network.name = 'morden'
          network.status = 'deprecated'
          break
        case '3':
          network.name = 'ropsten'
          break
        case '4':
          network.name = 'rinkeby'
          break
        case '42':
          network.name = 'kovan'
          break
        default:
          network.name = 'unknown'
      }
      return resolve(network)
    })
})

export default getNetwork
