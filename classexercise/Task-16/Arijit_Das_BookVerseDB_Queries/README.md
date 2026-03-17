
# BookVerseDB — MongoDB Data Modeling & CRUD Operations

## Student Name: Arijit

## Database Name: BookVerseDB

## Tool Used: MongoDB Shell / MongoDB Compass

---

# 1. Database Creation

```js
use BookVerseDB
```

---

# 2. Collection Design

## Authors Collection

```
{
  _id,
  name,
  nationality,
  birthYear
}
```

## Books Collection

```
{
  _id,
  title,
  genre,
  publicationYear,
  authorId (Reference to Authors),
  ratings: [
    {
      user,
      score,
      comment
    }
  ]
}
```

## Users Collection

```
{
  _id,
  name,
  email,
  joinDate
}
```

---

# 3. Data Modeling Explanation

* One-to-Many relationship between Authors and Books implemented using `authorId` reference.
* Ratings implemented using embedded documents inside Books collection.
* Users stored separately for better scalability and data normalization.

---

# 4. CRUD Operations

## Insert Authors

```js
db.authors.insertMany([
  { name: "J.K. Rowling", nationality: "British", birthYear: 1965 },
  { name: "Isaac Asimov", nationality: "American", birthYear: 1920 },
  { name: "George R.R. Martin", nationality: "American", birthYear: 1948 }
])
```

---

## Insert Users

```js
db.users.insertMany([
  { name: "Arijit", email: "arijit@gmail.com", joinDate: new Date("2025-09-01") },
  { name: "Rohit", email: "rohit@gmail.com", joinDate: new Date("2025-01-15") },
  { name: "Sneha", email: "sneha@gmail.com", joinDate: new Date("2025-12-01") }
])
```

---

## Insert Books

```js
db.books.insertMany([
  {
    title: "Harry Potter",
    genre: "Fantasy",
    publicationYear: 1997,
    authorId: ObjectId("AUTHOR_ID"),
    ratings: []
  }
])
```

---

## Retrieve Science Fiction Books

```js
db.books.find({ genre: "Science Fiction" })
```

---

## Update Publication Year

```js
db.books.updateOne(
  { title: "Foundation" },
  { $set: { publicationYear: 1952 } }
)
```

---

## Delete User

```js
db.users.deleteOne({ name: "Rohit" })
```

---

## Add Rating Using $push

```js
db.books.updateOne(
  { title: "Harry Potter" },
  {
    $push: {
      ratings: {
        user: "Arijit",
        score: 5,
        comment: "Amazing book!"
      }
    }
  }
)
```

---

# 5. Querying & Filtering

## Books Published After 2015

```js
db.books.find({
  publicationYear: { $gt: 2015 }
})
```

---

## Authors Who Wrote Fantasy Books

```js
db.authors.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "authorId",
      as: "writtenBooks"
    }
  },
  {
    $match: {
      "writtenBooks.genre": "Fantasy"
    }
  }
])
```

---

## Users Joined in Last 6 Months

```js
db.users.find({
  joinDate: {
    $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
  }
})
```

---

## Books With Average Rating Greater Than 4

```js
db.books.aggregate([
  {
    $addFields: {
      avgRating: { $avg: "$ratings.score" }
    }
  },
  {
    $match: { avgRating: { $gt: 4 } }
  }
])
```

---

# 6. Bonus Query

## Top 3 Most Rated Books

```js
db.books.aggregate([
  {
    $addFields: {
      ratingCount: { $size: "$ratings" }
    }
  },
  { $sort: { ratingCount: -1 } },
  { $limit: 3 }
])
```

---

# 7. Deliverables Included

✔ MongoDB Shell / Compass Screenshots
✔ Exported JSON Files (BookVerseDB.authors.json, BookVerseDB.books.json, BookVerseDB.users.json)
✔ This Documentation File