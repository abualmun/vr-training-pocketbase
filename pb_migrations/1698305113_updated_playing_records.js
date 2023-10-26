/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("347h2n4dhnz0ls0")

  collection.updateRule = ""
  collection.deleteRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("347h2n4dhnz0ls0")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
