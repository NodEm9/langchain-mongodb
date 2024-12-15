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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = configureRoutes;
const service_database_1 = require("./services/service.database");
const agent_1 = require("./agent");
require("dotenv/config");
function configureRoutes(app) {
    // API endpoint to start a new conversation
    app.post('/chat', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const initialMessage = req.body.message;
        const threadId = Date.now().toString(); // Simple thread ID generation
        try {
            const response = yield (0, agent_1.callAgent)(service_database_1.client, initialMessage, threadId);
            res.json({ threadId, response });
        }
        catch (error) {
            console.error('Error starting conversation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }));
    // API endpoint to send a message in an existing conversation
    app.post('/chat/:threadId', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { threadId } = req.params;
        const { message } = req.body;
        try {
            const response = yield (0, agent_1.callAgent)(service_database_1.client, message, threadId);
            res.json({ response });
        }
        catch (error) {
            console.error('Error in chat:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQU1BLGtDQTBCQztBQS9CRCxrRUFBb0Q7QUFDcEQsbUNBQW9DO0FBQ3BDLHlCQUF1QjtBQUd2QixTQUF3QixlQUFlLENBQUMsR0FBWTtJQUNsRCwyQ0FBMkM7SUFDM0MsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBTyxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7UUFDdEQsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsOEJBQThCO1FBQ3RFLElBQUksQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxpQkFBUyxFQUFDLHlCQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ25FLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNuQyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDckQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO1FBQzNELENBQUM7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBRUgsNkRBQTZEO0lBQzdELEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBTyxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7UUFDaEUsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDaEMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDN0IsSUFBSSxDQUFDO1lBQ0gsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLGlCQUFTLEVBQUMseUJBQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUQsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQztRQUMzRCxDQUFDO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgRXhwcmVzcyB9IGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7IGNsaWVudCB9IGZyb20gJy4vc2VydmljZXMvc2VydmljZS5kYXRhYmFzZSdcclxuaW1wb3J0IHsgY2FsbEFnZW50IH0gZnJvbSAnLi9hZ2VudCc7XHJcbmltcG9ydCAnZG90ZW52L2NvbmZpZyc7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29uZmlndXJlUm91dGVzKGFwcDogRXhwcmVzcykge1xyXG4gIC8vIEFQSSBlbmRwb2ludCB0byBzdGFydCBhIG5ldyBjb252ZXJzYXRpb25cclxuICBhcHAucG9zdCgnL2NoYXQnLCBhc3luYyAocmVxOiBSZXF1ZXN0LCByZXM6IFJlc3BvbnNlKSA9PiB7XHJcbiAgICBjb25zdCBpbml0aWFsTWVzc2FnZSA9IHJlcS5ib2R5Lm1lc3NhZ2U7XHJcbiAgICBjb25zdCB0aHJlYWRJZCA9IERhdGUubm93KCkudG9TdHJpbmcoKTsgLy8gU2ltcGxlIHRocmVhZCBJRCBnZW5lcmF0aW9uXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNhbGxBZ2VudChjbGllbnQsIGluaXRpYWxNZXNzYWdlLCB0aHJlYWRJZCk7XHJcbiAgICAgIHJlcy5qc29uKHsgdGhyZWFkSWQsIHJlc3BvbnNlIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc3RhcnRpbmcgY29udmVyc2F0aW9uOicsIGVycm9yKTtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogJ0ludGVybmFsIHNlcnZlciBlcnJvcicgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIEFQSSBlbmRwb2ludCB0byBzZW5kIGEgbWVzc2FnZSBpbiBhbiBleGlzdGluZyBjb252ZXJzYXRpb25cclxuICBhcHAucG9zdCgnL2NoYXQvOnRocmVhZElkJywgYXN5bmMgKHJlcTogUmVxdWVzdCwgcmVzOiBSZXNwb25zZSkgPT4ge1xyXG4gICAgY29uc3QgeyB0aHJlYWRJZCB9ID0gcmVxLnBhcmFtcztcclxuICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gcmVxLmJvZHk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNhbGxBZ2VudChjbGllbnQsIG1lc3NhZ2UsIHRocmVhZElkKTtcclxuICAgICAgcmVzLmpzb24oeyByZXNwb25zZSB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIGNoYXQ6JywgZXJyb3IpO1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yJyB9KTtcclxuICAgIH1cclxuICB9KTtcclxufSJdfQ==