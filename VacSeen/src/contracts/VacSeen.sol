// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0;

contract VacSeen {

    string name;

    constructor() public {
        name = "BlockStore";
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string calldata newName) external {
        name = newName;
    }

}