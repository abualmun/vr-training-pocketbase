/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw39i9vlv4cb28o")

  // remove
  collection.schema.removeField("3fndlmi5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uunndclx",
    "name": "linked_client_id",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "2o4hjgvw60sz4cp",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw39i9vlv4cb28o")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3fndlmi5",
    "name": "client_id",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("uunndclx")

  return dao.saveCollection(collection)
})
