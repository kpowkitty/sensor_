namespace sensor {
    //% block
    export function send_temp(): void {
        let byteMessage: Buffer = Buffer.fromUTF8("temp ")
        byteMessage = Buffer.concat([byteMessage, Buffer.fromUTF8(myTemp.toString())])
        radio.sendBuffer(byteMessage)
    }
}