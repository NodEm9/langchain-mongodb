"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utills/appError"));
const zod_1 = require("zod");
const httpStatusCode_1 = require("../constants/httpStatusCode");
const handleZodError = (res, err) => {
    const errors = err.errors.map((error) => {
        return {
            path: error.path.join("."),
            message: error.message,
        };
    });
    return res.status(httpStatusCode_1.BAD_REQUEST).json({
        message: err.message,
        errors,
    });
};
class ErrorHandler {
    constructor() {
        this.errorHandler = (err, req, res, next) => {
            console.log(`PATH: ${req.path} - ${req.method}`, err);
            // const invalidUrl = _req.url.endsWith('/');
            const status = err instanceof appError_1.default ? err.statusCode : 500;
            if (err instanceof zod_1.z.ZodError) {
                handleZodError(res, err);
                return;
            }
            res.status(status).json({
                message: err.message || 'Internal Server Error',
                status,
                success: false
            });
            if (process.env.NODE_ENV !== 'production') {
                console.error(err.stack);
            }
            next();
        };
    }
}
;
exports.default = ErrorHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZGRsZXdhcmVzL2Vycm9ySGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtFQUEwQztBQUcxQyw2QkFBd0I7QUFDeEIsZ0VBQTBEO0FBRzFELE1BQU0sY0FBYyxHQUFHLENBQUMsR0FBYSxFQUFFLEdBQWUsRUFBRSxFQUFFO0lBQ3hELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7UUFDdEMsT0FBTztZQUNMLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDMUIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQ3ZCLENBQUE7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyw0QkFBVyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2xDLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztRQUNwQixNQUFNO0tBQ1AsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxZQUFZO0lBQWxCO1FBQ1MsaUJBQVksR0FBd0IsQ0FDekMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUNuQixFQUFFO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRXRELDZDQUE2QztZQUM3QyxNQUFNLE1BQU0sR0FBRyxHQUFHLFlBQVksa0JBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBRTlELElBQUksR0FBRyxZQUFZLE9BQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDOUIsY0FBYyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDekIsT0FBTztZQUNULENBQUM7WUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDdEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxPQUFPLElBQUksdUJBQXVCO2dCQUMvQyxNQUFNO2dCQUNOLE9BQU8sRUFBRSxLQUFLO2FBQ2YsQ0FBQyxDQUFDO1lBRUgsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLEVBQUUsQ0FBQztnQkFDMUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0IsQ0FBQztZQUNELElBQUksRUFBRSxDQUFDO1FBQ1QsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztDQUFBO0FBQUEsQ0FBQztBQUVGLGtCQUFlLFlBQVksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcHBFcnJvciBmcm9tIFwiLi4vdXRpbGxzL2FwcEVycm9yXCI7XHJcbmltcG9ydCB7IFJlc3BvbnNlIH0gZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IHsgRXJyb3JSZXF1ZXN0SGFuZGxlciB9IGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XHJcbmltcG9ydCB7IEJBRF9SRVFVRVNUIH0gZnJvbSAnLi4vY29uc3RhbnRzL2h0dHBTdGF0dXNDb2RlJztcclxuXHJcblxyXG5jb25zdCBoYW5kbGVab2RFcnJvciA9IChyZXM6IFJlc3BvbnNlLCBlcnI6IHouWm9kRXJyb3IpID0+IHtcclxuICBjb25zdCBlcnJvcnMgPSBlcnIuZXJyb3JzLm1hcCgoZXJyb3IpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHBhdGg6IGVycm9yLnBhdGguam9pbihcIi5cIiksXHJcbiAgICAgIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UsXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiByZXMuc3RhdHVzKEJBRF9SRVFVRVNUKS5qc29uKHtcclxuICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlLFxyXG4gICAgZXJyb3JzLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuY2xhc3MgRXJyb3JIYW5kbGVyIHtcclxuICBwdWJsaWMgZXJyb3JIYW5kbGVyOiBFcnJvclJlcXVlc3RIYW5kbGVyID0gKFxyXG4gICAgZXJyLCByZXEsIHJlcywgbmV4dFxyXG4gICkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coYFBBVEg6ICR7cmVxLnBhdGh9IC0gJHtyZXEubWV0aG9kfWAsIGVycik7XHJcblxyXG4gICAgLy8gY29uc3QgaW52YWxpZFVybCA9IF9yZXEudXJsLmVuZHNXaXRoKCcvJyk7XHJcbiAgICBjb25zdCBzdGF0dXMgPSBlcnIgaW5zdGFuY2VvZiBBcHBFcnJvciA/IGVyci5zdGF0dXNDb2RlIDogNTAwO1xyXG5cclxuICAgIGlmIChlcnIgaW5zdGFuY2VvZiB6LlpvZEVycm9yKSB7XHJcbiAgICAgIGhhbmRsZVpvZEVycm9yKHJlcywgZXJyKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcy5zdGF0dXMoc3RhdHVzKS5qc29uKHtcclxuICAgICAgbWVzc2FnZTogZXJyLm1lc3NhZ2UgfHwgJ0ludGVybmFsIFNlcnZlciBFcnJvcicsXHJcbiAgICAgIHN0YXR1cyxcclxuICAgICAgc3VjY2VzczogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcclxuICAgIH1cclxuICAgIG5leHQoKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBFcnJvckhhbmRsZXI7Il19