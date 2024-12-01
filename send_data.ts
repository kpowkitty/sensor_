namespace sensor {
    //% block
    export function send_data(): void {
        send_temp()
        send_light()
    }
}