// require("cross-fetch/polyfill")
const cors = require("cors")
const PocketBase = require('pocketbase/cjs');
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")

const pb = new PocketBase('http://127.0.0.1:8090');


const express = require('express')
const app = express()
app.use(express.json())
app.use(cors());
const port = 3000

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
app.post("/clients/login", async (req, res) => {
    /**
     * @swagger
     * /clients/login:
     *  post:
     *      summary: client login
     *      description: login using pocketbase auth with password and username  
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                 schema:
     *                     type: object
     *                     properties:
     *                         username:
     *                             type: string
     *                         password:
     *                             type: string              
     *      responses:
     *          200:
     *              description: To test
     *              content:
     *               application/json:
     *                   schema:
     *                     type: object
     *                     properties:
     *                         name:
     *                             type: string
     *                         seats:
     *                             type: string   
     */

    try {
        const authData = await pb.collection('clients').authWithPassword(
            req.body.username,
            req.body.password,
        );
        const client_data = pb.authStore.model;
        const license_data = await pb.collection('licenses').getFirstListItem(`id = "${client_data.license_id}"`);

        return res.json(200, {
            // token: pb.authStore.token,
            name: client_data.name,
            seats: license_data.seats_left
        })
    } catch (error) {

        return res.json(error.status, error)
    }


})


// call from client
app.get("/clients/add_device", async (req, res) => {
    if (!pb.authStore.isValid) return res.json(200, { success: false, mesage: "invalid or expired token" })



    // GENERATE CONNECT-CODE
    try {
        var connect_code = getRandomInt(999999);
        var devices = await pb.collection('devices').getFullList({ filter: `connect_code=${connect_code}` });
        while (devices.length != 0) {
            connect_code = (connect_code + 1) % 999999;
            devices = await pb.collection('devices').getFullList({ filter: `connect_code=${connect_code}` });
        }

        // ADD EMPTY DEVICE RECORD TO TABLE
        const data = {
            "client_id": pb.authStore.model.id,
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
    if (!pb.authStore.isValid) return res.json(200, { success: false, mesage: "invalid or expired token" })

    /**
     * @swagger
     * /devices/connect:
     *  post:
     *      summary: link device 
     *      description: used to link new device to client license  
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                 schema:
     *                     type: object
     *                     properties:
     *                         connect_code:
     *                             type: int
     *                             description: the code showing in the client admin panel
     *                         device_serial_number:
     *                             type: string              
     *                             description: any unique string the device can provide
     *      responses:
     *          200:
     *              description: To test
     *              content:
     *               application/json:
     *                   schema:
     *                     type: object
     *                     properties:
     *                          device_id:
     *                              type: string
     *                          device_serial_number:
     *                              type: string   
     *                          client_id:
     *                              type: string
     *                          connect_code:
     *                              type: string
     *                          ready:
     *                              type: bool
     *                          running_scenario:
     *                              type: string 
     *                          running_record:
     *                              type: string        
     */

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
    if (!pb.authStore.isValid) return res.json(200, { success: false, mesage: "invalid or expired token" })
    /**
     * @swagger
     * /devices/connect:
     *  post:
     *      summary: link device 
     *      description: used to link new device to client license  
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                 schema:
     *                     type: object
     *                     properties:
     *                         device_serial_number:
     *                             type: string              
     *                             description: any unique string the device can provide
     *      responses:
     *          200:
     *              description: To test
     *              content:
     *               application/json:
     *                   schema:
     *                     type: object
     *                     properties:
     *                          device_id:
     *                              type: string
     *                          device_serial_number:
     *                              type: string   
     *                          client_id:
     *                              type: string
     *                          connect_code:
     *                              type: string
     *                          ready:
     *                              type: bool
     *                          running_scenario:
     *                              type: string 
     *                          running_record:
     *                              type: string        
     */



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
app.get("/devices/list", async (req, res) => {
    if (!pb.authStore.isValid) return res.json(200, { success: false, mesage: "invalid or expired token" })
    try {

        var devices = await pb.collection('devices').getFullList();
        return res.json(200, { "success": true, "devices": devices })

    } catch (error) {
        return res.json(error.status, error)
    }
})

// call from client
app.post("/clients/start_session", async (req, res) => {
    if (!pb.authStore.isValid) return res.json(200, { success: false, mesage: "invalid or expired token" })

    // SEND: {
    //     device_id,
    //         user_id,
    //         scenario_id
    // }


    try {

        const new_record_data = {
            client_id: pb.authStore.model.id,
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
    if (!pb.authStore.isValid) return res.json(200, { success: false, mesage: "invalid or expired token" })
    /**
     * @swagger
     * /devices/start_game:
     *  post:
     *      summary: start game 
     *      description: used to start the game after the client presses the start session button  
     *      requestBody:
     *          required: true
     *          content:
     *              application/json:
     *                 schema:
     *                     type: object
     *                     properties:
     *                         device_serial_number:
     *                             type: string              
     *                             description: any unique string the device can provide
     *      responses:
     *          200:
     *              description: To test
     *              content:
     *               application/json:
     *                   schema:
     *                     type: object
     *                     properties:
     *                          device_id:
     *                              type: string 
     *                          client_id:
     *                              type: string
     *                          scenario_id:
     *                              type: string
     *                          scenario_name:
     *                              type: string 
     *                          record_id:
     *                              type: string
     *                          metrics_keys:
     *                              type: array 
     *                          checklist_keys:
     *                              type: array 
     *                          additional_info:
     *                              type: array         
     */

    const device_serial_number = req.body.device_serial_number;

    const device = await pb.collection('devices').getFirstListItem(`device_serial_number = "${device_serial_number}"`);

    if (device.ready) {
        const scenario = await pb.collection('scenarios').getFirstListItem(`id = "${device.running_scenario}"`);

        return res.json(200, {
            client_id: device.client_id,
            device_id: device.id,
            record_id: device.running_record,
            scenario_id: device.running_scenario,
            scenario_name: scenario.name,
            metrics_keys: scenario.metrics_keys,
            checklist_keys: scenario.checklist_keys,
            additional_info: scenario.additional_info
        })
    } else {
        return res.json(200, { status: "failed", message: "device not marked ready" })
    }
})

// call from device
app.post("/records/add", async (req, res) => {
    if (!pb.authStore.isValid) return res.json(200, { success: false, mesage: "invalid or expired token" })

    /**
    * @swagger
    * /records/add:
    *  post:
    *      summary: add playing recored
    *      description: used after finishing the game to record the player results in the database  
    *      requestBody:
    *          required: true
    *          content:
    *              application/json:
    *                 schema:
    *                     type: object
    *                     properties:
    *                         client_id:
    *                             type: string 
    *                         device_id:
    *                             type: string
    *                         device_serial_number:
    *                             type: string  
    *                         record_id:
    *                             type: string
    *                         scenario_id:
    *                             type: string 
    *                         metrics:
    *                             type: object 
    *                         checklist:
    *                             type: object 
    *                         additional_info:
    *                             type: string               
    *      responses:
    *          200:
    *              description: To test
    *              content:
    *               application/json:
    *                   schema:
    *                     type: object
    *                     properties:
    *                          device_id:
    *                              type: string 
    *                          client_id:
    *                              type: string
    *                          scenario_id:
    *                              type: string
    *                          user_id:
    *                              type: string         
    */


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
    if (!pb.authStore.isValid) return res.json(200, { success: false, mesage: "invalid or expired token" })



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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

