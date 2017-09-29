var DigitalArtWork = artifacts.require("./DigitalArtWork.sol");

module.exports = function(deployer) {

    var a = {
        artThumbHash: 'QmVJi8akNp7qqdvPutGAumtUm4GRsPDrPjRzTAx2JozyJE',
        artHash: 'QmbkQfD89eA3cb6pncUF6rUbrqrkgDSyP11b9RbKb1NYXj',
        title: 'La Mort de Marat',
        artistName: 'Jacques-Louis David',
        createdYear: 1793,
        artist: '0x31a22f1129b20bb1123d9323452e52d68cc291b1'
    }

    deployer.deploy(DigitalArtWork,
                    a.artThumbHash,
                    a.artHash,
                    a.title,
                    a.artistName,
                    a.createdYear,
                    a.artist);
};
