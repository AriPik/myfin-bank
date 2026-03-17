const dbName = "BookVerseCloudDB";
db = db.getSiblingDB(dbName);

// ---------------------
// INDEX CREATION
// ---------------------

db.books.createIndex({ genre: 1 })
db.books.createIndex({ authorId: 1 })

// ---------------------
// EXPLAIN QUERIES
// ---------------------

db.books.find({ genre: "Fantasy" }).explain("executionStats")

// ---------------------
// AGGREGATION QUERIES
// ---------------------

// Average rating per book
db.books.aggregate([
  { $unwind: "$ratings" },
  {
    $group: {
      _id: "$title",
      avgRating: { $avg: "$ratings.score" }
    }
  }
])

// Books per genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      totalBooks: { $sum: 1 }
    }
  }
])

// Top author
db.books.aggregate([
  {
    $group: {
      _id: "$authorId",
      bookCount: { $sum: 1 }
    }
  },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
])