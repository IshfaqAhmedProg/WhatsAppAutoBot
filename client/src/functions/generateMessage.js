export function generateMessage(data, name = null) {
    const greeting = data.greetings[Math.floor(Math.random() * data.greetings.length)];
    const farewell = data.farewells[Math.floor(Math.random() * data.farewells.length)];
    const body = data.bodies[Math.floor(Math.random() * data.bodies.length)];

    let message = `${greeting}`;
    if (name && data.addName) {
        message += `, ${name}`;
    }
    message += `\n\n${body.message.replace('[CONTACTNAME]', name || '')}\n\n${farewell}`;

    return message;
}