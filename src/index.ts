import express, { Express } from "express";
import ErrorHandler from "./middlewares/errorHandler";
import 'dotenv/config';
import { main } from "./services/service.database";



class App {
  private static instance: App;
  private app: Express;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeErrorHandling();
  }

  public initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public initializeErrorHandling() {
    this.app.use(new ErrorHandler().errorHandler);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new App();
    }
    return this.instance.app;
  }

  public listen() {
    this.app.listen(process.env.PORT,  async () => {
      await main();
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  }
}

export default App.getInstance();