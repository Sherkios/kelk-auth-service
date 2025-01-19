import app from "src/app";

import environment from "config/environment";
import logger from "utils/logger";

const start = () => {
  try {
    app.listen(environment.port, () =>
      logger.info(`Server is running on http://localhost:${environment.port}`),
    );
  } catch (error) {
    console.error(error);
  }
};

start();
