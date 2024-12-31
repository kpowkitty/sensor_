let full: boolean = false
let startReceived: boolean = false
let logMessage: string = ""
let currentTempLevel: number = sensor.none()
let currentLightLevel: number = sensor.none()
let _ready = sensor.stringToBuffer("ready")
let _start = sensor.stringToBuffer("start")
let _ack = sensor.stringToBuffer("ack")
let _full = sensor.stringToBuffer("full")
let _empty = sensor.stringToBuffer("empty")
let lastActionTime: number = input.runningTime()
let _request = sensor.stringToBuffer("request")

namespace sensorAbstracted {
    //% block
    export function sendData() {
        sensor.sendData(currentTempLevel, currentLightLevel)
        basic.showString("D")
        logMessage = "Successfully sent data"
        datalogger.log(datalogger.createCV("Message", logMessage))
        sendingData = false
        lastActionTime = input.runningTime()
    }

    //% block
    export function requestRescue() {
        let error = "Timeout"
        datalogger.log(datalogger.createCV("Error", error))
        basic.showString("E")
        sensor.sendBuffer(_request)
        basic.pause(100)
        if (message != sensor.none() && sensor.compareBuffers(message, _ack)) {
            lastActionTime = input.runningTime()
        }
    }

    //% block
    export function sendRescue() {
        sensor.sendBuffer(_ready)
    }

    //% block
    export function acknowledgementReceived() {
        basic.showString("A")
        logMessage = "Received acknowledgement"
        datalogger.log(datalogger.createCV("Message", logMessage))
        awaitingAcknowledgement = false
        lastActionTime = input.runningTime()
    }

    //% block
    export function fullReceived() {
        basic.showString("F")
        full = true
        awaitingAcknowledgement = false
        lastActionTime = input.runningTime()
    }

    //% block
    export function waitForEmpty() {
        full = true
        while (full) {
            basic.showString("F")
            if (message != sensor.none() && sensor.compareBuffers(message, _empty)) {
                control.reset()
            }
        }
    }

    //% block
    export function sendReady() {
        sensor.sendBuffer(_ready)
        basic.showString("R")
        logMessage = "Ready sent"
        datalogger.log(datalogger.createCV("Message", logMessage))
        lastActionTime = input.runningTime()
    }

    //% block
    export function start() {
        startReceived = true
        basic.showString("S")
        logMessage = "Start received"
        datalogger.log(datalogger.createCV("Message", logMessage))
        lastActionTime = input.runningTime()
    }

    //% block
    export function notStartedYet(): Boolean {
        if (!startReceived) {
            return true
        }
        return false
    }

    //% block
    export function storeCurrentTemperatureReading() {
        currentTempLevel = input.temperature()
        currentTempLevel = currentTempLevel * 1.8 + 32
    }

    //% block
    export function storeCurrentLightReading() {
        currentLightLevel = input.lightLevel()
    }

    //% block
    export function resetVariables() {
        currentLightLevel = sensor.none()
        currentTempLevel = sensor.none()
        message = sensor.none()
        lastActionTime = input.runningTime()
        control.waitMicros(4800000000)
    }

    //% block
    export function wasAcknowledgement(message: Buffer): Boolean {
        return message != sensor.none() && sensor.compareBuffers(message, _ack)
    }

    //% block
    export function wasStart(message: Buffer): Boolean {
        return message != sensor.none() && sensor.compareBuffers(message, _start)
    }

    //% block
    export function dataIsStoredCorrectly(): Boolean {
        return currentTempLevel != sensor.none() && currentLightLevel != sensor.none()
    }

    //% block
    export function wasRequest(message: Buffer): Boolean {
        return message != sensor.none() && sensor.compareBuffers(message, _request)
    }

    //% block
    export function wasFull(message: Buffer): Boolean {
        return message != sensor.none() && sensor.compareBuffers(message, _full)
    }

    //% block
    export function timingOut(): Boolean {
        return input.runningTime() - lastActionTime > watchdogLimit
    }
}