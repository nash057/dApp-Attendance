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

            App.classes.push({classId: schoolClassId, className: schoolClassName, classTeacher: schoolClassTeacher});
            $('#classes').append(new Option(schoolClassName, schoolClassId));
        }
        $('#classNameLabel').html(App.classes[0].className);
        $('#classTeacherLabel').html(App.classes[0].classTeacher);
    },

    classSelectionChange: async (value) => {
        value--;
        $('#classNameLabel').html(App.classes[value].className);
        $('#classTeacherLabel').html(App.classes[value].classTeacher);
    },

    addClass: async () => {
        const newClass = $('.generateClassForm').serializeArray();
        const className = newClass[0].value;
        const teacherName = newClass[1].value;
        if (className && teacherName) {
            console.log(className, teacherName);

            await App.classbook.createClass(className, teacherName, {from: App.account});

            this.location.reload();
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load();
    })
})