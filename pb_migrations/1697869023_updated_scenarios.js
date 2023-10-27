/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("omgtv6bzslvfa32")

  // remove
  collection.schema.removeField("lhxo7ydx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "85zkwu7b",
    "name": "metrics_keys",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tjudw4dj",
    "name": "checklist_keys",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "skazsvjd",
    "name": "additional_info",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("omgtv6bzslvfa32")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lhxo7ydx",
    "name": "properties",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("85zkwu7b")

  // remove
  collection.schema.removeField("tjudw4dj")

  // remove
  collection.schema.removeField("skazsvjd")

  return dao.saveCollection(collection)
})
