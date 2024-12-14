radio.onReceivedBuffer(function (buff) {
    message = buff
})
let full = false
let currentLightLevel = 0
let currentTempLevel = 0
let message: Buffer = null
let startReceived = false
radio.setGroup(23)
radio.setTransmitPower(7)
let _empty = sensor.stringToBuffer("empty")
let _full = sensor.stringToBuffer("full")
let _ack = sensor.stringToBuffer("ack")
let _start = sensor.stringToBuffer("start")
let ready = sensor.stringToBuffer("ready")
let awaitingAcknowledgement = true
let sendingData = true
while (true) {
    if (!(startReceived)) {
        basic.showString("W")
        if (message != sensor.none() && sensor.compareBuffers(message, _start)) {
            startReceived = true
        } else {
            continue;
        }
    }
    basic.showString("SR")
    currentTempLevel = input.temperature()
    currentTempLevel = currentTempLevel * 1.8 + 32
    currentLightLevel = input.lightLevel()
    if (currentTempLevel != sensor.none() && currentLightLevel != sensor.none()) {
        sensor.sendBuffer(ready)
        basic.showString("R")
    }
    while (awaitingAcknowledgement) {
        basic.showString("WA")
        if (message != sensor.none() && sensor.compareBuffers(message, _ack)) {
            basic.showString("A")
            awaitingAcknowledgement = false
        }
        if (message != sensor.none() && sensor.compareBuffers(message, _full)) {
            basic.showString("F")
            full = true
            awaitingAcknowledgement = false
        }
    }
    while (sendingData) {
        basic.showString("WTS")
        if (message != sensor.none() && message == _ack) {
            sensor.sendData(currentTempLevel, currentLightLevel)
            basic.showString("SD")
            sendingData = false
            awaitingAcknowledgement = true
            control.waitMicros(10000000)
        } else if (message != sensor.none() && sensor.compareBuffers(message, _full)) {
            while (full) {
                basic.showString("F")
                if (message != sensor.none() && sensor.compareBuffers(message, _empty)) {
                    startReceived = false
                    full = false
                    sendingData = false
                }
            }
        }
    }
}