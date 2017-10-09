const getContract = (networkName, pageId) => {
    let contractId = ''
    switch (networkName) {
    case 'mainnet':
        contractId = false
        break
    case 'rinkeby':
        switch(pageId) {
        case '1':
            contractId = '0x0a1fa1e2fcab5014cdb9e850280ed404c1a01e1e'
            break
        default:
            contractId = false
        }
        break
    case 'unknown':
        switch(pageId) {
        case '1':
            contractId = ''
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
