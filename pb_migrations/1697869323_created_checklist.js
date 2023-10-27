/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "07my1d2jp0l2h6l",
    "created": "2023-10-21 06:22:03.574Z",
    "updated": "2023-10-21 06:22:03.574Z",
    "name": "checklist",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "nivhruxp",
        "name": "record_id",
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
        "id": "9vvxtvag",
        "name": "key",
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
        "id": "z6fzlok1",
        "name": "value",
        "type": "bool",
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
  const collection = dao.findCollectionByNameOrId("07my1d2jp0l2h6l");

  return dao.deleteCollection(collection);
})
