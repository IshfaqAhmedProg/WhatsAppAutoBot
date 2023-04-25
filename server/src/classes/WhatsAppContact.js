exports.WhatsAppContact = class {
    constructor(contactId = "",
        contactChatId = "",
        contactName = "",
        contactPushName = "",
        contactNumber = "",
        contactVerifiedName = "",
        contactVerifiedLevel = "",
        contactIsWAContact = false,
        contactLabels = "",
        contactType = "",
        contactProfilePicUrl = "") {
        this.contactId = contactId || "";
        this.contactChatId = contactChatId;
        this.contactName = contactName;
        this.contactPushName = contactPushName;
        this.contactNumber = contactNumber;
        this.contactVerifiedName = contactVerifiedName;
        this.contactVerifiedLevel = contactVerifiedLevel;
        this.contactIsWAContact = contactIsWAContact;
        this.contactLabels = contactLabels;
        this.contactType = contactType;
        this.contactProfilePicUrl = contactProfilePicUrl;
    }
}