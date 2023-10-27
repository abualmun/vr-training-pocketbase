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