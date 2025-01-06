import app from "src/app";

import environment from "config/environment";

const start = () => {
  try {
    app.listen(environment.port, () =>
      console.log(`Server is running on http://localhost:${environment.port}`),
    );
  } catch (error) {
    console.error(error);
  }
};

start();
