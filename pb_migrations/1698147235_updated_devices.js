/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ksxemfckuarofr0")

  // remove
  collection.schema.removeField("chkktzut")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ksxemfckuarofr0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "chkktzut",
    "name": "device_id",
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
