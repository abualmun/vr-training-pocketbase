/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ksxemfckuarofr0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "scplrflv",
    "name": "start_code",
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
  const collection = dao.findCollectionByNameOrId("ksxemfckuarofr0")

  // remove
  collection.schema.removeField("scplrflv")

  return dao.saveCollection(collection)
})
