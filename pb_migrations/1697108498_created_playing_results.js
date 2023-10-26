/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "347h2n4dhnz0ls0",
    "created": "2023-10-12 11:01:38.093Z",
    "updated": "2023-10-12 11:01:38.093Z",
    "name": "playing_results",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jpnb7ybm",
        "name": "scneario_id",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "r1eq1xbg",
        "name": "scenario_name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "htqm3kvr",
        "name": "metrics",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "fzxnghrx",
        "name": "checklist",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("347h2n4dhnz0ls0");

  return dao.deleteCollection(collection);
})
