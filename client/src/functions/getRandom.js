export default function getRandom(max, min) {
    return (
        Math.floor(Math.random() * parseFloat(max - min + 1)) +
        min
    );
}