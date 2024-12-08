radio.onReceivedString(function (receivedString) {
    basic.showString(receivedString)
    message = sensor.stringToBuffer(receivedString)
})
let full = false
let currentLightLevel = 0
let currentTempLevel = 0
let message: Buffer = null
let startReceived: boolean = false
radio.setGroup(23)
radio.setTransmitPower(7)
let _empty = sensor.stringToBuffer("empty")
let _full = sensor.stringToBuffer("full")
let _ack = sensor.stringToBuffer("ack")
let _start = sensor.stringToBuffer("start")
let ready = sensor.stringToBuffer("ready")
while (true) {
    if (!(startReceived)) {
        basic.showString("W")
        if (message != sensor.none() && sensor.compareBuffers(message, _start)) {
            start_received = true
        } else {
            continue;
        }
    }
    basic.showString("SR")
    currentTempLevel = input.temperature()
    currentTempLevel = currentTempLevel * 1.8 + 32
    currentLightLevel = input.lightLevel()
    if (currentTempLevel != sensor.none() && currentLightLevel != sensor.none()) {
        radio.sendBuffer(ready)
        basic.showString("R")
    }
    control.waitMicros(1000000)
    while (true) {
        if (message && sensor.compareBuffers(message, _ack)) {
            basic.showString("A")
            break;
        }
        if (message && sensor.compareBuffers(message, _full)) {
            full = true
            break;
        }
    }
    if (message && message == _ack) {
        sensor.sendData(currentTempLevel, currentLightLevel)
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
