const getContract = (networkName) => {
    let contractId = ''
    switch (networkName) {
    case 'mainnet':
        contractId = false
        break
    case 'rinkeby':
        contractId = '0xd275a265038c9ab985bc96a81aaabcceef8f57b9'
        break
    case 'unknown':
        contractId = ''
        break
    default:
        contractId = false
    }
    return contractId
}

export default getContract
