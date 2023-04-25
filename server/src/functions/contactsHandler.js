const { WhatsAppContact } = require("../classes/WhatsAppContact")

exports.getAllContacts = function (socket, db, wwebjsClient, activeClientData) {
    socket.on('get_all_contacts', () => {
        console.log("Syncing datapool!")
        wwebjsClient.getContacts().then(async (contacts) => {
            // const dbContactData = await db.getData(`/clients[${await db.getIndex('/clients', clientData.id)}]/contacts`)//get data from db
            // let extraContacts = dbContactData.filter(o1 => !contacts.some(o2 => o1.contactId === o2.id.user))//check if it matches data from wwebjs
            const validatedData = [];

            for (let index = 0; index < contacts.length; index++) {
                const contact = contacts[index];
                //check if contact is not a group and is not client itself and if it doesnt end with @lid and contact has a name 
                if (!contact.isGroup && !contact.isMe && !contact.id._serialized.endsWith('@lid') && contact.name) {
                    const validate = new WhatsAppContact(
                        contact.id.user,
                        contact.id._serialized,
                        contact.name,
                        contact.pushname,
                        contact.number,
                        contact.verifiedName,
                        contact.verifiedLevel,
                        contact.isWAContact,
                        contact.labels,
                        contact.type,
                        await contact.getProfilePicUrl() || ""
                    )
                    validatedData.push(validate);
                }
            }
            await db.push(`/clientsData/${activeClientData.id}/contacts/contactsInDevice`, validatedData, true)
            // socket.emit('set_all_contacts', validatedData)
        })
    })
}
exports.getContactsFragment = function (socket, db, clientData) {
    socket.on('get_contacts_fragment', async (data) => {
        // The array to be paginated
        const contactsFromDb = await db.getData(`/clientsData/${clientData.id}/contacts/contactsInDevice`); // fill with your array data
        // Calculate the total number of pages
        const totalPages = Math.ceil(contactsFromDb.length / data.itemsPerPage);

        // Calculate the start and end indexes for the specified page
        const startIndex = (data.page - 1) * data.itemsPerPage;
        const endIndex = startIndex + data.itemsPerPage;

        // Slice the array to get the items for the specified page
        const pageItems = contactsFromDb.slice(startIndex, endIndex);
        // Return the page data
        socket.emit('set_contacts_fragment',
            {
                page: data.page,
                totalPages: totalPages,
                items: pageItems,
                totalContacts: contactsFromDb.length
            }
        )
    })
}