/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("omgtv6bzslvfa32")

  // update
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("omgtv6bzslvfa32")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lhxo7ydx",
    "name": "properties_data_types",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})
