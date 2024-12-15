import express, { Express } from "express";
import ErrorHandler from "./middlewares/errorHandler";
import { main } from "./services/service.database";
import configureRoutes from "./routes";
import 'dotenv/config';


class App {
  private static instance: App;
  private app: Express;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeErrorHandling();
    this.app.get('/', (req, res) => {
      res.send('LangGraph Agent Server');
    });
    configureRoutes(this.app);
  }

  public initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public initializeErrorHandling() {
    const handleError = new ErrorHandler();
    this.app.use(handleError.errorHandler);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new App();
    }
    return this.instance.app;
  }

  public listen() {
    this.app.listen(process.env.PORT, async () => {
      console.log(`Server running on http://localhost:5000`);
      await main();
    });
  }
}

export default App;