var DigitalArtWork = artifacts.require("./ArtGallery.sol");

module.exports = function(deployer) {

    var a = {
        withdrawAddress: '0xb424bc1d2637270e3c1d8e34521fa800f3a83baf'
    }

    // Rinkeby Test
    // var a = {
    //     withdrawAddress: '0xB659225621BeF60ac15Ef0E7d2f79c3647b40315' // Shawn's cold storage Rinkeby address
    // }

    deployer.deploy(DigitalArtWork,
                    a.withdrawAddress);
};
