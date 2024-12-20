"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        // Capture the stack trace
        Error.captureStackTrace(this, this instanceof AppError ? this.constructor : this);
        if (process.env.NODE_ENV !== 'production') {
            console.log(this.stack);
        }
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.default = AppError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwRXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbGxzL2FwcEVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsTUFBTSxRQUFTLFNBQVEsS0FBSztJQUMxQixZQUNTLFVBQTBCLEVBQzFCLE9BQWU7UUFFdEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBSFIsZUFBVSxHQUFWLFVBQVUsQ0FBZ0I7UUFDMUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUl0QiwwQkFBMEI7UUFDMUIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLFlBQVksUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksRUFBRSxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEQsQ0FBQztDQUNGO0FBRUQsa0JBQWUsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gUHVycG9zZTogQ3VzdG9tIEVycm9yIGNsYXNzIHRvIGhhbmRsZSBBUEkgZXJyb3JzLlxyXG5pbXBvcnQgeyBIdHRwU3RhdHVzQ29kZSB9IGZyb20gJy4uL2NvbnN0YW50cy9odHRwU3RhdHVzQ29kZSc7XHJcblxyXG5cclxuY2xhc3MgQXBwRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgc3RhdHVzQ29kZTogSHR0cFN0YXR1c0NvZGUsXHJcbiAgICBwdWJsaWMgbWVzc2FnZTogc3RyaW5nXHJcbiAgKSB7XHJcbiAgICBzdXBlcihtZXNzYWdlKTtcclxuXHJcbiAgICAvLyBDYXB0dXJlIHRoZSBzdGFjayB0cmFjZVxyXG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcyBpbnN0YW5jZW9mIEFwcEVycm9yID8gdGhpcy5jb25zdHJ1Y3RvciA6IHRoaXMpO1xyXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcclxuICAgICAgY29uc29sZS5sb2codGhpcy5zdGFjayk7XHJcbiAgICB9XHJcblxyXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIEFwcEVycm9yLnByb3RvdHlwZSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcHBFcnJvcjtcclxuIl19