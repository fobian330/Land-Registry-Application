// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Land {
    // Struct to store user details
    struct User {
        address userId;
        string name;
        uint256 contact;
        string email;
        uint256 postalCode;
        string city;
        bool exists;
    }

    // Struct to store land details
    struct LandDetails {
        address payable owner;
        string ipfsHash; // For storing land documents
        string location;
        uint256 price;
        uint256 id;
        string govtApprovalStatus;
        string availabilityStatus;
        address requester;
        RequestStatus requestStatus;
    }

    // Enum for request status
    enum RequestStatus { Default, Pending, Rejected, Approved }

    // State variables
    address public contractOwner;
    mapping(address => User) public users;
    mapping(uint256 => LandDetails) public lands;
    address[] public userAddresses;
    uint256[] public landIds;

    // Events
    event UserRegistered(address userId, string name);
    event LandRegistered(uint256 landId, address owner);
    event LandRequest(uint256 landId, address requester);
    event LandApproval(uint256 landId, string status);

    // Constructor
    constructor() {
        contractOwner = msg.sender;
    }

    // Function to register a user
    function registerUser(
        address _userId,
        string memory _name,
        uint256 _contact,
        string memory _email,
        uint256 _postalCode,
        string memory _city
    ) public {
        require(!users[_userId].exists, "User already exists");
        users[_userId] = User(_userId, _name, _contact, _email, _postalCode, _city, true);
        userAddresses.push(_userId);
        emit UserRegistered(_userId, _name);
    }

    // Function to register land
    function registerLand(
        string memory _ipfsHash,
        string memory _location,
        uint256 _price,
        uint256 _id
    ) public {
        require(users[msg.sender].exists, "User not registered");
        require(lands[_id].owner == address(0), "Land already registered");

        lands[_id] = LandDetails(
            payable(msg.sender),
            _ipfsHash,
            _location,
            _price,
            _id,
            "Pending",
            "Not Available",
            address(0),
            RequestStatus.Default
        );
        landIds.push(_id);
        emit LandRegistered(_id, msg.sender);
    }

    // Function to request land
    function requestLand(uint256 _landId) public {
        require(lands[_landId].owner != address(0), "Land not registered");
        require(keccak256(abi.encodePacked(lands[_landId].availabilityStatus)) == keccak256(abi.encodePacked("Available")), "Land not available");
        require(lands[_landId].requester == address(0), "Land already requested");

        lands[_landId].requester = msg.sender;
        lands[_landId].requestStatus = RequestStatus.Pending;
        lands[_landId].availabilityStatus = "Pending";
        emit LandRequest(_landId, msg.sender);
    }

    // Function for government to approve or reject land
    function approveLand(uint256 _landId, string memory _status) public {
        require(msg.sender == contractOwner, "Only government can approve");
        require(lands[_landId].owner != address(0), "Land not registered");

        lands[_landId].govtApprovalStatus = _status;
        if (keccak256(abi.encodePacked(_status)) == keccak256(abi.encodePacked("Approved"))) {
            lands[_landId].availabilityStatus = "Available";
        } else {
            lands[_landId].availabilityStatus = "Not Available";
        }
        emit LandApproval(_landId, _status);
    }

    // Function to process land requests
    function processRequest(uint256 _landId, RequestStatus _status) public {
        require(lands[_landId].owner == msg.sender, "Only land owner can process requests");
        require(lands[_landId].requestStatus == RequestStatus.Pending, "No pending request");

        lands[_landId].requestStatus = _status;
        if (_status == RequestStatus.Approved) {
            lands[_landId].availabilityStatus = "Sold";
        } else if (_status == RequestStatus.Rejected) {
            lands[_landId].requester = address(0);
            lands[_landId].requestStatus = RequestStatus.Default;
            lands[_landId].availabilityStatus = "Available";
        }
    }

    // Function to buy land
    function buyLand(uint256 _landId) public payable {
        require(lands[_landId].requestStatus == RequestStatus.Approved, "Request not approved");
        require(msg.value == lands[_landId].price, "Incorrect payment amount");

        address payable previousOwner = lands[_landId].owner;
        previousOwner.transfer(msg.value);

        lands[_landId].owner = payable(msg.sender);
        lands[_landId].govtApprovalStatus = "Not Approved";
        lands[_landId].availabilityStatus = "Not Available";
        lands[_landId].requester = address(0);
        lands[_landId].requestStatus = RequestStatus.Default;
    }

    // Function to get all registered land IDs
    function getAllLandIds() public view returns (uint256[] memory) {
        return landIds;
    }

    // Function to get all registered user addresses
    function getAllUserAddresses() public view returns (address[] memory) {
        return userAddresses;
    }
}