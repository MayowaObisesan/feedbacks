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

library NumberArrayUtils {
    function removeFromIndex(
        uint256[] memory numbers,
        uint256 _index
    ) internal pure returns (uint256[] memory) {
        require(_index < numbers.length, "index out of bound");

        uint256[] memory newArray = new uint256[](numbers.length - 1);
        for (uint256 i = 0; i < _index; i++) {
            newArray[i] = numbers[i];
        }
        for (uint256 i = _index; i < numbers.length - 1; i++) {
            newArray[i] = numbers[i + 1];
        }
        return newArray;
    }

    function removeFromIndexOptimized(
        uint256[] memory numbers,
        uint256 _index
    ) internal pure returns (uint256[] memory) {
        require(numbers.length > 0, "empty array");
        require(_index < numbers.length, "index out of bound");

        // If array has only one element, return an empty array
        if (numbers.length == 1) {
            return new uint256[](0);
        }

        uint256[] memory newArray = new uint256[](numbers.length - 1);

        // One loop to handle copying the elements
        for (uint256 i = 0; i < numbers.length - 1; i++) {
            if (i < _index) {
                newArray[i] = numbers[i]; // Copy elements before _index
            } else {
                newArray[i] = numbers[i + 1]; // Copy elements after _index
            }
        }

        return newArray;
    }
}

error BrandDoesNotExist(string _message);
error NotBrandOwner(string _message);

contract BrandPlatform {
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
        string description;
        uint256 createdAt;
        uint256 updatedAt;
        uint256 feedbackCount;
        uint256 followersCount;
        string category;
        string imageHash;
    }

    uint256 public profileCounter = 0;
    uint256 public brandCounter = 0;

    // Mapping from brand ID to an array of follower addresses
    mapping(uint256 => address[]) public brandFollowers;

    // Nested mapping to check if an address is following a specific brand
    mapping(uint256 => mapping(address => bool)) public isFollowing;

    // Mapping to store profiles for each address
    mapping(address => Profile) private profiles;
    mapping(uint256 => Brand) public brands;
    mapping(address => uint256) public brandOwners;
    // Mapping from user address to array of followed brand IDs

    // ======
    // EVENTS
    // ======
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
        string category,
        string imageHash,
        uint256 createdAt
    );

    event FollowerAdded(uint256 indexed brandId, address indexed follower);
    event FollowerRemoved(uint256 indexed brandId, address indexed follower);

    // Custom errors
    error BrandAlreadyExist();
    // error BrandDoesNotExist(string _message);
    // error NotBrandOwner(string _message);
    error ProfileDoesNotExist();
    error ProfileAlreadyExist();
    error NotFollowingBrand();
    error AlreadyFollowingBrand();

    modifier onlyBrandOwner(uint256 brandId) {
        // require(brands[brandId].owner == msg.sender, "Not the brand owner");
        if (brands[brandId].owner != msg.sender) {
            revert NotBrandOwner("Not brand owner");
        }
        _;
    }

    modifier thisBrandExists(uint256 _brandId) {
        // require(
        //     bytes(brands[_brandId].name).length != 0,
        //     "Brand does not exist"
        // );
        if (bytes(brands[_brandId].name).length == 0) {
            revert BrandDoesNotExist("Brand does not exist");
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

    /// @notice Checks if a profile exists for a given user
    /// @param _user Address of the user to check
    /// @return true if profile exists, false otherwise
    function profileExists(address _user) public view returns (bool) {
        return bytes(profiles[_user].name).length != 0;
    }

    /// @notice Fetches the profile details for a specific user
    /// @param _user Address of the user to fetch profile details for
    /// @return The profile with the specified identifier.
    function getProfile(address _user) public view returns (Profile memory) {
        if (bytes(profiles[_user].name).length == 0) {
            revert ProfileDoesNotExist();
        }

        return profiles[_user];
    }

    /// @notice Checks if a brand exists or not
    /// @param _name Name of the brand to check
    /// @return true if brand exists, false otherwise
    function brandExists(string memory _name) public view returns (bool) {
        return getAllBrands(_name, address(0), "").length != 0;
    }

    /**
     * @dev This function registers a new brand.
     * @param _name The name of the new brand.
     */
    function registerBrand(
        string memory _name,
        string memory _description,
        string memory _category,
        string memory _imageHash
    ) public {
        if (getAllBrands(_name, address(0), "").length != 0) {
            revert BrandAlreadyExist();
        }

        string memory cleanedName = _name.toLowerCase();
        if (_name.includes(" ")) {
            cleanedName = cleanedName.split(" ").joinArray("_");
        }

        Brand memory _newBrand = Brand({
            brandId: brandCounter,
            name: cleanedName,
            rawName: _name,
            owner: msg.sender,
            description: _description,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            feedbackCount: 0,
            followersCount: 0,
            category: _category,
            imageHash: _imageHash
        });

        brandCounter++;

        _newBrand.brandId = brandCounter;
        brands[brandCounter] = _newBrand;

        brandOwners[msg.sender] = brandCounter;

        emit BrandRegistered(
            brandCounter,
            _name,
            msg.sender,
            _category,
            _imageHash,
            block.timestamp
        );
    }

    /**
     * @dev This function updates the details of a brand.
     * @param _brandId The identifier of the brand to be updated.
     * @param _name The new name of the brand.
     */
    function updateBrand(
        uint256 _brandId,
        string memory _name,
        string memory _description
    ) public onlyBrandOwner(_brandId) {
        brands[_brandId].name = _name;
        brands[_brandId].description = _description;
        // Brand storage brand = brands[_brandId];
        // brand.name = _name;
        // Profile storage profile = profiles[msg.sender];
    }

    /**
     * @dev This function updates an existing brand's details dynamically.
     * The function will only update fields that are provided (non-empty strings).
     * @param _brandId The ID of the brand to update.
     * @param _name The new name of the brand (leave empty if no change).
     * @param _category The new category of the brand (leave empty if no change).
     * @param _imageHash The new image hash of the brand (leave empty if no change).
     */
    function updateBrand(
        uint256 _brandId,
        string memory _name,
        string memory _description,
        string memory _category,
        string memory _imageHash
    ) public {
        // Check if the brand exists
        Brand storage brand = brands[_brandId];
        if (brand.owner == address(0)) {
            revert BrandDoesNotExist("Brand does not exist");
        }

        // Check if the caller is the owner of the brand
        if (msg.sender != brand.owner) {
            revert NotBrandOwner("This is not your brand");
        }

        // Update the name if provided
        if (bytes(_name).length > 0) {
            string memory cleanedName = _name.toLowerCase();
            if (_name.includes(" ")) {
                cleanedName = cleanedName.split(" ").joinArray("_");
            }

            brand.name = cleanedName;
            brand.rawName = _name;
        }

        // Update the description if provided
        if (bytes(_description).length > 0) {
            brand.description = _description;
        }

        // Update the category if provided
        if (bytes(_category).length > 0) {
            brand.category = _category;
        }

        // Update the imageHash if provided
        if (bytes(_imageHash).length > 0) {
            brand.imageHash = _imageHash;
        }

        // Update the updatedAt timestamp
        brand.updatedAt = block.timestamp;

        // Emit an event for the brand update
        emit BrandUpdated(
            _brandId,
            brand.name,
            brand.category,
            brand.imageHash,
            block.timestamp
        );
    }

    // Event for brand update
    event BrandUpdated(
        uint256 indexed brandId,
        string name,
        string category,
        string imageHash,
        uint256 updatedAt
    );

    /**
     * @dev This function retrieves a brand.
     * @param _brandId The identifier of the brand to be retrieved.
     * @return The brand with the specified identifier.
     */
    function getBrand(uint256 _brandId) public view returns (Brand memory) {
        return brands[_brandId];
    }

    /**
     * @dev This function retrieves multiple feedbacks.
     * @param _brandIds An array of identifiers of the feedbacks to be retrieved.
     * @return An array of feedbacks corresponding to the specified identifiers.
     */
    function getMultipleBrands(
        uint256[] memory _brandIds
    ) public view returns (Brand[] memory) {
        Brand[] memory multipleBrands = new Brand[](_brandIds.length);

        for (uint256 i = 0; i < _brandIds.length; i++) {
            multipleBrands[i] = brands[_brandIds[i]];
        }

        return multipleBrands;
    }

    /**
     * @notice Get all brands owned by the caller (msg.sender)
     * @return An array of Brand structs owned by the caller
     */
    function getMyBrands() public view returns (Brand[] memory) {
        // Count how many brands are owned by the caller
        uint256 brandCountForOwner = 0;
        // i starts from 1 because brandId starts from 1
        for (uint256 i = 1; i < brandCounter + 1; i++) {
            if (brands[i].owner == msg.sender) {
                brandCountForOwner++;
            }
        }

        // Create an array of the appropriate size
        Brand[] memory myBrands = new Brand[](brandCountForOwner);
        uint256 currentIndex = 0;

        // Populate the array with brands owned by the caller
        // i starts from 1 because brandId starts from 1
        for (uint256 i = 1; i < brandCounter + 1; i++) {
            if (brands[i].owner == msg.sender) {
                myBrands[currentIndex] = brands[i];
                currentIndex++;
            }
        }

        return myBrands;
    }

    /**
     * @notice Get all brands owned by a specified user
     * @param _user The address of the user whose brands you want to fetch
     * @return An array of Brand structs owned by the specified user
     */
    function getUserBrands(address _user) public view returns (Brand[] memory) {
        // Count how many brands are owned by the given user
        uint256 brandCountForUser = 0;
        // i starts from 1 because brandId starts from 1
        for (uint256 i = 1; i < brandCounter + 1; i++) {
            if (brands[i].owner == _user) {
                brandCountForUser++;
            }
        }

        // Create an array of the appropriate size
        Brand[] memory userBrands = new Brand[](brandCountForUser);
        uint256 currentIndex = 0;

        // Populate the array with brands owned by the given user
        // i starts from 1 because brandId starts from 1
        for (uint256 i = 1; i < brandCounter + 1; i++) {
            if (brands[i].owner == _user) {
                userBrands[currentIndex] = brands[i];
                currentIndex++;
            }
        }

        return userBrands;
    }

    function getAllBrands(
        string memory _nameFilter,
        address _ownerFilter,
        string memory _categoryFilter
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
                (_ownerFilter == address(0) ||
                    brands[i].owner == _ownerFilter) &&
                (bytes(_categoryFilter).length == 0 ||
                    keccak256(bytes(brands[i].category)) ==
                    keccak256(bytes(_categoryFilter)))
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
                (_ownerFilter == address(0) ||
                    brands[i].owner == _ownerFilter) &&
                (bytes(_categoryFilter).length == 0 ||
                    keccak256(bytes(brands[i].category)) ==
                    keccak256(bytes(_categoryFilter)))
            ) {
                filteredBrands[index] = brands[i];
                index++;
            }
        }

        return filteredBrands;
    }

    function incrementBrandFeedbackCount(uint256 _brandId) external {
        brands[_brandId].feedbackCount++;
    }

    /**
     * @notice Allows a user to follow a brand.
     * @dev Adds the follower to the brandFollowers array and updates the follower status.
     * @param _brandId The ID of the brand to follow.
     */
    function followBrand(uint256 _brandId) public {
        if (isFollowing[_brandId][msg.sender]) {
            revert AlreadyFollowingBrand();
        }
        // require(!isFollowing[_brandId][msg.sender], "Already following this brand");

        // Add the follower to the brandFollowers array
        brandFollowers[_brandId].push(msg.sender);

        // Update the followersCount and tracking status
        brands[_brandId].followersCount += 1;
        isFollowing[_brandId][msg.sender] = true;

        // Emit an event
        emit FollowerAdded(_brandId, msg.sender);
    }

    /**
     * @notice Allows a user to unfollow a brand.
     * @dev Removes the follower from the brandFollowers array and updates the follower status.
     * @param _brandId The ID of the brand to unfollow.
     */
    function unfollowBrand(uint256 _brandId) public {
        if (!isFollowing[_brandId][msg.sender]) {
            revert NotFollowingBrand();
        }

        // Update the followersCount and tracking status
        brands[_brandId].followersCount -= 1;
        isFollowing[_brandId][msg.sender] = false;

        // Remove the follower from the array (we'll need to loop through)
        removeFollower(_brandId, msg.sender);

        // Emit an event
        emit FollowerRemoved(_brandId, msg.sender);
    }

    /**
     * @notice Helper function to remove a follower from the brand's follower list.
     * @dev Loops through the follower array and removes the specified follower.
     * @param _brandId The ID of the brand.
     * @param _follower The address of the follower to remove.
     */
    function removeFollower(uint256 _brandId, address _follower) internal {
        address[] storage followers = brandFollowers[_brandId];
        for (uint256 i = 0; i < followers.length; i++) {
            if (followers[i] == _follower) {
                // Swap the follower with the last element and pop the array
                followers[i] = followers[followers.length - 1];
                followers.pop();
                break;
            }
        }
    }

    /**
     * @notice Returns the list of addresses following a specific brand.
     * @param _brandId The ID of the brand.
     * @return The array of addresses following the brand.
     */
    function getFollowers(
        uint256 _brandId
    ) public view returns (address[] memory) {
        return brandFollowers[_brandId];
    }

    /**
     * @notice Returns the list of brand IDs that a user is following.
     * @param _user The address of the user.
     * @return An array of brand IDs followed by the user.
     */
    function getFollowedBrands(
        address _user
    ) public view returns (uint256[] memory) {
        uint256[] memory followedBrands = new uint256[](brandCounter);
        uint256 count = 0;

        for (uint256 i = 1; i <= brandCounter; i++) {
            if (isFollowing[i][_user]) {
                followedBrands[count] = i;
                count++;
            }
        }

        // Resize the array to the actual count of followed brands
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = followedBrands[i];
        }

        return result;
    }

    /**
     * @notice Returns a paginated list of brand IDs that the user is following.
     * @dev Loops through all brands and checks if the user is following each one.
     * @param _user The address of the user.
     * @param _page The page number (starting from 1).
     * @param _pageSize The number of items per page.
     * @return An array of brand IDs the user is following for the requested page.
     */
    function getFollowedBrandsPaginatedForLoop(
        address _user,
        uint256 _page,
        uint256 _pageSize
    ) public view returns (uint256[] memory) {
        require(_page > 0, "Page must be greater than 0");
        require(_pageSize > 0, "Page size must be greater than 0");

        uint256 followedCount = 0;
        uint256[] memory tempFollowedBrands = new uint256[](brandCounter);

        // Loop through all brands and collect the ones the user is following
        for (uint256 i = 1; i <= brandCounter; i++) {
            if (isFollowing[i][_user]) {
                tempFollowedBrands[followedCount] = i;
                followedCount++;
            }
        }

        // If no brands are followed, return an empty array
        if (followedCount == 0) {
            return new uint256[](0);
        }

        // Calculate pagination indices
        uint256 startIndex = (_page - 1) * _pageSize;
        uint256 endIndex = startIndex + _pageSize;

        // Ensure the end index doesn't exceed the total number of followed brands
        if (endIndex > followedCount) {
            endIndex = followedCount;
        }

        // If the start index exceeds the total number of followed brands, return an empty array
        if (startIndex >= followedCount) {
            return new uint256[](0);
        }

        // Create an array to hold the paginated results
        uint256[] memory paginatedBrands = new uint256[](endIndex - startIndex);

        // Populate the paginated array with the appropriate brands
        for (uint256 i = startIndex; i < endIndex; i++) {
            paginatedBrands[i - startIndex] = tempFollowedBrands[i];
        }

        return paginatedBrands;
    }
}

contract FeedbackPlatform {
    BrandPlatform _brandPlatform;

    constructor(address _brandPlatformAddress) {
        _brandPlatform = BrandPlatform(_brandPlatformAddress);
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
        string feedbackTitle;
        string feedbackText;
        uint256 timestamp;
        address sender;
        uint256 recipientId;
        uint256 eventId; // Optional, 0 if not related to an event
        uint256 productId; // Optional, 0 if not related to a product
        uint8 starRating; // Max of 3 (star is between 1 to 3)
    }

    uint256 public feedbackCounter = 0;

    mapping(uint256 => Feedback) public feedbacks;
    mapping(address => uint256[]) private userFeedbacks;
    mapping(uint256 => uint256[]) private brandFeedbacks;
    mapping(uint256 => uint256[]) private eventFeedbacks;
    mapping(uint256 => uint256[]) private productFeedbacks;

    event FeedbackSubmitted(
        uint256 indexed feedbackId,
        string feedbackTitle,
        string feedbackText,
        uint256 timestamp,
        address sender,
        uint256 recipientId,
        uint256 starRating
    );
    event FeedbackUpdated(
        uint256 indexed feedbackId,
        string feedbackTitle,
        string feedbackText,
        uint256 timestamp,
        address sender,
        uint256 recipientId,
        uint256 starRating
    );

    error NoFeedbackContent(string _message);
    error InvalidStarRating(string _message);

    /**
     * @dev This function submits a new feedback.
     * @param _recipientId The identifier of the recipient of the new feedback.
     * @param _feedbackText The text of the new feedback.
     * @param _eventId The identifier of the event related to the new feedback (optional, 0 if not related to an event).
     * @param _productId The identifier of the product related to the new feedback (optional, 0 if not related to a product).
     */
    function submitFeedback(
        uint256 _recipientId,
        string memory _feedbackTitle,
        string memory _feedbackText,
        uint256 _eventId,
        uint256 _productId,
        uint8 _starRating
    ) public {
        if (bytes(_brandPlatform.getBrand(_recipientId).name).length == 0) {
            revert BrandDoesNotExist("Brand does not exist");
        }
        if (bytes(_feedbackText).length == 0) {
            revert NoFeedbackContent("Feedback content needed");
        }

        // Check that star is valid i.e., between 1 and 3
        if (_starRating < 1 || _starRating > 3) {
            revert InvalidStarRating("Rating is either 1, 2 or 3");
        }

        Feedback memory _newFeedback = Feedback({
            feedbackId: feedbackCounter,
            feedbackTitle: _feedbackTitle,
            feedbackText: _feedbackText,
            timestamp: block.timestamp,
            sender: msg.sender,
            recipientId: _recipientId,
            eventId: _eventId,
            productId: _productId,
            starRating: _starRating
        });

        feedbackCounter++;
        _newFeedback.feedbackId = feedbackCounter;

        feedbacks[feedbackCounter] = _newFeedback;

        // _brandPlatform.brands[_recipientId].feedbackCount++;
        _brandPlatform.incrementBrandFeedbackCount(_recipientId);
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
            _feedbackTitle,
            _feedbackText,
            block.timestamp,
            msg.sender,
            _recipientId,
            _starRating
        );
    }

    /**
     * @dev This function updates an existing feedback.
     * @param _feedbackId The identifier of the feedback to update.
     * @param _feedbackText The new feedback text (optional, pass empty string if no change).
     * @param _eventId The new event identifier (optional, pass 0 if no change).
     * @param _productId The new product identifier (optional, pass 0 if no change).
     * @param _starRating The new star rating (optional, pass 0 if no change).
     */
    function updateFeedback(
        uint256 _feedbackId,
        string memory _feedbackTitle,
        string memory _feedbackText,
        uint256 _eventId,
        uint256 _productId,
        uint8 _starRating
    ) public {
        Feedback storage feedback = feedbacks[_feedbackId];

        require(
            feedback.sender == msg.sender,
            "Only the sender can update their feedback"
        );
        require(
            _feedbackId != 0 && _feedbackId <= feedbackCounter,
            "Invalid feedback ID"
        );

        // Update feedback title if provided
        if (bytes(_feedbackTitle).length > 0) {
            feedback.feedbackTitle = _feedbackTitle;
        }

        // Update feedback text if provided
        if (bytes(_feedbackText).length > 0) {
            feedback.feedbackText = _feedbackText;
        }

        // Update eventId if provided
        if (_eventId != 0) {
            // Remove the feedback from the old event and add it to the new one
            if (feedback.eventId != 0) {
                // Find and remove from the old event
                uint256[] storage oldEventFeedbacks = eventFeedbacks[
                    feedback.eventId
                ];
                for (uint256 i = 0; i < oldEventFeedbacks.length; i++) {
                    if (oldEventFeedbacks[i] == _feedbackId) {
                        oldEventFeedbacks[i] = oldEventFeedbacks[
                            oldEventFeedbacks.length - 1
                        ];
                        oldEventFeedbacks.pop();
                        break;
                    }
                }
            }

            // Add to the new event
            eventFeedbacks[_eventId].push(_feedbackId);
            feedback.eventId = _eventId;
        }

        // Update productId if provided
        if (_productId != 0) {
            // Remove the feedback from the old product and add it to the new one
            if (feedback.productId != 0) {
                // Find and remove from the old product
                uint256[] storage oldProductFeedbacks = productFeedbacks[
                    feedback.productId
                ];
                for (uint256 i = 0; i < oldProductFeedbacks.length; i++) {
                    if (oldProductFeedbacks[i] == _feedbackId) {
                        oldProductFeedbacks[i] = oldProductFeedbacks[
                            oldProductFeedbacks.length - 1
                        ];
                        oldProductFeedbacks.pop();
                        break;
                    }
                }
            }

            // Add to the new product
            productFeedbacks[_productId].push(_feedbackId);
            feedback.productId = _productId;
        }

        // Update star rating if provided and valid
        if (_starRating != 0) {
            require(
                _starRating >= 1 && _starRating <= 3,
                "Rating must be between 1 and 3"
            );
            feedback.starRating = _starRating;
        }

        emit FeedbackUpdated(
            _feedbackId,
            feedback.feedbackTitle,
            feedback.feedbackText,
            feedback.timestamp,
            feedback.sender,
            feedback.recipientId,
            feedback.starRating
        );
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

    /**
     * @dev This function retrieves multiple feedbacks.
     * @param _feedbackIds An array of identifiers of the feedbacks to be retrieved.
     * @return An array of feedbacks corresponding to the specified identifiers.
     */
    function getMultipleFeedbacks(
        uint256[] memory _feedbackIds
    ) public view returns (Feedback[] memory) {
        Feedback[] memory multipleFeedbacks = new Feedback[](
            _feedbackIds.length
        );

        for (uint256 i = 0; i < _feedbackIds.length; i++) {
            multipleFeedbacks[i] = feedbacks[_feedbackIds[i]];
        }

        return multipleFeedbacks;
    }

    /**
     * @dev This function retrieves all feedbacks sent by the current user (msg.sender).
     * @return An array of feedbacks sent by the caller (msg.sender).
     */
    function getMyFeedbacks() public view returns (Feedback[] memory) {
        uint256 count = 0;
        // First, count the number of feedbacks by msg.sender to determine the array size
        // i starts from 1 because brandId starts from 1
        for (uint256 i = 1; i < feedbackCounter + 1; i++) {
            if (feedbacks[i].sender == msg.sender) {
                count++;
            }
        }

        Feedback[] memory myFeedbacks = new Feedback[](count);
        uint256 index = 0;

        // Then, populate the array with feedbacks from msg.sender
        // i starts from 1 because brandId starts from 1
        for (uint256 i = 1; i < feedbackCounter + 1; i++) {
            if (feedbacks[i].sender == msg.sender) {
                myFeedbacks[index] = feedbacks[i];
                index++;
            }
        }

        return myFeedbacks;
    }

    /**
     * @dev This function retrieves all feedbacks sent by a specific user (sender).
     * @param _sender The address of the user whose feedbacks are to be retrieved.
     * @return An array of feedbacks sent by the specified user.
     */
    function getUserFeedbacks(
        address _sender
    ) public view returns (Feedback[] memory) {
        uint256 count = 0;
        // First, count the number of feedbacks by the sender to determine the array size
        for (uint256 i = 0; i < feedbackCounter; i++) {
            if (feedbacks[i].sender == _sender) {
                count++;
            }
        }

        Feedback[] memory _userFeedbacks = new Feedback[](count);
        uint256 index = 0;

        // Then, populate the array with feedbacks from the sender
        for (uint256 i = 0; i < feedbackCounter; i++) {
            if (feedbacks[i].sender == _sender) {
                _userFeedbacks[index] = feedbacks[i];
                index++;
            }
        }

        return _userFeedbacks;
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

    // Function to get all userFeedback for a specific address
    function getUserFeedback(
        address _address
    ) public view returns (uint256[] memory) {
        return userFeedbacks[_address];
    }

    // Function to get all userFeedback for a specific address
    function getBrandFeedback(
        uint256 _brandId
    ) public view returns (uint256[] memory) {
        return brandFeedbacks[_brandId];
    }

    // Function to get all eventFeedback for a specific address
    function getEventFeedback(
        uint256 _eventId
    ) public view returns (uint256[] memory) {
        return eventFeedbacks[_eventId];
    }

    // Function to get all eventFeedback for a specific address
    function getProductFeedback(
        uint256 _productId
    ) public view returns (uint256[] memory) {
        return productFeedbacks[_productId];
    }
}

/**
 * @title FeedbackPlatform
 * @dev This contract represents a feedback platform where brands, products, events and feedbacks can be registered.
 */
contract FeedbacksPlatform {
    BrandPlatform _brandPlatform;

    constructor(address _brandPlatformAddress) {
        _brandPlatform = BrandPlatform(_brandPlatformAddress);
    }

    // using String for string;
    // using StringUtils for string[];
    // /**
    //  * @dev A structure to hold user profile information
    //  * @param brandId The unique identifier for the brand.
    //  * @param name The name of the brand.
    //  * @param owner The address of the owner of the brand.
    //  * @param createdAt The timestamp when the Product was created.
    //  * @param feedbackCount The number of feedback sent to this brand
    //  * @param followersCount The number of followers of this brand
    //  */
    // struct Profile {
    //     string name;
    //     string email;
    //     string bio;
    //     string profilePictureHash; // Could be an IPFS hash for the profile picture
    //     uint256 creationTime;
    //     uint256 lastUpdated;
    // }

    // /**
    //  * @dev A structure to represent a brand.
    //  * @param brandId The unique identifier for the brand.
    //  * @param name The name of the brand.
    //  * @param owner The address of the owner of the brand.
    //  * @param createdAt The timestamp when the Product was created.
    //  * @param feedbackCount The number of feedback sent to this brand
    //  * @param followersCount The number of followers of this brand
    //  */
    // struct Brand {
    //     uint256 brandId;
    //     string name;
    //     string rawName;
    //     address owner;
    //     uint256 createdAt;
    //     uint256 feedbackCount;
    //     uint256 followersCount;
    //     string category;
    //     string imageHash;
    // }

    // /**
    //  * @dev A structure to represent a product.
    //  * @param productId The unique identifier for the product.
    //  * @param name The name of the product.
    //  * @param description The description of the product.
    //  * @param brandId The identifier of the brand that owns the product.
    //  * @param createdAt The timestamp when the Product was created.
    //  */
    // struct Product {
    //     uint256 productId;
    //     string name;
    //     string description;
    //     uint256 brandId;
    //     uint256 createdAt;
    //     string imageHash;
    // }

    // /**
    //  * @dev A structure to represent an event.
    //  * @param eventId The unique identifier for the event.
    //  * @param name The name of the event.
    //  * @param description The description of the event.
    //  * @param brandIds The identifiers of the brands participating in the event.
    //  * @param createdAt The timestamp when the Event was created.
    //  */
    // struct Event {
    //     uint256 eventId;
    //     address owner;
    //     uint256 brandId;
    //     string name;
    //     string description;
    //     string eventLocation;
    //     string eventStartDate;
    //     string eventEndDate;
    //     string eventWebsite;
    //     string eventRegistrationLink;
    //     uint256[] brandIds;
    //     uint256 createdAt;
    // }

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
        uint8 starRating; // Max of 3 (star is between 1 to 3)
    }

    // uint256 public profileCounter = 0;
    // uint256 public brandCounter = 0;
    // uint256 public productCounter = 0;
    // uint256 public eventCounter = 0;
    uint256 public feedbackCounter = 0;

    // Mapping to store profiles for each address
    // mapping(address => Profile) private profiles;
    // mapping(uint256 => Brand) public brands;
    // mapping(address => uint256) public brandOwners;
    // mapping(uint256 => Product) public products;
    // mapping(uint256 => Event) public events;
    mapping(uint256 => Feedback) public feedbacks;
    mapping(address => uint256[]) private userFeedbacks;
    mapping(uint256 => uint256[]) private brandFeedbacks;
    mapping(uint256 => uint256[]) private eventFeedbacks;
    mapping(uint256 => uint256[]) private productFeedbacks;
    // mapping(address => uint256[]) private eventBrandInvites; // map address of Invited owner (i.e., the brand) to List of events invited to.

    // // Event emitted when a profile is created
    // event ProfileCreated(
    //     address indexed user,
    //     string name,
    //     string email,
    //     string bio,
    //     string profilePictureHash
    // );

    // // Event emitted when a profile is updated
    // event ProfileUpdated(
    //     address indexed user,
    //     string name,
    //     string email,
    //     string bio,
    //     string profilePictureHash
    // );

    // event BrandRegistered(
    //     uint256 indexed brandId,
    //     string name,
    //     address owner,
    //     uint256 createdAt
    // );

    event FeedbackSubmitted(
        uint256 indexed feedbackId,
        string feedbackText,
        uint256 timestamp,
        address sender,
        uint256 recipientId,
        uint256 starRating
    );
    event FeedbackUpdated(
        uint256 indexed feedbackId,
        string feedbackText,
        uint256 timestamp,
        address sender,
        uint256 recipientId,
        uint256 starRating
    );
    // event ProductRegistered(
    //     uint256 indexed productId,
    //     string name,
    //     string description,
    //     uint256 brandId,
    //     uint256 createdAt,
    //     string imageHash
    // );

    // event EventBrandConfirmed(uint256 indexed eventId, uint256 brandId);
    // event EventBrandRemove(uint256 indexed eventId, uint256 brandId);
    // event EventBrandInvited(uint256 indexed eventId, uint256 brandId);

    // // Custom errors
    // error BrandAlreadyExist();
    // error BrandDoesNotExist(string _message);
    // error NotBrandOwner(string _message);
    // error ProfileDoesNotExist();
    // error ProfileAlreadyExist();

    error NoFeedbackContent(string _message);
    error InvalidStarRating(string _message);

    // modifier onlyBrandOwner(uint256 brandId) {
    //     // require(brands[brandId].owner == msg.sender, "Not the brand owner");
    //     if (brands[brandId].owner != msg.sender) {
    //         revert NotBrandOwner("Not brand owner");
    //     }
    //     _;
    // }

    // modifier thisBrandExists(uint256 _brandId) {
    //     // require(
    //     //     bytes(brands[_brandId].name).length != 0,
    //     //     "Brand does not exist"
    //     // );
    //     if (bytes(brands[_brandId].name).length == 0) {
    //         revert BrandDoesNotExist("Brand does not exist");
    //     }
    //     _;
    // }

    // /// @notice Allows a user to create a profile
    // /// @param _name The name of the user
    // /// @param _email The email address of the user
    // /// @param _bio A short biography of the user
    // /// @param _profilePictureHash Hash (IPFS or similar) of the user's profile picture
    // function createProfile(
    //     string memory _name,
    //     string memory _email,
    //     string memory _bio,
    //     string memory _profilePictureHash
    // ) public {
    //     // require(
    //     //     bytes(profiles[msg.sender].name).length == 0,
    //     //     "Profile already exists"
    //     // );
    //     if (bytes(profiles[msg.sender].name).length != 0) {
    //         revert ProfileAlreadyExist();
    //     }

    //     profileCounter++;
    //     profiles[msg.sender] = Profile({
    //         name: _name,
    //         email: _email,
    //         bio: _bio,
    //         profilePictureHash: _profilePictureHash,
    //         creationTime: block.timestamp,
    //         lastUpdated: block.timestamp
    //     });

    //     emit ProfileCreated(
    //         msg.sender,
    //         _name,
    //         _email,
    //         _bio,
    //         _profilePictureHash
    //     );
    // }

    // /// @notice Allows a user to update their profile
    // /// @param _name The new name of the user
    // /// @param _email The new email address of the user
    // /// @param _bio The new biography of the user
    // /// @param _profilePictureHash New profile picture hash (if updated)
    // function updateProfile(
    //     string memory _name,
    //     string memory _email,
    //     string memory _bio,
    //     string memory _profilePictureHash
    // ) public {
    //     // require(
    //     //     bytes(profiles[msg.sender].name).length != 0,
    //     //     "Profile does not exist"
    //     // );
    //     if (bytes(profiles[msg.sender].name).length == 0) {
    //         revert ProfileDoesNotExist();
    //     }

    //     Profile storage profile = profiles[msg.sender];
    //     profile.name = _name;
    //     profile.email = _email;
    //     profile.bio = _bio;
    //     profile.profilePictureHash = _profilePictureHash;
    //     profile.lastUpdated = block.timestamp;

    //     emit ProfileUpdated(
    //         msg.sender,
    //         _name,
    //         _email,
    //         _bio,
    //         _profilePictureHash
    //     );
    // }

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

    // /// @notice Fetches the profile details for a specific user
    // /// @param _user Address of the user to fetch profile details for
    // /// @return The profile with the specified identifier.
    // function getProfile(address _user) public view returns (Profile memory) {
    //     if (bytes(profiles[_user].name).length == 0) {
    //         revert ProfileDoesNotExist();
    //     }

    //     return profiles[_user];
    // }

    // /// @notice Checks if a profile exists for a given user
    // /// @param _user Address of the user to check
    // /// @return true if profile exists, false otherwise
    // function profileExists(address _user) public view returns (bool) {
    //     return bytes(profiles[_user].name).length != 0;
    // }

    // /// @notice Checks if a brand exists or not
    // /// @param _name Name of the brand to check
    // /// @return true if brand exists, false otherwise
    // function brandExists(string memory _name) public view returns (bool) {
    //     return getAllBrands(_name, address(0), "").length != 0;
    // }

    // /**
    //  * @dev This function registers a new brand.
    //  * @param _name The name of the new brand.
    //  */
    // function registerBrand(
    //     string memory _name,
    //     string memory _category,
    //     string memory _imageHash
    // ) public {
    //     if (getAllBrands(_name, address(0), "").length != 0) {
    //         revert BrandAlreadyExist();
    //     }
    //     // require(
    //     //     getAllBrands(_name, address(0)).length == 0,
    //     //     "Brand already exists"
    //     // );
    //     string memory cleanedName;
    //     if (_name.includes(" ")) {
    //         cleanedName = _name.split(" ").joinArray("_");
    //         cleanedName.toLowerCase();
    //     }

    //     brandCounter++;
    //     brands[brandCounter] = Brand(
    //         brandCounter,
    //         cleanedName,
    //         _name,
    //         msg.sender,
    //         block.timestamp,
    //         0,
    //         0,
    //         _category,
    //         _imageHash
    //     );
    //     brandOwners[msg.sender] = brandCounter;
    //     emit BrandRegistered(brandCounter, _name, msg.sender, block.timestamp);
    // }

    // /**
    //  * @dev This function updates the details of a brand.
    //  * @param _brandId The identifier of the brand to be updated.
    //  * @param _name The new name of the brand.
    //  */
    // function updateBrand(uint256 _brandId, string memory _name)
    //     public
    //     onlyBrandOwner(_brandId)
    // {
    //     brands[_brandId].name = _name;
    //     // Brand storage brand = brands[_brandId];
    //     // brand.name = _name;
    //     // Profile storage profile = profiles[msg.sender];
    // }

    // /// @notice Checks if a brand product exists or not
    // /// @param _name Name of the Brand Product to check
    // /// @return true if brand exists, false otherwise
    // function productExists(uint256 _brandId, string memory _name)
    //     public
    //     view
    //     returns (bool)
    // {
    //     return getAllProducts(_brandId, _name).length != 0;
    // }

    // /**
    //  * @dev This function creates a new product.
    //  * @param _name The name of the new product.
    //  * @param _description The description of the new product.
    //  * @param _brandId The identifier of the brand that owns the new product.
    //  */
    // function createProduct(
    //     string memory _name,
    //     string memory _description,
    //     uint256 _brandId,
    //     string memory _imageHash
    // ) public onlyBrandOwner(_brandId) {
    //     productCounter++;
    //     products[productCounter] = Product(
    //         productCounter,
    //         _name,
    //         _description,
    //         _brandId,
    //         block.timestamp,
    //         _imageHash
    //     );
    // }

    // /**
    //  * @dev This function creates a new event.
    //  * @param _name The name of the new event.
    //  * @param _description The description of the new event.
    //  * @param _brandIds The identifiers of the brands participating in the new event.
    //  */
    // function createEvent(
    //     uint256 _brandId,
    //     string memory _name,
    //     string memory _description,
    //     string memory _eventLocation,
    //     string memory _eventStartDate,
    //     string memory _eventEndDate,
    //     string memory _eventWebsite,
    //     string memory _eventRegistrationLink,
    //     uint256[] memory _brandIds
    // ) public onlyBrandOwner(_brandId) {
    //     eventCounter++;
    //     uint256[] memory _initialBrandIds;
    //     events[eventCounter] = Event(
    //         eventCounter,
    //         msg.sender,
    //         _brandId,
    //         _name,
    //         _description,
    //         _eventLocation,
    //         _eventStartDate,
    //         _eventEndDate,
    //         _eventWebsite,
    //         _eventRegistrationLink,
    //         _initialBrandIds,
    //         block.timestamp
    //     );

    //     // Send an Invite to the Brands added to this event before adding them to the events
    //     if (_brandIds.length > 0) {
    //         for (uint256 i = 0; i < _brandIds.length; i++) {
    //             sendJoinBrandEventInvite(_brandId, _brandIds[i], eventCounter);
    //         }
    //     }
    // }

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
        uint256 _productId,
        uint8 _starRating
    ) public {
        if (bytes(_brandPlatform.getBrand(_recipientId).name).length == 0) {
            revert BrandDoesNotExist("Brand does not exist");
        }
        if (bytes(_feedbackText).length == 0) {
            revert NoFeedbackContent("Feedback content needed");
        }

        // Check that star is valid i.e., between 1 and 3
        if (_starRating < 1 || _starRating > 3) {
            revert InvalidStarRating("Rating is either 1, 2 or 3");
        }

        Feedback memory _newFeedback = Feedback({
            feedbackId: feedbackCounter,
            feedbackText: _feedbackText,
            timestamp: block.timestamp,
            sender: msg.sender,
            recipientId: _recipientId,
            eventId: _eventId,
            productId: _productId,
            starRating: _starRating
        });

        feedbackCounter++;
        _newFeedback.feedbackId = feedbackCounter;

        feedbacks[feedbackCounter] = _newFeedback;

        // feedbackCounter++;
        // feedbacks[feedbackCounter] = Feedback(
        //     feedbackCounter,
        //     _feedbackText,
        //     block.timestamp,
        //     msg.sender,
        //     _recipientId,
        //     _eventId,
        //     _productId,
        //     _starRating
        // );

        // _brandPlatform.brands[_recipientId].feedbackCount++;
        _brandPlatform.incrementBrandFeedbackCount(_recipientId);
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
            _recipientId,
            _starRating
        );
    }

    /**
     * @dev This function updates an existing feedback.
     * @param _feedbackId The identifier of the feedback to update.
     * @param _feedbackText The new feedback text (optional, pass empty string if no change).
     * @param _eventId The new event identifier (optional, pass 0 if no change).
     * @param _productId The new product identifier (optional, pass 0 if no change).
     * @param _starRating The new star rating (optional, pass 0 if no change).
     */
    function updateFeedback(
        uint256 _feedbackId,
        string memory _feedbackText,
        uint256 _eventId,
        uint256 _productId,
        uint8 _starRating
    ) public {
        Feedback storage feedback = feedbacks[_feedbackId];

        require(
            feedback.sender == msg.sender,
            "Only the sender can update their feedback"
        );
        require(
            _feedbackId != 0 && _feedbackId <= feedbackCounter,
            "Invalid feedback ID"
        );

        // Update feedback text if provided
        if (bytes(_feedbackText).length > 0) {
            feedback.feedbackText = _feedbackText;
        }

        // Update eventId if provided
        if (_eventId != 0) {
            // Remove the feedback from the old event and add it to the new one
            if (feedback.eventId != 0) {
                // Find and remove from the old event
                uint256[] storage oldEventFeedbacks = eventFeedbacks[
                    feedback.eventId
                ];
                for (uint256 i = 0; i < oldEventFeedbacks.length; i++) {
                    if (oldEventFeedbacks[i] == _feedbackId) {
                        oldEventFeedbacks[i] = oldEventFeedbacks[
                            oldEventFeedbacks.length - 1
                        ];
                        oldEventFeedbacks.pop();
                        break;
                    }
                }
            }

            // Add to the new event
            eventFeedbacks[_eventId].push(_feedbackId);
            feedback.eventId = _eventId;
        }

        // Update productId if provided
        if (_productId != 0) {
            // Remove the feedback from the old product and add it to the new one
            if (feedback.productId != 0) {
                // Find and remove from the old product
                uint256[] storage oldProductFeedbacks = productFeedbacks[
                    feedback.productId
                ];
                for (uint256 i = 0; i < oldProductFeedbacks.length; i++) {
                    if (oldProductFeedbacks[i] == _feedbackId) {
                        oldProductFeedbacks[i] = oldProductFeedbacks[
                            oldProductFeedbacks.length - 1
                        ];
                        oldProductFeedbacks.pop();
                        break;
                    }
                }
            }

            // Add to the new product
            productFeedbacks[_productId].push(_feedbackId);
            feedback.productId = _productId;
        }

        // Update star rating if provided and valid
        if (_starRating != 0) {
            require(
                _starRating >= 1 && _starRating <= 3,
                "Rating must be between 1 and 3"
            );
            feedback.starRating = _starRating;
        }

        emit FeedbackUpdated(
            _feedbackId,
            feedback.feedbackText,
            feedback.timestamp,
            feedback.sender,
            feedback.recipientId,
            feedback.starRating
        );
    }

    // /**
    //  * @dev This function retrieves a brand.
    //  * @param _brandId The identifier of the brand to be retrieved.
    //  * @return The brand with the specified identifier.
    //  */
    // function getBrand(uint256 _brandId) public view returns (Brand memory) {
    //     return brands[_brandId];
    // }

    // /**
    //  * @dev This function retrieves multiple feedbacks.
    //  * @param _feedbackIds An array of identifiers of the feedbacks to be retrieved.
    //  * @return An array of feedbacks corresponding to the specified identifiers.
    //  */
    // function getMultipleBrands(uint256[] memory _feedbackIds)
    //     public
    //     view
    //     returns (Brand[] memory)
    // {
    //     Brand[] memory multipleBrands = new Brand[](_feedbackIds.length);

    //     for (uint256 i = 0; i < _feedbackIds.length; i++) {
    //         multipleBrands[i] = brands[_feedbackIds[i]];
    //     }

    //     return multipleBrands;
    // }

    // function getAllBrands(
    //     string memory _nameFilter,
    //     address _ownerFilter,
    //     string memory _categoryFilter
    // ) public view returns (Brand[] memory) {
    //     uint256 count = 0;

    //     // First, count how many brands match the filter criteria
    //     for (uint256 i = 1; i <= brandCounter; i++) {
    //         if (
    //             (bytes(_nameFilter).length == 0 ||
    //                 keccak256(bytes(brands[i].name)) ==
    //                 keccak256(bytes(_nameFilter)) ||
    //                 keccak256(bytes(brands[i].rawName)) ==
    //                 keccak256(bytes(_nameFilter))) &&
    //             (_ownerFilter == address(0) ||
    //                 brands[i].owner == _ownerFilter) &&
    //             (bytes(_categoryFilter).length == 0 ||
    //                 keccak256(bytes(brands[i].category)) ==
    //                 keccak256(bytes(_categoryFilter)))
    //         ) {
    //             count++;
    //         }
    //     }

    //     // Create an array to store the filtered brands
    //     Brand[] memory filteredBrands = new Brand[](count);
    //     uint256 index = 0;

    //     // Populate the filtered brands array
    //     for (uint256 i = 1; i <= brandCounter; i++) {
    //         if (
    //             (bytes(_nameFilter).length == 0 ||
    //                 keccak256(bytes(brands[i].name)) ==
    //                 keccak256(bytes(_nameFilter))) &&
    //             (_ownerFilter == address(0) ||
    //                 brands[i].owner == _ownerFilter) &&
    //             (bytes(_categoryFilter).length == 0 ||
    //                 keccak256(bytes(brands[i].category)) ==
    //                 keccak256(bytes(_categoryFilter)))
    //         ) {
    //             filteredBrands[index] = brands[i];
    //             index++;
    //         }
    //     }

    //     return filteredBrands;
    // }

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

    // function getAllProducts(uint256 _brandIdFilter, string memory _nameFilter)
    //     public
    //     view
    //     returns (Product[] memory)
    // {
    //     uint256 count = 0;

    //     // First, count how many products match the filter criteria
    //     for (uint256 i = 1; i <= productCounter; i++) {
    //         if (
    //             (_brandIdFilter == 0 ||
    //                 products[i].brandId == _brandIdFilter) &&
    //             (bytes(_nameFilter).length == 0 ||
    //                 keccak256(bytes(products[i].name)) ==
    //                 keccak256(bytes(_nameFilter)))
    //         ) {
    //             count++;
    //         }
    //     }

    //     // Create an array to store the filtered products
    //     Product[] memory filteredProducts = new Product[](count);
    //     uint256 index = 0;

    //     // Populate the filtered products array
    //     for (uint256 i = 1; i <= productCounter; i++) {
    //         if (
    //             (_brandIdFilter == 0 ||
    //                 products[i].brandId == _brandIdFilter) &&
    //             (bytes(_nameFilter).length == 0 ||
    //                 keccak256(bytes(products[i].name)) ==
    //                 keccak256(bytes(_nameFilter)))
    //         ) {
    //             filteredProducts[index] = products[i];
    //             index++;
    //         }
    //     }

    //     return filteredProducts;
    // }

    // /**
    //  * @dev This function retrieves an event.
    //  * @param _eventIds The identifier of the event to be retrieved.
    //  * @return The event with the specified identifier.
    //  */
    // // function getEvent(uint256 _eventId) public view returns (Event memory) {
    // //     return events[_eventId];
    // // }
    // function getMultipleEvents(uint256[] memory _eventIds)
    //     public
    //     view
    //     returns (Event[] memory)
    // {
    //     Event[] memory multipleEvents = new Event[](_eventIds.length);
    //     for (uint256 i = 0; i < _eventIds.length; i++) {
    //         multipleEvents[i] = events[_eventIds[i]];
    //     }
    //     return multipleEvents;
    // }

    // function getAllEvents(uint256 _brandIdFilter, string memory _nameFilter)
    //     public
    //     view
    //     returns (Event[] memory)
    // {
    //     uint256 count = 0;

    //     // First, count how many events match the filter criteria
    //     for (uint256 i = 1; i <= eventCounter; i++) {
    //         bool brandMatches = false;

    //         // If no brand filter is applied, set brandMatches to true
    //         if (_brandIdFilter == 0) {
    //             brandMatches = true;
    //         } else {
    //             // Check if any brandId in the event matches the brand filter
    //             for (uint256 j = 0; j < events[i].brandIds.length; j++) {
    //                 if (events[i].brandIds[j] == _brandIdFilter) {
    //                     brandMatches = true;
    //                     break;
    //                 }
    //             }
    //         }

    //         // Apply name filter and brand filter
    //         if (
    //             brandMatches &&
    //             (bytes(_nameFilter).length == 0 ||
    //                 keccak256(bytes(events[i].name)) ==
    //                 keccak256(bytes(_nameFilter)))
    //         ) {
    //             count++;
    //         }
    //     }

    //     // Create an array to store the filtered events
    //     Event[] memory filteredEvents = new Event[](count);
    //     uint256 index = 0;

    //     // Populate the filtered events array
    //     for (uint256 i = 1; i <= eventCounter; i++) {
    //         bool brandMatches = false;

    //         if (_brandIdFilter == 0) {
    //             brandMatches = true;
    //         } else {
    //             for (uint256 j = 0; j < events[i].brandIds.length; j++) {
    //                 if (events[i].brandIds[j] == _brandIdFilter) {
    //                     brandMatches = true;
    //                     break;
    //                 }
    //             }
    //         }

    //         if (
    //             brandMatches &&
    //             (bytes(_nameFilter).length == 0 ||
    //                 keccak256(bytes(events[i].name)) ==
    //                 keccak256(bytes(_nameFilter)))
    //         ) {
    //             filteredEvents[index] = events[i];
    //             index++;
    //         }
    //     }

    //     return filteredEvents;
    // }

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

    /**
     * @dev This function retrieves multiple feedbacks.
     * @param _feedbackIds An array of identifiers of the feedbacks to be retrieved.
     * @return An array of feedbacks corresponding to the specified identifiers.
     */
    function getMultipleFeedbacks(
        uint256[] memory _feedbackIds
    ) public view returns (Feedback[] memory) {
        Feedback[] memory multipleFeedbacks = new Feedback[](
            _feedbackIds.length
        );

        for (uint256 i = 0; i < _feedbackIds.length; i++) {
            multipleFeedbacks[i] = feedbacks[_feedbackIds[i]];
        }

        return multipleFeedbacks;
    }

    /**
     * @dev This function retrieves all feedbacks sent by the current user (msg.sender).
     * @return An array of feedbacks sent by the caller (msg.sender).
     */
    function getMyFeedbacks() public view returns (Feedback[] memory) {
        uint256 count = 0;
        // First, count the number of feedbacks by msg.sender to determine the array size
        // i starts from 1 because feedbackId starts from 1
        for (uint256 i = 0; i < feedbackCounter + 1; i++) {
            if (feedbacks[i].sender == msg.sender) {
                count++;
            }
        }

        Feedback[] memory myFeedbacks = new Feedback[](count);
        uint256 index = 0;

        // Then, populate the array with feedbacks from msg.sender
        // i starts from 1 because feedbackId starts from 1
        for (uint256 i = 0; i < feedbackCounter + 1; i++) {
            if (feedbacks[i].sender == msg.sender) {
                myFeedbacks[index] = feedbacks[i];
                index++;
            }
        }

        return myFeedbacks;
    }

    /**
     * @dev This function retrieves all feedbacks sent by a specific user (sender).
     * @param _sender The address of the user whose feedbacks are to be retrieved.
     * @return An array of feedbacks sent by the specified user.
     */
    function getUserFeedbacks(
        address _sender
    ) public view returns (Feedback[] memory) {
        uint256 count = 0;
        // First, count the number of feedbacks by the sender to determine the array size
        // i starts from 1 because feedbackId starts from 1
        for (uint256 i = 0; i < feedbackCounter + 1; i++) {
            if (feedbacks[i].sender == _sender) {
                count++;
            }
        }

        Feedback[] memory _userFeedbacks = new Feedback[](count);
        uint256 index = 0;

        // Then, populate the array with feedbacks from the sender
        // i starts from 1 because feedbackId starts from 1
        for (uint256 i = 0; i < feedbackCounter + 1; i++) {
            if (feedbacks[i].sender == _sender) {
                _userFeedbacks[index] = feedbacks[i];
                index++;
            }
        }

        return _userFeedbacks;
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

    // // Function to get all invites for a specific address
    // function getInvitesForAddress(address _address)
    //     public
    //     view
    //     returns (uint256[] memory)
    // {
    //     return eventBrandInvites[_address];
    // }

    // Function to get all userFeedback for a specific address
    function getUserFeedback(
        address _address
    ) public view returns (uint256[] memory) {
        return userFeedbacks[_address];
    }

    // Function to get all userFeedback for a specific address
    function getBrandFeedback(
        uint256 _brandId
    ) public view returns (uint256[] memory) {
        return brandFeedbacks[_brandId];
    }

    // Function to get all eventFeedback for a specific address
    function getEventFeedback(
        uint256 _eventId
    ) public view returns (uint256[] memory) {
        return eventFeedbacks[_eventId];
    }

    // Function to get all eventFeedback for a specific address
    function getProductFeedback(
        uint256 _productId
    ) public view returns (uint256[] memory) {
        return productFeedbacks[_productId];
    }

    // // Sample function to add invites (for testing purposes)
    // function addInvite(address _address, uint256 _inviteId) public {
    //     eventBrandInvites[_address].push(_inviteId);
    // }

    // function sendJoinBrandEventInvite(
    //     uint256 _fromBrandId,
    //     uint256 _toBrandId,
    //     uint256 _eventId
    // ) public onlyBrandOwner(_fromBrandId) {
    //     // Get the brand name for the event invite message
    //     // string memory brandName = getBrand(_brandId).name;

    //     address invitedBrandOwner = getBrand(_toBrandId).owner;
    //     // eventBrandInvites[invitedBrandOwner].push(_eventId);
    //     addInvite(invitedBrandOwner, _eventId);

    //     emit EventBrandInvited(_eventId, _toBrandId);

    //     // // Get the event name for the event invite message
    //     // string memory eventName = getAllEvents(uint256(0), "")[_brandId].name;

    //     // // Get the event registration link for the event invite message
    //     // string memory eventRegistrationLink = getAllEvents(uint256(0), "")[_brandId].eventRegistrationLink;

    //     // // Send an event invite to the brand owner's address using the event invite message
    //     // (bool sent, ) = getBrand(_brandId).owner.call{value: 1 ether}("");

    //     // // Check if the event invite was sent successfully
    //     // require(sent == true);
    // }

    // // function confirmJointBrandEvent(
    // //     uint256 _eventId,
    // //     uint256 _brandId,
    // //     uint256 _indexInArray
    // // ) public thisBrandExists(_brandId) {
    // //     // require(
    // //     //     bytes(brands[_brandId].name).length != 0,
    // //     //     "Brand does not exist"
    // //     // );

    // //     // Update an event brandId if that brand accepts the event invite.
    // //     // if (!reject) {
    // //     // }
    // //     events[_eventId].brandIds.push(_brandId);
    // //     removeJointBrandEvent(_eventId, _brandId, _indexInArray);

    // //     emit EventBrandConfirmed(_eventId, _brandId);
    // // }

    // function removeJointBrandEvent(
    //     uint256 _eventId,
    //     uint256 _brandId,
    //     uint256 _indexInArray
    // ) public {
    //     address invitedBrandOwner = getBrand(_brandId).owner;
    //     delete eventBrandInvites[invitedBrandOwner][_indexInArray];

    //     emit EventBrandRemove(_eventId, _brandId);
    // }
}

contract EventsPlatform {
    using String for string;
    using NumberArrayUtils for uint256[];

    BrandPlatform _brandPlatform;

    constructor(address _brandPlatformAddress) {
        _brandPlatform = BrandPlatform(_brandPlatformAddress);
    }

    /**
     * @dev A structure to represent an event.
     * @param eventId The unique identifier for the event.
     * @param name The name of the event.
     * @param description The description of the event.
     * @param brandIds The identifiers of the brands participating in the event.
     * @param createdAt The timestamp when the Event was created.
     */
    struct EventBasicInfo {
        uint256 eventId;
        CreateEventBasicInfo createEventBasicInfo;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct CreateEventBasicInfo {
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
    }

    struct EventOtherInfo {
        uint256 eventId;
        CreateEventOtherInfo createEventOtherInfo;
    }

    struct CreateEventOtherInfo {
        string eventImageHash;
        string tags;
    }

    struct Event {
        EventBasicInfo eventBasicInfo;
        EventOtherInfo eventOtherInfo;
    }

    struct CreateEvent {
        CreateEventBasicInfo createEventBasicInfo;
        CreateEventOtherInfo createEventOtherInfo;
    }

    uint256 public eventCounter = 0;

    mapping(uint256 => Event) private events;
    // mapping(uint256 => EventOtherInfo) public eventsOtherInfo; // EventId to EventOtherInfo
    mapping(address => uint256[]) private eventBrandInvites; // map address of Invited owner (i.e., the brand) to List of events invited to.

    event EventRegistered(
        uint256 indexed eventId,
        address owner,
        uint256 brandId,
        string name,
        string description,
        uint256 createdAt
    );
    event EventBrandConfirmed(uint256 indexed eventId, uint256 brandId);
    event EventBrandRemove(uint256 indexed eventId, uint256 brandId);
    event EventBrandInvited(uint256 indexed eventId, uint256 brandId);

    // error NotBrandOwner(string _message);
    error NoEventName(string _message);
    error NoEventDescription(string _message);
    error NoEventDate(string _message);
    error NotAuthorized(string _message);

    // /**
    //  * @dev This function creates a new event.
    //  * @param _name The name of the new event.
    //  * @param _description The description of the new event.
    //  * @param _brandIds The identifiers of the brands participating in the new event.
    //  */
    // function createEvent(
    //     uint256 _brandId,
    //     string memory _name,
    //     string memory _description,
    //     string memory _eventLocation,
    //     string memory _eventStartDate,
    //     string memory _eventEndDate,
    //     string memory _eventWebsite,
    //     string memory _eventRegistrationLink,
    //     uint256[] memory _brandIds,
    //     string memory _eventImageHash
    // ) public {
    /**
     * @dev This function creates a new event.
     * @param _event The struct of the new event.
     */
    // function createEvent(Event memory _event) public {
    //     // uint256 _brandId = _event.brandId;
    //     // string memory _name = _event.name;
    //     // string memory _description = _event.description;
    //     // string memory _eventLocation = _event.eventLocation;
    //     // string memory _eventStartDate = _event.eventStartDate;
    //     // string memory _eventEndDate = _event.eventEndDate;
    //     // string memory _eventWebsite = _event.eventWebsite;
    //     // string memory _eventRegistrationLink = _event.eventRegistrationLink;
    //     // string memory _eventImageHash = _event.eventImageHash;
    //     // string memory _eventTags = _event.tags;
    //     // uint256[] memory _brandIds = _event.brandIds;

    //     // Ensure that only Brand owner can call this function
    //     if (_feedbacksPlatform.getBrand(_event.brandId).owner != msg.sender) {
    //         revert NotBrandOwner("Not Brand owner");
    //     }

    //     if (bytes(_event.name).length == 0) {
    //         revert NoEventName("Event name needed");
    //     }
    //     if (bytes(_event.description).length == 0) {
    //         revert NoEventDescription("Event description needed");
    //     }
    //     if (bytes(_event.eventStartDate).length == 0) {
    //         revert NoEventDate("Event start date needed");
    //     }
    //     if (bytes(_event.eventEndDate).length == 0) {
    //         revert NoEventDate("Event end date needed");
    //     }

    //     for (uint256 i = 0; i < _event.brandIds.length; i++) {
    //         if (_event.brandIds[i] == _event.brandId) {
    //             // remove _event.brandId from _event.brandIds if it exists in it. This means you cannot invite yourself when creating your own events.
    //             _event.brandIds.removeFromIndex(i);
    //         }
    //     }

    //     uint256[] memory _initialBrandIds = new uint256[](0);

    //     Event memory newEvent = Event({
    //         eventId: eventCounter,
    //         owner: msg.sender,
    //         brandId: _event.brandId,
    //         name: _event.name,
    //         description: _event.description,
    //         eventLocation: _event.eventLocation,
    //         eventStartDate: _event.eventStartDate,
    //         eventEndDate: _event.eventEndDate,
    //         eventWebsite: _event.eventWebsite,
    //         eventRegistrationLink: _event.eventRegistrationLink,
    //         brandIds: _initialBrandIds,
    //         createdAt: block.timestamp,
    //         eventImageHash: _event.eventImageHash,
    //         tags: _event.tags
    //     });

    //     eventCounter++;
    //     newEvent.eventId = eventCounter;

    //     events[eventCounter] = newEvent;

    //     // Send an Invite to the Brands added to this event before adding them to the events
    //     if (_event.brandIds.length > 0) {
    //         for (uint256 i = 0; i < _event.brandIds.length; i++) {
    //             sendJoinBrandEventInvite(_event.brandId, _event.brandIds[i], eventCounter);
    //         }
    //     }
    // }

    function createEvent(CreateEvent memory _event) public {
        validateEventData(_event);
        cleanUpBrandIds(_event);
        storeNewEvent(_event);
    }

    function validateEventData(CreateEvent memory _event) internal view {
        CreateEventBasicInfo memory _createEventBasicInfo = _event
            .createEventBasicInfo;
        if (
            _brandPlatform.getBrand(_createEventBasicInfo.brandId).owner !=
            msg.sender
        ) {
            revert NotBrandOwner("Not Brand owner");
        }

        if (bytes(_createEventBasicInfo.name).length == 0) {
            revert NoEventName("Event name needed");
        }
        if (bytes(_createEventBasicInfo.description).length == 0) {
            revert NoEventDescription("Event description needed");
        }
        if (bytes(_createEventBasicInfo.eventStartDate).length == 0) {
            revert NoEventDate("Event start date needed");
        }
        if (bytes(_createEventBasicInfo.eventEndDate).length == 0) {
            revert NoEventDate("Event end date needed");
        }
    }

    function cleanUpBrandIds(CreateEvent memory _event) internal pure {
        CreateEventBasicInfo memory _createEventBasicInfo = _event
            .createEventBasicInfo;
        for (uint256 i = 0; i < _createEventBasicInfo.brandIds.length; i++) {
            if (
                _createEventBasicInfo.brandIds[i] ==
                _createEventBasicInfo.brandId
            ) {
                // remove the creating brandId from brandIds if it exists in it
                _createEventBasicInfo.brandIds.removeFromIndex(i);
            }
        }
    }

    function storeNewEvent(CreateEvent memory _event) internal {
        // uint256[] memory _initialBrandIds = new uint256[](0);
        CreateEventBasicInfo memory _createEventBasicInfo = _event
            .createEventBasicInfo;
        CreateEventOtherInfo memory _createEventOtherInfo = _event
            .createEventOtherInfo;
        // Get the brandIds sent when creating the account.
        uint256[] memory _eventBrandIds = _createEventBasicInfo.brandIds;

        // Set the new Event Data's brandId for the new event to an empty array.
        _createEventBasicInfo.brandIds = new uint256[](0);

        EventBasicInfo memory newEvent = EventBasicInfo({
            eventId: eventCounter,
            createEventBasicInfo: _createEventBasicInfo,
            // owner: msg.sender,
            // brandId: _event.eventBasicInfo.brandId,
            // name: _event.eventBasicInfo.name,
            // description: _event.eventBasicInfo.description,
            // eventLocation: _event.eventBasicInfo.eventLocation,
            // eventStartDate: _event.eventBasicInfo.eventStartDate,
            // eventEndDate: _event.eventBasicInfo.eventEndDate,
            // eventWebsite: _event.eventBasicInfo.eventWebsite,
            // eventRegistrationLink: _event.eventBasicInfo.eventRegistrationLink,
            // brandIds: _initialBrandIds,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        // Create the EventOtherInfo
        EventOtherInfo memory newEventOtherInfo = EventOtherInfo({
            eventId: eventCounter,
            createEventOtherInfo: _createEventOtherInfo
            // tags: _event.eventOtherInfo.tags,
            // eventImageHash: _event.eventOtherInfo.eventImageHash
        });

        eventCounter++;
        newEvent.eventId = eventCounter;
        newEventOtherInfo.eventId = eventCounter;

        events[eventCounter] = Event(newEvent, newEventOtherInfo);
        // eventsOtherInfo[eventCounter] = newEventOtherInfo;

        if (_eventBrandIds.length > 0) {
            for (uint256 i = 0; i < _eventBrandIds.length; i++) {
                sendJoinBrandEventInvite(
                    _createEventBasicInfo.brandId,
                    _eventBrandIds[i],
                    eventCounter
                );
            }
        }
    }

    function updateEvent(uint256 _eventId, CreateEvent memory _event) public {
        CreateEventBasicInfo memory _createEventBasicInfo = _event
            .createEventBasicInfo;
        CreateEventOtherInfo memory _createEventOtherInfo = _event
            .createEventOtherInfo;
        Event storage existingEvent = events[_eventId];
        // EventOtherInfo storage existingEventOtherInfo = eventsOtherInfo[
        //     _eventId
        // ];

        // Ensure that only the Event owner or Brand owner can call this function
        if (
            existingEvent.eventBasicInfo.createEventBasicInfo.owner !=
            msg.sender &&
            _brandPlatform
                .getBrand(
                    existingEvent.eventBasicInfo.createEventBasicInfo.brandId
                )
                .owner !=
            msg.sender
        ) {
            revert NotAuthorized("Not authorized");
        }

        // Validate and update each field if provided, otherwise keep the existing value
        if (bytes(_createEventBasicInfo.name).length > 0) {
            existingEvent
                .eventBasicInfo
                .createEventBasicInfo
                .name = _createEventBasicInfo.name;
        }

        if (bytes(_createEventBasicInfo.description).length > 0) {
            existingEvent
                .eventBasicInfo
                .createEventBasicInfo
                .description = _createEventBasicInfo.description;
        }

        if (bytes(_createEventBasicInfo.eventLocation).length > 0) {
            existingEvent
                .eventBasicInfo
                .createEventBasicInfo
                .eventLocation = _createEventBasicInfo.eventLocation;
        }

        if (bytes(_createEventBasicInfo.eventStartDate).length > 0) {
            existingEvent
                .eventBasicInfo
                .createEventBasicInfo
                .eventStartDate = _createEventBasicInfo.eventStartDate;
        }

        if (bytes(_createEventBasicInfo.eventEndDate).length > 0) {
            existingEvent
                .eventBasicInfo
                .createEventBasicInfo
                .eventEndDate = _createEventBasicInfo.eventEndDate;
        }

        if (bytes(_createEventBasicInfo.eventWebsite).length > 0) {
            existingEvent
                .eventBasicInfo
                .createEventBasicInfo
                .eventWebsite = _createEventBasicInfo.eventWebsite;
        }

        if (bytes(_createEventBasicInfo.eventRegistrationLink).length > 0) {
            existingEvent
                .eventBasicInfo
                .createEventBasicInfo
                .eventRegistrationLink = _createEventBasicInfo
                .eventRegistrationLink;
        }

        if (bytes(_createEventOtherInfo.eventImageHash).length > 0) {
            existingEvent
                .eventOtherInfo
                .createEventOtherInfo
                .eventImageHash = _createEventOtherInfo.eventImageHash;
        }

        if (bytes(_createEventOtherInfo.tags).length > 0) {
            existingEvent
                .eventOtherInfo
                .createEventOtherInfo
                .tags = _createEventOtherInfo.tags;
        }

        // Update the brandIds array, ensuring the event owner cannot invite themselves
        if (_createEventBasicInfo.brandIds.length > 0) {
            uint256[] memory updatedBrandIds = new uint256[](
                _createEventBasicInfo.brandIds.length
            );
            uint256 count = 0;
            for (
                uint256 i = 0;
                i < _createEventBasicInfo.brandIds.length;
                i++
            ) {
                if (
                    _createEventBasicInfo.brandIds[i] !=
                    existingEvent.eventBasicInfo.createEventBasicInfo.brandId
                ) {
                    updatedBrandIds[count] = _createEventBasicInfo.brandIds[i];
                    count++;
                }
            }
            existingEvent
                .eventBasicInfo
                .createEventBasicInfo
                .brandIds = updatedBrandIds;
        }

        // Re-send invites if brandIds are updated
        if (_createEventBasicInfo.brandIds.length > 0) {
            for (
                uint256 i = 0;
                i < _createEventBasicInfo.brandIds.length;
                i++
            ) {
                sendJoinBrandEventInvite(
                    existingEvent.eventBasicInfo.createEventBasicInfo.brandId,
                    _createEventBasicInfo.brandIds[i],
                    _eventId
                );
            }
        }

        // Update the event's last modified timestamp
        existingEvent.eventBasicInfo.updatedAt = block.timestamp;
    }

    /**
     * @dev This function retrieves an event.
     * @param _eventId The identifier of the event to be retrieved.
     * @return The event with the specified identifier.
     */
    function getEvent(uint256 _eventId) public view returns (Event memory) {
        return events[_eventId];
    }

    /**
     * @notice Retrieves a list of events.
     * @dev This function retrieves an event.
     * @param _eventIds The identifiers of the events to be retrieved.
     * @return A list of events with the specified identifiers.
     */
    function getMultipleEvents(
        uint256[] memory _eventIds
    ) public view returns (Event[] memory) {
        Event[] memory multipleEvents = new Event[](_eventIds.length);
        for (uint256 i = 0; i < _eventIds.length; i++) {
            multipleEvents[i] = events[_eventIds[i]];
        }
        return multipleEvents;
    }

    /**
     * @notice Retrieves a list of events owned by the caller.
     * @dev This function returns a list of events owned by the caller.
     * @return A list of events owned by the caller.
     */
    function getMyEvents() public view returns (Event[] memory) {
        uint256 count = 0;

        // First, count how many events belong to msg.sender
        // i starts from 1 because eventId starts from 1
        for (uint256 i = 0; i < eventCounter + 1; i++) {
            if (
                events[i].eventBasicInfo.createEventBasicInfo.owner ==
                msg.sender
            ) {
                count++;
            }
        }

        // Create an array for storing the user's events
        Event[] memory myEvents = new Event[](count);
        uint256 index = 0;

        // Now, add the events owned by msg.sender to the array
        // i starts from 1 because eventId starts from 1
        for (uint256 i = 0; i < eventCounter + 1; i++) {
            if (
                events[i].eventBasicInfo.createEventBasicInfo.owner ==
                msg.sender
            ) {
                myEvents[index] = events[i];
                index++;
            }
        }

        return myEvents;
    }

    /**
     * @notice Retrieves a list of events owned by the caller.
     * @dev This function returns a list of events owned by the caller.
     * @return A list of events owned by the caller.
     */
    function getUserEvents(
        address _owner
    ) public view returns (Event[] memory) {
        uint256 count = 0;

        // First, count how many events belong to _owner
        // i starts from 1 because eventId starts from 1
        for (uint256 i = 0; i < eventCounter + 1; i++) {
            if (events[i].eventBasicInfo.createEventBasicInfo.owner == _owner) {
                count++;
            }
        }

        // Create an array for storing the user's events
        Event[] memory myEvents = new Event[](count);
        uint256 index = 0;

        // Now, add the events owned by _owner to the array
        // i starts from 1 because eventId starts from 1
        for (uint256 i = 0; i < eventCounter + 1; i++) {
            if (events[i].eventBasicInfo.createEventBasicInfo.owner == _owner) {
                myEvents[index] = events[i];
                index++;
            }
        }

        return myEvents;
    }

    /**
     * @notice Retrieves all events.
     * @dev This function retrieves all of events.
     * @param _brandIdFilter The identifiers of the brand to use for events filter.
     * @param _nameFilter The name filter.
     * @return A list of events with the specified ids.
     */
    function getAllEvents(
        uint256 _brandIdFilter,
        string memory _nameFilter,
        string memory _tagFilter
    ) public view returns (Event[] memory) {
        uint256 count = 0;

        // First, count how many events match the filter criteria
        for (uint256 i = 1; i <= eventCounter; i++) {
            bool brandMatches = false;
            bool tagMatches = false;

            // If no brand filter is applied, set brandMatches to true
            if (_brandIdFilter == 0) {
                brandMatches = true;
            } else {
                // Check if any brandId in the event matches the brand filter
                for (
                    uint256 j = 0;
                    j <
                    events[i]
                        .eventBasicInfo
                        .createEventBasicInfo
                        .brandIds
                        .length;
                    j++
                ) {
                    if (
                        events[i].eventBasicInfo.createEventBasicInfo.brandIds[
                            j
                        ] == _brandIdFilter
                    ) {
                        brandMatches = true;
                        break;
                    }
                }
            }

            // Apply tag filter
            if (bytes(_tagFilter).length == 0) {
                tagMatches = true; // No tag filter, so it's a match
            } else {
                string memory eventTags = events[i]
                    .eventOtherInfo
                    .createEventOtherInfo
                    .tags;
                // if (keccak256(bytes(eventTags)) == keccak256(bytes(_tagFilter))) {
                //     tagMatches = true;
                // }
                // Use an `include` instead of direct byte comparison
                if (eventTags.includes(_tagFilter)) {
                    tagMatches = true;
                }
            }

            // Apply brand, tags and name filter
            if (
                brandMatches &&
                tagMatches &&
                (bytes(_nameFilter).length == 0 ||
                    keccak256(
                        bytes(
                            events[i].eventBasicInfo.createEventBasicInfo.name
                        )
                    ) ==
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
            bool tagMatches = false;

            if (_brandIdFilter == 0) {
                brandMatches = true;
            } else {
                for (
                    uint256 j = 0;
                    j <
                    events[i]
                        .eventBasicInfo
                        .createEventBasicInfo
                        .brandIds
                        .length;
                    j++
                ) {
                    if (
                        events[i].eventBasicInfo.createEventBasicInfo.brandIds[
                            j
                        ] == _brandIdFilter
                    ) {
                        brandMatches = true;
                        break;
                    }
                }
            }

            // Apply tag filter
            if (bytes(_tagFilter).length == 0) {
                tagMatches = true; // No tag filter, so it's a match
            } else {
                string memory eventTags = events[i]
                    .eventOtherInfo
                    .createEventOtherInfo
                    .tags;
                // if (keccak256(bytes(eventTags)) == keccak256(bytes(_tagFilter))) {
                //     tagMatches = true;
                // }
                // Use an `include` instead of direct byte comparison
                if (eventTags.includes(_tagFilter)) {
                    tagMatches = true;
                }
            }

            if (
                brandMatches &&
                tagMatches &&
                (bytes(_nameFilter).length == 0 ||
                    keccak256(
                        bytes(
                            events[i].eventBasicInfo.createEventBasicInfo.name
                        )
                    ) ==
                    keccak256(bytes(_nameFilter)))
            ) {
                filteredEvents[index] = events[i];
                index++;
            }
        }

        return filteredEvents;
    }

    // Sample function to add invites (for testing purposes)
    function addInvite(address _address, uint256 _inviteId) public {
        eventBrandInvites[_address].push(_inviteId);
    }

    /**
     * @notice Function to get all invites for a specific address
     * @dev This function returns the list of invites for a specific address
     * @param _address The address to fetch the invites for
     */
    function getInvitesForAddress(
        address _address
    ) public view returns (uint256[] memory) {
        return eventBrandInvites[_address];
    }

    /**
     * @notice Send an invite for a brand's participation in an event feedback.
     * @dev This function sends handles the logic to send an invite for a brand's participation in an event feedback.
     * @param _fromBrandId The identifier of the brand sending the invite.
     * @param _toBrandId The identifier of the invited brand to be confirmed.
     * @param _eventId The identifier of the event being invited to.
     */
    function sendJoinBrandEventInvite(
        uint256 _fromBrandId,
        uint256 _toBrandId,
        uint256 _eventId
    ) public {
        if (_brandPlatform.getBrand(_fromBrandId).owner != msg.sender) {
            revert NotBrandOwner("Not brand owner");
        }

        // Get the brand name for the event invite message
        // string memory brandName = getBrand(_brandId).name;

        address invitedBrandOwner = _brandPlatform.getBrand(_toBrandId).owner;
        // eventBrandInvites[invitedBrandOwner].push(_eventId);
        addInvite(invitedBrandOwner, _eventId);

        emit EventBrandInvited(_eventId, _toBrandId);

        // // Get the event name for the event invite message
        // string memory eventName = getAllEvents(uint256(0), "")[_brandId].name;

        // // Get the event registration link for the event invite message
        // string memory eventRegistrationLink = getAllEvents(uint256(0), "")[_brandId].eventRegistrationLink;

        /**
         * @dev This function confirms a brand's participation in an event.
         * @param _eventId The identifier of the event to be confirmed.
         * @param _brandId The identifier of the brand to be confirmed.
         * @param _indexInArray The index of the brand in the event's brand array.
         */

        // // Send an event invite to the brand owner's address using the event invite message
        // (bool sent, ) = getBrand(_brandId).owner.call{value: 1 ether}("");

        // // Check if the event invite was sent successfully
        // require(sent == true);
    }

    /**
     * @notice Confirms a brand's participation in an event.
     * @dev This function updates the event brandId if the brand accepts the event invite.
     * @param _eventId The identifier of the event to be updated.
     * @param _brandId The identifier of the brand to be confirmed.
     */
    function confirmJointBrandEvent(uint256 _eventId, uint256 _brandId) public {
        // Ensure that only Brand owner can call this function
        if (_brandPlatform.getBrand(_brandId).owner != msg.sender) {
            revert NotBrandOwner("Not brand owner");
        }

        // require(
        //     bytes(brands[_brandId].name).length != 0,
        //     "Brand does not exist"
        // );

        // Update an event brandId if that brand accepts the event invite.
        // if (!reject) {
        // }
        events[_eventId].eventBasicInfo.createEventBasicInfo.brandIds.push(
            _brandId
        );
        removeJointBrandEvent(_eventId, _brandId);

        emit EventBrandConfirmed(_eventId, _brandId);
    }

    /**
     * @notice Removes a brand's participation in an event.
     * @dev This function updates the event brandId if the brand rejects the event invite.
     * @param _eventId The identifier of the event to be updated.
     * @param _brandId The identifier of the brand to be rejected.
     */
    function removeJointBrandEvent(uint256 _eventId, uint256 _brandId) public {
        address invitedBrandOwner = _brandPlatform.getBrand(_brandId).owner;

        CreateEventBasicInfo memory _createEventBasicInfo = events[_eventId]
            .eventBasicInfo
            .createEventBasicInfo;

        for (uint256 i = 0; i < _createEventBasicInfo.brandIds.length; i++) {
            if (_createEventBasicInfo.brandIds[i] == _brandId) {
                // remove the creating brandId from brandIds if it exists in it
                // _createEventBasicInfo.brandIds.removeFromIndex(i);
                // delete eventBrandInvites[invitedBrandOwner][i];
                eventBrandInvites[invitedBrandOwner].removeFromIndex(i);
            }
        }

        emit EventBrandRemove(_eventId, _brandId);
    }
}

contract ProductsPlatform {
    using String for string;
    using StringUtils for string[];

    BrandPlatform _brandPlatform;

    constructor(address _brandPlatformAddress) {
        _brandPlatform = BrandPlatform(_brandPlatformAddress);
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
        address owner;
        string name;
        string rawName;
        string description;
        uint256 brandId;
        uint256 createdAt;
        uint256 updatedAt;
        string imageHash;
    }

    uint256 public productCounter = 0;

    mapping(uint256 => Product) public products;

    event ProductRegistered(
        uint256 indexed productId,
        string name,
        string rawName,
        string description,
        uint256 brandId,
        uint256 createdAt,
        uint256 updatedAt,
        string imageHash
    );

    // error NotBrandOwner(string _message);
    error NotAuthorized(string _message);
    error NoProductName(string _message);
    error NoProductDescription(string _message);

    /**
     * @notice Checks if a brand product exists or not
     * @param _name Name of the Brand Product to check
     * @return true if brand exists, false otherwise
     */
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
        uint256 _brandId,
        string memory _imageHash
    ) public {
        // Ensure that only Brand owner can call this function
        if (_brandPlatform.getBrand(_brandId).owner != msg.sender) {
            revert NotBrandOwner("Not Brand owner");
        }

        // Ensure the product name is valid
        // 1. Check that name is not empty
        // 2. Check that description is not empty
        // 3. Check that description starts with letters and not symbols or numbers.
        if (bytes(_name).length == 0) {
            revert NoProductName("Product name needed");
        }
        if (bytes(_description).length == 0) {
            revert NoProductDescription("Product description needed");
        }
        require(bytes(_name).length > 0, "Product name cannot be empty");

        //
        string memory cleanedName;
        if (_name.includes(" ")) {
            cleanedName = _name.split(" ").joinArray("_");
            cleanedName.toLowerCase();
        }

        Product memory newProduct = Product({
            productId: productCounter,
            owner: msg.sender,
            name: cleanedName,
            rawName: _name,
            description: _description,
            brandId: _brandId,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            imageHash: _imageHash
        });

        productCounter++;
        newProduct.productId = productCounter;

        products[productCounter] = newProduct;
    }

    /**
     * @dev This function updates an existing product's details dynamically.
     * @param _productId The identifier of the product to update.
     * @param _name The new name of the product (if updating).
     * @param _description The new description of the product (if updating).
     * @param _brandId The new brandId of the product (if changing ownership).
     * @param _imageHash The new image hash of the product (if updating).
     */
    function updateProduct(
        uint256 _productId,
        string memory _name,
        string memory _description,
        uint256 _brandId,
        string memory _imageHash
    ) public {
        // Ensure the product exists
        Product storage product = products[_productId];

        // Ensure that only the product owner or brand owner can update the product
        if (
            product.owner != msg.sender &&
            _brandPlatform.getBrand(product.brandId).owner != msg.sender
        ) {
            revert NotAuthorized("Not authorized to update product");
        }

        // Update product name if provided and valid
        if (bytes(_name).length > 0) {
            string memory cleanedName = _name;
            if (_name.includes(" ")) {
                cleanedName = _name.split(" ").joinArray("_").toLowerCase();
            }
            product.name = cleanedName;
            product.rawName = _name;
        }

        // Update product description if provided and valid
        if (bytes(_description).length > 0) {
            product.description = _description;
        }

        // Update brandId if provided and ensure the new brand ownership is valid
        if (_brandId != 0 && _brandId != product.brandId) {
            if (_brandPlatform.getBrand(_brandId).owner != msg.sender) {
                revert NotBrandOwner("Not owner of new brand");
            }
            product.brandId = _brandId;
        }

        // Update image hash if provided
        if (bytes(_imageHash).length > 0) {
            product.imageHash = _imageHash;
        }

        // Update the timestamp to reflect when the product was updated
        product.updatedAt = block.timestamp;
    }

    /**
     * @dev This function retrieves a product.
     * @param _productId The identifier of the product to be retrieved.
     * @return The product with the specified identifier.
     */
    function getProduct(
        uint256 _productId
    ) public view returns (Product memory) {
        return products[_productId];
    }

    /**
     * @dev This function retrieves a list of products.
     * @param _productIds The identifiers of the products to be retrieved.
     * @return A list of products with the specified ids.
     */
    function getMultipleProducts(
        uint256[] memory _productIds
    ) public view returns (Product[] memory) {
        Product[] memory multipleProducts = new Product[](_productIds.length);
        for (uint256 i = 0; i < _productIds.length; i++) {
            multipleProducts[i] = products[_productIds[i]];
        }
        return multipleProducts;
    }

    /**
     * @notice Retrieves a list of products owned by the caller.
     * @dev This function returns a list of products owned by the caller.
     * @return A list of products owned by the caller.
     */
    function getMyProducts() public view returns (Product[] memory) {
        uint256 count = 0;

        // First, count how many products are owned by msg.sender
        // i starts from 1 because productId starts from 1
        for (uint256 i = 0; i < productCounter + 1; i++) {
            if (products[i].owner == msg.sender) {
                count++;
            }
        }

        // Create an array to hold the caller's products
        Product[] memory myProducts = new Product[](count);
        uint256 index = 0;

        // Populate the array with products owned by msg.sender
        // i starts from 1 because productId starts from 1
        for (uint256 i = 0; i < productCounter + 1; i++) {
            if (products[i].owner == msg.sender) {
                myProducts[index] = products[i];
                index++;
            }
        }

        return myProducts;
    }

    /**
     * @notice Retrieves a list of products owned by the caller.
     * @dev This function returns a list of products owned by the caller.
     * @return A list of products owned by the caller.
     */
    function getUserProducts(
        address _owner
    ) public view returns (Product[] memory) {
        uint256 count = 0;

        // First, count how many products are owned by _owner
        // i starts from 1 because productId starts from 1
        for (uint256 i = 0; i < productCounter + 1; i++) {
            if (products[i].owner == _owner) {
                count++;
            }
        }

        // Create an array to hold the caller's products
        Product[] memory myProducts = new Product[](count);
        uint256 index = 0;

        // Populate the array with products owned by _owner
        // i starts from 1 because productId starts from 1
        for (uint256 i = 0; i < productCounter + 1; i++) {
            if (products[i].owner == _owner) {
                myProducts[index] = products[i];
                index++;
            }
        }

        return myProducts;
    }

    /**
     * @notice Retrieves all products.
     * @dev This function retrieves all of products.
     * @param _brandIdFilter The identifiers of the brand to use for product filter.
     * @param _nameFilter The name filter.
     * @return A list of products with the specified ids.
     */
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
}
