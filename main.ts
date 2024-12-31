let awaitingAcknowledgement = false
let sendingData = false
let watchdogLimit = 600000
radio.setGroup(23)
radio.setTransmitPower(7)
let message = sensor.none()
let requesting = true
while (true) {
    sendingData = true
    awaitingAcknowledgement = true
    requesting = true
    if (sensorAbstracted.notStartedYet()) {
        basic.showString("O")
        basic.pause(100)
        if (sensorAbstracted.wasStart(message)) {
            sensorAbstracted.start()
        } else {
            continue;
        }
    }
    sensorAbstracted.storeCurrentTemperatureReading()
    sensorAbstracted.storeCurrentLightReading()
    if (sensorAbstracted.dataIsStoredCorrectly()) {
        sensorAbstracted.sendReady()
    }
    while (awaitingAcknowledgement) {
        basic.showString("W")
        basic.pause(100)
        if (sensorAbstracted.wasRequest(message)) {
            sensorAbstracted.sendReady()
        }
        if (sensorAbstracted.wasAcknowledgement(message)) {
            sensorAbstracted.acknowledgementReceived()
        } else if (sensorAbstracted.wasFull(message)) {
            sensorAbstracted.fullReceived()
        }
        while (sensorAbstracted.timingOut()) {
            sensorAbstracted.requestRescue()
        }
    }
    while (sendingData) {
        basic.showString("D")
        basic.pause(100)
        if (sensorAbstracted.wasAcknowledgement(message)) {
            sensorAbstracted.sendData()
        } else if (sensorAbstracted.wasFull(message)) {
            sensorAbstracted.waitForEmpty()
        }
    }
    sensorAbstracted.resetVariables()
}
