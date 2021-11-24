pragma solidity ^0.5.0;

contract Classbook {
    uint public classCount = 0;
    uint public attendanceCount = 0;

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

    struct Attendance {
        uint id;
        uint classId;
        uint256 date;
        bool student1Attendance;
        bool student2Attendance;
        bool student3Attendance;
        bool student4Attendance;
        bool student5Attendance;
    }

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

    event AttendanceCreated(
        uint id,
        uint classId,
        uint256 date,
        bool student1Attendance,
        bool student2Attendance,
        bool student3Attendance,
        bool student4Attendance,
        bool student5Attendance
    );

    mapping(uint => Class) public classes;
    mapping(uint => Attendance) public attendance;

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

    function createAttendance(
        uint _classId,
        uint256 _date,
        bool _student1Attendance,
        bool _student2Attendance,
        bool _student3Attendance,
        bool _student4Attendance,
        bool _student5Attendance) public {
        attendanceCount ++;
        attendance[attendanceCount] = Attendance(attendanceCount, _classId, _date,
            _student1Attendance, _student2Attendance, _student3Attendance,
            _student4Attendance, _student5Attendance);
        emit AttendanceCreated(attendanceCount, _classId, _date,
            _student1Attendance, _student2Attendance, _student3Attendance,
            _student4Attendance, _student5Attendance);
    }
}
