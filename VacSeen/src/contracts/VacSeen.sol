// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0;

contract VacSeen {

    // ---GOVERNMENT CONTROL---
    // Government
    address government;
    
    // Set the contract creator as government
    constructor() public {
        government = msg.sender;
    }
    
    // Returrn the government's public addrerss
    function getGovernment() public view returns (address) {
        return government;
    }
    
    // Get status of citizen - only government can access this data
    function getCitizenStatus(uint index) public view onlyGovernment returns (string memory, string memory, bool) {
        return (Citizens[index].name, Citizens[index].vaccine, Citizens[index].vaccinated);
    }
    
    // Grant hospital permission to vaccinate
    function validateHospital(uint hospitalId) public onlyGovernment {
        Hospital storage hospital = HospitalsID[hospitalId]; // Fetch associated hospital
        hospital.isValidated = true; // Validate hospital
    }
    
    // Custom modifier to enable only the government to access certain data
    modifier onlyGovernment() {
        require(msg.sender == government);
        _;
    }
    // ---END GOVERNMENT CONTROL---
    
    
    
    // ---VARIABLES---
    // Variables to keep track of instance counts
    uint public manufacturerCount;
    uint public citizenCount;
    uint public hospitalCount;
    uint public appointmentCount;
    
    // Mappings to keep track of structs
    mapping(address => Manufacturer) public Manufacturers; // Mapping that holds records of all manufacturers
    mapping(uint => Manufacturer) public ManufacturersID; // Mapping that holds records of all manufacturers by id
    mapping(address => Hospital) public Hospitals; // Mapping that holds records of all hospitals
    mapping(uint => Hospital) public HospitalsID; // Mapping that holds records of all hospitals by id
    mapping(address => Citizen) public CitizensAddress; // Mapping that holds records of all citizens by address
    mapping(uint => Citizen) public Citizens; // Mapping that holds records of all citizens 
    mapping(uint => Appointment) public Appointments; // Mapping that holds records of all appointments 

    // Structs for Hospital, Manufacturers, Citizens and Appointments
    struct Hospital {
        uint id;
        string name;
        address payable owner;
        bool isValidated;
        string vaccine;
        uint stock;
        uint nabhID;
        uint doseCost;
    }
    
    struct Manufacturer {
        uint id;
        string name;
        address payable owner;
        string vaccine;
        uint capacity;
        uint gstNo;
        uint doseCost;
        bool isCreated;
    }
    
    struct Citizen {
        uint id;
        string name;
        address publicAddress;
        string vaccine;
        bool vaccinated;
        uint doses;
        bool isCreated;
    }
    
    struct Appointment {
        uint id;
        string date;
        address citizen;
        uint citizenId;
        address payable hospital;
        uint hospitalId;
        string vaccine;
        uint doseCount;
        bool vaccinated;
    }
    // ---END VARIABLES---
    
    
    
    // ---CITIZEN METHODS---
    // Citizen register themselves for vaccination
    function registerCitizen(string memory name) public {
        Citizen memory citizen = Citizen(citizenCount, name, msg.sender, "Not Vaccinated", false, 0, true); // Create new citizen 
        Citizens[citizenCount] = citizen; // Pass instance to mapping
        CitizensAddress[msg.sender] = citizen; // Pass instance to mapping
        citizenCount++; // Increment identifier for subsequent creation
    }
    
    // Citizens book vaccination slot
    function bookAppointment(string memory date, uint hospitalID, address payable hospitalAddress, string memory vaccine) public payable {
        require(CitizensAddress[msg.sender].vaccinated == false, "You are already vaccinated!");
        require(HospitalsID[Hospitals[hospitalAddress].id].stock >= 1, "Not enough stock");
        Appointment memory appointment = Appointment(appointmentCount, date, msg.sender, CitizensAddress[msg.sender].id, hospitalAddress, 
        hospitalID, vaccine, CitizensAddress[msg.sender].doses+1, false); // Create new appointment
        Appointments[appointmentCount] = appointment; // Pass instance to mapping
        appointmentCount++; // Increment identifier for subsequent creation
        
        hospitalAddress.transfer(msg.value); // Pay for vaccine
    }
    // ---END CITIZEN METHODS---
    
    
    
    // ---HOSPITAL METHODS---
    // Register hospital
    function registerHospital(string memory name, string memory vaccine, uint nabhID, uint doseCost) public {
        Hospital memory hospital = Hospital(hospitalCount, name, msg.sender, false, vaccine, 0, nabhID, doseCost); // Create new instance variable 
        Hospitals[msg.sender] = hospital; // Pass instance to mapping 
        HospitalsID[hospitalCount] = hospital; // Pass instance to mapping 
        hospitalCount++; // Increment identifier for subsequent creation
    }
    
    // Citizen vaccinated at hospital - only hospitals can do this
    function vaccinateCitizen(uint appointmentId, uint citizenID) public {
        Hospital storage hospital = Hospitals[msg.sender]; // Fetch associated hospital
        
        require(msg.sender == hospital.owner, "You are not authorised"); // Only authorised hospitals can vaccinate people
        require(HospitalsID[hospital.id].isValidated == true , "Hospital not authorised by government"); // Only authorised hospitals can vaccinate people
        
        Citizen storage citizen = Citizens[citizenID]; // Fetch associated citizen
        citizen.vaccine = hospital.vaccine; // Set vaccine
        citizen.doses = citizen.doses + 1; // Increment doses
        CitizensAddress[citizen.publicAddress].doses = citizen.doses; // Increment doses
        
        // Mark citizen as vaccinated if this is second dose
        if(citizen.doses == 2){
            CitizensAddress[citizen.publicAddress].vaccinated = true;
            citizen.vaccinated = true;
        }
        
        hospital.stock = hospital.stock - 1; // Reduce vaccine from stock

        Hospital storage hospitalid = HospitalsID[Hospitals[msg.sender].id];
        hospitalid.stock = hospitalid.stock - 1;
        
        Appointments[appointmentId].vaccinated = true; // Set appointment as completed
    }
    
    // Place vaccine order
    function placeVaccineOrder(address payable manufacturerAddress, uint quantity) payable public {
        Manufacturer memory manufacturer = ManufacturersID[Manufacturers[manufacturerAddress].id];
        require(quantity <= manufacturer.capacity, "Not enough quantity available");
        manufacturer.capacity = manufacturer.capacity - quantity;

        Manufacturer memory manufacturerAdd = Manufacturers[manufacturerAddress];
        manufacturerAdd.capacity = manufacturerAdd.capacity - quantity;

        Hospital storage hospital = HospitalsID[Hospitals[msg.sender].id];
        hospital.stock = hospital.stock + quantity;
        
        manufacturerAddress.transfer(msg.value); // Pay the manufacturer
    }
    // ---END HOSPITAL METHODS---
    
    
    
    /// ---MANUFACTURER METHODS---
    // Register hospital
    function registerManufacturer(string memory name, string memory vaccine, uint gstNo, uint doseCost) public {
        Manufacturer memory manufacturer = Manufacturer(manufacturerCount, name, msg.sender, vaccine, 0, gstNo, doseCost, true); // Create new instance variable 
        Manufacturers[msg.sender] = manufacturer; // Pass instance to mapping 
        ManufacturersID[manufacturerCount] = manufacturer; // Pass instance to mapping 
        manufacturerCount++; // Increment identifier for subsequent creation
    }
    
    function addSupply(uint supply) public {
        Manufacturer storage manufacturer = ManufacturersID[Manufacturers[msg.sender].id];
        manufacturer.capacity = manufacturer.capacity + supply;
    }
    /// ---END MANUFACTURER METHODS---

}