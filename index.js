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
    } catch (error) {
        res.status(error.status || 500).json(error);
    }
});

// call from client
app.get('/clients/add_device', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, mesage: 'invalid or expired token' });

    try {
        var IsConnected = true; // to make sure that there are no aother pending connect_code
        var connect_code = getRandomInt(999999);
        var devices = await pb.collection('devices').getFullList({
            filter: `connect_code=${connect_code} && connected=${IsConnected}`,
        });
        while (devices.length != 0) {
            connect_code = (connect_code + 1) % 999999;
            devices = await pb.collection('devices').getFullList({
                filter: `connect_code=${connect_code}`,
            });
        }

        const data = {
            client_id: pb.authStore.model.id,
            connect_code: connect_code,
        };
        const device = await pb.collection('devices').create(data);

        res.status(200).json({ connect_code: connect_code });
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// call from device
app.post('/devices/connect', async (req, res) => {
    const connect_code = req.body.connect_code;
    try {
        const device = await pb.collection('devices').getFirstListItem(`connect_code = ${connect_code}`);
        const data = {
            device_serial_number: req.body.device_serial_number,
            connected: true,
        };
        const device_updated = await pb.collection('devices').update(device.id, data);

        res.status(200).json(device_updated);
    } catch (error) {
        res.status(error.status || 500).json(error);
    }
});


// call from device
app.post('/devices/auto_connect', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, mesage: 'invalid or expired token' });

    try {
        const device = await pb
            .collection('devices')
            .getFirstListItem(`device_serial_number = "${req.body.device_serial_number}"`);
        if (device.connected) {
            return res.status(200).json(device);
        } else {
            return res.status(200).json({ connected: false, message: 'device is not connected to client' });
        }
    } catch (error) {
        return res.status(200).json({ connected: false, message: 'device is not connected to client' });
    }
});

// call from client
app.get('/devices/list', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, mesage: 'invalid or expired token' });
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
        return res.status(200).json({ success: false, mesage: 'invalid or expired token' });

    try {
        const new_record_data = {
            client_id: pb.authStore.model.id,
            user_id: req.body.user_id,
            device_id: req.body.device_id,
        };
        const new_record = await pb.collection('playing_records').create(new_record_data);

        const device_data = {
            ready: true,
            running_scenario: req.body.running_scenario,
            running_record: new_record.id,
        };
        const device_updated = await pb.collection('devices').update(req.body.device_id, device_data);

        return res.status(200).json(new_record);
    } catch (error) {
        return res.status(error.status || 500).json(error);
    }
});

// call from device
app.post('/devices/start_game', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, mesage: 'invalid or expired token' });

    const device_serial_number = req.body.device_serial_number;
    const device = await pb
        .collection('devices')
        .getFirstListItem(`device_serial_number = "${device_serial_number}"`);

    if (device.ready) {
        const scenario = await pb.collection('scenarios').getFirstListItem(`id = "${device.running_scenario}"`);

        return res.status(200).json({
            client_id: device.client_id,
            device_id: device.id,
            record_id: device.running_record,
            scenario_id: device.running_scenario,
            scenario_name: scenario.name,
            // metrics_keys: scenario.metrics_keys,
            // checklist_keys: scenario.checklist_keys,
            // additional_info: scenario.additional_info,
        });
    } else {
        return res.status(200).json({ status: 'failed', message: 'device not marked ready' });
    }
});

// call from device
app.post('/records/add', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, mesage: 'invalid or expired token' });

    try {
        const device = await pb
            .collection('devices')
            .getFirstListItem(`device_serial_number = "${req.body.device_serial_number}"`);

        const device_data = {
            ready: false,
            running_scenario: '',
            running_record: '',
        };
        const device_updated = await pb.collection('devices').update(device.id, device_data);

        const data = {
            scenario_id: req.body.scenario_id,
            client_id: req.body.client_id,
            device_id: req.body.device_id,
        };
        const record = await pb.collection('playing_records').getFirstListItem(`id = "${req.body.record_id}"`);
        const record_id = record.id;

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

        res.status(200).json(record);
    } catch (error) {
        res.status(error.status || 500).json(error);
    }
});

// ADD NEW SCENARIO
app.post('/scenarios/add', async (req, res) => {
    if (!pb.authStore.isValid)
        return res.status(200).json({ success: false, mesage: 'invalid or expired token' });

    const data = {
        name: req.body.scenario_name,
        client_id: req.body.client_id,
        metrics_keys: req.body.metrics_keys,
        checklist_keys: req.body.checklist_keys,
        additional_info: req.body.additional_info,
    };

    try {
        const record = await pb.collection('scenarios').create(data);

        return res.status(200).json({ record });
    } catch (error) {
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

