App = {
    contracts: {},
    classes: [],
    attendance: [],

    load: async () => {
        await App.loadMetaMask();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    loadMetaMask: async () => {
        if (typeof window.ethereum !== 'undefined') {
            console.log("MetaMask is installed!");
        } else {
            window.alert("Please connect to Metamask.");
        }
    },

    loadAccount: async () => {
        const accounts = await ethereum.request({method: 'eth_requestAccounts'});
        App.account = accounts[0];
    },

    loadContract: async () => {
        const classbook = await $.getJSON('Classbook.json');
        App.contracts.Classbook = TruffleContract(classbook);
        App.contracts.Classbook.setProvider(window.ethereum);

        App.classbook = await App.contracts.Classbook.deployed();
    },

    render: async () => {
        await App.renderAccount();
        await App.renderClasses();
        await App.renderAttendance();
        await App.renderAttendanceView('new');
    },

    renderAccount: async () => {
        $('#accountText').html('Account:');
        $('#account').html(App.account);
    },

    renderClasses: async () => {
        const classCount = await App.classbook.classCount();

        for (let i = 1; i <= classCount.toNumber(); i++) {
            const schoolClass = await App.classbook.classes(i);
            const schoolClassId = schoolClass[0].toNumber();
            const schoolClassName = schoolClass[1];
            const schoolClassTeacher = schoolClass[2];
            const schoolClassStudent1 = schoolClass[3];
            const schoolClassStudent2 = schoolClass[4];
            const schoolClassStudent3 = schoolClass[5];
            const schoolClassStudent4 = schoolClass[6];
            const schoolClassStudent5 = schoolClass[7];

            App.classes.push({
                classId: schoolClassId,
                className: schoolClassName,
                classTeacher: schoolClassTeacher,
                studentName1: schoolClassStudent1,
                studentName2: schoolClassStudent2,
                studentName3: schoolClassStudent3,
                studentName4: schoolClassStudent4,
                studentName5: schoolClassStudent5,
            });
            $('#classes').append(new Option(schoolClassName, schoolClassId));
        }
        $('#classNameLabel').html(App.classes[0].className);
        $('#classTeacherLabel').html(App.classes[0].classTeacher);

        $('#student1Label').html(App.classes[0].studentName1);
        $('#student2Label').html(App.classes[0].studentName2);
        $('#student3Label').html(App.classes[0].studentName3);
        $('#student4Label').html(App.classes[0].studentName4);
        $('#student5Label').html(App.classes[0].studentName5);
    },

    classSelectionChange: async (value) => {
        value--;
        $('#classNameLabel').html(App.classes[value].className);
        $('#classTeacherLabel').html(App.classes[value].classTeacher);

        $('#student1Label').html(App.classes[value].studentName1);
        $('#student2Label').html(App.classes[value].studentName2);
        $('#student3Label').html(App.classes[value].studentName3);
        $('#student4Label').html(App.classes[value].studentName4);
        $('#student5Label').html(App.classes[value].studentName5);

        await App.renderAttendanceView('new');
        await App.setAttendanceCombobox();
    },

    addClass: async () => {
        const newClass = $('.generateClassForm').serializeArray();
        const className = newClass[0].value;
        const teacherName = newClass[1].value;
        const student1Name = newClass[2].value;
        const student2Name = newClass[3].value;
        const student3Name = newClass[4].value;
        const student4Name = newClass[5].value;
        const student5Name = newClass[6].value;

        if (className && teacherName) {
            await App.classbook.createClass(className, teacherName,
                student1Name, student2Name, student3Name, student4Name, student5Name, {from: App.account});

            this.location.reload();
        }
    },

    renderAttendance: async () => {
        const attendanceCount = await App.classbook.attendanceCount();

        for (let i = 1; i <= attendanceCount.toNumber(); i++) {
            const attendance = await App.classbook.attendance(i);
            const attendanceId = attendance[0].toNumber();
            const classId = attendance[1].toNumber();
            let date = attendance[2].toNumber();
            const student1Attendance = attendance[3];
            const student2Attendance = attendance[4];
            const student3Attendance = attendance[5];
            const student4Attendance = attendance[6];
            const student5Attendance = attendance[7];

            date = new Date(date * 1000);

            App.attendance.push({
                attendanceId: attendanceId,
                classId: classId,
                date: date,
                student1Attendance: student1Attendance,
                student2Attendance: student2Attendance,
                student3Attendance: student3Attendance,
                student4Attendance: student4Attendance,
                student5Attendance: student5Attendance
            });
        }

        await App.setAttendanceCombobox();
    },

    setAttendanceCombobox: async () => {
        let selectedClassId = $('#classes').val();
        selectedClassId = parseInt(selectedClassId);
        if (isNaN(selectedClassId)) {
            return null;
        }
        $("#attendance option").remove();
        $('#attendance').append(new Option('neue Anwensenheit', 'new'));
        App.attendance.forEach(element => {
            if (element.classId === selectedClassId) {
                $('#attendance').append(new Option(element.date.toLocaleDateString(), element.attendanceId));
            }
        })
    },

    renderAttendanceView: async (value) => {
        if (value !== 'new') {
            $('.attendanceForm :input').prop("disabled", true);
            value = parseInt(value);
            if (isNaN(value)) {
                return null;
            }
            value --;
            const now = App.attendance[value].date;
            const day = ("0" + now.getDate()).slice(-2);
            const month = ("0" + (now.getMonth() + 1)).slice(-2);
            const today = now.getFullYear()+"-"+(month)+"-"+(day);
            $('#dateInput').val(today);
            $('#student1TableCheckbox').prop('checked', App.attendance[value].student1Attendance);
            $('#student2TableCheckbox').prop('checked', App.attendance[value].student2Attendance);
            $('#student3TableCheckbox').prop('checked', App.attendance[value].student3Attendance);
            $('#student4TableCheckbox').prop('checked', App.attendance[value].student4Attendance);
            $('#student5TableCheckbox').prop('checked', App.attendance[value].student5Attendance);
        }
        else {
            $('.attendanceForm :input').prop("disabled", false);
            $('.attendanceForm').trigger("reset");
        }
    },

    addAttendance: async () => {
        const classId = $('#classes').val();
        let date = new Date($('#dateInput').val());
        const student1 = $('#student1TableCheckbox').is(":checked");
        const student2 = $('#student2TableCheckbox').is(":checked");
        const student3 = $('#student3TableCheckbox').is(":checked");
        const student4 = $('#student4TableCheckbox').is(":checked");
        const student5 = $('#student5TableCheckbox').is(":checked");
        if (!isNaN(date.getTime())) {
            date = date.getTime() / 1000;

            await App.classbook.createAttendance(classId, date,
                student1, student2, student3, student4, student5, {from: App.account});

            this.location.reload();
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load();
    })
})
