// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@tw3/solidity/contracts/utils/String.sol";

library StringUtils {
    function joinArray(
        string[] memory array,
        string memory separator
    ) internal pure returns (string memory) {
        bytes memory result;

        for (uint256 i = 0; i < array.length; i++) {
            result = abi.encodePacked(result, array[i]);

            // Add separator if it's not the last element
            if (i < array.length - 1) {
                result = abi.encodePacked(result, separator);
            }
        }

        return string(result);
    }
}

/**
 * @title FeedbackPlatform
 * @dev This contract represents a feedback platform where brands, products, events and feedbacks can be registered.
 */
contract FeedbackPlatform {
    using String for string;
    using StringUtils for string[];
    /**
     * @dev A structure to hold user profile information
     * @param brandId The unique identifier for the brand.
     * @param name The name of the brand.
     * @param owner The address of the owner of the brand.
     * @param createdAt The timestamp when the Product was created.
     * @param feedbackCount The number of feedback sent to this brand
     * @param followersCount The number of followers of this brand
     */
    struct Profile {
        string name;
        string email;
        string bio;
        string profilePictureHash; // Could be an IPFS hash for the profile picture
        uint256 creationTime;
        uint256 lastUpdated;
    }

    /**
     * @dev A structure to represent a brand.
     * @param brandId The unique identifier for the brand.
     * @param name The name of the brand.
     * @param owner The address of the owner of the brand.
     * @param createdAt The timestamp when the Product was created.
     * @param feedbackCount The number of feedback sent to this brand
     * @param followersCount The number of followers of this brand
     */
    struct Brand {
        uint256 brandId;
        string name;
        string rawName;
        address owner;
        uint256 createdAt;
        uint256 feedbackCount;
        uint256 followersCount;
    }

    /**
     * @dev A structure to represent a product.
     * @param productId The unique identifier for the product.
     * @param name The name of the product.
     * @param description The description of the product.
     * @param brandId The identifier of the brand that owns the product.
     * @param createdAt The timestamp when the Product was created.
     */
    struct Product {
        uint256 productId;
        string name;
        string description;
        uint256 brandId;
        uint256 createdAt;
    }

    /**
     * @dev A structure to represent an event.
     * @param eventId The unique identifier for the event.
     * @param name The name of the event.
     * @param description The description of the event.
     * @param brandIds The identifiers of the brands participating in the event.
     * @param createdAt The timestamp when the Event was created.
     */
    struct Event {
        uint256 eventId;
        address owner;
        uint256 brandId;
        string name;
        string description;
        string eventLocation;
        string eventStartDate;
        string eventEndDate;
        string eventWebsite;
        string eventRegistrationLink;
        uint256[] brandIds;
        uint256 createdAt;
    }

    /**
     * @dev A structure to represent a feedback.
     * @param feedbackId The unique identifier for the feedback.
     * @param feedbackText The text of the feedback.
     * @param timestamp The timestamp when the feedback was submitted.
     * @param sender The address of the sender of the feedback.
     * @param recipientId The identifier of the recipient of the feedback.
     * @param eventId The identifier of the event related to the feedback (optional, 0 if not related to an event).
     * @param productId The identifier of the product related to the feedback (optional, 0 if not related to a product).
     */
    struct Feedback {
        uint256 feedbackId;
        string feedbackText;
        uint256 timestamp;
        address sender;
        uint256 recipientId;
        uint256 eventId; // Optional, 0 if not related to an event
        uint256 productId; // Optional, 0 if not related to a product
    }

    uint256 public profileCounter = 0;
    uint256 public brandCounter = 0;
    uint256 public productCounter = 0;
    uint256 public eventCounter = 0;
    uint256 public feedbackCounter = 0;

    // Mapping to store profiles for each address
    mapping(address => Profile) private profiles;
    mapping(uint256 => Brand) public brands;
    mapping(address => uint256) public brandOwners;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Event) public events;
    mapping(uint256 => Feedback) public feedbacks;
    mapping(address => uint256[]) public userFeedbacks;
    mapping(uint256 => uint256[]) public brandFeedbacks;
    mapping(uint256 => uint256[]) public eventFeedbacks;
    mapping(uint256 => uint256[]) public productFeedbacks;
    mapping(address => uint256[]) public eventBrandInvites; // map address of Invited owner (i.e., the brand) to List of events invited to.

    // Event emitted when a profile is created
    event ProfileCreated(
        address indexed user,
        string name,
        string email,
        string bio,
        string profilePictureHash
    );

    // Event emitted when a profile is updated
    event ProfileUpdated(
        address indexed user,
        string name,
        string email,
        string bio,
        string profilePictureHash
    );

    event BrandRegistered(
        uint256 indexed brandId,
        string name,
        address owner,
        uint256 createdAt
    );
    event FeedbackSubmitted(
        uint256 indexed feedbackId,
        string feedbackText,
        uint256 timestamp,
        address sender,
        uint256 recipientId
    );
    event ProductRegistered(
        uint256 indexed productId,
        string name,
        string description,
        uint256 brandId,
        uint256 createdAt
    );

    event EventBrandConfirmed(uint256 indexed eventId, uint256 brandId);
    event EventBrandRemove(uint256 indexed eventId, uint256 brandId);
    event EventBrandInvited(uint256 indexed eventId, uint256 brandId);

    // Custom errors
    error BrandAlreadyExist();
    error BrandDoesNotExist();
    error NotBrandOwner();
    error ProfileDoesNotExist();
    error ProfileAlreadyExist();

    modifier onlyBrandOwner(uint256 brandId) {
        // require(brands[brandId].owner == msg.sender, "Not the brand owner");
        if (brands[brandId].owner != msg.sender) {
            revert NotBrandOwner();
        }
        _;
    }

    modifier thisBrandExists(uint256 _brandId) {
        // require(
        //     bytes(brands[_brandId].name).length != 0,
        //     "Brand does not exist"
        // );
        if (bytes(brands[_brandId].name).length == 0) {
            revert BrandDoesNotExist();
        }
        _;
    }

    /// @notice Allows a user to create a profile
    /// @param _name The name of the user
    /// @param _email The email address of the user
    /// @param _bio A short biography of the user
    /// @param _profilePictureHash Hash (IPFS or similar) of the user's profile picture
    function createProfile(
        string memory _name,
        string memory _email,
        string memory _bio,
        string memory _profilePictureHash
    ) public {
        // require(
        //     bytes(profiles[msg.sender].name).length == 0,
        //     "Profile already exists"
        // );
        if (bytes(profiles[msg.sender].name).length != 0) {
            revert ProfileAlreadyExist();
        }

        profileCounter++;
        profiles[msg.sender] = Profile({
            name: _name,
            email: _email,
            bio: _bio,
            profilePictureHash: _profilePictureHash,
            creationTime: block.timestamp,
            lastUpdated: block.timestamp
        });

        emit ProfileCreated(
            msg.sender,
            _name,
            _email,
            _bio,
            _profilePictureHash
        );
    }

    /// @notice Allows a user to update their profile
    /// @param _name The new name of the user
    /// @param _email The new email address of the user
    /// @param _bio The new biography of the user
    /// @param _profilePictureHash New profile picture hash (if updated)
    function updateProfile(
        string memory _name,
        string memory _email,
        string memory _bio,
        string memory _profilePictureHash
    ) public {
        // require(
        //     bytes(profiles[msg.sender].name).length != 0,
        //     "Profile does not exist"
        // );
        if (bytes(profiles[msg.sender].name).length == 0) {
            revert ProfileDoesNotExist();
        }

        Profile storage profile = profiles[msg.sender];
        profile.name = _name;
        profile.email = _email;
        profile.bio = _bio;
        profile.profilePictureHash = _profilePictureHash;
        profile.lastUpdated = block.timestamp;

        emit ProfileUpdated(
            msg.sender,
            _name,
            _email,
            _bio,
            _profilePictureHash
        );
    }

    /// @notice Fetches the profile details for a specific user
    /// @param _user Address of the user to fetch profile details for
    /// @return name The name of the user
    /// @return email The email address of the user
    /// @return bio The biography of the user
    /// @return profilePictureHash The profile picture hash of the user
    /// @return creationTime The profile creation timestamp
    /// @return lastUpdated The last updated timestamp of the profile
    // function getProfile(address _user)
    //     public
    //     view
    //     returns (
    //         string memory name,
    //         string memory email,
    //         string memory bio,
    //         string memory profilePictureHash,
    //         uint256 creationTime,
    //         uint256 lastUpdated
    //     )
    // {
    //     // require(
    //     //     bytes(profiles[_user].name).length != 0,
    //     //     "Profile does not exist"
    //     // );
    //     if (bytes(profiles[_user].name).length == 0) {
    //         revert ProfileDoesNotExist();
    //     }

    //     Profile storage profile = profiles[_user];
    //     return (
    //         profile.name,
    //         profile.email,
    //         profile.bio,
    //         profile.profilePictureHash,
    //         profile.creationTime,
    //         profile.lastUpdated
    //     );
    // }

    /// @notice Fetches the profile details for a specific user
    /// @param _user Address of the user to fetch profile details for
    /// @return The profile with the specified identifier.
    function getProfile(address _user) public view returns (Profile memory) {
        if (bytes(profiles[_user].name).length == 0) {
            revert ProfileDoesNotExist();
        }

        return profiles[_user];
    }

    /// @notice Checks if a profile exists for a given user
    /// @param _user Address of the user to check
    /// @return true if profile exists, false otherwise
    function profileExists(address _user) public view returns (bool) {
        return bytes(profiles[_user].name).length != 0;
    }

    /// @notice Checks if a brand exists or not
    /// @param _name Name of the brand to check
    /// @return true if brand exists, false otherwise
    function brandExists(string memory _name) public view returns (bool) {
        return getAllBrands(_name, address(0)).length != 0;
    }

    /**
     * @dev This function registers a new brand.
     * @param _name The name of the new brand.
     */
    function registerBrand(string memory _name) public {
        if (getAllBrands(_name, address(0)).length != 0) {
            revert BrandAlreadyExist();
        }
        // require(
        //     getAllBrands(_name, address(0)).length == 0,
        //     "Brand already exists"
        // );
        // if (_name.includes(" ")) {
        //     // _name.split(" ");
        // }

        brandCounter++;
        brands[brandCounter] = Brand(
            brandCounter,
            _name.toLowerCase(),
            _name,
            msg.sender,
            block.timestamp,
            0,
            0
        );
        brandOwners[msg.sender] = brandCounter;
        emit BrandRegistered(brandCounter, _name, msg.sender, block.timestamp);
    }

    /**
     * @dev This function updates the details of a brand.
     * @param _brandId The identifier of the brand to be updated.
     * @param _name The new name of the brand.
     */
    function updateBrand(
        uint256 _brandId,
        string memory _name
    ) public onlyBrandOwner(_brandId) {
        brands[_brandId].name = _name;
        // Brand storage brand = brands[_brandId];
        // brand.name = _name;
        // Profile storage profile = profiles[msg.sender];
    }

    /// @notice Checks if a brand product exists or not
    /// @param _name Name of the Brand Product to check
    /// @return true if brand exists, false otherwise
    function productExists(
        uint256 _brandId,
        string memory _name
    ) public view returns (bool) {
        return getAllProducts(_brandId, _name).length != 0;
    }

    /**
     * @dev This function creates a new product.
     * @param _name The name of the new product.
     * @param _description The description of the new product.
     * @param _brandId The identifier of the brand that owns the new product.
     */
    function createProduct(
        string memory _name,
        string memory _description,
        uint256 _brandId
    ) public onlyBrandOwner(_brandId) {
        productCounter++;
        products[productCounter] = Product(
            productCounter,
            _name,
            _description,
            _brandId,
            block.timestamp
        );
    }

    /**
     * @dev This function creates a new event.
     * @param _name The name of the new event.
     * @param _description The description of the new event.
     * @param _brandIds The identifiers of the brands participating in the new event.
     */
    function createEvent(
        uint256 _brandId,
        string memory _name,
        string memory _description,
        string memory _eventLocation,
        string memory _eventStartDate,
        string memory _eventEndDate,
        string memory _eventWebsite,
        string memory _eventRegistrationLink,
        uint256[] memory _brandIds
    ) public onlyBrandOwner(_brandId) {
        eventCounter++;
        uint256[] memory _initialBrandIds;
        events[eventCounter] = Event(
            eventCounter,
            msg.sender,
            _brandId,
            _name,
            _description,
            _eventLocation,
            _eventStartDate,
            _eventEndDate,
            _eventWebsite,
            _eventRegistrationLink,
            _initialBrandIds,
            block.timestamp
        );

        // Send an Invite to the Brands added to this event before adding them to the events
        if (_brandIds.length > 0) {
            for (uint256 i = 0; i < _brandIds.length; i++) {
                sendJoinBrandEventInvite(_brandId, _brandIds[i], eventCounter);
            }
        }
    }

    /**
     * @dev This function submits a new feedback.
     * @param _recipientId The identifier of the recipient of the new feedback.
     * @param _feedbackText The text of the new feedback.
     * @param _eventId The identifier of the event related to the new feedback (optional, 0 if not related to an event).
     * @param _productId The identifier of the product related to the new feedback (optional, 0 if not related to a product).
     */
    function submitFeedback(
        uint256 _recipientId,
        string memory _feedbackText,
        uint256 _eventId,
        uint256 _productId
    ) public {
        feedbackCounter++;
        feedbacks[feedbackCounter] = Feedback(
            feedbackCounter,
            _feedbackText,
            block.timestamp,
            msg.sender,
            _recipientId,
            _eventId,
            _productId
        );
        brands[_recipientId].feedbackCount++;
        userFeedbacks[msg.sender].push(feedbackCounter);
        brandFeedbacks[_recipientId].push(feedbackCounter);
        if (_eventId != 0) {
            eventFeedbacks[_eventId].push(feedbackCounter);
        }
        if (_productId != 0) {
            productFeedbacks[_productId].push(feedbackCounter);
        }
        emit FeedbackSubmitted(
            feedbackCounter,
            _feedbackText,
            block.timestamp,
            msg.sender,
            _recipientId
        );
    }

    /**
     * @dev This function retrieves a brand.
     * @param _brandId The identifier of the brand to be retrieved.
     * @return The brand with the specified identifier.
     */
    function getBrand(uint256 _brandId) public view returns (Brand memory) {
        return brands[_brandId];
    }

    function getAllBrands(
        string memory _nameFilter,
        address _ownerFilter
    ) public view returns (Brand[] memory) {
        uint256 count = 0;

        // First, count how many brands match the filter criteria
        for (uint256 i = 1; i <= brandCounter; i++) {
            if (
                (bytes(_nameFilter).length == 0 ||
                    keccak256(bytes(brands[i].name)) ==
                    keccak256(bytes(_nameFilter)) ||
                    keccak256(bytes(brands[i].rawName)) ==
                    keccak256(bytes(_nameFilter))) &&
                (_ownerFilter == address(0) || brands[i].owner == _ownerFilter)
            ) {
                count++;
            }
        }

        // Create an array to store the filtered brands
        Brand[] memory filteredBrands = new Brand[](count);
        uint256 index = 0;

        // Populate the filtered brands array
        for (uint256 i = 1; i <= brandCounter; i++) {
            if (
                (bytes(_nameFilter).length == 0 ||
                    keccak256(bytes(brands[i].name)) ==
                    keccak256(bytes(_nameFilter))) &&
                (_ownerFilter == address(0) || brands[i].owner == _ownerFilter)
            ) {
                filteredBrands[index] = brands[i];
                index++;
            }
        }

        return filteredBrands;
    }

    // /**
    //  * @dev This function retrieves a product.
    //  * @param _productId The identifier of the product to be retrieved.
    //  * @return The product with the specified identifier.
    //  */
    // function getProduct(uint256 _productId)
    //     public
    //     view
    //     returns (Product memory)
    // {
    //     return products[_productId];
    // }

    function getAllProducts(
        uint256 _brandIdFilter,
        string memory _nameFilter
    ) public view returns (Product[] memory) {
        uint256 count = 0;

        // First, count how many products match the filter criteria
        for (uint256 i = 1; i <= productCounter; i++) {
            if (
                (_brandIdFilter == 0 ||
                    products[i].brandId == _brandIdFilter) &&
                (bytes(_nameFilter).length == 0 ||
                    keccak256(bytes(products[i].name)) ==
                    keccak256(bytes(_nameFilter)))
            ) {
                count++;
            }
        }

        // Create an array to store the filtered products
        Product[] memory filteredProducts = new Product[](count);
        uint256 index = 0;

        // Populate the filtered products array
        for (uint256 i = 1; i <= productCounter; i++) {
            if (
                (_brandIdFilter == 0 ||
                    products[i].brandId == _brandIdFilter) &&
                (bytes(_nameFilter).length == 0 ||
                    keccak256(bytes(products[i].name)) ==
                    keccak256(bytes(_nameFilter)))
            ) {
                filteredProducts[index] = products[i];
                index++;
            }
        }

        return filteredProducts;
    }

    /**
     * @dev This function retrieves an event.
     * @param _eventId The identifier of the event to be retrieved.
     * @return The event with the specified identifier.
     */
    function getEvent(uint256 _eventId) public view returns (Event memory) {
        return events[_eventId];
    }

    function getMultipleEvents(
        uint256[] memory _eventIds
    ) public view returns (Event[] memory) {
        Event[] memory multipleEvents = new Event[](_eventIds.length);
        for (uint256 i = 0; i < _eventIds.length; i++) {
            multipleEvents[i] = events[_eventIds[i]];
        }
        return multipleEvents;
    }

    function getAllEvents(
        uint256 _brandIdFilter,
        string memory _nameFilter
    ) public view returns (Event[] memory) {
        uint256 count = 0;

        // First, count how many events match the filter criteria
        for (uint256 i = 1; i <= eventCounter; i++) {
            bool brandMatches = false;

            // If no brand filter is applied, set brandMatches to true
            if (_brandIdFilter == 0) {
                brandMatches = true;
            } else {
                // Check if any brandId in the event matches the brand filter
                for (uint256 j = 0; j < events[i].brandIds.length; j++) {
                    if (events[i].brandIds[j] == _brandIdFilter) {
                        brandMatches = true;
                        break;
                    }
                }
            }

            // Apply name filter and brand filter
            if (
                brandMatches &&
                (bytes(_nameFilter).length == 0 ||
                    keccak256(bytes(events[i].name)) ==
                    keccak256(bytes(_nameFilter)))
            ) {
                count++;
            }
        }

        // Create an array to store the filtered events
        Event[] memory filteredEvents = new Event[](count);
        uint256 index = 0;

        // Populate the filtered events array
        for (uint256 i = 1; i <= eventCounter; i++) {
            bool brandMatches = false;

            if (_brandIdFilter == 0) {
                brandMatches = true;
            } else {
                for (uint256 j = 0; j < events[i].brandIds.length; j++) {
                    if (events[i].brandIds[j] == _brandIdFilter) {
                        brandMatches = true;
                        break;
                    }
                }
            }

            if (
                brandMatches &&
                (bytes(_nameFilter).length == 0 ||
                    keccak256(bytes(events[i].name)) ==
                    keccak256(bytes(_nameFilter)))
            ) {
                filteredEvents[index] = events[i];
                index++;
            }
        }

        return filteredEvents;
    }

    /**
     * @dev This function retrieves a feedback.
     * @param _feedbackId The identifier of the feedback to be retrieved.
     * @return The feedback with the specified identifier.
     */
    function getFeedback(
        uint256 _feedbackId
    ) public view returns (Feedback memory) {
        return feedbacks[_feedbackId];
    }

    function getAllFeedbacks(
        address _senderFilter,
        uint256 _recipientIdFilter,
        uint256 _eventIdFilter,
        uint256 _productIdFilter
    ) public view returns (Feedback[] memory) {
        uint256 count = 0;

        // First, count how many feedbacks match the filter criteria
        for (uint256 i = 1; i <= feedbackCounter; i++) {
            if (
                (_senderFilter == address(0) ||
                    feedbacks[i].sender == _senderFilter) &&
                (_recipientIdFilter == 0 ||
                    feedbacks[i].recipientId == _recipientIdFilter) &&
                (_eventIdFilter == 0 ||
                    feedbacks[i].eventId == _eventIdFilter) &&
                (_productIdFilter == 0 ||
                    feedbacks[i].productId == _productIdFilter)
            ) {
                count++;
            }
        }

        // Create an array to store the filtered feedbacks
        Feedback[] memory filteredFeedbacks = new Feedback[](count);
        uint256 index = 0;

        // Populate the filtered feedbacks array
        for (uint256 i = 1; i <= feedbackCounter; i++) {
            if (
                (_senderFilter == address(0) ||
                    feedbacks[i].sender == _senderFilter) &&
                (_recipientIdFilter == 0 ||
                    feedbacks[i].recipientId == _recipientIdFilter) &&
                (_eventIdFilter == 0 ||
                    feedbacks[i].eventId == _eventIdFilter) &&
                (_productIdFilter == 0 ||
                    feedbacks[i].productId == _productIdFilter)
            ) {
                filteredFeedbacks[index] = feedbacks[i];
                index++;
            }
        }

        return filteredFeedbacks;
    }

    // Function to get all invites for a specific address
    function getInvitesForAddress(
        address _address
    ) public view returns (uint256[] memory) {
        return eventBrandInvites[_address];
    }

    // Sample function to add invites (for testing purposes)
    function addInvite(address _address, uint256 _inviteId) public {
        eventBrandInvites[_address].push(_inviteId);
    }

    function sendJoinBrandEventInvite(
        uint256 _fromBrandId,
        uint256 _toBrandId,
        uint256 _eventId
    ) public onlyBrandOwner(_fromBrandId) {
        // Get the brand name for the event invite message
        // string memory brandName = getBrand(_brandId).name;

        address invitedBrandOwner = getBrand(_toBrandId).owner;
        // eventBrandInvites[invitedBrandOwner].push(_eventId);
        addInvite(invitedBrandOwner, _eventId);

        emit EventBrandInvited(_eventId, _toBrandId);

        // // Get the event name for the event invite message
        // string memory eventName = getAllEvents(uint256(0), "")[_brandId].name;

        // // Get the event registration link for the event invite message
        // string memory eventRegistrationLink = getAllEvents(uint256(0), "")[_brandId].eventRegistrationLink;

        // // Send an event invite to the brand owner's address using the event invite message
        // (bool sent, ) = getBrand(_brandId).owner.call{value: 1 ether}("");

        // // Check if the event invite was sent successfully
        // require(sent == true);
    }

    function confirmJointBrandEvent(
        uint256 _eventId,
        uint256 _brandId,
        uint256 _indexInArray
    ) public thisBrandExists(_brandId) {
        // require(
        //     bytes(brands[_brandId].name).length != 0,
        //     "Brand does not exist"
        // );

        // Update an event brandId if that brand accepts the event invite.
        // if (!reject) {
        // }
        events[_eventId].brandIds.push(_brandId);
        removeJointBrandEvent(_eventId, _brandId, _indexInArray);

        emit EventBrandConfirmed(_eventId, _brandId);
    }

    function removeJointBrandEvent(
        uint256 _eventId,
        uint256 _brandId,
        uint256 _indexInArray
    ) public {
        address invitedBrandOwner = getBrand(_brandId).owner;
        delete eventBrandInvites[invitedBrandOwner][_indexInArray];

        emit EventBrandRemove(_eventId, _brandId);
    }
}
