radio.onReceivedBuffer(function (receivedBuffer) {
    message = receivedBuffer
})
let full = false
let startReceived = false
let awaitingAcknowledgement = false
let sendingData = false
let message: Buffer = null
radio.setGroup(23)
radio.setTransmitPower(7)
let _ready = sensor.stringToBuffer("ready")
let _start = sensor.stringToBuffer("start")
let _ack = sensor.stringToBuffer("ack")
let _full = sensor.stringToBuffer("full")
let _empty = sensor.stringToBuffer("empty")
let currentLightLevel: number = sensor.none()
let currentTempLevel: number = sensor.none()
message = sensor.none()
let _req = sensor.stringToBuffer("request")
let requesting = true
while (true) {
    sendingData = true
    awaitingAcknowledgement = true
    requesting = true
    if (!(startReceived)) {
        basic.showString("W")
        basic.pause(100)
        if (message != sensor.none() && sensor.compareBuffers(message, _start)) {
            startReceived = true
            basic.showString("S")
        } else {
            continue;
        }
    }
    currentTempLevel = input.temperature()
    currentTempLevel = currentTempLevel * 1.8 + 32
    currentLightLevel = input.lightLevel()
    if (currentTempLevel != sensor.none() && currentLightLevel != sensor.none()) {
        sensor.sendBuffer(_ready)
        basic.showString("R")
    }
    while (awaitingAcknowledgement) {
        basic.pause(100)
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
        if (message != sensor.none() && sensor.compareBuffers(message, _ack)) {
            sensor.sendData(currentTempLevel, currentLightLevel)
            basic.showString("D")
            sendingData = false
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
    currentLightLevel = sensor.none()
    currentTempLevel = sensor.none()
    message = sensor.none()
    control.waitMicros(5000000)
}
