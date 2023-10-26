/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("07my1d2jp0l2h6l")

  collection.listRule = ""
  collection.createRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("07my1d2jp0l2h6l")

  collection.listRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
