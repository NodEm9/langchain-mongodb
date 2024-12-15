"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const service_database_1 = require("./services/service.database");
const routes_1 = __importDefault(require("./routes"));
require("dotenv/config");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeErrorHandling();
        this.app.get('/', (req, res) => {
            res.send('LangGraph Agent Server');
        });
        (0, routes_1.default)(this.app);
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    initializeErrorHandling() {
        const handleError = new errorHandler_1.default();
        this.app.use(handleError.errorHandler);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }
        return this.instance.app;
    }
    listen() {
        this.app.listen(process.env.PORT, () => __awaiter(this, void 0, void 0, function* () {
            console.log(`Server running on http://localhost:5000`);
            yield (0, service_database_1.main)();
        }));
    }
}
exports.default = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBMkM7QUFDM0MsOEVBQXNEO0FBQ3RELGtFQUFtRDtBQUNuRCxzREFBdUM7QUFDdkMseUJBQXVCO0FBR3ZCLE1BQU0sR0FBRztJQUlQO1FBQ0UsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDN0IsR0FBRyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBQSxnQkFBZSxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRU0scUJBQXFCO1FBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVNLHVCQUF1QjtRQUM1QixNQUFNLFdBQVcsR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztRQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxXQUFXO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzVCLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO0lBQzNCLENBQUM7SUFFTSxNQUFNO1FBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBUyxFQUFFO1lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUNBQXlDLENBQUMsQ0FBQztZQUN2RCxNQUFNLElBQUEsdUJBQUksR0FBRSxDQUFDO1FBQ2YsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELGtCQUFlLEdBQUcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzLCB7IEV4cHJlc3MgfSBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgRXJyb3JIYW5kbGVyIGZyb20gXCIuL21pZGRsZXdhcmVzL2Vycm9ySGFuZGxlclwiO1xyXG5pbXBvcnQgeyBtYWluIH0gZnJvbSBcIi4vc2VydmljZXMvc2VydmljZS5kYXRhYmFzZVwiO1xyXG5pbXBvcnQgY29uZmlndXJlUm91dGVzIGZyb20gXCIuL3JvdXRlc1wiO1xyXG5pbXBvcnQgJ2RvdGVudi9jb25maWcnO1xyXG5cclxuXHJcbmNsYXNzIEFwcCB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEFwcDtcclxuICBwcml2YXRlIGFwcDogRXhwcmVzcztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmFwcCA9IGV4cHJlc3MoKTtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZU1pZGRsZXdhcmVzKCk7XHJcbiAgICB0aGlzLmluaXRpYWxpemVFcnJvckhhbmRsaW5nKCk7XHJcbiAgICB0aGlzLmFwcC5nZXQoJy8nLCAocmVxLCByZXMpID0+IHtcclxuICAgICAgcmVzLnNlbmQoJ0xhbmdHcmFwaCBBZ2VudCBTZXJ2ZXInKTtcclxuICAgIH0pO1xyXG4gICAgY29uZmlndXJlUm91dGVzKHRoaXMuYXBwKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0aWFsaXplTWlkZGxld2FyZXMoKSB7XHJcbiAgICB0aGlzLmFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xyXG4gICAgdGhpcy5hcHAudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0aWFsaXplRXJyb3JIYW5kbGluZygpIHtcclxuICAgIGNvbnN0IGhhbmRsZUVycm9yID0gbmV3IEVycm9ySGFuZGxlcigpO1xyXG4gICAgdGhpcy5hcHAudXNlKGhhbmRsZUVycm9yLmVycm9ySGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKCkge1xyXG4gICAgaWYgKCF0aGlzLmluc3RhbmNlKSB7XHJcbiAgICAgIHRoaXMuaW5zdGFuY2UgPSBuZXcgQXBwKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5hcHA7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbGlzdGVuKCkge1xyXG4gICAgdGhpcy5hcHAubGlzdGVuKHByb2Nlc3MuZW52LlBPUlQsIGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coYFNlcnZlciBydW5uaW5nIG9uIGh0dHA6Ly9sb2NhbGhvc3Q6NTAwMGApO1xyXG4gICAgICBhd2FpdCBtYWluKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFwcDsiXX0=