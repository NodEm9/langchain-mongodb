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
require("dotenv/config");
const service_database_1 = require("./services/service.database");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.initializeMiddlewares();
        this.initializeErrorHandling();
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    initializeErrorHandling() {
        this.app.use(new errorHandler_1.default().errorHandler);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new App();
        }
        return this.instance.app;
    }
    listen() {
        this.app.listen(process.env.PORT, () => __awaiter(this, void 0, void 0, function* () {
            yield (0, service_database_1.main)();
            console.log(`Server running on http://localhost:${process.env.PORT}`);
        }));
    }
}
exports.default = App.getInstance();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBMkM7QUFDM0MsOEVBQXNEO0FBQ3RELHlCQUF1QjtBQUN2QixrRUFBbUQ7QUFJbkQsTUFBTSxHQUFHO0lBSVA7UUFDRSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTSxxQkFBcUI7UUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRU0sdUJBQXVCO1FBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksc0JBQVksRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFTSxNQUFNLENBQUMsV0FBVztRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUM1QixDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztJQUMzQixDQUFDO0lBRU0sTUFBTTtRQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFHLEdBQVMsRUFBRTtZQUM1QyxNQUFNLElBQUEsdUJBQUksR0FBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcywgeyBFeHByZXNzIH0gZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IEVycm9ySGFuZGxlciBmcm9tIFwiLi9taWRkbGV3YXJlcy9lcnJvckhhbmRsZXJcIjtcclxuaW1wb3J0ICdkb3RlbnYvY29uZmlnJztcclxuaW1wb3J0IHsgbWFpbiB9IGZyb20gXCIuL3NlcnZpY2VzL3NlcnZpY2UuZGF0YWJhc2VcIjtcclxuXHJcblxyXG5cclxuY2xhc3MgQXBwIHtcclxuICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQXBwO1xyXG4gIHByaXZhdGUgYXBwOiBFeHByZXNzO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuYXBwID0gZXhwcmVzcygpO1xyXG4gICAgdGhpcy5pbml0aWFsaXplTWlkZGxld2FyZXMoKTtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZUVycm9ySGFuZGxpbmcoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0aWFsaXplTWlkZGxld2FyZXMoKSB7XHJcbiAgICB0aGlzLmFwcC51c2UoZXhwcmVzcy5qc29uKCkpO1xyXG4gICAgdGhpcy5hcHAudXNlKGV4cHJlc3MudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbml0aWFsaXplRXJyb3JIYW5kbGluZygpIHtcclxuICAgIHRoaXMuYXBwLnVzZShuZXcgRXJyb3JIYW5kbGVyKCkuZXJyb3JIYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKSB7XHJcbiAgICBpZiAoIXRoaXMuaW5zdGFuY2UpIHtcclxuICAgICAgdGhpcy5pbnN0YW5jZSA9IG5ldyBBcHAoKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmluc3RhbmNlLmFwcDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBsaXN0ZW4oKSB7XHJcbiAgICB0aGlzLmFwcC5saXN0ZW4ocHJvY2Vzcy5lbnYuUE9SVCwgIGFzeW5jICgpID0+IHtcclxuICAgICAgYXdhaXQgbWFpbigpO1xyXG4gICAgICBjb25zb2xlLmxvZyhgU2VydmVyIHJ1bm5pbmcgb24gaHR0cDovL2xvY2FsaG9zdDoke3Byb2Nlc3MuZW52LlBPUlR9YCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFwcC5nZXRJbnN0YW5jZSgpOyJdfQ==