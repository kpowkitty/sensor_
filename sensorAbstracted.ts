let full: boolean = false
let startReceived: boolean = false
let logMessage: string = ""
let _ready = sensor.stringToBuffer("ready")
let _start = sensor.stringToBuffer("start")
let _ack = sensor.stringToBuffer("ack")
let _full = sensor.stringToBuffer("full")
let _empty = sensor.stringToBuffer("empty")
let lastActionTime: number = input.runningTime()
let _request = sensor.stringToBuffer("request")
let awaitingAcknowledgement: Boolean = true
let watchdogLimit = 3600000
namespace sensorAbstracted {
    //% block
    export function sendData() {
        sensor.sendData(currentTempLevel, currentLightLevel)
        lastActionTime = input.runningTime()
    }

    //% block
    export function requestRescue() {
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
        basic.clearScreen()
        lastActionTime = input.runningTime()
    }

    //% block
    export function start() {
        startReceived = true
        basic.showString("S")
        basic.clearScreen()
        lastActionTime = input.runningTime()
    }

    //% block
    export function startedYet(): Boolean {
        while (!startReceived) {
            basic.pause(100)
            if (wasStart(message)) {
                start()
            }
            if (timingOut()) {
                log("Start timeout")
            }
            while (timingOut()) {
                requestRescue()
            }
        }
        if (startReceived) {
            return true;
        } else {
            return false;
        }
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
        control.waitMicros(3000000000)
        if (timingOut()) {
            log("Reset timeout")
        }
        while (timingOut()) {
            requestRescue()
        }
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

    //% block
    export function waitForAcknowledgement() {
        basic.showString("W")
        basic.clearScreen()
        while (awaitingAcknowledgement) {
            basic.pause(100)
            if (wasRequest(message)) {
                sendReady()
            }
            if (wasAcknowledgement(message)) {
                acknowledgementReceived()
            } else if (wasFull(message)) {
                fullReceived()
            }
            while (timingOut()) {
                requestRescue()
            }
        }
    }

    //% block
    export function sendingData(temp: number, light: number) {
        let sending: Boolean = true
        basic.showString("D")
        basic.clearScreen()
        while (sending) {
            basic.pause(100)
            if (wasAcknowledgement(message)) {
                sendData()
                sending = false
            } else if (sensorAbstracted.wasFull(message)) {
                waitForEmpty()
                sending = false
            }
            if (timingOut()) {
                log("Ack timeout")
            }
            while (timingOut()) {
                requestRescue()
            }
        }
    }

    // Helper function for logging errors dynamically
    export function log(error: string) {
        datalogger.log(datalogger.createCV("Error", error))
    }
}