import express, { json } from "express";
import {MongoClient,ObjectId} from "mongodb";
import cors from 'cors'

let app = express();
let port = 5800;

// data base connection 
let db;
(async () => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017");
    db = client.db("userDB");
    let usercollection = db.collection("userdata");
    console.log(usercollection);
    console.log("db is connectd");
  } catch (err) {
    console.log("failed to connect with db", err);
  }
})();

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173",
}))

// api cheching 
app.get("/", (req, res) => {
  res.send("api working ");
});

// get api
app.get("/skills",async (req,res)=>{
    try{
        const skillsdata=await db.collection("userdata").find({ deleted: false }).toArray();
        console.log("skillsdata",skillsdata)
        res.json(skillsdata)

        // skillsdata.forEach((skill) => {
        //   if (!skill.used_by) {
        //     skill.used_by = "NA";
        //   }
        // });
        // res.json(skillsdata)
    }
    catch(err){
console.log("failed to get datafrom db",err);
res.status(500).send("failed to get skilleddata");
    }
})


// for multiple ids
app.delete("/skills", async (req, res) => {
  try {
    const { ids } = req.body;
    const objectIds = ids.map((id) => new ObjectId(id));

    const result = await db.collection("userdata").updateMany(
      { _id: { $in: objectIds } },
      { $set: { deleted: true } }
    );

    if (result.matchedCount !== ids.length) {
      throw new Error(`Failed to update userdata with ids ${ids}`);
    }

    res.json(result);
  } catch (err) {
    console.error("Failed to update userdata", err);
    res.status(500).send("Failed to update userdata");
  }
});




app.listen(port, (req, res) => {
  console.log(`server is running on port number ${port}`);
});
