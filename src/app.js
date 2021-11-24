App = {
    contracts: {},
    classes: [],

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
        console.log(App.classes)
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
    }
}

$(() => {
    $(window).load(() => {
        App.load();
    })
})