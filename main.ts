radio.onReceivedBuffer(function (receivedBuffer) {
    message = receivedBuffer
})
let message: Buffer = null
let currentTempLevel: number = sensor.none()
let currentLightLevel: number = sensor.none()
radio.setGroup(23)
radio.setTransmitPower(7)
while (true) {
    if (!(sensorAbstracted.startedYet())) {
        continue;
    }
    currentTempLevel = input.temperature()
    currentTempLevel = currentTempLevel * 1.8 + 32
    currentLightLevel = input.lightLevel()
    if (sensorAbstracted.dataIsStoredCorrectly()) {
        sensorAbstracted.sendReady()
    }
    sensorAbstracted.waitForAcknowledgement()
    sensorAbstracted.sendingData(currentTempLevel, currentLightLevel)
    sensorAbstracted.resetVariables()
}
