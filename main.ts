radio.onReceivedBuffer(function (receivedBuffer) {
    message = receivedBuffer
})
let error = ""
let full = false
let logMessage = ""
let startReceived = false
let awaitingAcknowledgement = false
let sendingData = false
let message: Buffer = null
let watchdogLimit = 600000
let lastActionTime = input.runningTime()
let _request = sensor.stringToBuffer("request")
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
        basic.showString("O")
        basic.pause(100)
        if (message != sensor.none() && sensor.compareBuffers(message, _start)) {
            startReceived = true
            basic.showString("S")
            logMessage = "Start received"
            datalogger.log(datalogger.createCV("Message", logMessage))
            lastActionTime = input.runningTime()
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
        logMessage = "Ready sent"
        datalogger.log(datalogger.createCV("Message", logMessage))
        lastActionTime = input.runningTime()
    }
    while (awaitingAcknowledgement) {
        basic.showString("W")
        basic.pause(100)
        if (message != sensor.none() && sensor.compareBuffers(message, _request)) {
            sensor.sendBuffer(_ready)
        }
        if (message != sensor.none() && sensor.compareBuffers(message, _ack)) {
            basic.showString("A")
            logMessage = "Received acknowledgement"
            datalogger.log(datalogger.createCV("Message", logMessage))
            awaitingAcknowledgement = false
            lastActionTime = input.runningTime()
        }
        if (message != sensor.none() && sensor.compareBuffers(message, _full)) {
            basic.showString("F")
            full = true
            awaitingAcknowledgement = false
            lastActionTime = input.runningTime()
        }
        while (input.runningTime() - lastActionTime > watchdogLimit) {
            error = "Ack Timeout"
            datalogger.log(datalogger.createCV("Error", error))
            basic.showString("E")
            sensor.sendBuffer(_request)
            basic.pause(100)
            if (message != sensor.none() && sensor.compareBuffers(message, _ack)) {
                lastActionTime = input.runningTime()
            }
        }
    }
    while (sendingData) {
        if (message != sensor.none() && sensor.compareBuffers(message, _ack)) {
            sensor.sendData(currentTempLevel, currentLightLevel)
            basic.showString("D")
            logMessage = "Successfully sent data"
            datalogger.log(datalogger.createCV("Message", logMessage))
            sendingData = false
            lastActionTime = input.runningTime()
        } else if (message != sensor.none() && sensor.compareBuffers(message, _full)) {
            while (full) {
                basic.showString("F")
                if (message != sensor.none() && sensor.compareBuffers(message, _empty)) {
                    startReceived = false
                    full = false
                    sendingData = false
                    lastActionTime = input.runningTime()
                }
            }
        }
    }
    currentLightLevel = sensor.none()
    currentTempLevel = sensor.none()
    message = sensor.none()
    lastActionTime = input.runningTime()
    control.waitMicros(4800000000)
}
