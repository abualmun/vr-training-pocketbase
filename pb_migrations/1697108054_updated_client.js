/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2o4hjgvw60sz4cp")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cv3dxsqp",
    "name": "name",
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
  const collection = dao.findCollectionByNameOrId("2o4hjgvw60sz4cp")

  // remove
  collection.schema.removeField("cv3dxsqp")

  return dao.saveCollection(collection)
})
