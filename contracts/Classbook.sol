pragma solidity ^0.5.0;

contract Classbook {
    uint public classCount = 0;

    struct Class {
        uint id;
        string name;
        string teacher;
        string student1;
        string student2;
        string student3;
        string student4;
        string student5;
    }

    /* struct Student {
      uint id;
      string name;
      bool isPresent;
    } */

    event ClassCreated(
        uint id,
        string name,
        string teacher,
        string student1,
        string student2,
        string student3,
        string student4,
        string student5
    );

    mapping(uint => Class) public classes;

    function createClass(
        string memory _name,
        string memory _teacher,
        string memory _student1,
        string memory _student2,
        string memory _student3,
        string memory _student4,
        string memory _student5) public {
        classCount ++;
        classes[classCount] = Class(classCount, _name, _teacher, _student1, _student2, _student3, _student4, _student5);
        emit ClassCreated(classCount, _name, _teacher, _student1, _student2, _student3, _student4, _student5);
    }
}
