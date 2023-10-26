/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("347h2n4dhnz0ls0")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jpnb7ybm",
    "name": "sceneario_id",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jpnb7ybm",
    "name": "scneario_id",
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
