var DigitalArtWork = artifacts.require("./DigitalArtWork.sol");

module.exports = function(deployer) {

    var a = {
        artThumbHash: 'QmVJi8akNp7qqdvPutGAumtUm4GRsPDrPjRzTAx2JozyJE',
        artHash: 'QmbkQfD89eA3cb6pncUF6rUbrqrkgDSyP11b9RbKb1NYXj',
        title: 'La Mort de Marat',
        artistName: 'Jacques-Louis David',
        createdYear: 1793,
        artist: '0x6128309c95ea6e5c9dcb43f2d80c54764b52e4e9',
        withdrawAddress: '0x378b89b1015b28873b5764bd507c822684ddea8a'
    }

    deployer.deploy(DigitalArtWork,
                    a.artThumbHash,
                    a.artHash,
                    a.title,
                    a.artistName,
                    a.createdYear,
                    a.artist,
                    a.withdrawAddress);
};
