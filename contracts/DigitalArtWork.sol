pragma solidity 0.4.15;

contract DigitalArtWork {

    /// LogPurchase is emitted when an artwork is purchased.
    event LogPurchase(
        address newOwner,
        uint256 purchaseAmount
    );

    /// PayoutOwner is emitted when an owner is paid.
    event PayoutOwner(
        address owner,
        uint256 purchaseAmount
    );

    /// PayoutArtist is emitted when an artist is paid.
    event PayoutArtist(
        address artist,
        uint256 purchaseAmount
    );

    /// curator is the contract owner.
    address public contractOwner;

    /// withdrawAddress is the cold-storage address.
    address private withdrawAddress;

    // owner is the artwork owner.
    address public owner;

    /// artThumbHash is the IPFS hash of the artwork thumbnail.
    string public artThumbHash;

    /// artHash is the IPFS hash of the artwork thumbnail.
    string public artHash;

    /// listingPrice is the value in wei that the artwork is on sale for.
    uint256 public listingPrice;

    /// title is the name of the artwork.
    string public title;

    /// artistName is the artwork's artist name.
    string public artistName;

    /// artist is the artwork's artist wallet.
    address public artist;

    /// createdYear is the year the artwork was created.
    uint public createdYear;

    /// forSaleDate is the date at which the artwork is available for sale.
    /// Stored as seconds since epoch.
    uint public forSaleDate;

    /// forSale flags whether the artwork is for sale.
    bool public forSale;

    /// artistHasSigned flags whether the artist has signed the artwork.
    bool public artistHasSigned;

    /// ownerShare is the percentage the owner of the artwork receives from a sale.
    uint32 private constant ownerShare = 75;

    /// artistShare is the percentage the artist of the artwork receives from a sale.
    uint32 private constant artistShare = 10;

    /// contractOwnerShare is the percentage the contract owner receives from a sale.
    uint32 private constant contractOwnerShare = 15;

    /// Provenence is a data structure to track the purchase details of the artwork.
    struct Provenence {
        address owner;
        uint purchaseAmount;
        uint purchaseDate;
    }

    /// provenence is an array of all artwork purchases.
    Provenence[] public provenence;

    /// onlyOwner ensures only the owner can execute a function.
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /// onlyContractOwner ensures only the contract owner can execute a function.
    modifier onlyContractOwner() {
        require(msg.sender == contractOwner);
        _;
    }

    /// onlyArtist ensures only the artwork artist can execute a function.
    modifier onlyArtist() {
        require(msg.sender == artist);
        _;
    }

    function DigitalArtWork(string _artThumbHash,
                            string _artHash,
                            string _title,
                            string _artistName,
                            uint _createdYear,
                            address _artist,
                            address _withdrawAddress) {

        if (bytes(_artThumbHash).length == 0) revert();
        if (bytes(_artHash).length == 0) revert();
        if (bytes(_title).length == 0) revert();
        if (bytes(_artistName).length == 0) revert();
        if (_createdYear == 0) revert();
        if (_artist == address(0)) revert();
        if (_withdrawAddress == address(0)) revert();

        // Set initial state of the artwork.
        artThumbHash = _artThumbHash;
        artHash = _artHash;
        title = _title;
        artistName = _artistName;
        createdYear = _createdYear;
        artistHasSigned = false;
        forSale = false;

        // Set the artist.
        artist = _artist;

        // The artist is the initial owner of the artwork.
        owner = _artist;

        // contractOwner is the contract creator
        contractOwner = msg.sender;

        // Set the withdraw address.
        withdrawAddress = _withdrawAddress;
    }

    /// If an artwork is for sale, process the purchase.
    function buy() payable returns (bool) {
        if (forSale != true) revert();
        if (artistHasSigned != true) revert();
        if (msg.value < listingPrice) revert();
        if (forSaleDate > now) revert();

        uint256 artistAmount = msg.value / 100 * artistShare;
        uint256 ownerAmount = msg.value / 100 * ownerShare;

        // Send the artist their share
        if (!artist.send(artistAmount)) {
            revert();
        }
        PayoutArtist(artist, msg.value);

        // Send the current owner their share
        if (!owner.send(ownerAmount)) {
            revert();
        }
        PayoutOwner(owner, msg.value);

        // Artwork is no longer for sale
        forSale = false;
        forSaleDate = 0;
        listingPrice = 0;

        // Change ownership
        owner = msg.sender;

        provenence.push(Provenence({
            owner: owner,
            purchaseAmount: msg.value,
            purchaseDate: now
        }));

        LogPurchase(msg.sender, msg.value);

        return true;
    }

    /// listWorkForSale allows the artist to list the artwork for sale.
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

    /// delistWorkForSale allows the artist to delist the artwork from sale.
    function delistWorkForSale() 
    onlyOwner()
    public returns (bool) {
        if (forSale != true) revert();

        forSale = false;
        forSaleDate = 0;
        listingPrice = 0;

        return forSale;
    }

    /// signWork allows the artist to sign the work.
    function signWork() 
    onlyArtist() 
    public returns (bool) {
        if (artistHasSigned) revert();

        artistHasSigned = true;

        return artistHasSigned;
    }

    /// getSalesNum returns the number of purchases.
    function getSalesNum() constant returns (uint) {
        return provenence.length;
    }

    /// withdraw allows the contract owner to transfer out the contract balance.
    function withdraw()
    onlyContractOwner() {
        withdrawAddress.transfer(this.balance);
    }

    /// Used for development. Remove for deployment.
    function destroy()
    onlyContractOwner() {
        selfdestruct(withdrawAddress);
    }
}