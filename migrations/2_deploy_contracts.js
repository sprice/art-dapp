var DigitalArtWork = artifacts.require("./DigitalArtWork.sol");

module.exports = function(deployer) {

    var a = {
        artThumbHash: 'QmT7Tko852jEgrFE9EWT1gHeBjydsobFcQssq8YizPFeGJ',
        artHash: 'QmTMBboQj3Kum7sffXJ4kvnwwFKy8ycVCaQ9jjHcHHMvKY',
        title: 'Autumn',
        artistName: 'Shawn Price',
        createdYear: 2017,
        artist: '',
        withdrawAddress: ''
    }

    // // Rinkeby Test
    // var a = {
    //     artThumbHash: 'QmT7Tko852jEgrFE9EWT1gHeBjydsobFcQssq8YizPFeGJ',
    //     artHash: 'QmTMBboQj3Kum7sffXJ4kvnwwFKy8ycVCaQ9jjHcHHMvKY',
    //     title: 'Autumn',
    //     artistName: 'Shawn Price',
    //     createdYear: 2017,
    //     artist: '0xf5136F6a8C2c8C559FD1468d81a3f7DC9d2dC26E', // Shawn's Metamask Address
    //     withdrawAddress: '0xB659225621BeF60ac15Ef0E7d2f79c3647b40315' // Shawn's cold storage Rinkeby address
    // }

    deployer.deploy(DigitalArtWork,
                    a.artThumbHash,
                    a.artHash,
                    a.title,
                    a.artistName,
                    a.createdYear,
                    a.artist,
                    a.withdrawAddress);
};
