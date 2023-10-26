/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ksxemfckuarofr0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4vv8ye7w",
    "name": "device_serial_number",
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
  const collection = dao.findCollectionByNameOrId("ksxemfckuarofr0")

  // remove
  collection.schema.removeField("4vv8ye7w")

  return dao.saveCollection(collection)
})
