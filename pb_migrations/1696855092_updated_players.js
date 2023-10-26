/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mfo9rx53mjofuzk")

  collection.listRule = "@collection.players.name = \"beebz\""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mfo9rx53mjofuzk")

  collection.listRule = "@collection.players.name = \"abualmun\""

  return dao.saveCollection(collection)
})
