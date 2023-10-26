// require("cross-fetch/polyfill")
const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://127.0.0.1:8090');

const a = require("./functions.js")


const express = require('express')
const app = express()
app.use(express.json())
const port = 3000
// call from client
app.post("/clients/login", async (req, res) => {
    // SEND:
    // {
    //     username,
    //     password,
    // }


    try {
        const authData = await pb.collection('clients').authWithPassword(
            req.body.username,
            req.body.password,
        );
        const client_data = pb.authStore.model;
        const license_data = await pb.collection('licenses').getFirstListItem(`id = "${client_data.license_id}"`);

        return res.json(200, {
            token: pb.authStore.token,
            license_type: client_data.license_type,
            name: client_data.name,
            client_id: client_data.id,
            license_id: client_data.license_id,
            seats: license_data.seats_left
        })
    } catch (error) {

        res.json(error.status, error)
    }


})


// call from client
app.post("/devices/add", async (req, res) => {
    // SEND: {
    //     client_id
    // }


    // GENERATE CONNECT-CODE
    try {
        var connect_code = 123456
        var devices = await pb.collection('devices').getFullList({ filter: `connect_code=${connect_code}` });
        while (devices.length != 0) {
            connect_code = (connect_code + 1) % 999999;
            devices = await pb.collection('devices').getFullList({ filter: `connect_code=${connect_code}` });
        }

        // ADD EMPTY DEVICE RECORD TO TABLE
        const data = {
            "client_id": req.body.client_id,
            "connect_code": connect_code
        }
        const device = await pb.collection('devices').create(data);

        return res.json(200, { "connect_code": connect_code })

    } catch (error) {
        res.json(error.message)
    }
})

// call from device
app.post("/devices/connect", async (req, res) => {


    // SEND:{
    //     connect_code,
    //     device_serial_number

    // }
    const connect_code = req.body.connect_code
    try {

        const device = await pb.collection('devices').getFirstListItem(`connect_code = ${connect_code}`);
        const data = {
            "device_serial_number": req.body.device_serial_number,
            "connected": true
        }
        const divice_updated = await pb.collection('devices').update(device.id, data);

        return res.json(200, divice_updated)
    } catch (error) {
        return res.json(error.status, error)
    }

})


// call from device
app.post("/devices/auto_connect", async (req, res) => {


    // SEND:{
    //     device_serial_number
    // }

    try {

        const device = await pb.collection('devices').getFirstListItem(`device_serial_number = "${req.body.device_serial_number}"`);
        if (device.connected) {
            return res.json(200, device)
        } else {
            return res.json(200, { connected: false, message: "device is not connected to client" })
        }
    } catch (error) {
        return res.json(200, { connected: false, message: "device is not connected to client" })

    }

})


// call from client
app.get("/devices/list", (req, res) => {



})

// call from client
app.post("/clients/start_session", async (req, res) => {
    // SEND: {
    //     device_id,
    //         client_id,
    //         user_id,
    //         scenario_id
    // }


    try {

        const new_record_data = {
            client_id: req.body.client_id,
            user_id: req.body.user_id,
            device_id: req.body.device_id,
        }
        const new_record = await pb.collection("playing_records").create(new_record_data)

        const device_data = {
            ready: true,
            running_scenario: req.body.running_scenario,
            running_record: new_record.id

        }
        const device_updated = await pb.collection('devices').update(req.body.device_id, device_data);


        return res.json(new_record)
    } catch (error) {
        return json(error.status, error)
    }

})

// call from device
app.post("/devices/start_game", async (req, res) => {
    // SEND:{
    //     device_serial_number
    // }

    const device_serial_number = req.body.device_serial_number;

    const device = await pb.collection('devices').getFirstListItem(`device_serial_number = "${device_serial_number}"`);

    if (device.ready) {
        const scenario = await pb.collection('scenarios').getFirstListItem(`id = "${device.running_scenario}"`);

        return res.json(200, {
            device_id: device.id,
            scenario_id: device.running_scenario,
            scenario_name: scenario.name,
            metrics_keys: scenario.metrics_keys,
            checklist_keys: scenario.checklist_keys,
            additional_info: scenario.additional_info,
            client_id: device.client_id,
            record_id: device.running_record
        })
    } else {
        return res.json(200, { status: "failed", message: "device not marked ready" })
    }
})

// call from device
app.post("/records/add", async (req, res) => {
    // SEND: {
    //     "scenario_id",
    //         "client_id",
    //         "device_id",
    //         "metrics",
    //     "checklist",
    //     "additional_info",
    //      "device_serial_number",
    //      "record_id"
    // }


    try {



        const device = await pb.collection('devices').getFirstListItem(`device_serial_number = "${req.body.device_serial_number}"`);

        const device_data = {
            ready: false,
            running_scenario: "",
            running_record: ""
        }
        const device_updated = await pb.collection('devices').update(device.id, device_data);


        const data = {
            "scenario_id": req.body.scenario_id,
            "client_id": req.body.client_id,
            "device_id": req.body.device_id,
        };
        const record = await pb.collection('playing_records').getFirstListItem(`id = "${req.body.record_id}"`);
        const record_id = record.id;


        const metrics = req.body.metrics
        for (const key in metrics) {
            const data = {
                "record_id": record_id,
                "key": key,
                "value": metrics[key]
            }
            const metrics_record = await pb.collection('metrics').create(data);
        }

        const checklist = req.body.checklist
        for (const key in checklist) {
            const data = {
                "record_id": record_id,
                "key": key,
                "value": checklist[key]
            }
            const checklist_record = await pb.collection('checklist').create(data);
        }

        const additional_info = req.body.additional_info
        for (const key in additional_info) {
            const data = {
                "record_id": record_id,
                "key": key,
                "value": additional_info[key]
            }
            const additional_info_record = await pb.collection('additional_info').create(data);
        }


        res.json(200, record)

    } catch (error) {
        res.json(error)
    }
})


// ADD NEW SCENARIO
app.post("/scenarios/add", async (req, res) => {


    const data = {
        "name": req.body.scenario_name,
        "client_id": req.body.client_id,
        "metrics_keys": req.body.metrics_keys,
        "checklist_keys": req.body.checklist_keys,
        "additional_info": req.body.additional_info
    };

    const record = await pb.collection('scenarios').create(data);

    return res.json(200, { record })

})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))



// Functions

function SubToLicense(client_id, license_type, period) {

    // operation succeeded?
    return true;
}

function UpdateLicense(license_id, license_type, added_seats) {

    // operation succeeded?
    return true;
}

function AddNewDevice(client_id, device_ip, device_model_name) {

    // operation succeeded?
    return true;
}
async function AddNewScenario(pb, client_id, scenario_name, metrics, checklist, additional_info) {

    const data = {
        "name": scenario_name,
        "client_id": client_id,
        "metrics_keys": metrics,
        "checklist_keys": checklist,
        "additional_info": additional_info
    };
    try {
        const record = await pb.collection('scenarios').create(data);

    } catch (error) {
        return error;
    }
    // operation succeeded?
    return true;
}

function GetScenarioRecords(scenario_id) {

    // playing records of the scenario
    return json_list;
}


function GetDeviceRecords(device_id) {

    // playing records of the device
    return json_list;
}

function GetUserRecords(user_id) {

    // playing records of the user
    return json_list;
}

function StartGameSession(client_id, device_id, scenario_id, user_id) {

    // send json of scenario customization to the targeted device
    return json;
}

function StorePlayingRecord(client_id, device_id, user_id, scenario_id, metrics, checklist, additional_info) {


    // operation succeeded?
    return true;
}

function ClientLogin(username, password) {

    return login_token, client_info
}

function DeviceNormalLogin(username, password) {


    return login_token;
}

function DeviceAutoLogin(auto_login_token) {

    // operation succeeded?
    return true;
}



// TOKENS

function GenerateLoginToken() {

}
function RefreshToken() {

}