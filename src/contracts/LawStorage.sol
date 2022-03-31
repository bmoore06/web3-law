// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.21 <0.6.0;

contract LawStorage {
    // string lawHash;

    // event LawUpdated(string indexed _lawHash);

    // // store function
    // function store(string memory _lawHash) public {
    //     lawHash = _lawHash;
    //     emit LawUpdated(_lawHash);
    // }

    // // retrieve function
    // function retrieve() public view returns (string memory) {
    //     return (lawHash);
    // }

    string clause;
    string lawHash;

    event LawUpdated(string indexed _clause, string indexed _lawHash);

    // store function
    function store(string memory _clause, string memory _lawHash) public {
        clause = _clause;
        lawHash = _lawHash;
        emit LawUpdated(_clause, _lawHash);
    }

    // retrieve function
    function retrieve() public view returns (string memory, string memory) {
        return (clause, lawHash);
    }
}
