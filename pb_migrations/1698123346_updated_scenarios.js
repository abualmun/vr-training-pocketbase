/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("omgtv6bzslvfa32")

  // remove
  collection.schema.removeField("c6pcruif")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("omgtv6bzslvfa32")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "c6pcruif",
    "name": "scenario_id",
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
})
