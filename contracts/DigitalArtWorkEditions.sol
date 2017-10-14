pragma solidity 0.4.17;

contract DigitalArtWorkEditions {

    /// LogPurchase is emitted when an artwork is purchased.
    event LogPurchase(
        address newOwner,
        uint256 purchaseAmount,
        uint numEdition
    );

    /// PayoutOwner is emitted when an owner is paid.
    event PayoutOwner(
        address owner,
        uint256 purchaseAmount,
        uint numEdition
    );

    /// PayoutArtist is emitted when an artist is paid.
    event PayoutArtist(
        address artist,
        uint256 purchaseAmount,
        uint numEdition
    );

    /// curator is the contract owner.
    address public contractOwner;

    /// withdrawAddress is the cold-storage address.
    address private withdrawAddress;

    /// artThumbHash is the IPFS hash of the artwork thumbnail.
    string public artThumbHash;

    /// artHash is the IPFS hash of the artwork thumbnail.
    string public artHash;

    /// title is the name of the artwork.
    string public title;

    /// title is the description of the artwork.
    /// Need to implement
    string public description;

    /// artistName is the artwork's artist name.
    string public artistName;

    /// artistKeybase is the artists Keybase.io username
    /// Need to implement
    string public artistKeybase;

    /// artistDoc is an IPFS file hash of a crypto signed text file (eth address, artist statement)
    /// Need to implement
    string public artistDocHash;

    /// artist is the artwork's artist wallet.
    address public artist;

    /// createdYear is the year the artwork was created.
    uint public createdYear;

    /// artistHasSigned flags whether the artist has signed the artwork.
    bool public artistHasSigned;

    /// numEditions is the number of number of editions.
    uint public numEditions;

    /// Provenence is a data structure to track the purchase details of the artwork.
    struct Provenence {
        address owner;
        uint purchaseAmount;
        uint purchaseDate;
    }

    struct Edition {
        /// owner is the artwork owner.
        address owner;

        /// listingPrice is the value in wei that the artwork is on sale for.
        uint256 listingPrice;

        /// forSaleDate is the date at which the artwork is available for sale.
        /// Stored as seconds since epoch.
        uint forSaleDate;

        /// forSale flags whether the artwork is for sale.
        bool forSale;

        // TODO
        /// provenence is an array of all artwork purchases.
        /// Provenence[] public provenence;
    }

    /// editions is an array of all the artwork editions.
    Edition[] public editions;

    /// ownerShare is the percentage the owner of the artwork receives from a sale.
    uint32 private constant ownerShare = 80;

    /// artistShare is the percentage the artist of the artwork receives from a sale.
    uint32 private constant artistShare = 10;

    /// contractOwnerShare is the percentage the contract owner receives from a sale.
    uint32 private constant contractOwnerShare = 10;

    /// onlyOwner ensures only the owner can execute a function.
    modifier onlyOwner(uint numEdition) {
        require(msg.sender == editions[numEdition].owner);
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

    function DigitalArtWorkEditions(string _artThumbHash,
                            string _artHash,
                            string _title,
                            string _artistName,
                            uint _createdYear,
                            address _artist,
                            address _withdrawAddress,
                            uint _numEditions)
    public {

        if (bytes(_artThumbHash).length == 0) revert();
        if (bytes(_artHash).length == 0) revert();
        if (bytes(_title).length == 0) revert();
        if (bytes(_artistName).length == 0) revert();
        if (_createdYear == 0) revert();
        if (_artist == address(0)) revert();
        if (_withdrawAddress == address(0)) revert();
        if (_numEditions < 1) revert();

        // Set initial state of the artwork.
        artThumbHash = _artThumbHash;
        artHash = _artHash;
        title = _title;
        artistName = _artistName;
        createdYear = _createdYear;
        numEditions = _numEditions;
        artistHasSigned = false;

        // Set the artist.
        artist = _artist;

        // contractOwner is the contract creator
        contractOwner = msg.sender;

        // Set the withdraw address.
        withdrawAddress = _withdrawAddress;

        // Create all editions
        for(uint i=0; i<numEditions; i++) {
            editions.push(Edition({
                owner: _artist,
                listingPrice: 0,
                forSaleDate: 0,
                forSale: false
            }));
        }        
    }

    /// getEdition returns edition specific info.
    function getEdition(uint i) public constant returns (Edition) {
        return editions[i];
    }

    /// If an artwork is for sale, process the purchase.
    function buy(uint numEdition) public payable returns (bool) {
        if (editions[numEdition].forSale != true) revert();
        if (artistHasSigned != true) revert();
        if (msg.value < editions[numEdition].listingPrice) revert();
        if (editions[numEdition].forSaleDate > now) revert();

        uint256 artistAmount = msg.value / 100 * artistShare;
        uint256 ownerAmount = msg.value / 100 * ownerShare;

        // Send the artist their share
        if (!artist.send(artistAmount)) {
            revert();
        }
        PayoutArtist(artist, msg.value, numEdition);

        // Send the current owner their share
        if (!editions[numEdition].owner.send(ownerAmount)) {
            revert();
        }
        PayoutOwner(editions[numEdition].owner, msg.value, numEdition);

        // Artwork is no longer for sale
        editions[numEdition].forSale = false;
        editions[numEdition].forSaleDate = 0;
        editions[numEdition].listingPrice = 0;

        // Change ownership
        editions[numEdition].owner = msg.sender;

        // TODO
        // editions[numEdition].provenence.push(Provenence({
        //     owner: editions[numEdition].owner,
        //     purchaseAmount: msg.value,
        //     purchaseDate: now
        // }));

        LogPurchase(msg.sender, msg.value, numEdition);

        return true;
    }

    /// listWorkForSale allows the artist to list the artwork for sale.
    function listWorkForSale(uint numEdition, uint256 _listingPrice, uint _forSaleDate)
    onlyOwner(numEdition)
    public returns (bool) {
        if (_listingPrice <= 0) revert();
        if (_forSaleDate <= 0) revert();
        if (artistHasSigned != true) revert();

        editions[numEdition].listingPrice = _listingPrice;
        editions[numEdition].forSaleDate = _forSaleDate;
        editions[numEdition].forSale = true;

        return editions[numEdition].forSale;
    }

    /// delistWorkForSale allows the artist to delist the artwork from sale.
    function delistWorkForSale(uint numEdition) 
    onlyOwner(numEdition)
    public returns (bool) {
        if (editions[numEdition].forSale != true) revert();

        editions[numEdition].forSale = false;
        editions[numEdition].forSaleDate = 0;
        editions[numEdition].listingPrice = 0;

        return editions[numEdition].forSale;
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
    function getSalesNum(uint numEdition) public constant returns (uint) {
        return numEdition;
        // TODO
        // return editions[numEdition].provenence.length;
    }

    /// withdraw allows the contract owner to transfer out the contract balance.
    function withdraw() public
    onlyContractOwner() {
        withdrawAddress.transfer(this.balance);
    }

    /// Used for development. Remove for deployment.
    function destroy() public
    onlyContractOwner() {
        selfdestruct(withdrawAddress);
    }
}