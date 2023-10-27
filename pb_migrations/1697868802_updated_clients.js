/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x6dc5wvtini8hcp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cnjwrz6q",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x6dc5wvtini8hcp")

  // remove
  collection.schema.removeField("cnjwrz6q")

  return dao.saveCollection(collection)
})
