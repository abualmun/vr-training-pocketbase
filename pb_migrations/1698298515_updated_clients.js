/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3vmv0ui272jm76w")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hlerzfse",
    "name": "license_id",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3vmv0ui272jm76w")

  // remove
  collection.schema.removeField("hlerzfse")

  return dao.saveCollection(collection)
})
