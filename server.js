const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ejs = require('ejs');
const { query } = require('express');

const app = express();


MongoClient.connect(
  "mongodb+srv://handa26:manjaddawajada@cluster0.nnubg.mongodb.net/<dbname>?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
		console.log("Connected to Database");
		const db = client.db('my-quotes');
		// Store quotes ke quotesCollection
		const quotesCollection = db.collection('quotes');

		app.set("view engine", "ejs");
		app.use(express.static("public"));
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(bodyParser.json());

    app.get("/", (req, res) => {
			db.collection("quotes").find().toArray()
				.then(results => {
					res.render("index", {quotes: results});
				})
				.catch(error => console.log(error));

      
    });

    app.post("/quotes", (req, res) => {
			quotesCollection.insertOne(req.body)
				.then(result => {
					res.redirect("/");
				})
				.catch(error => console.log(error));
		});

		app.put("/quotes", (req, res) => {
			quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
						upsert: true
					}
        )
        .then((result) => {
					res.json("Sukses");
				})
        .catch((error) => {
          console.error(error);
        });
			console.log(req.body);
		});

		app.delete("/quotes", (req, res) => {
			quotesCollection.deleteOne(
				{ name: req.body.name },
			)
				.then(result => {
					if (result.deletedCount === 0) {
            return res.json("No quote to delete");
					}
					res.json(`Deleted dumb quotes`);
				})
				.catch(error => console.error(error));
		})
		
		app.listen(3000, () => {
      console.log("Server berjalan pada port 3000");
    });
  }
);

