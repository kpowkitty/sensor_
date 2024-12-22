radio.onReceivedBuffer(function (receivedBuffer) {
    message = receivedBuffer
})
let full: Boolean
let currentLightLevel
let currentTempLevel
let startReceived: Boolean
let sendingData: Boolean
let awaitingAcknowledgement: Boolean
let ready: Buffer
let _start: Buffer
let _ack: Buffer
let _full: Buffer
let _empty: Buffer
let message: Buffer
let started: Boolean
let test: string
radio.setGroup(23)
radio.setTransmitPower(7)
basic.forever(function () {
    _empty = sensor.stringToBuffer("empty")
    _full = sensor.stringToBuffer("full")
    _ack = sensor.stringToBuffer("ack")
    _start = sensor.stringToBuffer("start")
    ready = sensor.stringToBuffer("ready")
    awaitingAcknowledgement = true
    sendingData = true
    started = true
    startReceived = false
    full = false
    currentLightLevel = null
currentTempLevel = null
message = null
while (started) {
        if (!(startReceived)) {
            basic.showString("W")
            basic.pause(100)
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
            basic.showString("WTS")
            if (message != sensor.none() && sensor.compareBuffers(message, _ack)) {
                sensor.sendData(currentTempLevel, currentLightLevel)
                basic.showString("SD")
                sendingData = false
                awaitingAcknowledgement = true
                basic.pause(10000)
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
        started = false
    }
})
