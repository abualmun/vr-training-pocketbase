/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("347h2n4dhnz0ls0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4fax4nni",
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
  const collection = dao.findCollectionByNameOrId("347h2n4dhnz0ls0")

  // remove
  collection.schema.removeField("4fax4nni")

  return dao.saveCollection(collection)
})
