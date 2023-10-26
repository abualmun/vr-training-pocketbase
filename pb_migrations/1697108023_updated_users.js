/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw39i9vlv4cb28o")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1vbcbmql",
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
  const collection = dao.findCollectionByNameOrId("sw39i9vlv4cb28o")

  // remove
  collection.schema.removeField("1vbcbmql")

  return dao.saveCollection(collection)
})
