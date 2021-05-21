// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0;

contract VacSeen {

    // Government
    address government;
    
    // Set the contract creator as government
    constructor() {
        government = msg.sender;
    }
    
    // Returrn the government's public addrerss
    function getGovernment() public view returns (address) {
        return government;
    }
    
    // Custom modifier to enable only the government to access certain data
    modifier onlyGovernment() {
        require(msg.sender == government);
        _;
    }
    
    
    
    // Variables to keep track of instance counts
    uint citizenCount;
    
    
    // Mappings to keep track of structs
    mapping(uint => Vaccine) public Vaccines; // Mapping that holds records of all vaccines
    mapping(uint => Hospital) public Hospitals; // Mapping that holds records of all hospitals
    mapping(uint => Citizen) Citizens; // Mapping that holds records of all citizens

    
    // Structs for Vaccine, Hospital, Manufacturers and Citizens
    struct Vaccine {
        string name;
        address manufacturer;
        bool isCreated;
        uint totalSupply;
    }
    
    struct Hospital {
        string name;
        address owner;
        bool isCreated;
        string vaccine;
        uint capacity;
    }
    
    struct Manufacturer {
        string name;
        address owner;
        bool isCreated;
        string vaccine;
        uint capacity;
    }
    
    struct Citizen {
        uint id;
        string name;
        address publicAddress;
        string vaccine;
        bool vaccinated;
        bool isCreated;
    }
    
    
    // Citizen register themselves for vaccination
    function registerCitizen(string memory name) public {
        Citizen storage citizen = Citizens[citizenCount]; // New citizen object
        citizen.id = citizenCount; // Set identifier
        citizen.name = name; // Set name
        citizen.publicAddress = msg.sender; // Set address
        citizen.vaccine = "Not Vaccinated"; // Set vaccine name
        citizen.vaccinated = false; // Set vaccinated status as false
        citizen.isCreated = false; // Validate registration
        citizenCount++; // Increment identifier for subsequent creation
    }
    
    // Citizen vaccinated at hospital
    function getVaccinated() public {
        
    }
    
    // Get status of citizen - only government can access this data
    function getCitizenStatus(uint index) public view onlyGovernment returns (string memory, string memory, bool) {
        return (Citizens[index].name, Citizens[index].vaccine, Citizens[index].vaccinated);
    }

}