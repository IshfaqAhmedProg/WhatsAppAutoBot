const { WhatsAppContact } = require("../classes/WhatsAppContact")
const fs = require('fs')
const { joinData } = require("../utils/joinData")
const { listDir } = require("../utils/listDir")
const { formattedDate } = require("../utils/formattedDate")
exports.getTasks = function (socket, db, activeClientData) {
    socket.on('get_tasks', async (data) => {
        try {
            const allTasks = await db.getData(`/clientsData/${activeClientData.id}/tasks`)
            socket.emit('all_tasks', allTasks)
        } catch (error) {
            console.log('Error while getting tasks', error)
        }
    })
}
exports.createTask = function (socket, db, activeClientData) {
    socket.on('create_task', async (task, callback) => {
        //upload if file exists in task
        try {
            if (task.file) {
                const dir = `./filePool/tasks/${activeClientData.id}/`
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFile(`${dir}/${task.id}.json`, JSON.stringify(task.file), (err) => {
                    callback({ fileUploaded: err ? "error" : "success" });
                });
            }

            await db.push(`/clientsData/${activeClientData.id}/tasks/${task.id}`, {
                createdAt: formattedDate(),
                length: task.data.length
            }, true)
            await db.push(`/clientsData/${activeClientData.id}/tasksData/${task.id}`, task.data, true)
            socket.emit('task_created')
        } catch (error) {
        }
    })
}
exports.getTaskData = function (socket, db, activeClientData) {
    socket.on('get_task_data', async (taskId) => {
        try {
            const taskData = await db.getData(`/clientsData/${activeClientData.id}/tasksData/${taskId}`)
            socket.emit('task_data', taskData);
        } catch (error) {
            console.log(error)
        }
    })
}
exports.getTaskResults = function (socket, db, activeClientData) {
    socket.on('get_task_results', async (taskId) => {
        const taskData = await db.getData(`/clientsData/${activeClientData.id}/tasksData/${taskId}`)
        const dbContactData = await db.getData(`/clientsData/${activeClientData.id}/contacts/contactsInDevice`)//get data from db
        const dir = `./filePool/tasks/${activeClientData.id}/`
        const tasksInFilePool = await listDir(dir)
        const match = []
        const noMatch = []
        taskData.filter(taskelement => dbContactData.some((contact) =>
            taskelement.queryNumber === contact.contactNumber && match.push({
                ...contact,
                queryName: taskelement.queryName || "",
                queryNumber: taskelement.queryNumber || "",
                unformattedNumber: taskelement.unformattedNumber || "",

            })));
        taskData.filter(o1 => !match.some(o2 => o1.queryNumber === o2.queryNumber) && noMatch.push({
            ...new WhatsAppContact(),
            queryName: o1.queryName || "",
            queryNumber: o1.queryNumber || "",
            unformattedNumber: o1.unformattedNumber || "",

        }))

        var result = [...match, ...noMatch]
        // console.log('result length before join', result.length)
        // console.log('keys in result before join', Object.keys(result[0]))
        //join with input file

        if (tasksInFilePool.includes(`${taskId}.json`)) {
            console.log("joining data")
            const rawJson = fs.readFileSync(`${dir}/${taskId}.json`)
            const jsonDataInFilePool = JSON.parse(rawJson)
            result = await joinData(result, jsonDataInFilePool, 'unformattedNumber')
        }
        // console.log('keys in result after join', Object.keys(result[0]))
        console.log("Created task results for ", taskId)
        // console.log("resultSize after join", result.length)
        socket.emit('task_results', result);
    })
}

exports.deleteTask = function (socket, db, activeClientData) {
    socket.on('delete_task', async (taskId) => {
        console.log('deleted task:', taskId)
        await db.delete(`/clientsData/${activeClientData.id}/tasks/${taskId}`)
        await db.delete(`/clientsData/${activeClientData.id}/tasksData/${taskId}`)
    })
}