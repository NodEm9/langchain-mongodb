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
exports.main = exports.client = void 0;
require("dotenv/config");
const mongodb_1 = require("mongodb");
const env_1 = require("../constants/env");
exports.client = new mongodb_1.MongoClient(env_1.MONGO_URI);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.connect();
        yield exports.client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
    exports.client.close();
});
exports.main = main;
(0, exports.main)().catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5kYXRhYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zZXJ2aWNlLmRhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlCQUF1QjtBQUN2QixxQ0FBc0M7QUFDdEMsMENBQTZDO0FBR2hDLFFBQUEsTUFBTSxHQUFHLElBQUkscUJBQVcsQ0FBQyxlQUFTLENBQUMsQ0FBQztBQUUxQyxNQUFNLElBQUksR0FBRyxHQUFTLEVBQUU7SUFDN0IsSUFBSSxDQUFDO1FBQ0gsTUFBTSxjQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkIsTUFBTSxjQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBQ0QsY0FBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQSxDQUFBO0FBVlksUUFBQSxJQUFJLFFBVWhCO0FBRUQsSUFBQSxZQUFJLEdBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdkb3RlbnYvY29uZmlnJztcclxuaW1wb3J0IHsgTW9uZ29DbGllbnQgfSBmcm9tIFwibW9uZ29kYlwiO1xyXG5pbXBvcnQgeyBNT05HT19VUkkgfSBmcm9tICcuLi9jb25zdGFudHMvZW52JztcclxuXHJcblxyXG5leHBvcnQgY29uc3QgY2xpZW50ID0gbmV3IE1vbmdvQ2xpZW50KE1PTkdPX1VSSSk7XHJcblxyXG5leHBvcnQgY29uc3QgbWFpbiA9IGFzeW5jICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcclxuICAgIGF3YWl0IGNsaWVudC5kYihcImFkbWluXCIpLmNvbW1hbmQoeyBwaW5nOiAxIH0pO1xyXG4gICAgY29uc29sZS5sb2coXCJQaW5nZWQgeW91ciBkZXBsb3ltZW50LiBZb3Ugc3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byBNb25nb0RCIVwiKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgfVxyXG4gIGNsaWVudC5jbG9zZSgpO1xyXG59XHJcblxyXG5tYWluKCkuY2F0Y2goY29uc29sZS5lcnJvcik7Il19