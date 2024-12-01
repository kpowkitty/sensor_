radio.onReceivedString(function (receivedString) {
    message = sensor.stringToBuffer(receivedString)
})
let full = false
let light2 = 0
let temp = 0
let start_received = false
let message: Buffer = null
radio.setGroup(23)
radio.setTransmitPower(7)
let ready = sensor.stringToBuffer("ready")
message = sensor.none()
let _ack = sensor.stringToBuffer("ack")
let _full = sensor.stringToBuffer("full")
let _empty = sensor.stringToBuffer("empty")
let _start = sensor.stringToBuffer("start")
while (true) {
    if (!(start_received)) {
        if (message && sensor.compareBuffers(message, _start)) {
            start_received = true
        }
    } else {
        continue;
    }
    sensor.check_temp()
    sensor.check_light()
    temp = input.temperature()
    light2 = input.lightLevel()
    if (("temp" as any) != ("none" as any) && ("light" as any) != ("none" as any)) {
        sensor.sendBuffer(ready)
        basic.showString("R")
    }
    control.waitMicros(1000000)
    while (true) {
        if (message && sensor.compareBuffers(message, _ack)) {
            basic.showString("M")
            break;
        }
        if (message && sensor.compareBuffers(message, _full)) {
            full = true
            break;
        }
    }
    if (message && sensor.compareBuffers(message, _ack)) {
        radio.sendValue("temp", temp)
        radio.sendValue("light", light2)
        basic.showString("S")
        control.waitMicros(10000000)
    } else if (message && sensor.compareBuffers(message, _full)) {
        while (full) {
            basic.showString("F")
            if (message && sensor.compareBuffers(message, _empty)) {
                full = false
            }
        }
    }
}
