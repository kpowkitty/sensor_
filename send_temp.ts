namespace sensor {
    //% block
    export function send_light(): void {
        let byteMessage: Buffer = Buffer.fromUTF8("light")
        byteMessage = Buffer.concat([byteMessage, Buffer.fromUTF8(myLight.toString())])
        radio.sendBuffer(byteMessage)
    }
}