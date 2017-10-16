const getContract = (networkName) => {
    let contractId = ''
    switch (networkName) {
    case 'mainnet':
        contractId = false
        break
    case 'rinkeby':
        contractId = '0x0a1fa1e2fcab5014cdb9e850280ed404c1a01e1e'
        break
    case 'unknown':
        contractId = '0xa1a79a2f67160c3de05bf7b6748a5fad9477a2ae'
        break
    default:
        contractId = false
    }
    return contractId
}

export default getContract
