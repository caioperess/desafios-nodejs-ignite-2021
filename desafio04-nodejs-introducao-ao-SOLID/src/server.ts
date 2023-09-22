import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { app } from ".";

const swaggerFile = YAML.load(path.resolve(__dirname, "./swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3333, () => console.log("Server is running!"));
