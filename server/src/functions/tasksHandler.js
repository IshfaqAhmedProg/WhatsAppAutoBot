const { WhatsAppContact } = require("../classes/WhatsAppContact")

exports.getTasks = function (socket, db, clientData) {
    socket.on('get_tasks', async (data) => {
        try {
            const allTasks = await db.getData(`/clientsData/${clientData.id}/tasks`)
            socket.emit('all_tasks', allTasks)
        } catch (error) {
            console.log('Error while getting tasks', error)
        }
    })
}
exports.createTask = function (socket, db, clientData) {
    socket.on('create_task', async (task) => {
        var dateOptions = {};
        dateOptions.year = dateOptions.month = dateOptions.day = dateOptions.hour = dateOptions.minute = dateOptions.second = 'numeric'
        await db.push(`/clientsData/${clientData.id}/tasks/${task.id}`, {
            createdAt: new Date().toLocaleString('sv-SE', dateOptions),
            length: task.data.length
        }, true)
        await db.push(`/clientsData/${clientData.id}/tasksData/${task.id}`, task.data, true)
    })
}
exports.getTaskData = function (socket, db, clientData) {
    socket.on('get_task_data', async (taskId) => {
        try {
            const taskData = await db.getData(`/clientsData/${clientData.id}/tasksData/${taskId}`)
            socket.emit('task_data', taskData);
        } catch (error) {
            console.log(error)
        }
    })
}
exports.getTaskResults = function (socket, db, clientData) {
    socket.on('get_task_results', async (taskId) => {
        const taskData = await db.getData(`/clientsData/${clientData.id}/tasksData/${taskId}`)
        const dbContactData = await db.getData(`/clientsData/${clientData.id}/contacts/contactsInDevice`)//get data from db
        const match = []
        const noMatch = []
        taskData.filter(taskelement => dbContactData.some((contact) =>
            taskelement.number === contact.contactNumber && match.push({
                ...contact,
                queryName: taskelement.name || "",
                queryNumber: taskelement.number || "",
            })));
        // console.log(match)
        taskData.filter(o1 => !match.some(o2 => o1.number === o2.queryNumber) && noMatch.push({
            ...new WhatsAppContact(),
            queryName: o1.name || "",
            queryNumber: o1.number || "",
        }))

        const result = [...match, ...noMatch]
        console.log("getting task results for ", taskId)
        console.log("resultSize", result.length)
        result.length < 10 && console.log("result", result)
        socket.emit('task_results', result);
    })
}
exports.deleteTask = function (socket, db, clientData) {
    socket.on('delete_task', async (taskId) => {
        console.log('deleted task:', taskId)
        await db.delete(`/clientsData/${clientData.id}/tasks/${taskId}`)
        await db.delete(`/clientsData/${clientData.id}/tasksData/${taskId}`)
    })
}