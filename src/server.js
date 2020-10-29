import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the default Gebeya E-commerce API route",
  })
);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

export default app;
