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
const openai_1 = require("@langchain/openai");
const output_parsers_1 = require("@langchain/core/output_parsers");
const mongodb_1 = require("mongodb");
const mongodb_2 = require("@langchain/mongodb");
const zod_1 = require("zod");
require("dotenv/config");
const client = new mongodb_1.MongoClient(process.env.MONGO_URI);
const model = new openai_1.ChatOpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
    model: "gpt-4o-mini",
    temperature: 0.7,
    cache: true,
});
const EmployeeSchema = zod_1.z.object({
    employee_id: zod_1.z.string(),
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    date_of_birth: zod_1.z.string(),
    address: zod_1.z.object({
        street: zod_1.z.string(),
        city: zod_1.z.string(),
        state: zod_1.z.string(),
        postal_code: zod_1.z.string(),
        country: zod_1.z.string(),
    }),
    contact_details: zod_1.z.object({
        email: zod_1.z.string().email(),
        phone_number: zod_1.z.string(),
    }),
    job_details: zod_1.z.object({
        job_title: zod_1.z.string(),
        department: zod_1.z.string(),
        hire_date: zod_1.z.string(),
        employment_type: zod_1.z.string(),
        salary: zod_1.z.number(),
        currency: zod_1.z.string(),
    }),
    work_location: zod_1.z.object({
        nearest_office: zod_1.z.string(),
        is_remote: zod_1.z.boolean(),
    }),
    reporting_manager: zod_1.z.string().nullable(),
    skills: zod_1.z.array(zod_1.z.string()),
    performance_reviews: zod_1.z.array(zod_1.z.object({
        review_date: zod_1.z.string(),
        rating: zod_1.z.number(),
        comments: zod_1.z.string(),
    })),
    benefits: zod_1.z.object({
        health_insurance: zod_1.z.string(),
        retirement_plan: zod_1.z.string(),
        paid_time_off: zod_1.z.number(),
    }),
    emergency_contact: zod_1.z.object({
        name: zod_1.z.string(),
        relationship: zod_1.z.string(),
        phone_number: zod_1.z.string(),
    }),
    notes: zod_1.z.string(),
});
const parser = output_parsers_1.StructuredOutputParser.fromZodSchema(zod_1.z.array(EmployeeSchema));
function generateSyntheticData() {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `I want you to be a helpful assistant that generates employee data. Generate 3 fictional employee records. Each record should include the following fields: employee_id, first_name, last_name, date_of_birth, address, contact_details, job_details, work_location, reporting_manager, skills, performance_reviews, benefits, emergency_contact, notes. Ensure variety in the data and realistic values.

  ${parser.getFormatInstructions()}`;
        console.log("Generating synthetic data...");
        const response = yield model.invoke(prompt);
        return parser.parse(response.content);
    });
}
;
function createEmployeeSummary(employee) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const jobDetails = `${employee.job_details.job_title} in ${employee.job_details.department}`;
            const skills = employee.skills.join(", ");
            const performanceReviews = employee.performance_reviews
                .map((review) => `Rated ${review.rating} on ${review.review_date}: ${review.comments}`)
                .join(" ");
            const basicInfo = `${employee.first_name} ${employee.last_name}, born on ${employee.date_of_birth}`;
            const workLocation = `Works at ${employee.work_location.nearest_office}, Remote: ${employee.work_location.is_remote}`;
            const notes = employee.notes;
            const summary = `${basicInfo}. Job: ${jobDetails}. Skills: ${skills}. Reviews: ${performanceReviews}. Location: ${workLocation}. Notes: ${notes}`;
            resolve(summary);
        });
    });
}
;
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            const db = client.db("hr_database");
            const collection = db.collection("employees-record");
            yield collection.deleteMany({});
            const syntheticData = yield generateSyntheticData();
            const recordsWithSummaries = yield Promise.all(syntheticData.map((record) => __awaiter(this, void 0, void 0, function* () {
                return ({
                    pageContent: yield createEmployeeSummary(record),
                    metadata: Object.assign({}, record),
                });
            })));
            for (const record of recordsWithSummaries) {
                yield mongodb_2.MongoDBAtlasVectorSearch.fromDocuments([record], new openai_1.OpenAIEmbeddings(), {
                    collection,
                    indexName: "vector_index",
                    textKey: "embedding_text",
                    embeddingKey: "embedding",
                });
                console.log("Successfully processed & saved record:", record.metadata.employee_id);
            }
            console.log("Database seeding completed");
        }
        catch (error) {
            console.error("Error seeding database:", error);
        }
        finally {
            yield client.close();
        }
    });
}
seedDatabase().catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC1kYXRhYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9zZWVkLWRhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsOENBQWlFO0FBQ2pFLG1FQUF3RTtBQUN4RSxxQ0FBc0M7QUFDdEMsZ0RBQThEO0FBQzlELDZCQUF3QjtBQUN4Qix5QkFBdUI7QUFHdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBbUIsQ0FBQyxDQUFDO0FBR2hFLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQVUsQ0FBQztJQUMzQixNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUF5QjtJQUM3QyxLQUFLLEVBQUUsYUFBYTtJQUNwQixXQUFXLEVBQUUsR0FBRztJQUNoQixLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUMsQ0FBQztBQUVILE1BQU0sY0FBYyxHQUFHLE9BQUMsQ0FBQyxNQUFNLENBQUM7SUFDOUIsV0FBVyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDdkIsVUFBVSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDdEIsU0FBUyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDckIsYUFBYSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7SUFDekIsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLENBQUM7UUFDaEIsTUFBTSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7UUFDbEIsSUFBSSxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7UUFDaEIsS0FBSyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7UUFDakIsV0FBVyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7UUFDdkIsT0FBTyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUU7S0FDcEIsQ0FBQztJQUNGLGVBQWUsRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3hCLEtB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QUFvQixHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDNUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFPLE1BQU0sRUFBRSxFQUFFO2dCQUFDLE9BQUEsQ0FBQztvQkFDbkMsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUMsTUFBTSxDQUFDO29CQUNoRCxRQUFRLG9CQUFNLE1BQU0sQ0FBQztpQkFDdEIsQ0FBQyxDQUFBO2NBQUEsQ0FBQyxDQUNKLENBQUM7WUFFRixLQUFLLE1BQU0sTUFBTSxJQUFJLG9CQUFvQixFQUFFLENBQUM7Z0JBQzFDLE1BQU0sa0NBQXdCLENBQUMsYUFBYSxDQUMxQyxDQUFDLE1BQU0sQ0FBQyxFQUNSLElBQUkseUJBQWdCLEVBQUUsRUFDdEI7b0JBQ0UsVUFBVTtvQkFDVixTQUFTLEVBQUUsY0FBYztvQkFDekIsT0FBTyxFQUFFLGdCQUFnQjtvQkFDekIsWUFBWSxFQUFFLFdBQVc7aUJBQzFCLENBQ0YsQ0FBQztnQkFFRixPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckYsQ0FBQztZQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUU1QyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbEQsQ0FBQztnQkFBUyxDQUFDO1lBQ1QsTUFBTSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsQ0FBQztJQUNILENBQUM7Q0FBQTtBQUVELFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGF0T3BlbkFJLCBPcGVuQUlFbWJlZGRpbmdzIH0gZnJvbSBcIkBsYW5nY2hhaW4vb3BlbmFpXCI7XHJcbmltcG9ydCB7IFN0cnVjdHVyZWRPdXRwdXRQYXJzZXIgfSBmcm9tIFwiQGxhbmdjaGFpbi9jb3JlL291dHB1dF9wYXJzZXJzXCI7XHJcbmltcG9ydCB7IE1vbmdvQ2xpZW50IH0gZnJvbSBcIm1vbmdvZGJcIjtcclxuaW1wb3J0IHsgTW9uZ29EQkF0bGFzVmVjdG9yU2VhcmNoIH0gZnJvbSBcIkBsYW5nY2hhaW4vbW9uZ29kYlwiO1xyXG5pbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xyXG5pbXBvcnQgXCJkb3RlbnYvY29uZmlnXCI7XHJcblxyXG5cclxuY29uc3QgY2xpZW50ID0gbmV3IE1vbmdvQ2xpZW50KHByb2Nlc3MuZW52Lk1PTkdPX1VSSSBhcyBzdHJpbmcpO1xyXG5cclxuXHJcbmNvbnN0IG1vZGVsID0gbmV3IENoYXRPcGVuQUkoe1xyXG4gIGFwaUtleTogcHJvY2Vzcy5lbnYuT1BFTl9BSV9BUElfS0VZIGFzIHN0cmluZyxcclxuICBtb2RlbDogXCJncHQtNG8tbWluaVwiLFxyXG4gIHRlbXBlcmF0dXJlOiAwLjcsXHJcbiAgY2FjaGU6IHRydWUsXHJcbn0pO1xyXG5cclxuY29uc3QgRW1wbG95ZWVTY2hlbWEgPSB6Lm9iamVjdCh7XHJcbiAgZW1wbG95ZWVfaWQ6IHouc3RyaW5nKCksXHJcbiAgZmlyc3RfbmFtZTogei5zdHJpbmcoKSxcclxuICBsYXN0X25hbWU6IHouc3RyaW5nKCksXHJcbiAgZGF0ZV9vZl9iaXJ0aDogei5zdHJpbmcoKSxcclxuICBhZGRyZXNzOiB6Lm9iamVjdCh7XHJcbiAgICBzdHJlZXQ6IHouc3RyaW5nKCksXHJcbiAgICBjaXR5OiB6LnN0cmluZygpLFxyXG4gICAgc3RhdGU6IHouc3RyaW5nKCksXHJcbiAgICBwb3N0YWxfY29kZTogei5zdHJpbmcoKSxcclxuICAgIGNvdW50cnk6IHouc3RyaW5nKCksXHJcbiAgfSksXHJcbiAgY29udGFjdF9kZXRhaWxzOiB6Lm9iamVjdCh7XHJcbiAgICBlbWFpbDogei5zdHJpbmcoKS5lbWFpbCgpLFxyXG4gICAgcGhvbmVfbnVtYmVyOiB6LnN0cmluZygpLFxyXG4gIH0pLFxyXG4gIGpvYl9kZXRhaWxzOiB6Lm9iamVjdCh7XHJcbiAgICBqb2JfdGl0bGU6IHouc3RyaW5nKCksXHJcbiAgICBkZXBhcnRtZW50OiB6LnN0cmluZygpLFxyXG4gICAgaGlyZV9kYXRlOiB6LnN0cmluZygpLFxyXG4gICAgZW1wbG95bWVudF90eXBlOiB6LnN0cmluZygpLFxyXG4gICAgc2FsYXJ5OiB6Lm51bWJlcigpLFxyXG4gICAgY3VycmVuY3k6IHouc3RyaW5nKCksXHJcbiAgfSksXHJcbiAgd29ya19sb2NhdGlvbjogei5vYmplY3Qoe1xyXG4gICAgbmVhcmVzdF9vZmZpY2U6IHouc3RyaW5nKCksXHJcbiAgICBpc19yZW1vdGU6IHouYm9vbGVhbigpLFxyXG4gIH0pLFxyXG4gIHJlcG9ydGluZ19tYW5hZ2VyOiB6LnN0cmluZygpLm51bGxhYmxlKCksXHJcbiAgc2tpbGxzOiB6LmFycmF5KHouc3RyaW5nKCkpLFxyXG4gIHBlcmZvcm1hbmNlX3Jldmlld3M6IHouYXJyYXkoXHJcbiAgICB6Lm9iamVjdCh7XHJcbiAgICAgIHJldmlld19kYXRlOiB6LnN0cmluZygpLFxyXG4gICAgICByYXRpbmc6IHoubnVtYmVyKCksXHJcbiAgICAgIGNvbW1lbnRzOiB6LnN0cmluZygpLFxyXG4gICAgfSlcclxuICApLFxyXG4gIGJlbmVmaXRzOiB6Lm9iamVjdCh7XHJcbiAgICBoZWFsdGhfaW5zdXJhbmNlOiB6LnN0cmluZygpLFxyXG4gICAgcmV0aXJlbWVudF9wbGFuOiB6LnN0cmluZygpLFxyXG4gICAgcGFpZF90aW1lX29mZjogei5udW1iZXIoKSxcclxuICB9KSxcclxuICBlbWVyZ2VuY3lfY29udGFjdDogei5vYmplY3Qoe1xyXG4gICAgbmFtZTogei5zdHJpbmcoKSxcclxuICAgIHJlbGF0aW9uc2hpcDogei5zdHJpbmcoKSxcclxuICAgIHBob25lX251bWJlcjogei5zdHJpbmcoKSxcclxuICB9KSxcclxuICBub3Rlczogei5zdHJpbmcoKSxcclxufSk7XHJcblxyXG50eXBlIEVtcGxveWVlID0gei5pbmZlcjx0eXBlb2YgRW1wbG95ZWVTY2hlbWE+O1xyXG5cclxuY29uc3QgcGFyc2VyID0gU3RydWN0dXJlZE91dHB1dFBhcnNlci5mcm9tWm9kU2NoZW1hKHouYXJyYXkoRW1wbG95ZWVTY2hlbWEpKTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlU3ludGhldGljRGF0YSgpOiBQcm9taXNlPEVtcGxveWVlW10+IHtcclxuICBjb25zdCBwcm9tcHQgPSBgSSB3YW50IHlvdSB0byBiZSBhIGhlbHBmdWwgYXNzaXN0YW50IHRoYXQgZ2VuZXJhdGVzIGVtcGxveWVlIGRhdGEuIEdlbmVyYXRlIDMgZmljdGlvbmFsIGVtcGxveWVlIHJlY29yZHMuIEVhY2ggcmVjb3JkIHNob3VsZCBpbmNsdWRlIHRoZSBmb2xsb3dpbmcgZmllbGRzOiBlbXBsb3llZV9pZCwgZmlyc3RfbmFtZSwgbGFzdF9uYW1lLCBkYXRlX29mX2JpcnRoLCBhZGRyZXNzLCBjb250YWN0X2RldGFpbHMsIGpvYl9kZXRhaWxzLCB3b3JrX2xvY2F0aW9uLCByZXBvcnRpbmdfbWFuYWdlciwgc2tpbGxzLCBwZXJmb3JtYW5jZV9yZXZpZXdzLCBiZW5lZml0cywgZW1lcmdlbmN5X2NvbnRhY3QsIG5vdGVzLiBFbnN1cmUgdmFyaWV0eSBpbiB0aGUgZGF0YSBhbmQgcmVhbGlzdGljIHZhbHVlcy5cclxuXHJcbiAgJHtwYXJzZXIuZ2V0Rm9ybWF0SW5zdHJ1Y3Rpb25zKCl9YDtcclxuXHJcbiAgY29uc29sZS5sb2coXCJHZW5lcmF0aW5nIHN5bnRoZXRpYyBkYXRhLi4uXCIpO1xyXG5cclxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG1vZGVsLmludm9rZShwcm9tcHQpO1xyXG4gIHJldHVybiAgcGFyc2VyLnBhcnNlKHJlc3BvbnNlLmNvbnRlbnQgYXMgc3RyaW5nKTtcclxuXHJcbn07XHJcblxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlRW1wbG95ZWVTdW1tYXJ5KGVtcGxveWVlOiBFbXBsb3llZSk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICBjb25zdCBqb2JEZXRhaWxzID0gYCR7ZW1wbG95ZWUuam9iX2RldGFpbHMuam9iX3RpdGxlfSBpbiAke2VtcGxveWVlLmpvYl9kZXRhaWxzLmRlcGFydG1lbnR9YDtcclxuICAgIGNvbnN0IHNraWxscyA9IGVtcGxveWVlLnNraWxscy5qb2luKFwiLCBcIik7XHJcbiAgICBjb25zdCBwZXJmb3JtYW5jZVJldmlld3MgPSBlbXBsb3llZS5wZXJmb3JtYW5jZV9yZXZpZXdzXHJcbiAgICAgIC5tYXAoXHJcbiAgICAgICAgKHJldmlldykgPT5cclxuICAgICAgICAgIGBSYXRlZCAke3Jldmlldy5yYXRpbmd9IG9uICR7cmV2aWV3LnJldmlld19kYXRlfTogJHtyZXZpZXcuY29tbWVudHN9YFxyXG4gICAgICApXHJcbiAgICAgIC5qb2luKFwiIFwiKTtcclxuICAgIGNvbnN0IGJhc2ljSW5mbyA9IGAke2VtcGxveWVlLmZpcnN0X25hbWV9ICR7ZW1wbG95ZWUubGFzdF9uYW1lfSwgYm9ybiBvbiAke2VtcGxveWVlLmRhdGVfb2ZfYmlydGh9YDtcclxuICAgIGNvbnN0IHdvcmtMb2NhdGlvbiA9IGBXb3JrcyBhdCAke2VtcGxveWVlLndvcmtfbG9jYXRpb24ubmVhcmVzdF9vZmZpY2V9LCBSZW1vdGU6ICR7ZW1wbG95ZWUud29ya19sb2NhdGlvbi5pc19yZW1vdGV9YDtcclxuICAgIGNvbnN0IG5vdGVzID0gZW1wbG95ZWUubm90ZXM7XHJcblxyXG4gICAgY29uc3Qgc3VtbWFyeSA9IGAke2Jhc2ljSW5mb30uIEpvYjogJHtqb2JEZXRhaWxzfS4gU2tpbGxzOiAke3NraWxsc30uIFJldmlld3M6ICR7cGVyZm9ybWFuY2VSZXZpZXdzfS4gTG9jYXRpb246ICR7d29ya0xvY2F0aW9ufS4gTm90ZXM6ICR7bm90ZXN9YDtcclxuXHJcbiAgICByZXNvbHZlKHN1bW1hcnkpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gc2VlZERhdGFiYXNlKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpO1xyXG4gICAgYXdhaXQgY2xpZW50LmRiKFwiYWRtaW5cIikuY29tbWFuZCh7IHBpbmc6IDEgfSk7XHJcbiAgICBjb25zb2xlLmxvZyhcIlBpbmdlZCB5b3VyIGRlcGxveW1lbnQuIFlvdSBzdWNjZXNzZnVsbHkgY29ubmVjdGVkIHRvIE1vbmdvREIhXCIpO1xyXG5cclxuICAgIGNvbnN0IGRiID0gY2xpZW50LmRiKFwiaHJfZGF0YWJhc2VcIik7XHJcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gZGIuY29sbGVjdGlvbihcImVtcGxveWVlcy1yZWNvcmRcIik7XHJcblxyXG4gICAgYXdhaXQgY29sbGVjdGlvbi5kZWxldGVNYW55KHt9KTtcclxuICAgIFxyXG4gICAgY29uc3Qgc3ludGhldGljRGF0YSA9IGF3YWl0IGdlbmVyYXRlU3ludGhldGljRGF0YSgpO1xyXG5cclxuICAgIGNvbnN0IHJlY29yZHNXaXRoU3VtbWFyaWVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIHN5bnRoZXRpY0RhdGEubWFwKGFzeW5jIChyZWNvcmQpID0+ICh7XHJcbiAgICAgICAgcGFnZUNvbnRlbnQ6IGF3YWl0IGNyZWF0ZUVtcGxveWVlU3VtbWFyeShyZWNvcmQpLFxyXG4gICAgICAgIG1ldGFkYXRhOiB7Li4ucmVjb3JkfSxcclxuICAgICAgfSkpXHJcbiAgICApO1xyXG4gICAgXHJcbiAgICBmb3IgKGNvbnN0IHJlY29yZCBvZiByZWNvcmRzV2l0aFN1bW1hcmllcykge1xyXG4gICAgICBhd2FpdCBNb25nb0RCQXRsYXNWZWN0b3JTZWFyY2guZnJvbURvY3VtZW50cyhcclxuICAgICAgICBbcmVjb3JkXSxcclxuICAgICAgICBuZXcgT3BlbkFJRW1iZWRkaW5ncygpLFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGNvbGxlY3Rpb24sXHJcbiAgICAgICAgICBpbmRleE5hbWU6IFwidmVjdG9yX2luZGV4XCIsXHJcbiAgICAgICAgICB0ZXh0S2V5OiBcImVtYmVkZGluZ190ZXh0XCIsXHJcbiAgICAgICAgICBlbWJlZGRpbmdLZXk6IFwiZW1iZWRkaW5nXCIsXHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG5cclxuICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzZnVsbHkgcHJvY2Vzc2VkICYgc2F2ZWQgcmVjb3JkOlwiLCByZWNvcmQubWV0YWRhdGEuZW1wbG95ZWVfaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiRGF0YWJhc2Ugc2VlZGluZyBjb21wbGV0ZWRcIik7XHJcblxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc2VlZGluZyBkYXRhYmFzZTpcIiwgZXJyb3IpO1xyXG4gIH0gZmluYWxseSB7XHJcbiAgICBhd2FpdCBjbGllbnQuY2xvc2UoKTtcclxuICB9XHJcbn1cclxuXHJcbnNlZWREYXRhYmFzZSgpLmNhdGNoKGNvbnNvbGUuZXJyb3IpOyJdfQ==