radio.onReceivedString(function (receivedString) {
    message = sensor.stringToBuffer(receivedString)
})
let full = false
let light2 = 0
let temp = 0
let start_received = false
let message: Buffer = null
let ready = sensor.stringToBuffer("ready")
message = sensor.none()
let _ack = sensor.stringToBuffer("ack")
let _full = sensor.stringToBuffer("full")
let _empty = sensor.stringToBuffer("empty")
let _start = sensor.stringToBuffer("start")

function turn_on(): void {
	radio.setGroup(23)
	radio.setTransmitPower(7)
}

function scan(): void {
	sensor.check_temp()
	sensor.check_light()
	temp = input.temperature()
	light2 = input.lightLevel()
}

function send(): void {
	if (("temp" as any) != ("none" as any) && ("light" as any) != ("none" as any)) {
	    sensor.sendBuffer(ready)
	    basic.showString("R")
	}
}

function process(): void {
    control.waitMicros(1000000)
}

function recieve(): void {
    if (message && sensor.compareBuffers(message, _ack)) {
        basic.showString("M")
        break;
    }
    if (message && sensor.compareBuffers(message, _full)) {
        full = true
        break;
    }
}

function send_other(): void {
	if (message && sensor.compareBuffers(message, _ack)) {
	    radio.sendValue("temp", temp)
	    radio.sendValue("light", light2)
	    basic.showString("S")
	    control.waitMicros(10000000)
	} else if (message && sensor.compareBuffers(message, _full)) {
	    while (full) {
	        basic.showString("F")
	        if (message && sensor.compareBuffers(message, _empty)) {
	            full = false
	        }
	    }
}

function run(): void {
	turn_on()	// init block
	while (true) {	// makecode has
		if (!on()) {
			skip()
		}
		scan_sensors()	// block
		process_data()	// block
		send_data()	// block
		show_sensors()
		if (recieve_data()) {
			recieve_more_data()
		}
	}
}

function recieving_data(): boolean {
	if (!(start_received)) {
		if (message && sensor.compareBuffers(message, _start)) {
		    start_received = true
		}
	}
	return t/f
}

// sensor device
// data storage device
	
function run_sensors(): void {
	sensor.check_temp()
	sensor.check_light()
	temp = input.temperature()
	light2 = input.lightLevel()
}

function check_sensors(): void {
	sensor.check_temp()
	sensor.check_light()
}

function record_sensors(): void {
	temp = input.temperature()
	light2 = input.lightLevel()
}

class BeeBit {

	start()
	send_data()
	recieve_data()

}

/*
Opt 1:
sensor.check_temp()
sensor.check_light()
temp = input.temperature()
light2 = input.lightLevel()

Opt 2:
check_sensors()
record_sensors()

Opt 3:
run_sensors()

Opt 4:
some even more abstracted function that does more
*/

while (true) {
	if (!recieving_data()) {
		continue
	}
	record_sensors()
	if (sensors_recorded_data()) {
		send_data()
	recieve_data()

function sensors_recorded_data(): boolean {
	return (("temp" as any) != ("none" as any) && ("light" as any) != ("none" as any)) 
}

function send_data(): void {
	while (true) {
		if (check_ack()) {
	        basic.showString("M")
	        break;
	    }
		if (check_full()) {
	        full = true
	        break;
	    }
	}
	if (check_ack()) {
	    radio.sendValue("temp", temp)
	    radio.sendValue("light", light2)
	    basic.showString("S")
	    control.waitMicros(10000000)
	} else if (check_full()) {
	    while (full) {
	        basic.showString("F")
	        if (data_emptied()) {
	            full = false
	        }
	    }
	}
}

function wait_ready(): void {
	while (true) {
		if (check_ack()) {
		    basic.showString("M")
		    break;
		}
		if (check_full()) {
		    full = true
		    break;
		}
	}
}

function check_full(): boolean {
	return message && sensor.compareBuffers(message, _full)
}

function check_ack(): boolean {
	return message && sensor.compareBuffers(message, _ack)

function send_ready(): void {
	let wait = 1000000
	sensor.sendBuffer(ready)
	basic.showString("R")
	control.waitMicros(wait)
}

function data_emptied(): boolean {
	return message && sensor.compareBuffers(message, _empty)
}

function main(): int {
	while (true) {
	    if (!(start_received)) {
	        if (message && sensor.compareBuffers(message, _start)) {
	            start_received = true
	        }
	    } else {
	        continue;
	    }
	    sensor.check_temp()
	    sensor.check_light()
	    temp = input.temperature()
	    light2 = input.lightLevel()
	    if (sensors_recorded_data()) {
	        sensor.sendBuffer(ready)
	        basic.showString("R")
	    }
	    control.waitMicros(1000000)
	    while (true) {
	        if (check_ack()) {
	            basic.showString("M")
	            break;
	        }
	        if (check_full()) {
	            full = true
	            break;
	        }
	    }
	    if (check_ack()) {
	        radio.sendValue("temp", temp)
	        radio.sendValue("light", light2)
	        basic.showString("S")
	        control.waitMicros(10000000)
	    } else if (check_full()) {
	        while (full) {
	            basic.showString("F")
	            if (data_emptied()) {
	                full = false
	            }
	        }
	    }
	}
}
