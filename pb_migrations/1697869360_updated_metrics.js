/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("29ggw2tgkeulq8z")

  // remove
  collection.schema.removeField("ismsyteo")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nmzq9abw",
    "name": "value",
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
  const collection = dao.findCollectionByNameOrId("29ggw2tgkeulq8z")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ismsyteo",
    "name": "value",
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

  // remove
  collection.schema.removeField("nmzq9abw")

  return dao.saveCollection(collection)
})
