namespace sensor {
    //% block
    export function sendBuffer(buffer: Buffer) {
        // Send the buffer over radio
        radio.sendBuffer(buffer);
    }

    //% block
    export function receiveABuffer(handler: (message: Buffer) => void): void {
        radio.onReceivedBuffer(handler);
    }

    //% block
    export function stringToBuffer(str: string): Buffer {
        return Buffer.fromUTF8(str);
    }

    //% block
    export function send_light(light: number): void {
        let byteMessage: Buffer = Buffer.fromUTF8("light")
        byteMessage = Buffer.concat([byteMessage, Buffer.fromUTF8(light.toString())])
        radio.sendBuffer(byteMessage)
    }

    //% block
    export function send_temp(temp: number): void {
        let byteMessage: Buffer = Buffer.fromUTF8("temp ")
        byteMessage = Buffer.concat([byteMessage, Buffer.fromUTF8(temp.toString())])
        radio.sendBuffer(byteMessage)
    }

    //% block
    export function send_data(temp: number, light: number): void {
        send_temp(temp)
        send_light(light)
    }

    //% block
    export function concatenateBuffers(buf1: Buffer, buf2: Buffer): Buffer {
        return Buffer.concat([buf1, buf2]);
    }

    //% block
    export function compareBuffers(buf1: Buffer, buf2: Buffer): boolean {
        if (buf1.length != buf2.length) {
            return false;
        }

        for (let i = 0; i < buf1.length; i++) {
            if (buf1.getUint8(i) != buf2.getUint8(i)) {
                return false;
            }
        }
        return true;
    }

    //% block
    export function none(): null {
        return null
    }
}