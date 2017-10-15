const getArtworkContract = (networkName) => {
    let contractId = ''
    switch (networkName) {
    case 'mainnet':
        contractId = false
        break
    case 'rinkeby':
        contractId = '0x0a1fa1e2fcab5014cdb9e850280ed404c1a01e1e'
        break
    case 'unknown':
        contractId = '0xe9695889123c830fcba6bc6f612fa82bc1e2c356'
        break
    default:
        contractId = false
    }
    return contractId
}

export default getArtworkContract
