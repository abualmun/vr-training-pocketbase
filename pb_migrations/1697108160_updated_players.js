/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4ulqtomkwr8n8pz")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "4mshdzwt",
    "name": "linked_user_id",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "nqlbmo4w",
    "name": "played_scenario_name",
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
  const collection = dao.findCollectionByNameOrId("4ulqtomkwr8n8pz")

  // remove
  collection.schema.removeField("4mshdzwt")

  // remove
  collection.schema.removeField("nqlbmo4w")

  return dao.saveCollection(collection)
})
