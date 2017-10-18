var DigitalArtWork = artifacts.require("./ArtGallery.sol");

module.exports = function(deployer) {

    // var a = {
    //     withdrawAddress: '0xd897068387dc7620b039c24a6edb4005e2cc94ba'
    // }

    // Rinkeby Test
    // var a = {
    //     withdrawAddress: '0xB659225621BeF60ac15Ef0E7d2f79c3647b40315' // Shawn's cold storage Rinkeby address
    // }

    // Ropsten Test
    var a = {
        withdrawAddress: '0xe407c9d148add4df42f8b4bcaa7e789d2dc4ebcb' // Dave's Ropsten address
    }

    deployer.deploy(DigitalArtWork,
                    a.withdrawAddress);
};
