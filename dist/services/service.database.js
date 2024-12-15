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
exports.main = void 0;
require("dotenv/config");
const mongodb_1 = require("mongodb");
const env_1 = require("../constants/env");
const client = new mongodb_1.MongoClient(env_1.MONGO_URI);
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        yield client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
    client.close();
});
exports.main = main;
(0, exports.main)().catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5kYXRhYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zZXJ2aWNlLmRhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlCQUF1QjtBQUN2QixxQ0FBc0M7QUFDdEMsMENBQTZDO0FBRzdDLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVcsQ0FBQyxlQUFTLENBQUMsQ0FBQztBQUVuQyxNQUFNLElBQUksR0FBRyxHQUFTLEVBQUU7SUFDN0IsSUFBSSxDQUFDO1FBQ0gsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDdkIsTUFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQSxDQUFBO0FBVlksUUFBQSxJQUFJLFFBVWhCO0FBRUQsSUFBQSxZQUFJLEdBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdkb3RlbnYvY29uZmlnJztcclxuaW1wb3J0IHsgTW9uZ29DbGllbnQgfSBmcm9tIFwibW9uZ29kYlwiO1xyXG5pbXBvcnQgeyBNT05HT19VUkkgfSBmcm9tICcuLi9jb25zdGFudHMvZW52JztcclxuXHJcblxyXG5jb25zdCBjbGllbnQgPSBuZXcgTW9uZ29DbGllbnQoTU9OR09fVVJJKTtcclxuXHJcbmV4cG9ydCBjb25zdCBtYWluID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpO1xyXG4gICAgYXdhaXQgY2xpZW50LmRiKFwiYWRtaW5cIikuY29tbWFuZCh7IHBpbmc6IDEgfSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIlBpbmdlZCB5b3VyIGRlcGxveW1lbnQuIFlvdSBzdWNjZXNzZnVsbHkgY29ubmVjdGVkIHRvIE1vbmdvREIhXCIpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgIHByb2Nlc3MuZXhpdCgxKTtcclxuICB9XHJcbiAgY2xpZW50LmNsb3NlKCk7XHJcbn1cclxuXHJcbm1haW4oKS5jYXRjaChjb25zb2xlLmVycm9yKTsiXX0=