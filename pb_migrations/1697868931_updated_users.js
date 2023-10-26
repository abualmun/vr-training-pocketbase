/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("sw39i9vlv4cb28o")

  // remove
  collection.schema.removeField("1tajqslq")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p0qke9i9",
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
  const collection = dao.findCollectionByNameOrId("sw39i9vlv4cb28o")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "1tajqslq",
    "name": "permisson_type",
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

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p0qke9i9",
    "name": "linked_client_id",
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
