

// routerAdd("GET", "/hello/fuckit_base", (c) => {

//     let name = c.pathParam("name")

//     return c.json(200, { "message": "Hello " + name })
// })
// // ADD NEW SCENARIO
// routerAdd("POST", "/scenarios/add", (c) => {

//     const data = $apis.requestInfo(c).data
//     const scenarios = $app.dao().findCollectionByNameOrId("scenarios")

//     const record =
//         Record(scenarios, {
//             "scenario_id": data.scenario_id,
//             "name": data.name,
//             "client_id": data.client_id,
//             "properties": data.properties
//         })

//     $app.dao().saveRecord(record)

//     return c.json(200, "record created successfully")

// })

// // ADD NEW PLAYER
// routerAdd("POST", "/players/add", (c) => {

//     const data = $apis.requestInfo(c).data
//     const players = $app.dao().findCollectionByNameOrId("players")

//     const record =
//         Record(players, {
//             "player_id": data.player_id,
//             "linked_client_id": data.linked_client_id,
//             "linked_user_id": data.linked_user_id,
//             "played_scenario_id": data.played_scenario_id,
//             "played_scenario_name": data.played_scenario_name
//         })

//     $app.dao().saveRecord(record)


//     return c.json(200, "player added successfully")

// })


// // ADD NEW RESULT RECORD
// routerAdd("POST", "/scenarios/results", (c) => {

//     const data = $apis.requestInfo(c).data
//     const results = $app.dao().findCollectionByNameOrId("playing_results")

//     const record =
//         Record(results, {
//             "scneario_id": data.scenario_id,
//             "scenario_name": data.scenario_name,
//             "metrics": data.metrics,
//             "checklist": data.checklist,
//             "additional_info": data.additional_info
//         })

//     $app.dao().saveRecord(record)


//     return c.json(200, "results added successfully")

// })

// // GET SCENARIOS LIST

// routerAdd("GET", "/scenarios/results", async (c) => {
//     // try {
//     var records = await $app.dao().db().
//         newQuery("SELECT * FROM playing_results").
//         execute()
//     // } catch (error) {
//     //     return c.json(200, error.message)

//     // }
//     return c.json(200, records)

// })
