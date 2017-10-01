pragma solidity 0.4.15;

contract DigitalArtWork {
    address public curator;
    address public owner;
    string public artThumbHash;
    string public artHash;
    uint256 public listingPrice;
    string public title;
    string public artistName;
    address public artist;
    uint public createdYear;
    uint public forSaleDate;
    uint public curatorCurrentBalance;
    bool public forSale;
    bool public artistHasSigned;
    // The artist receives 85% of the initial sale amount
    // and 10% of every subsequent sale.
    // The contract owner receives 15% of every sale amount
    uint32 private constant ownerShare = 75;
    uint32 private constant artistShare = 10;
    uint32 private constant curatorShare = 15;

    struct OwnerProvenence {
        address owner;
        uint purchaseAmount;
        uint purchaseDate;
    }
    OwnerProvenence[] public ownerProvenence;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyCurator() {
        require(msg.sender == curator);
        _;
    }

    modifier onlyArtist() {
        require(msg.sender == artist);
        _;
    }

    function DigitalArtWork(string _artThumbHash,
                            string _artHash,
                            string _title,
                            string _artistName,
                            uint _createdYear,
                            address _artist) {

        if (bytes(_artThumbHash).length == 0) revert();
        if (bytes(_artHash).length == 0) revert();
        if (bytes(_title).length == 0) revert();
        if (bytes(_artistName).length == 0) revert();
        if (_createdYear == 0) revert();
        if (_artist == address(0)) revert();

        artThumbHash = _artThumbHash;
        artHash = _artHash;
        title = _title;
        artistName = _artistName;
        createdYear = _createdYear;
        artistHasSigned = false;
        forSale = false;
        curatorCurrentBalance = 0;

        // Set the artist
        artist = _artist;

        // Initial owner is the artist
        owner = _artist;

        // Curator is the contract creator
        curator = msg.sender;
    }

    event LogPurchase(address purchaseOwner, uint256 purchaseAmount);

    function buy() payable returns (bool) {
        if (forSale != true) revert();
        if (artistHasSigned != true) revert();
        if (msg.value != listingPrice) revert();
        if (forSaleDate > now) revert();

        // @TODO: deal with possible decimals?
        uint256 artistAmount = msg.value / 100 * artistShare;
        uint256 ownerAmount = msg.value / 100 * ownerShare;
        uint256 curatorAmount = msg.value / 100 * curatorShare;

        // Send the artist their share
        if (!artist.send(artistAmount)) {
            revert();
        }

        // Send the current owner their share
        if (!owner.send(ownerAmount)) {
            revert();
        }

        // Artwork is no longer for sale
        forSale = false;
        forSaleDate = 0;
        listingPrice = 0;

        // Track curator balance
        curatorCurrentBalance += curatorAmount;

        // Change ownership
        owner = msg.sender;

        ownerProvenence.push(OwnerProvenence({
            owner: owner,
            purchaseAmount: msg.value,
            purchaseDate: now
        }));

        LogPurchase(msg.sender, msg.value);

        return true;
    }

    function listWorkForSale(uint256 _listingPrice, uint _forSaleDate)
    onlyOwner()
    public returns (bool) {
        if (_listingPrice <= 0) revert();
        if (_forSaleDate <= 0) revert();
        if (artistHasSigned != true) revert();

        listingPrice = _listingPrice;
        forSaleDate = _forSaleDate;
        forSale = true;

        return forSale;
    }

    function delistWorkForSale() 
    onlyOwner()
    public returns (bool) {
        if (forSale != true) revert();

        forSale = false;
        forSaleDate = 0;
        listingPrice = 0;

        return forSale;
    }

    function signWork() 
    onlyArtist() 
    public returns (bool) {
        if (artistHasSigned) revert();

        artistHasSigned = true;

        return artistHasSigned;
    }

    // Allow the contract owner to withdraw value
    function withdraw(uint256 amount)
    onlyCurator()
    returns (uint256) {
        if (amount <= 0) revert();
        if (amount > curatorCurrentBalance) revert();

        if (!curator.send(amount)) {
            revert();
        }

        curatorCurrentBalance -= amount;

        return amount;
    }

    function destroy()
    onlyCurator() {
        selfdestruct(curator);
    }
}