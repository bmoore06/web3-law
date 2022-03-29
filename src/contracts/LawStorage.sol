pragma solidity >=0.4.21 <0.6.0;

contract LawStorage {
    // address public owner;
    string lawHash;

    // store function
    function store(string memory _lawHash) public {
        lawHash = _lawHash;
    }

    // retrieve function
    function retrieve() public view returns (string memory) {
        return lawHash;
    }
}
