let myLight = 0

namespace sensor {
    //% block
    export function check_light(): void {
        myLight = input.lightLevel()
    }
}