const getContract = (networkName) => {
    let contractId = ''
    switch (networkName) {
    case 'mainnet':
        contractId = '0x007bb38a26a84d36c845db7f47aa5d25b241ab16'
        break
    case 'rinkeby':
        contractId = '0x007bb38a26a84d36c845db7f47aa5d25b241ab16'
        break
    case 'unknown':
        contractId = '0x007bb38a26a84d36c845db7f47aa5d25b241ab16'
        break
    default:
        contractId = false
    }
    return contractId
}

export default getContract
