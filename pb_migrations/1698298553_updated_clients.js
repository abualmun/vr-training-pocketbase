/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("3vmv0ui272jm76w")

  // remove
  collection.schema.removeField("hlerzfse")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w101kt4a",
    "name": "license_id",
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

  // remove
  collection.schema.removeField("w101kt4a")

  return dao.saveCollection(collection)
})
