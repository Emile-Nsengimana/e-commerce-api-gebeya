import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "../swagger.json";
import dotenv from 'dotenv';
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

// Swagger ui documentation
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc));

app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the default Gebeya E-commerce API route",
  })
);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

export default app;
