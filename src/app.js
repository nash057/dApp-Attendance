App = {
    contracts: {},
  
    load: async () => {
      await App.loadMetaMask()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    loadMetaMask: async () => {
      if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask is installed!");
      } else {
        window.alert("Please connect to Metamask.")
      }
    },
  
    loadAccount: async () => {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      const account = accounts[0]
      App.account = account
    },
  
    loadContract: async () => {
      const classbook = await $.getJSON('Classbook.json')
      App.contracts.Classbook = TruffleContract(classbook)
      App.contracts.Classbook.setProvider(window.ethereum)

      App.classbook = await App.contracts.Classbook.deployed()
    },

    render: async () => {
      await App.renderAccount()
    },
  
    renderAccount: async () => {
      $('#accountText').html('Account:')
      $('#account').html(App.account)
    },

    addClass: async () => {
      const newClass = $('.generateClassForm').serializeArray()
      const className = newClass[0].value
      const teacherName = newClass[1].value
      if(className && teacherName) {
        console.log(className, teacherName)

        await App.classbook.createClass(className, teacherName, { from: App.account})

        this.location.reload()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })