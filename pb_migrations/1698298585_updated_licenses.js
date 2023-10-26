/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z8iv6ivp3p1r47a")

  // remove
  collection.schema.removeField("ifgs0gqf")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("z8iv6ivp3p1r47a")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ifgs0gqf",
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
})
