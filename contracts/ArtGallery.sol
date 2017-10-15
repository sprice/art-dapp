pragma solidity 0.4.17;

contract ArtGallery {

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

    /// numArtworks is a counter for the number of artworks in the gallery.
    uint numArtworks;

    struct ArtWork {
        /// artist is the artwork's artist wallet.
        address artist;

        /// artistName is the artwork's artist name.
        string artistName;

        /// title is the name of the artwork.
        string title;

        /// title is the description of the artwork.
        string description;

        /// createdYear is the year the artwork was created.
        uint createdYear;

        /// artThumbHash is the IPFS hash of the artwork thumbnail.
        string artThumbHash;

        /// artHash is the IPFS hash of the artwork thumbnail.
        string artHash;

        /// numEditions is the number of number of editions.
        uint numEditions;

        /// artistHasSigned flags whether the artist has signed the artwork.
        bool artistHasSigned;

        /// editions is an array of all the artwork editions.
        /// getter function automatically created.
        mapping (uint => Edition) editions;
    }

    /// artworks is an array of all the artworks in the gallery..
    /// getter function automatically created.
    mapping (uint => ArtWork) public artworks;

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

        /// provenence is an array of all artwork purchases.
        Provenence[] provenence;
    }

    /// ownerShare is the percentage the owner of the artwork receives from a sale.
    uint32 private constant ownerShare = 80;

    /// artistShare is the percentage the artist of the artwork receives from a sale.
    uint32 private constant artistShare = 10;

    /// contractOwnerShare is the percentage the contract owner receives from a sale.
    uint32 private constant contractOwnerShare = 10;

    /// onlyOwner ensures only the artwork owner can execute a function.
    modifier onlyOwner(uint numArtwork, uint numEdition) {
        require(msg.sender == artworks[numArtwork].editions[numEdition].owner);
        _;
    }

    /// onlyContractOwner ensures only the contract owner can execute a function.
    modifier onlyContractOwner() {
        require(msg.sender == contractOwner);
        _;
    }

    /// onlyArtist ensures only the artwork artist can execute a function.
    modifier onlyArtist(uint numArtwork) {
        require(msg.sender == artworks[numArtwork].artist);
        _;
    }

    function ArtGallery(address _withdrawAddress)
    public {
        if (_withdrawAddress == address(0)) revert();

        // Set the withdraw address.
        withdrawAddress = _withdrawAddress;

        // contractOwner is the contract creator
        contractOwner = msg.sender;

        numArtworks = 0;
    }

    function createArtwork(address _artist,
                           string _artistName,
                           string _title,
                           string _description,
                           uint _createdYear,
                           string _artThumbHash,
                           string _artHash,
                           uint _numEditions)
    onlyContractOwner()
    public {

        if (_artist == address(0)) revert();
        if (bytes(_artistName).length == 0) revert();
        if (bytes(_title).length == 0) revert();
        if (bytes(_description).length == 0) revert();
        if (_createdYear == 0) revert();
        if (bytes(_artThumbHash).length == 0) revert();
        if (bytes(_artHash).length == 0) revert();
        if (_numEditions < 1) revert();

        artworks[numArtworks].artist = _artist;
        artworks[numArtworks].artistName = _artistName;
        artworks[numArtworks].title = _title;
        artworks[numArtworks].description = _description;
        artworks[numArtworks].createdYear = _createdYear;
        artworks[numArtworks].artThumbHash = _artThumbHash;
        artworks[numArtworks].artHash = _artHash;
        artworks[numArtworks].numEditions = _numEditions;
        artworks[numArtworks].artistHasSigned = false;

        // Create all editions
        for(uint i=0; i<artworks[numArtworks].numEditions; i++) {
            artworks[numArtworks].editions[i].owner = _artist;
            artworks[numArtworks].editions[i].listingPrice = 0;
            artworks[numArtworks].editions[i].forSaleDate = 0;
            artworks[numArtworks].editions[i].forSale = false;
        }

        numArtworks += 1;
    }

    /// If an artwork is for sale, process the purchase.
    function buy(uint numArtwork, uint numEdition) public payable returns (bool) {
        if (numArtwork < 0) revert();
        if (numEdition < 0) revert();
        if (artworks[numArtwork].editions[numEdition].forSale != true) revert();
        if (artworks[numArtwork].artistHasSigned != true) revert();
        if (msg.value < artworks[numArtwork].editions[numEdition].listingPrice) revert();
        if (artworks[numArtwork].editions[numEdition].forSaleDate > now) revert();

        uint256 artistAmount = msg.value / 100 * artistShare;
        uint256 ownerAmount = msg.value / 100 * ownerShare;

        // Send the artist their share
        if (!artworks[numArtwork].artist.send(artistAmount)) {
            revert();
        }
        PayoutArtist(artworks[numArtwork].artist, msg.value, numEdition);

        // Send the current owner their share
        if (!artworks[numArtwork].editions[numEdition].owner.send(ownerAmount)) {
            revert();
        }
        PayoutOwner(artworks[numArtwork].editions[numEdition].owner, msg.value, numEdition);

        // Artwork is no longer for sale
        artworks[numArtwork].editions[numEdition].forSale = false;
        artworks[numArtwork].editions[numEdition].forSaleDate = 0;
        artworks[numArtwork].editions[numEdition].listingPrice = 0;

        // Change ownership
        artworks[numArtwork].editions[numEdition].owner = msg.sender;

        artworks[numArtwork].editions[numEdition].provenence.push(Provenence({
            owner: artworks[numArtwork].editions[numEdition].owner,
            purchaseAmount: msg.value,
            purchaseDate: now
        }));

        LogPurchase(msg.sender, msg.value, numEdition);

        return true;
    }

    /// listWorkForSale allows the artist to list the artwork for sale.
    function listWorkForSale(uint numArtwork, uint numEdition, uint256 _listingPrice, uint _forSaleDate)
    onlyOwner(numArtwork, numEdition)
    public returns (bool) {
        if (numArtwork < 0) revert();
        if (numEdition < 0) revert();
        if (_listingPrice <= 0) revert();
        if (_forSaleDate <= 0) revert();
        if (artworks[numArtwork].artistHasSigned != true) revert();

        artworks[numArtwork].editions[numEdition].listingPrice = _listingPrice;
        artworks[numArtwork].editions[numEdition].forSaleDate = _forSaleDate;
        artworks[numArtwork].editions[numEdition].forSale = true;

        return artworks[numArtwork].editions[numEdition].forSale;
    }

    /// delistWorkForSale allows the artist to delist the artwork from sale.
    function delistWorkForSale(uint numArtwork, uint numEdition) 
    onlyOwner(numArtwork, numEdition)
    public returns (bool) {
        if (numArtwork < 0) revert();
        if (numEdition < 0) revert();
        if (artworks[numArtwork].editions[numEdition].forSale != true) revert();

        artworks[numArtwork].editions[numEdition].forSale = false;
        artworks[numArtwork].editions[numEdition].forSaleDate = 0;
        artworks[numArtwork].editions[numEdition].listingPrice = 0;

        return artworks[numArtwork].editions[numEdition].forSale;
    }

    /// signWork allows the artist to sign the work.
    function signWork(uint numArtwork) 
    onlyArtist(numArtwork) 
    public returns (bool) {
        if (numArtwork < 0) revert();
        if (artworks[numArtwork].artistHasSigned) revert();

        artworks[numArtwork].artistHasSigned = true;

        return artworks[numArtwork].artistHasSigned;
    }

    /// getSalesNum returns the number of purchases.
    function getSalesNum(uint numArtwork, uint numEdition) public constant returns (uint) {
        if (numArtwork < 0) revert();
        if (numEdition < 0) revert();
        return artworks[numArtwork].editions[numEdition].provenence.length;
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