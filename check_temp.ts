let myTemp = 0

namespace sensor {
    //% block
    export function check_temp(): void {
        myTemp = input.temperature()
    }
}