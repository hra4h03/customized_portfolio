// @ts-nocheck
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mailjet = require("node-mailjet").connect(
  "87eacb6ddcb996a2d6df95fa8bb03b51",
  "115192b08831cf9a19f72fe57e7a1bcc"
);
require("express-session");
const Admin = require("./models/admin.model");
const AdminBro = require("admin-bro");
const AdminBroMongoose = require("admin-bro-mongoose");
const AdminBroExpress = require("admin-bro-expressjs");
const Work = require("./models/works.model");
const About_us = require("./models/about_us.model");
const Person = require("./models/person.model");
const Social = require("./models/social.model");
const WorkCategory = require("./models/work_category.model");
const app = express();

(async () => {
  try {
    dotenv.config();
    const PORT = process.env.PORT || 5000;
    // @ts-ignore
    const connection = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    AdminBro.registerAdapter(AdminBroMongoose);

    const contentParent = {
      name: "Portfolio",
    };
    const userParent = {
      name: "Admin Users",
      icon: "Settings",
    };
    const adminBro = new AdminBro({
      databases: [connection],
      rootPath: "/admin",
      resources: [
        {
          resource: Work,
          options: {
            parent: contentParent,
          },
        },
        {
          resource: WorkCategory,
          options: {
            parent: contentParent,
          },
        },
        {
          resource: About_us,
          options: {
            parent: contentParent,
          },
        },
        {
          resource: Social,
          options: {
            parent: contentParent,
          },
        },
        {
          resource: Person,
          options: {
            parent: contentParent,
          },
        },
        {
          resource: Admin,
          options: {
            parent: userParent,
          },
        },
      ],
      branding: {
        companyName: "Portfolio",
      },
    });

    const ADMIN = {
      email: process.env.EMAIL || "test@example.com",
      password: process.env.PASSWORD || "password",
    };

    const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
      authenticate: async (email, password) => {
        const user = await Admin.findOne({ email });
        if (user && user.password === password) {
          return user;
        } else if (ADMIN.password === password && ADMIN.email === email) {
          return ADMIN;
        }
        return null;
      },
      cookieName: "adminbro",
      cookiePassword: process.env.COOKIE_SECRET,
    });

    app.use(adminBro.options.rootPath, router);

    app.listen(PORT, () =>
      console.log(`server started at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(`server error: `, error.message);
    process.exit(1);
  }
})();

app.use(bodyParser.json());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "public"));

app.get("/", async (req, res) => {
  const { who_i_am, what_i_do } = await About_us.findOne({});
  const person = await Person.findOne({});
  const social = await Social.findOne({});

  const work_categories = await WorkCategory.find({}).populate({
    path: "works",
  });
  // console.log(work_categories);
  res.render("index", {
    work_categories,
    work_text: "hii",
    who_i_am,
    what_i_do,
    person,
    social,
  });
});

app.post("/send", (req, res) => {
  console.log(req.body);

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.EMAIL,
          Name: req.body.name,
        },
        To: [
          {
            Email: process.env.EMAIL,
            Name: "Hrach",
          },
        ],
        Subject: `Greetings from ${req.body.name}`,
        TextPart: "My first Mailjet email",
        HTMLPart: `
            <h3>email: ${req.body.email}</h3>
            <h3>name: ${req.body.name}</h3>
            <p>message: ${req.body.message}</p>
          `,
        CustomID: "AppGettingStartedTest",
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });

  res.redirect("/");
});
