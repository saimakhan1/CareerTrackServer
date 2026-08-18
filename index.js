// // const express = require("express");
// // const cors = require("cors");
// // const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const { OAuth2Client } = require("google-auth-library");

// // require("dotenv").config();

// // const app = express();
// // const port = process.env.PORT || 3000;

// // const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";
// // const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// // app.use(
// //   cors({
// //     origin: true,
// //     credentials: true,
// //   }),
// // );

// // app.use(express.json());

// // const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldizubn.mongodb.net/?appName=Cluster0`;

// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   },
// // });

// // // =====================================================
// // // AUTH MIDDLEWARE
// // // =====================================================

// // const verifyToken = (req, res, next) => {
// //   try {
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader) {
// //       return res.status(401).json({
// //         message: "Unauthorized access. Token is required.",
// //       });
// //     }

// //     if (!authHeader.startsWith("Bearer ")) {
// //       return res.status(401).json({
// //         message: "Unauthorized access. Invalid authorization format.",
// //       });
// //     }

// //     const token = authHeader.split(" ")[1];

// //     if (!token) {
// //       return res.status(401).json({
// //         message: "Unauthorized access. Token is missing.",
// //       });
// //     }

// //     const decoded = jwt.verify(token, JWT_SECRET);

// //     if (!decoded.id) {
// //       return res.status(401).json({
// //         message: "Unauthorized access. Invalid user information.",
// //       });
// //     }

// //     // Make sure the ID in JWT is a valid MongoDB ObjectId
// //     if (!ObjectId.isValid(decoded.id)) {
// //       return res.status(401).json({
// //         message: "Unauthorized access. Invalid user ID.",
// //       });
// //     }

// //     req.user = {
// //       id: decoded.id,
// //       email: decoded.email,
// //       name: decoded.name,
// //     };

// //     next();
// //   } catch (error) {
// //     console.error("Token verification error:", error);

// //     return res.status(401).json({
// //       message: "Unauthorized access. Invalid or expired token.",
// //     });
// //   }
// // };

// // // =====================================================
// // // SERVER
// // // =====================================================

// // async function run() {
// //   try {
// //     await client.connect();

// //     const db = client.db("careerTrack_db");

// //     const usersCollection = db.collection("users");
// //     const jobsCollection = db.collection("jobs");

// //     // =====================================================
// //     // REGISTER
// //     // =====================================================

// //     app.post("/register", async (req, res) => {
// //       try {
// //         const { name, email, password } = req.body;

// //         if (!name || !email || !password) {
// //           return res.status(400).json({
// //             message: "All fields are required.",
// //           });
// //         }

// //         const normalizedEmail = email.trim().toLowerCase();

// //         const existingUser = await usersCollection.findOne({
// //           email: normalizedEmail,
// //         });

// //         if (existingUser) {
// //           return res.status(400).json({
// //             message: "User with this email already exists.",
// //           });
// //         }

// //         const hashedPassword = await bcrypt.hash(password, 10);

// //         const newUser = {
// //           name: name.trim(),
// //           email: normalizedEmail,
// //           password: hashedPassword,
// //           authProvider: "credentials",
// //           createdAt: new Date(),
// //         };

// //         const result = await usersCollection.insertOne(newUser);

// //         const token = jwt.sign(
// //           {
// //             id: result.insertedId.toString(),
// //             email: normalizedEmail,
// //             name: name.trim(),
// //           },
// //           JWT_SECRET,
// //           {
// //             expiresIn: "7d",
// //           },
// //         );

// //         return res.status(201).json({
// //           message: "User registered successfully.",
// //           token,
// //           user: {
// //             id: result.insertedId.toString(),
// //             name: name.trim(),
// //             email: normalizedEmail,
// //           },
// //         });
// //       } catch (error) {
// //         console.error("Register Error:", error);

// //         return res.status(500).json({
// //           message: "Internal server error.",
// //         });
// //       }
// //     });

// //     // =====================================================
// //     // LOGIN
// //     // =====================================================

// //     app.post("/login", async (req, res) => {
// //       try {
// //         const { email, password } = req.body;

// //         if (!email || !password) {
// //           return res.status(400).json({
// //             message: "Email and password are required.",
// //           });
// //         }

// //         const normalizedEmail = email.trim().toLowerCase();

// //         const user = await usersCollection.findOne({
// //           email: normalizedEmail,
// //         });

// //         if (!user) {
// //           return res.status(400).json({
// //             message: "Invalid email or password.",
// //           });
// //         }

// //         if (!user.password) {
// //           return res.status(400).json({
// //             message:
// //               "This account was created with Google. Please continue with Google.",
// //           });
// //         }

// //         const isMatch = await bcrypt.compare(password, user.password);

// //         if (!isMatch) {
// //           return res.status(400).json({
// //             message: "Invalid email or password.",
// //           });
// //         }

// //         const token = jwt.sign(
// //           {
// //             id: user._id.toString(),
// //             email: user.email,
// //             name: user.name,
// //           },
// //           JWT_SECRET,
// //           {
// //             expiresIn: "7d",
// //           },
// //         );

// //         return res.status(200).json({
// //           message: "Logged in successfully.",
// //           token,
// //           user: {
// //             id: user._id.toString(),
// //             name: user.name,
// //             email: user.email,
// //             picture: user.picture || "",
// //           },
// //         });
// //       } catch (error) {
// //         console.error("Login Error:", error);

// //         return res.status(500).json({
// //           message: "Internal server error.",
// //         });
// //       }
// //     });

// //     // =====================================================
// //     // GOOGLE LOGIN
// //     // =====================================================

// //     app.post("/google-login", async (req, res) => {
// //       try {
// //         const { credential } = req.body;

// //         if (!credential) {
// //           return res.status(400).json({
// //             message: "Google credential is required.",
// //           });
// //         }

// //         if (!GOOGLE_CLIENT_ID) {
// //           return res.status(500).json({
// //             message: "Google Client ID is not configured on the server.",
// //           });
// //         }

// //         const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// //         const ticket = await googleClient.verifyIdToken({
// //           idToken: credential,
// //           audience: GOOGLE_CLIENT_ID,
// //         });

// //         const payload = ticket.getPayload();

// //         const googleId = payload.sub;
// //         const email = payload.email;
// //         const name = payload.name;
// //         const picture = payload.picture;

// //         if (!email || !payload.email_verified) {
// //           return res.status(400).json({
// //             message: "Google account could not be verified.",
// //           });
// //         }

// //         const normalizedEmail = email.trim().toLowerCase();

// //         let user = await usersCollection.findOne({
// //           email: normalizedEmail,
// //         });

// //         if (!user) {
// //           const newUser = {
// //             name: name || "Google User",
// //             email: normalizedEmail,
// //             googleId,
// //             picture: picture || "",
// //             authProvider: "google",
// //             createdAt: new Date(),
// //           };

// //           const result = await usersCollection.insertOne(newUser);

// //           user = {
// //             _id: result.insertedId,
// //             ...newUser,
// //           };
// //         } else {
// //           await usersCollection.updateOne(
// //             {
// //               _id: user._id,
// //             },
// //             {
// //               $set: {
// //                 googleId,
// //                 picture: picture || user.picture || "",
// //                 authProvider: "google",
// //               },
// //             },
// //           );
// //         }

// //         const token = jwt.sign(
// //           {
// //             id: user._id.toString(),
// //             email: user.email,
// //             name: user.name,
// //           },
// //           JWT_SECRET,
// //           {
// //             expiresIn: "7d",
// //           },
// //         );

// //         return res.status(200).json({
// //           message: "Google login successful.",
// //           token,
// //           user: {
// //             id: user._id.toString(),
// //             name: user.name,
// //             email: user.email,
// //             picture: picture || user.picture || "",
// //           },
// //         });
// //       } catch (error) {
// //         console.error("Google Login Error:", error);

// //         return res.status(401).json({
// //           message: "Google authentication failed.",
// //         });
// //       }
// //     });

// //     // =====================================================
// //     // GET CURRENT USER
// //     // =====================================================

// //     app.get("/me", verifyToken, async (req, res) => {
// //       try {
// //         const userId = new ObjectId(req.user.id);

// //         const user = await usersCollection.findOne(
// //           { _id: userId },
// //           {
// //             projection: {
// //               password: 0,
// //             },
// //           },
// //         );

// //         if (!user) {
// //           return res.status(404).json({
// //             message: "User not found.",
// //           });
// //         }

// //         return res.status(200).json({
// //           id: user._id.toString(),
// //           name: user.name,
// //           email: user.email,
// //           picture: user.picture || "",
// //         });
// //       } catch (error) {
// //         console.error("Current User Error:", error);

// //         return res.status(500).json({
// //           message: "Failed to get current user.",
// //         });
// //       }
// //     });

// //     // =====================================================
// //     // GET JOB APPLICATIONS
// //     //
// //     // VERY IMPORTANT:
// //     // ONLY jobs belonging to req.user.id are returned.
// //     // =====================================================

// //     app.get("/jobs", verifyToken, async (req, res) => {
// //       try {
// //         const userId = new ObjectId(req.user.id);

// //         const jobs = await jobsCollection
// //           .find({
// //             userId: userId,
// //           })
// //           .sort({
// //             createdAt: -1,
// //           })
// //           .toArray();

// //         return res.status(200).json(jobs);
// //       } catch (error) {
// //         console.error("GET /jobs Error:", error);

// //         return res.status(500).json({
// //           message: "Failed to fetch job applications.",
// //         });
// //       }
// //     });

// //     // =====================================================
// //     // CREATE JOB APPLICATION
// //     //
// //     // NEVER accept userId from frontend.
// //     // userId ALWAYS comes from JWT.
// //     // =====================================================

// //     app.post("/jobs", verifyToken, async (req, res) => {
// //       try {
// //         const userId = new ObjectId(req.user.id);

// //         const { companyName, jobTitle, source, status, notes } = req.body;

// //         if (!companyName || !jobTitle) {
// //           return res.status(400).json({
// //             message: "Company name and job title are required.",
// //           });
// //         }

// //         const newJob = {
// //           companyName: companyName.trim(),
// //           jobTitle: jobTitle.trim(),
// //           source: source || "LinkedIn",
// //           status: status || "Pending",
// //           notes: notes || "",

// //           // THIS IS THE OWNER
// //           userId: userId,

// //           createdAt: new Date(),
// //           updatedAt: new Date(),
// //         };

// //         const result = await jobsCollection.insertOne(newJob);

// //         return res.status(201).json({
// //           message: "Job application created successfully.",
// //           job: {
// //             _id: result.insertedId,
// //             ...newJob,
// //           },
// //         });
// //       } catch (error) {
// //         console.error("POST /jobs Error:", error);

// //         return res.status(500).json({
// //           message: "Failed to create job application.",
// //         });
// //       }
// //     });

// //     // =====================================================
// //     // UPDATE JOB STATUS
// //     //
// //     // BOTH _id AND userId MUST MATCH.
// //     // =====================================================

// //     app.patch("/jobs/:id", verifyToken, async (req, res) => {
// //       try {
// //         const jobId = req.params.id;
// //         const userId = new ObjectId(req.user.id);

// //         if (!ObjectId.isValid(jobId)) {
// //           return res.status(400).json({
// //             message: "Invalid job ID.",
// //           });
// //         }

// //         const allowedStatuses = ["Pending", "Interview", "Offer", "Rejected"];

// //         const { status } = req.body;

// //         if (!allowedStatuses.includes(status)) {
// //           return res.status(400).json({
// //             message: "Invalid application status.",
// //           });
// //         }

// //         const filter = {
// //           _id: new ObjectId(jobId),

// //           // CRITICAL SECURITY CONDITION
// //           userId: userId,
// //         };

// //         const update = {
// //           $set: {
// //             status,
// //             updatedAt: new Date(),
// //           },
// //         };

// //         const result = await jobsCollection.updateOne(filter, update);

// //         if (result.matchedCount === 0) {
// //           return res.status(404).json({
// //             message:
// //               "Application not found or you do not have permission to update it.",
// //           });
// //         }

// //         return res.status(200).json({
// //           message: "Application status updated successfully.",
// //         });
// //       } catch (error) {
// //         console.error("PATCH /jobs/:id Error:", error);

// //         return res.status(500).json({
// //           message: "Failed to update application status.",
// //         });
// //       }
// //     });

// //     // =====================================================
// //     // DELETE JOB
// //     //
// //     // BOTH _id AND userId MUST MATCH.
// //     // =====================================================

// //     app.delete("/jobs/:id", verifyToken, async (req, res) => {
// //       try {
// //         const jobId = req.params.id;
// //         const userId = new ObjectId(req.user.id);

// //         if (!ObjectId.isValid(jobId)) {
// //           return res.status(400).json({
// //             message: "Invalid job ID.",
// //           });
// //         }

// //         const result = await jobsCollection.deleteOne({
// //           _id: new ObjectId(jobId),

// //           // CRITICAL SECURITY CONDITION
// //           userId: userId,
// //         });

// //         if (result.deletedCount === 0) {
// //           return res.status(404).json({
// //             message:
// //               "Application not found or you do not have permission to delete it.",
// //           });
// //         }

// //         return res.status(200).json({
// //           message: "Application deleted successfully.",
// //         });
// //       } catch (error) {
// //         console.error("DELETE /jobs/:id Error:", error);

// //         return res.status(500).json({
// //           message: "Failed to delete application.",
// //         });
// //       }
// //     });

// //     // =====================================================
// //     // MONGODB TEST
// //     // =====================================================

// //     await client.db("admin").command({
// //       ping: 1,
// //     });

// //     console.log("Connected to MongoDB successfully!");
// //   } catch (error) {
// //     console.error("MongoDB Connection Error:", error);
// //   }
// // }

// // run().catch(console.dir);

// // // =====================================================
// // // ROOT
// // // =====================================================

// // app.get("/", (req, res) => {
// //   res.send("CareerTrack Server!");
// // });

// // // =====================================================
// // // START SERVER
// // // =====================================================

// // app.listen(port, () => {
// //   console.log(`CareerTrack server listening on port ${port}`);
// // });

// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { OAuth2Client } = require("google-auth-library");

// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 3000;

// const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// // =====================================================
// // MIDDLEWARE
// // =====================================================

// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   }),
// );

// // IMPORTANT:
// // Profile images are currently stored as Base64 strings.
// // 5MB gives enough room for your frontend's 2MB image limit.
// app.use(
//   express.json({
//     limit: "5mb",
//   }),
// );

// app.use(
//   express.urlencoded({
//     extended: true,
//     limit: "5mb",
//   }),
// );

// // =====================================================
// // MONGODB
// // =====================================================

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldizubn.mongodb.net/?appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// // =====================================================
// // AUTH MIDDLEWARE
// // =====================================================

// const verifyToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access. Token is required.",
//       });
//     }

//     if (!authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access. Invalid authorization format.",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access. Token is missing.",
//       });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);

//     if (!decoded.id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access. Invalid user information.",
//       });
//     }

//     if (!ObjectId.isValid(decoded.id)) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access. Invalid user ID.",
//       });
//     }

//     req.user = {
//       id: decoded.id,
//       email: decoded.email,
//       name: decoded.name,
//     };

//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);

//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized access. Invalid or expired token.",
//     });
//   }
// };

// // =====================================================
// // HELPER
// // =====================================================

// // Convert MongoDB user document into safe frontend user object.
// // IMPORTANT:
// // We use "image" consistently throughout the application.
// const formatUser = (user) => {
//   if (!user) {
//     return null;
//   }

//   return {
//     id: user._id?.toString(),

//     name: user.name || "",

//     email: user.email || "",

//     role: user.role || "Job Seeker",

//     bio: user.bio || "",

//     location: user.location || "",

//     // New standard field
//     image: user.image || user.picture || "",

//     authProvider: user.authProvider || "credentials",

//     createdAt: user.createdAt || null,

//     updatedAt: user.updatedAt || null,
//   };
// };

// // =====================================================
// // SERVER
// // =====================================================

// async function run() {
//   try {
//     await client.connect();

//     const db = client.db("careerTrack_db");

//     const usersCollection = db.collection("users");
//     const jobsCollection = db.collection("jobs");

//     console.log("Connected to MongoDB successfully!");

//     // =====================================================
//     // REGISTER
//     // =====================================================

//     app.post("/register", async (req, res) => {
//       try {
//         const { name, email, password } = req.body;

//         if (!name || !email || !password) {
//           return res.status(400).json({
//             success: false,
//             message: "All fields are required.",
//           });
//         }

//         const trimmedName = name.trim();
//         const normalizedEmail = email.trim().toLowerCase();

//         if (trimmedName.length < 2) {
//           return res.status(400).json({
//             success: false,
//             message: "Name must contain at least 2 characters.",
//           });
//         }

//         if (password.length < 6) {
//           return res.status(400).json({
//             success: false,
//             message: "Password must contain at least 6 characters.",
//           });
//         }

//         const existingUser = await usersCollection.findOne({
//           email: normalizedEmail,
//         });

//         if (existingUser) {
//           return res.status(400).json({
//             success: false,
//             message: "User with this email already exists.",
//           });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = {
//           name: trimmedName,
//           email: normalizedEmail,

//           password: hashedPassword,

//           role: "Job Seeker",

//           bio: "",

//           location: "",

//           // IMPORTANT
//           image: "",

//           authProvider: "credentials",

//           createdAt: new Date(),

//           updatedAt: new Date(),
//         };

//         const result = await usersCollection.insertOne(newUser);

//         const token = jwt.sign(
//           {
//             id: result.insertedId.toString(),
//             email: normalizedEmail,
//             name: trimmedName,
//           },
//           JWT_SECRET,
//           {
//             expiresIn: "7d",
//           },
//         );

//         const createdUser = {
//           _id: result.insertedId,
//           ...newUser,
//         };

//         return res.status(201).json({
//           success: true,

//           message: "User registered successfully.",

//           token,

//           user: formatUser(createdUser),
//         });
//       } catch (error) {
//         console.error("Register Error:", error);

//         return res.status(500).json({
//           success: false,
//           message: "Internal server error.",
//         });
//       }
//     });

//     // =====================================================
//     // LOGIN
//     // =====================================================

//     app.post("/login", async (req, res) => {
//       try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//           return res.status(400).json({
//             success: false,
//             message: "Email and password are required.",
//           });
//         }

//         const normalizedEmail = email.trim().toLowerCase();

//         const user = await usersCollection.findOne({
//           email: normalizedEmail,
//         });

//         if (!user) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid email or password.",
//           });
//         }

//         if (!user.password) {
//           return res.status(400).json({
//             success: false,
//             message:
//               "This account was created with Google. Please continue with Google.",
//           });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid email or password.",
//           });
//         }

//         const token = jwt.sign(
//           {
//             id: user._id.toString(),
//             email: user.email,
//             name: user.name,
//           },
//           JWT_SECRET,
//           {
//             expiresIn: "7d",
//           },
//         );

//         return res.status(200).json({
//           success: true,

//           message: "Logged in successfully.",

//           token,

//           user: formatUser(user),
//         });
//       } catch (error) {
//         console.error("Login Error:", error);

//         return res.status(500).json({
//           success: false,
//           message: "Internal server error.",
//         });
//       }
//     });

//     // =====================================================
//     // GOOGLE LOGIN
//     // =====================================================

//     app.post("/google-login", async (req, res) => {
//       try {
//         const { credential } = req.body;

//         if (!credential) {
//           return res.status(400).json({
//             success: false,
//             message: "Google credential is required.",
//           });
//         }

//         if (!GOOGLE_CLIENT_ID) {
//           return res.status(500).json({
//             success: false,
//             message: "Google Client ID is not configured on the server.",
//           });
//         }

//         const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

//         const ticket = await googleClient.verifyIdToken({
//           idToken: credential,
//           audience: GOOGLE_CLIENT_ID,
//         });

//         const payload = ticket.getPayload();

//         const googleId = payload.sub;

//         const email = payload.email;

//         const name = payload.name;

//         const picture = payload.picture;

//         if (!email || !payload.email_verified) {
//           return res.status(400).json({
//             success: false,
//             message: "Google account could not be verified.",
//           });
//         }

//         const normalizedEmail = email.trim().toLowerCase();

//         let user = await usersCollection.findOne({
//           email: normalizedEmail,
//         });

//         if (!user) {
//           const newUser = {
//             name: name || "Google User",

//             email: normalizedEmail,

//             googleId,

//             // IMPORTANT:
//             // Store Google image in "image"
//             image: picture || "",

//             role: "Job Seeker",

//             bio: "",

//             location: "",

//             authProvider: "google",

//             createdAt: new Date(),

//             updatedAt: new Date(),
//           };

//           const result = await usersCollection.insertOne(newUser);

//           user = {
//             _id: result.insertedId,

//             ...newUser,
//           };
//         } else {
//           // Do not overwrite a custom profile image
//           // if the user already has one.
//           const updateData = {
//             googleId,

//             authProvider: "google",

//             updatedAt: new Date(),
//           };

//           if (!user.image && picture) {
//             updateData.image = picture;
//           }

//           await usersCollection.updateOne(
//             {
//               _id: user._id,
//             },
//             {
//               $set: updateData,
//             },
//           );

//           user = await usersCollection.findOne({
//             _id: user._id,
//           });
//         }

//         const token = jwt.sign(
//           {
//             id: user._id.toString(),

//             email: user.email,

//             name: user.name,
//           },
//           JWT_SECRET,
//           {
//             expiresIn: "7d",
//           },
//         );

//         return res.status(200).json({
//           success: true,

//           message: "Google login successful.",

//           token,

//           user: formatUser(user),
//         });
//       } catch (error) {
//         console.error("Google Login Error:", error);

//         return res.status(401).json({
//           success: false,
//           message: "Google authentication failed.",
//         });
//       }
//     });

//     // =====================================================
//     // GET CURRENT USER
//     // GET /me
//     // =====================================================

//     app.get("/me", verifyToken, async (req, res) => {
//       try {
//         const userId = new ObjectId(req.user.id);

//         const user = await usersCollection.findOne(
//           {
//             _id: userId,
//           },
//           {
//             projection: {
//               password: 0,
//             },
//           },
//         );

//         if (!user) {
//           return res.status(404).json({
//             success: false,
//             message: "User not found.",
//           });
//         }

//         return res.status(200).json({
//           success: true,

//           user: formatUser(user),
//         });
//       } catch (error) {
//         console.error("GET /me Error:", error);

//         return res.status(500).json({
//           success: false,
//           message: "Failed to get current user.",
//         });
//       }
//     });

//     // =====================================================
//     // UPDATE CURRENT USER PROFILE
//     // PUT /me
//     //
//     // THIS IS THE IMPORTANT NEW ROUTE
//     // =====================================================

//     app.put("/me", verifyToken, async (req, res) => {
//       try {
//         const userId = new ObjectId(req.user.id);

//         const { name, role, bio, location, image } = req.body;

//         // =================================================
//         // VALIDATE NAME
//         // =================================================

//         if (typeof name !== "string" || !name.trim()) {
//           return res.status(400).json({
//             success: false,
//             message: "Name is required.",
//           });
//         }

//         const trimmedName = name.trim();

//         if (trimmedName.length < 2) {
//           return res.status(400).json({
//             success: false,
//             message: "Name must contain at least 2 characters.",
//           });
//         }

//         // =================================================
//         // VALIDATE IMAGE
//         // =================================================

//         let profileImage = "";

//         if (typeof image === "string") {
//           profileImage = image;
//         }

//         // Allow either an empty image or Base64/data URL.
//         // Your frontend already limits uploads to 2MB.
//         if (profileImage && !profileImage.startsWith("data:image/")) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid profile image format.",
//           });
//         }

//         // =================================================
//         // UPDATE DATA
//         // =================================================

//         const updateData = {
//           name: trimmedName,

//           role:
//             typeof role === "string" && role.trim()
//               ? role.trim()
//               : "Job Seeker",

//           bio: typeof bio === "string" ? bio.trim() : "",

//           location: typeof location === "string" ? location.trim() : "",

//           // IMPORTANT:
//           // Always save image as "image"
//           image: profileImage,

//           updatedAt: new Date(),
//         };

//         // =================================================
//         // UPDATE MONGODB
//         // =================================================

//         const result = await usersCollection.updateOne(
//           {
//             _id: userId,
//           },
//           {
//             $set: updateData,

//             // Remove old "picture" field if it exists.
//             $unset: {
//               picture: "",
//             },
//           },
//         );

//         if (result.matchedCount === 0) {
//           return res.status(404).json({
//             success: false,
//             message: "User not found.",
//           });
//         }

//         // =================================================
//         // GET UPDATED USER
//         // =================================================

//         const updatedUser = await usersCollection.findOne(
//           {
//             _id: userId,
//           },
//           {
//             projection: {
//               password: 0,
//             },
//           },
//         );

//         if (!updatedUser) {
//           return res.status(404).json({
//             success: false,
//             message: "User was updated but could not be retrieved.",
//           });
//         }

//         // =================================================
//         // RETURN UPDATED USER
//         // =================================================

//         return res.status(200).json({
//           success: true,

//           message: "Profile updated successfully.",

//           user: formatUser(updatedUser),
//         });
//       } catch (error) {
//         console.error("PUT /me Error:", error);

//         return res.status(500).json({
//           success: false,
//           message: "Failed to update profile.",
//         });
//       }
//     });

//     // =====================================================
//     // GET JOB APPLICATIONS
//     // =====================================================

//     app.get("/jobs", verifyToken, async (req, res) => {
//       try {
//         const userId = new ObjectId(req.user.id);

//         const jobs = await jobsCollection
//           .find({
//             userId: userId,
//           })
//           .sort({
//             createdAt: -1,
//           })
//           .toArray();

//         return res.status(200).json(jobs);
//       } catch (error) {
//         console.error("GET /jobs Error:", error);

//         return res.status(500).json({
//           success: false,
//           message: "Failed to fetch job applications.",
//         });
//       }
//     });

//     // =====================================================
//     // CREATE JOB APPLICATION
//     // =====================================================

//     app.post("/jobs", verifyToken, async (req, res) => {
//       try {
//         const userId = new ObjectId(req.user.id);

//         const { companyName, jobTitle, source, status, notes } = req.body;

//         if (!companyName || !jobTitle) {
//           return res.status(400).json({
//             success: false,
//             message: "Company name and job title are required.",
//           });
//         }

//         const allowedStatuses = ["Pending", "Interview", "Offer", "Rejected"];

//         const finalStatus = status || "Pending";

//         if (!allowedStatuses.includes(finalStatus)) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid application status.",
//           });
//         }

//         const newJob = {
//           companyName: companyName.trim(),

//           jobTitle: jobTitle.trim(),

//           source: source || "LinkedIn",

//           status: finalStatus,

//           notes: notes || "",

//           userId: userId,

//           createdAt: new Date(),

//           updatedAt: new Date(),
//         };

//         const result = await jobsCollection.insertOne(newJob);

//         return res.status(201).json({
//           success: true,

//           message: "Job application created successfully.",

//           job: {
//             _id: result.insertedId,

//             ...newJob,
//           },
//         });
//       } catch (error) {
//         console.error("POST /jobs Error:", error);

//         return res.status(500).json({
//           success: false,
//           message: "Failed to create job application.",
//         });
//       }
//     });

//     // =====================================================
//     // UPDATE JOB STATUS
//     // =====================================================

//     app.patch("/jobs/:id", verifyToken, async (req, res) => {
//       try {
//         const jobId = req.params.id;

//         const userId = new ObjectId(req.user.id);

//         if (!ObjectId.isValid(jobId)) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid job ID.",
//           });
//         }

//         const allowedStatuses = ["Pending", "Interview", "Offer", "Rejected"];

//         const { status } = req.body;

//         if (!allowedStatuses.includes(status)) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid application status.",
//           });
//         }

//         const filter = {
//           _id: new ObjectId(jobId),

//           userId: userId,
//         };

//         const update = {
//           $set: {
//             status,

//             updatedAt: new Date(),
//           },
//         };

//         const result = await jobsCollection.updateOne(filter, update);

//         if (result.matchedCount === 0) {
//           return res.status(404).json({
//             success: false,
//             message:
//               "Application not found or you do not have permission to update it.",
//           });
//         }

//         return res.status(200).json({
//           success: true,

//           message: "Application status updated successfully.",
//         });
//       } catch (error) {
//         console.error("PATCH /jobs/:id Error:", error);

//         return res.status(500).json({
//           success: false,
//           message: "Failed to update application status.",
//         });
//       }
//     });

//     // =====================================================
//     // DELETE JOB
//     // =====================================================

//     app.delete("/jobs/:id", verifyToken, async (req, res) => {
//       try {
//         const jobId = req.params.id;

//         const userId = new ObjectId(req.user.id);

//         if (!ObjectId.isValid(jobId)) {
//           return res.status(400).json({
//             success: false,
//             message: "Invalid job ID.",
//           });
//         }

//         const result = await jobsCollection.deleteOne({
//           _id: new ObjectId(jobId),

//           userId: userId,
//         });

//         if (result.deletedCount === 0) {
//           return res.status(404).json({
//             success: false,
//             message:
//               "Application not found or you do not have permission to delete it.",
//           });
//         }

//         return res.status(200).json({
//           success: true,

//           message: "Application deleted successfully.",
//         });
//       } catch (error) {
//         console.error("DELETE /jobs/:id Error:", error);

//         return res.status(500).json({
//           success: false,
//           message: "Failed to delete application.",
//         });
//       }
//     });

//     // =====================================================
//     // MONGODB PING
//     // =====================================================

//     await client.db("admin").command({
//       ping: 1,
//     });

//     console.log("MongoDB ping successful!");
//   } catch (error) {
//     console.error("MongoDB Connection Error:", error);
//   }
// }

// // =====================================================
// // START SERVER
// // =====================================================

// run().catch((error) => {
//   console.error("Server startup error:", error);
// });

// // =====================================================
// // ROOT
// // =====================================================

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "CareerTrack Server is running!",
//   });
// });

// // =====================================================
// // 404 HANDLER
// // =====================================================
// //
// // IMPORTANT:
// // This makes sure missing routes return JSON instead
// // of an HTML page. This prevents:
// //
// // Unexpected token '<', "<!DOCTYPE..."
// //
// // =====================================================

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.method} ${req.originalUrl} not found.`,
//   });
// });

// // =====================================================
// // GLOBAL ERROR HANDLER
// // =====================================================

// app.use((error, req, res, next) => {
//   console.error("Global Server Error:", error);

//   res.status(500).json({
//     success: false,
//     message: "Internal server error.",
//   });
// });

// // =====================================================
// // LISTEN
// // =====================================================

// app.listen(port, () => {
//   console.log(`CareerTrack server listening on http://localhost:${port}`);
// });

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

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// IMPORTANT:
// Profile images are currently sent as Base64 JSON.
// Express default JSON limit is only 100kb.
// 5mb allows your 2mb frontend image limit.
app.use(
  express.json({
    limit: "5mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "5mb",
  }),
);

// =====================================================
// MONGODB
// =====================================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldizubn.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized access. Token is required.",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized access. Invalid authorization format.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized access. Token is missing.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        message: "Unauthorized access. Invalid user information.",
      });
    }

    if (!ObjectId.isValid(decoded.id)) {
      return res.status(401).json({
        message: "Unauthorized access. Invalid user ID.",
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);

    return res.status(401).json({
      message: "Unauthorized access. Invalid or expired token.",
    });
  }
};

// =====================================================
// SERVER
// =====================================================

async function run() {
  try {
    await client.connect();

    const db = client.db("careerTrack_db");

    const usersCollection = db.collection("users");
    const jobsCollection = db.collection("jobs");

    // =====================================================
    // REGISTER
    // =====================================================

    app.post("/register", async (req, res) => {
      try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          return res.status(400).json({
            message: "All fields are required.",
          });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();

        const existingUser = await usersCollection.findOne({
          email: normalizedEmail,
        });

        if (existingUser) {
          return res.status(400).json({
            message: "User with this email already exists.",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
          name: trimmedName,
          email: normalizedEmail,
          password: hashedPassword,

          role: "Job Seeker",
          bio: "",
          location: "",
          image: "",

          authProvider: "credentials",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign(
          {
            id: result.insertedId.toString(),
            email: normalizedEmail,
            name: trimmedName,
          },
          JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );

        return res.status(201).json({
          message: "User registered successfully.",
          token,
          user: {
            id: result.insertedId.toString(),
            name: trimmedName,
            email: normalizedEmail,
            role: newUser.role,
            bio: newUser.bio,
            location: newUser.location,
            image: newUser.image,
          },
        });
      } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
          message: "Internal server error.",
        });
      }
    });

    // =====================================================
    // LOGIN
    // =====================================================

    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({
            message: "Email and password are required.",
          });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await usersCollection.findOne({
          email: normalizedEmail,
        });

        if (!user) {
          return res.status(400).json({
            message: "Invalid email or password.",
          });
        }

        if (!user.password) {
          return res.status(400).json({
            message:
              "This account was created with Google. Please continue with Google.",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({
            message: "Invalid email or password.",
          });
        }

        const token = jwt.sign(
          {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          },
          JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );

        return res.status(200).json({
          message: "Logged in successfully.",
          token,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,

            role: user.role || "Job Seeker",
            bio: user.bio || "",
            location: user.location || "",

            // IMPORTANT:
            // Always use image.
            image: user.image || "",
          },
        });
      } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
          message: "Internal server error.",
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
          return res.status(400).json({
            message: "Google credential is required.",
          });
        }

        if (!GOOGLE_CLIENT_ID) {
          return res.status(500).json({
            message: "Google Client ID is not configured on the server.",
          });
        }

        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.name;
        const picture = payload.picture;

        if (!email || !payload.email_verified) {
          return res.status(400).json({
            message: "Google account could not be verified.",
          });
        }

        const normalizedEmail = email.trim().toLowerCase();

        let user = await usersCollection.findOne({
          email: normalizedEmail,
        });

        if (!user) {
          const newUser = {
            name: name || "Google User",
            email: normalizedEmail,

            googleId,

            role: "Job Seeker",
            bio: "",
            location: "",

            // Store Google profile image
            image: picture || "",

            authProvider: "google",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const result = await usersCollection.insertOne(newUser);

          user = {
            _id: result.insertedId,
            ...newUser,
          };
        } else {
          await usersCollection.updateOne(
            {
              _id: user._id,
            },
            {
              $set: {
                googleId,
                updatedAt: new Date(),

                // Keep existing custom image if available.
                // Otherwise use Google's image.
                image: user.image || picture || "",

                authProvider: "google",
              },
            },
          );

          // Get updated user
          user = await usersCollection.findOne({
            _id: user._id,
          });
        }

        const token = jwt.sign(
          {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          },
          JWT_SECRET,
          {
            expiresIn: "7d",
          },
        );

        return res.status(200).json({
          message: "Google login successful.",
          token,
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,

            role: user.role || "Job Seeker",
            bio: user.bio || "",
            location: user.location || "",

            image: user.image || "",
          },
        });
      } catch (error) {
        console.error("Google Login Error:", error);

        return res.status(401).json({
          message: "Google authentication failed.",
        });
      }
    });

    // =====================================================
    // GET CURRENT USER
    // =====================================================

    app.get("/me", verifyToken, async (req, res) => {
      try {
        const userId = new ObjectId(req.user.id);

        const user = await usersCollection.findOne(
          {
            _id: userId,
          },
          {
            projection: {
              password: 0,
            },
          },
        );

        if (!user) {
          return res.status(404).json({
            message: "User not found.",
          });
        }

        return res.status(200).json({
          id: user._id.toString(),

          name: user.name || "User",
          email: user.email || "",

          role: user.role || "Job Seeker",
          bio: user.bio || "",
          location: user.location || "",

          image: user.image || "",
        });
      } catch (error) {
        console.error("Current User Error:", error);

        return res.status(500).json({
          message: "Failed to get current user.",
        });
      }
    });

    // =====================================================
    // UPDATE CURRENT USER PROFILE
    // =====================================================

    app.put("/me", verifyToken, async (req, res) => {
      try {
        const userId = new ObjectId(req.user.id);

        const { name, role, bio, location, image } = req.body;

        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!name || !name.trim()) {
          return res.status(400).json({
            message: "Name is required.",
          });
        }

        // -----------------------------
        // IMAGE VALIDATION
        // -----------------------------

        let finalImage = "";

        if (typeof image === "string") {
          finalImage = image;
        }

        // Prevent accidentally storing huge data.
        // Frontend already limits images to 2MB.
        if (finalImage.length > 5 * 1024 * 1024) {
          return res.status(400).json({
            message: "Profile image is too large.",
          });
        }

        // -----------------------------
        // UPDATE DATA
        // -----------------------------

        const updateData = {
          name: name.trim(),

          role: role?.trim() || "Job Seeker",

          bio: bio?.trim() || "",

          location: location?.trim() || "",

          image: finalImage,

          updatedAt: new Date(),
        };

        const result = await usersCollection.updateOne(
          {
            _id: userId,
          },
          {
            $set: updateData,
          },
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({
            message: "User not found.",
          });
        }

        // -----------------------------
        // GET UPDATED USER
        // -----------------------------

        const updatedUser = await usersCollection.findOne(
          {
            _id: userId,
          },
          {
            projection: {
              password: 0,
            },
          },
        );

        if (!updatedUser) {
          return res.status(404).json({
            message: "Updated user could not be found.",
          });
        }

        // -----------------------------
        // RETURN UPDATED USER
        // -----------------------------

        return res.status(200).json({
          message: "Profile updated successfully.",

          user: {
            id: updatedUser._id.toString(),

            name: updatedUser.name,
            email: updatedUser.email,

            role: updatedUser.role || "Job Seeker",
            bio: updatedUser.bio || "",
            location: updatedUser.location || "",

            image: updatedUser.image || "",
          },
        });
      } catch (error) {
        console.error("PUT /me Error:", error);

        return res.status(500).json({
          message: "Failed to update profile.",
        });
      }
    });

    // =====================================================
    // GET JOB APPLICATIONS
    // =====================================================

    app.get("/jobs", verifyToken, async (req, res) => {
      try {
        const userId = new ObjectId(req.user.id);

        const jobs = await jobsCollection
          .find({
            userId: userId,
          })
          .sort({
            createdAt: -1,
          })
          .toArray();

        return res.status(200).json(jobs);
      } catch (error) {
        console.error("GET /jobs Error:", error);

        return res.status(500).json({
          message: "Failed to fetch job applications.",
        });
      }
    });

    // =====================================================
    // CREATE JOB APPLICATION
    // =====================================================

    app.post("/jobs", verifyToken, async (req, res) => {
      try {
        const userId = new ObjectId(req.user.id);

        const { companyName, jobTitle, source, status, notes } = req.body;

        if (!companyName || !jobTitle) {
          return res.status(400).json({
            message: "Company name and job title are required.",
          });
        }

        const newJob = {
          companyName: companyName.trim(),
          jobTitle: jobTitle.trim(),

          source: source || "LinkedIn",

          status: status || "Pending",

          notes: notes || "",

          userId: userId,

          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const result = await jobsCollection.insertOne(newJob);

        return res.status(201).json({
          message: "Job application created successfully.",

          job: {
            _id: result.insertedId,
            ...newJob,
          },
        });
      } catch (error) {
        console.error("POST /jobs Error:", error);

        return res.status(500).json({
          message: "Failed to create job application.",
        });
      }
    });

    // =====================================================
    // UPDATE JOB STATUS
    // =====================================================

    app.patch("/jobs/:id", verifyToken, async (req, res) => {
      try {
        const jobId = req.params.id;

        const userId = new ObjectId(req.user.id);

        if (!ObjectId.isValid(jobId)) {
          return res.status(400).json({
            message: "Invalid job ID.",
          });
        }

        const allowedStatuses = ["Pending", "Interview", "Offer", "Rejected"];

        const { status } = req.body;

        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({
            message: "Invalid application status.",
          });
        }

        const filter = {
          _id: new ObjectId(jobId),
          userId: userId,
        };

        const update = {
          $set: {
            status,
            updatedAt: new Date(),
          },
        };

        const result = await jobsCollection.updateOne(filter, update);

        if (result.matchedCount === 0) {
          return res.status(404).json({
            message:
              "Application not found or you do not have permission to update it.",
          });
        }

        return res.status(200).json({
          message: "Application status updated successfully.",
        });
      } catch (error) {
        console.error("PATCH /jobs/:id Error:", error);

        return res.status(500).json({
          message: "Failed to update application status.",
        });
      }
    });

    // =====================================================
    // DELETE JOB
    // =====================================================

    app.delete("/jobs/:id", verifyToken, async (req, res) => {
      try {
        const jobId = req.params.id;

        const userId = new ObjectId(req.user.id);

        if (!ObjectId.isValid(jobId)) {
          return res.status(400).json({
            message: "Invalid job ID.",
          });
        }

        const result = await jobsCollection.deleteOne({
          _id: new ObjectId(jobId),
          userId: userId,
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            message:
              "Application not found or you do not have permission to delete it.",
          });
        }

        return res.status(200).json({
          message: "Application deleted successfully.",
        });
      } catch (error) {
        console.error("DELETE /jobs/:id Error:", error);

        return res.status(500).json({
          message: "Failed to delete job application.",
        });
      }
    });

    // =====================================================
    // MONGODB TEST
    // =====================================================

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
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "CareerTrack Server is running!",
  });
});

// =====================================================
// JSON PAYLOAD ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      message:
        "Request payload is too large. Please choose a smaller profile image.",
    });
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      message: "Invalid JSON request.",
    });
  }

  console.error("Server Error:", error);

  return res.status(500).json({
    message: "Internal server error.",
  });
});

// =====================================================
// START SERVER
// =====================================================

app.listen(port, () => {
  console.log(`CareerTrack server listening on port ${port}`);
});
