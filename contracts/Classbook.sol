pragma solidity ^0.5.0;


contract Classbook {
  uint classCount = 0;

  struct Class {
    uint id;
    string name;
    string teacher;
  }

  /* struct Student {
    uint id;
    string name;
    bool isPresent;
  } */

  event ClassCreated(
    uint id,
    string name,
    string teacher
  );

  mapping(uint => Class) public classes;

  function createClass(string memory _name, string memory _teacher) public {
    classCount ++;
    classes[classCount] = Class(classCount, _name, _teacher);
    emit ClassCreated(classCount, _name, _teacher);
  }
}
