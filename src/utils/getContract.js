const getContract = (networkName, pageId) => {
    let contractId = ''
    switch (networkName) {
    case 'mainnet':
        contractId = false
        break
    case 'rinkeby':
        contractId = false
        break
    case 'unknown':
        switch(pageId) {
        case '1':
            contractId = '0x007bb38a26a84d36c845db7f47aa5d25b241ab16'
            break
        default:
            contractId = false
        }
        break
    default:
        contractId = false
    }
    return contractId
}

export default getContract
