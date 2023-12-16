// require("cross-fetch/polyfill")
const cors = require("cors")
const PocketBase = require('pocketbase/cjs');
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")

const pb = new PocketBase('https://vr-training-backend.fly.dev');


const express = require('express')
const app = express()
app.use(express.json())
app.use(cors());
const port = 8080

class actions {
    static user_login = "user_login";
    static add_device = "add_device";
    static connect_device = "connect_device";
    static start_session = "start_session";
    static start_game = "start_game";
    static add_record = "add_record";
    static add_scenario = "add_scenario";
}

const actions_log = {
    client_id, action, success, user_id, device_id, scenario_id, error
}

const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'VR-Training backend with pockebase',
            version: '1.0.0'

        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: ['./index.js']
}

const swaggerSpec = swaggerJsdoc(options)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))


// call from client
app.post('/clients/login', async (req, res) => {
    try {
        const authData = await pb.collection('clients').authWithPassword(
            req.body.username,
            req.body.password
        );
        const client_data = pb.authStore.model;
        const license_data = await pb
            .collection('licenses')
            .getFirstListItem(`client_id = "${client_data.id}"`);

        res.status(200).json({
            name: client_data.name,
            seats: license_data.seats_left,
        });

        const data = {
            client_id: client_data.id,
            action: actions.user_login,
            success: true
        };
        const action_record = await pb.collection('actions_log').create(data);
    } catch (error) {

        const data = {
            client_id: client_data.id,
            action: actions.user_login,
            success: false,
            error: error.message
        };
        const action_record = await pb.collection('actions_log').create(data);

        res.status(error.status || 500).json(error);
    }
});

// call from client
app.get('/clients/add_device', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, message: 'invalid or expired token' });

    try {
        var isConnected = true; // to make sure that there are no aother pending connect_code
        var connect_code = getRandomInt(999999);
        var devices = await pb.collection('unconnected_devices').getFullList({
            filter: `connect_code=${connect_code}`,
        });
        while (devices.length != 0) {
            connect_code = (connect_code + 1) % 999999;
            devices = await pb.collection('unconnected_devices').getFullList({
                filter: `connect_code=${connect_code}`,
            });
        }

        const data = {
            client_id: pb.authStore.model.id,
            connect_code: connect_code,
        };
        const device = await pb.collection('devices').create(data);
        const log = {
            client_id: pb.authStore.model.id,
            action: actions.add_device,
            success: true,
        };
        const action_record = await pb.collection('actions_log').create(log);

        res.status(200).json({ connect_code: connect_code });
    } catch (error) {
        const log = {
            client_id: pb.authStore.model.id,
            action: actions.add_device,
            success: false,
            error: error.message
        };
        const action_record = await pb.collection('actions_log').create(log);

        res.status(500).json(error.message);
    }
});

// call from device
app.post('/devices/connect', async (req, res) => {
    const connect_code = req.body.connect_code;
    try {
        const device = await pb.collection('unconnected_devices').getFirstListItem(`connect_code = ${connect_code}`);
        const data = {
            client_id: device.client_id,
            device_serial_number: req.body.device_serial_number,
            connected: true,
        };
        const device_updated = await pb.collection('devices').create(data);
        await pb.collection('running_scenarios').delete(device.id)
        res.status(200).json(device_updated);
        const log = {
            client_id: client_id,
            device_id: device_updated.id,
            action: actions.connect_device,
            success: true
        };
        const action_record = await pb.collection('actions_log').create(log);

    } catch (error) {
        const log = {
            client_id: client_id,
            action: actions.connect_device,
            success: false,
            error: error.message
        };
        const action_record = await pb.collection('actions_log').create(log);

        res.status(error.status || 500).json(error);
    }
});


// call from device
app.post('/devices/auto_connect', async (req, res) => {
    try {
        const device = await pb
            .collection('devices')
            .getFirstListItem(`device_serial_number = "${req.body.device_serial_number}"`);
        if (device.connected) {
            const log = {
                client_id: device.client_id,
                device_id: device.id,
                action: actions.connect_device,
                success: true
            };
            const action_record = await pb.collection('actions_log').create(log);

            return res.status(200).json(device);
        } else {
            const log = {
                client_id: device.client_id,
                device_id: device.id,
                action: actions.connect_device,
                success: false,
                error: 'device is not connected to client'
            };
            const action_record = await pb.collection('actions_log').create(log);

            return res.status(200).json({ connected: false, message: 'device is not connected to client' });
        }
    } catch (error) {

        const log = {
            client_id: device.client_id,
            device_id: device.id,
            action: actions.connect_device,
            success: false,
            error: error.message
        };
        const action_record = await pb.collection('actions_log').create(log);

        return res.status(error.status).json({ connected: false, message: error.message });
    }
});


// call from client
app.get('/devices/list', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, message: 'invalid or expired token' });
    try {
        var devices = await pb.collection('devices').getFullList();
        return res.status(200).json({ success: true, devices: devices });
    } catch (error) {
        return res.status(error.status || 500).json(error);
    }
});


// call from client
app.post('/clients/start_session', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, message: 'invalid or expired token' });

    try {
        var temp_records = await pb.collection('running_scenarioss').getFullList(`device_id = "${req.body.device_id}"`);
        temp_records.forEach(async element => {
            await pb.collection('running_scenarios').delete(element.id)

        });


        const new_record_data = {
            client_id: pb.authStore.model.id,
            user_id: req.body.user_id,
            device_id: req.body.device_id,
            active: true,
            running_scenario: req.body.running_scenario,
        };
        const temp_record = await pb.collection('running_scenarios').create(new_record_data);

        const log = {
            client_id: pb.authStore.model.id,
            device_id: req.body.device_id,
            action: actions.start_session,
            success: true,
        };
        const action_record = await pb.collection('actions_log').create(log);


        return res.status(200).json(temp_record);
    } catch (error) {
        const log = {
            client_id: pb.authStore.model.id,
            device_id: req.body.device_id,
            action: actions.start_session,
            success: false,
            error: error.message
        };
        const action_record = await pb.collection('actions_log').create(log);

        return res.status(error.status || 500).json(error);
    }
});

// call from device
app.post('/devices/start_game', async (req, res) => {

    const device = await pb
        .collection('running_scenarios')
        .getFirstListItem(`device_id = "${req.body.device_id}"`);

    if (device.active) {
        const scenario = await pb.collection('scenarios').getFirstListItem(`id = "${device.running_scenario}"`);
        const log = {
            client_id: device.client_id,
            device_id: req.body.device_id,
            action: actions.start_game,
            success: true,
        };
        const action_record = await pb.collection('actions_log').create(log);

        return res.status(200).json({
            client_id: device.client_id,
            device_id: device.id,
            record_id: device.running_record,
            scenario_id: device.running_scenario,
            scenario_name: scenario.name,
        });

    } else {
        const log = {
            client_id: device.client_id,
            device_id: req.body.device_id,
            action: actions.start_game,
            success: false,
            error: error.message
        };
        const action_record = await pb.collection('actions_log').create(log);

        return res.status(200).json({ status: 'failed', message: 'device not marked ready' });
    }
});

// call from device
app.post('/records/add', async (req, res) => {

    try {
        const temp_record = await pb
            .collection('running_scenarios')
            .getFirstListItem(`device_id = "${req.body.device_id}"`);

        const record_id = temp_record.id;
        const data = {
            scenario_id: req.body.scenario_id,
            client_id: req.body.client_id,
            device_id: req.body.device_id,
        };

        const metrics = req.body.metrics;
        for (const key in metrics) {
            const data = {
                record_id: record_id,
                key: key,
                value: metrics[key],
            };
            const metrics_record = await pb.collection('metrics').create(data);
        }

        const checklist = req.body.checklist;
        for (const key in checklist) {
            const data = {
                record_id: record_id,
                key: key,
                value: checklist[key],
            };
            const checklist_record = await pb.collection('checklist').create(data);
        }

        const additional_info = req.body.additional_info;
        for (const key in additional_info) {
            const data = {
                record_id: record_id,
                key: key,
                value: additional_info[key],
            };
            const additional_info_record = await pb.collection('additional_info').create(data);
        }

        const log = {
            scenario_id: req.body.scenario_id,
            client_id: req.body.client_id,
            device_id: req.body.device_id,
            action: actions.add_record,
            success: true,
        };
        const action_record = await pb.collection('actions_log').create(log);


        res.status(200).json(record);
    } catch (error) {

        const log = {
            scenario_id: req.body.scenario_id,
            client_id: req.body.client_id,
            device_id: req.body.device_id,
            action: actions.add_record,
            success: false,
            error: error.message
        };
        const action_record = await pb.collection('actions_log').create(log);

        res.status(error.status || 500).json(error);
    }
});

// ADD NEW SCENARIO
app.post('/scenarios/add', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, message: 'invalid or expired token' });

    const data = {
        name: req.body.scenario_name,
        client_id: req.body.client_id,
        metrics_keys: req.body.metrics_keys,
        checklist_keys: req.body.checklist_keys,
        additional_info: req.body.additional_info,
    };

    try {
        const record = await pb.collection('scenarios').create(data);

        const log = {
            scenario_id: req.body.scenario_id,
            client_id: req.body.client_id,
            action: actions.add_scenario,
            success: true,
        };
        const action_record = await pb.collection('actions_log').create(log);

        return res.status(200).json({ record });
    } catch (error) {
        const log = {
            scenario_id: req.body.scenario_id,
            client_id: req.body.client_id,
            action: actions.add_scenario,
            success: false,
            error: error.message
        };
        const action_record = await pb.collection('actions_log').create(log);

        return res.status(error.status || 500).json(error);
    }
});



app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});




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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

