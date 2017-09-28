var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var DigitalArtWork = artifacts.require("./DigitalArtWork.sol");

module.exports = function(deployer) {
    deployer.deploy(SimpleStorage);

    var a = {
        artThumbHash: 'foo',
        artHash: 'bar',
        title: 'baz',
        artistName: 'foobar',
        createdYear: 2017,
        artist: '0xe96b1792d7a6d8012d4f61a4b5e9974129759cea'
    }

    deployer.deploy(DigitalArtWork,
                    a.artThumbHash,
                    a.artHash,
                    a.title,
                    a.artistName,
                    a.createdYear,
                    a.artist);
};
