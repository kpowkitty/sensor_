namespace sensor {
    //% block
    export function sendBuffer(buffer: Buffer) {
        // Send the buffer over radio
        radio.sendBuffer(buffer);
    }
}