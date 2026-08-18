// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 3000;
// const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123"; // Set JWT_SECRET in .env

// // Middleware
// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldizubn.mongodb.net/?appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     await client.connect();

//     const db = client.db("careerTrack_db");
//     const usersCollection = db.collection("users");
//     const jobsCollection = db.collection("jobs");

//     // ================= AUTH ROUTES =================

//     // 1. REGISTER USER
//     app.post("/register", async (req, res) => {
//       try {
//         const { name, email, password } = req.body;

//         if (!name || !email || !password) {
//           return res.status(400).send({ message: "All fields are required." });
//         }

//         // Check if user already exists
//         const existingUser = await usersCollection.findOne({ email });
//         if (existingUser) {
//           return res
//             .status(400)
//             .send({ message: "User with this email already exists." });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Save user to DB
//         const newUser = {
//           name,
//           email,
//           password: hashedPassword,
//           createdAt: new Date(),
//         };

//         const result = await usersCollection.insertOne(newUser);

//         // Generate JWT Token
//         const token = jwt.sign(
//           { id: result.insertedId, email, name },
//           JWT_SECRET,
//           { expiresIn: "7d" },
//         );

//         res.status(201).send({
//           message: "User registered successfully",
//           token,
//           user: { id: result.insertedId, name, email },
//         });
//       } catch (error) {
//         console.error("Register Error:", error);
//         res.status(500).send({ message: "Internal server error" });
//       }
//     });

//     // 2. LOGIN USER
//     app.post("/login", async (req, res) => {
//       try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//           return res
//             .status(400)
//             .send({ message: "Email and password are required." });
//         }

//         // Find user by email
//         const user = await usersCollection.findOne({ email });
//         if (!user) {
//           return res
//             .status(400)
//             .send({ message: "Invalid email or password." });
//         }

//         // Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//           return res
//             .status(400)
//             .send({ message: "Invalid email or password." });
//         }

//         // Generate JWT Token
//         const token = jwt.sign(
//           { id: user._id, email: user.email, name: user.name },
//           JWT_SECRET,
//           { expiresIn: "7d" },
//         );

//         res.status(200).send({
//           message: "Logged in successfully",
//           token,
//           user: { id: user._id, name: user.name, email: user.email },
//         });
//       } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).send({ message: "Internal server error" });
//       }
//     });
//     //---------dashboard route

//     // GET all job applications
//     app.get("/jobs", async (req, res) => {
//       try {
//         const result = await jobsCollection
//           .find()
//           .sort({ createdAt: -1 })
//           .toArray();
//         res.status(200).send(result);
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//         res.status(500).send({ message: "Failed to fetch job applications" });
//       }
//     });
//     //----------Job Application Handle
//     const { ObjectId } = require("mongodb");

//     // 1. GET all job applications
//     app.get("/jobs", async (req, res) => {
//       try {
//         const result = await jobsCollection
//           .find()
//           .sort({ createdAt: -1 })
//           .toArray();
//         res.status(200).send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to fetch jobs" });
//       }
//     });

//     // 2. POST create a new job application
//     app.post("/jobs", async (req, res) => {
//       try {
//         const newJob = {
//           ...req.body,
//           createdAt: new Date(),
//         };
//         const result = await jobsCollection.insertOne(newJob);
//         res.status(201).send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to create job application" });
//       }
//     });

//     // 3. PATCH update job status
//     app.patch("/jobs/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const { status } = req.body;
//         const filter = { _id: new ObjectId(id) };
//         const updateDoc = { $set: { status } };

//         const result = await jobsCollection.updateOne(filter, updateDoc);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to update status" });
//       }
//     });

//     // 4. DELETE job application
//     app.delete("/jobs/:id", async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const result = await jobsCollection.deleteOne(query);
//         res.send(result);
//       } catch (error) {
//         res.status(500).send({ message: "Failed to delete job application" });
//       }
//     });

//     // ================= JOBS ROUTES =================
//     app.get("/jobs", async (req, res) => {
//       const cursor = jobsCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.post("/jobs", async (req, res) => {
//       const job = req.body;
//       const result = await jobsCollection.insertOne(job);
//       res.send(result);
//     });

//     await client.db("admin").command({ ping: 1 });
//     console.log("Connected to MongoDB successfully!");
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error);
//   }
// }

// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("CareerTrack Server!");
// });

// app.listen(port, () => {
//   console.log(`CareerTrack server listening on port ${port}`);
// });

//google login route

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldizubn.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("careerTrack_db");

    const usersCollection = db.collection("users");
    const jobsCollection = db.collection("jobs");

    // =====================================================
    // AUTH ROUTES
    // =====================================================

    // ================= REGISTER =================
    app.post("/register", async (req, res) => {
      try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          return res.status(400).send({
            message: "All fields are required.",
          });
        }

        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
          return res.status(400).send({
            message: "User with this email already exists.",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          name,
          email,
          password: hashedPassword,
          createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign(
          {
            id: result.insertedId,
            email,
            name,
          },
          JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );

        res.status(201).send({
          message: "User registered successfully",
          token,
          user: {
            id: result.insertedId,
            name,
            email,
          },
        });
      } catch (error) {
        console.error("Register Error:", error);

        res.status(500).send({
          message: "Internal server error",
        });
      }
    });

    // ================= LOGIN =================
    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).send({
            message: "Email and password are required.",
          });
        }

        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(400).send({
            message: "Invalid email or password.",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).send({
            message: "Invalid email or password.",
          });
        }

        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            name: user.name,
          },
          JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );

        res.status(200).send({
          message: "Logged in successfully",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      } catch (error) {
        console.error("Login Error:", error);

        res.status(500).send({
          message: "Internal server error",
        });
      }
    });

    // =====================================================
    // GOOGLE LOGIN
    // =====================================================

    app.post("/google-login", async (req, res) => {
      try {
        const { credential } = req.body;

        if (!credential) {
          return res.status(400).send({
            message: "Google credential is required.",
          });
        }

        if (!GOOGLE_CLIENT_ID) {
          return res.status(500).send({
            message: "Google Client ID is not configured on the server.",
          });
        }

        // Verify Google ID token
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.name;
        const picture = payload.picture;

        if (!email) {
          return res.status(400).send({
            message: "Google account email could not be verified.",
          });
        }

        // Check if user already exists
        let user = await usersCollection.findOne({
          email,
        });

        // If user doesn't exist, create one
        if (!user) {
          const newUser = {
            name: name || "Google User",
            email,
            googleId,
            picture: picture || "",
            authProvider: "google",
            createdAt: new Date(),
          };

          const result = await usersCollection.insertOne(newUser);

          user = {
            _id: result.insertedId,
            ...newUser,
          };
        } else {
          // Update Google information for an existing account
          await usersCollection.updateOne(
            { _id: user._id },
            {
              $set: {
                googleId,
                picture: picture || user.picture || "",
              },
            },
          );
        }

        // Create your existing CareerTrack JWT
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            name: user.name,
          },
          JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );

        res.status(200).send({
          message: "Google login successful",
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            picture: picture || user.picture || "",
          },
        });
      } catch (error) {
        console.error("Google Login Error:", error);

        res.status(401).send({
          message: "Google authentication failed.",
        });
      }
    });

    // =====================================================
    // JOB APPLICATION ROUTES
    // =====================================================

    // GET all job applications
    app.get("/jobs", async (req, res) => {
      try {
        const result = await jobsCollection
          .find()
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).send(result);
      } catch (error) {
        console.error("Error fetching jobs:", error);

        res.status(500).send({
          message: "Failed to fetch job applications",
        });
      }
    });

    // POST create a new job application
    app.post("/jobs", async (req, res) => {
      try {
        const newJob = {
          ...req.body,
          createdAt: new Date(),
        };

        const result = await jobsCollection.insertOne(newJob);

        res.status(201).send(result);
      } catch (error) {
        console.error("Error creating job:", error);

        res.status(500).send({
          message: "Failed to create job application",
        });
      }
    });

    // PATCH update job status
    app.patch("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { status } = req.body;

        const filter = {
          _id: new ObjectId(id),
        };

        const updateDoc = {
          $set: {
            status,
          },
        };

        const result = await jobsCollection.updateOne(filter, updateDoc);

        res.send(result);
      } catch (error) {
        console.error("Error updating status:", error);

        res.status(500).send({
          message: "Failed to update status",
        });
      }
    });

    // DELETE job application
    app.delete("/jobs/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const query = {
          _id: new ObjectId(id),
        };

        const result = await jobsCollection.deleteOne(query);

        res.send(result);
      } catch (error) {
        console.error("Error deleting job:", error);

        res.status(500).send({
          message: "Failed to delete job application",
        });
      }
    });

    // Test MongoDB connection
    await client.db("admin").command({
      ping: 1,
    });

    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

run().catch(console.dir);

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.send("CareerTrack Server!");
});

// =====================================================
// START SERVER
// =====================================================

app.listen(port, () => {
  console.log(`CareerTrack server listening on port ${port}`);
});
