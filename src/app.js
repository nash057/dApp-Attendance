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
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      App.account = account;
      console.log(App.account);
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
      $('#account').html(App.account)
    },
  
    /*renderTasks: async () => {
      // Load the total task count from the blockchain
      const taskCount = await App.todoList.taskCount()
      const $taskTemplate = $('.taskTemplate')
  
      // Render out each task with a new task template
      for (var i = 1; i <= taskCount; i++) {
        // Fetch the task data from the blockchain
        const task = await App.todoList.tasks(i)
        const taskId = task[0].toNumber()
        const taskContent = task[1]
        const taskCompleted = task[2]
  
        // Create the html for the task
        const $newTaskTemplate = $taskTemplate.clone()
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        .on('click', App.toggleCompleted)
  
        // Put the task in the correct list
        if (taskCompleted) {
          $('#completedTaskList').append($newTaskTemplate)
        } else {
          $('#taskList').append($newTaskTemplate)
        }
  
        // Show the task
        $newTaskTemplate.show()
      }
    },
  
    createTask: async () => {
      App.setLoading(true)
      const content = $('#newTask').val()
      await App.todoList.createTask(content)
      window.location.reload()
    },
  
    toggleCompleted: async (e) => {
      App.setLoading(true)
      const taskId = e.target.name
      await App.todoList.toggleCompleted(taskId)
      window.location.reload()
    },*/
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })