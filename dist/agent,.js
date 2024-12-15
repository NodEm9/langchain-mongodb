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
exports.callAgent = callAgent;
const openai_1 = require("@langchain/openai");
const anthropic_1 = require("@langchain/anthropic");
const messages_1 = require("@langchain/core/messages");
const prompts_1 = require("@langchain/core/prompts");
const langgraph_1 = require("@langchain/langgraph");
const langgraph_2 = require("@langchain/langgraph");
const tools_1 = require("@langchain/core/tools");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const langgraph_checkpoint_mongodb_1 = require("@langchain/langgraph-checkpoint-mongodb");
const mongodb_1 = require("@langchain/mongodb");
const zod_1 = require("zod");
require("dotenv/config");
function callAgent(client, query, thread_id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Define the MongoDB database and collection
        const dbName = "hr_database";
        const db = client.db(dbName);
        const collection = db.collection("employees");
        // Define the graph state
        const GraphState = langgraph_2.Annotation.Root({
            messages: (0, langgraph_2.Annotation)({
                reducer: (x, y) => x.concat(y),
            }),
        });
        // Define the tools for the agent to use
        const employeeLookupTool = (0, tools_1.tool)((_a) => __awaiter(this, [_a], void 0, function* ({ query, n = 10 }) {
            console.log("Employee lookup tool called");
            const dbConfig = {
                collection: collection,
                indexName: "vector_index",
                textKey: "embedding_text",
                embeddingKey: "embedding",
            };
            // Initialize vector store
            const vectorStore = new mongodb_1.MongoDBAtlasVectorSearch(new openai_1.OpenAIEmbeddings(), dbConfig);
            const result = yield vectorStore.similaritySearchWithScore(query, n);
            return JSON.stringify(result);
        }), {
            name: "employee_lookup",
            description: "Gathers employee details from the HR database",
            schema: zod_1.z.object({
                query: zod_1.z.string().describe("The search query"),
                n: zod_1.z
                    .number()
                    .optional()
                    .default(10)
                    .describe("Number of results to return"),
            }),
        });
        const tools = [employeeLookupTool];
        // We can extract the state typing via `GraphState.State`
        const toolNode = new prebuilt_1.ToolNode(tools);
        const model = new anthropic_1.ChatAnthropic({
            model: "claude-3-5-sonnet-20240620",
            temperature: 0,
        }).bindTools(tools);
        // Define the function that determines whether to continue or not
        function shouldContinue(state) {
            var _a;
            const messages = state.messages;
            const lastMessage = messages[messages.length - 1];
            // If the LLM makes a tool call, then we route to the "tools" node
            if ((_a = lastMessage.tool_calls) === null || _a === void 0 ? void 0 : _a.length) {
                return "tools";
            }
            // Otherwise, we stop (reply to the user)
            return "__end__";
        }
        // Define the function that calls the model
        function callModel(state) {
            return __awaiter(this, void 0, void 0, function* () {
                const prompt = prompts_1.ChatPromptTemplate.fromMessages([
                    [
                        "system",
                        `You are a helpful AI assistant, collaborating with other assistants. Use the provided tools to progress towards answering the question. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off. Execute what you can to make progress. If you or any of the other assistants have the final answer or deliverable, prefix your response with FINAL ANSWER so the team knows to stop. You have access to the following tools: {tool_names}.\n{system_message}\nCurrent time: {time}.`,
                    ],
                    new prompts_1.MessagesPlaceholder("messages"),
                ]);
                const formattedPrompt = yield prompt.formatMessages({
                    system_message: "You are helpful HR Chatbot Agent.",
                    time: new Date().toISOString(),
                    tool_names: tools.map((tool) => tool.name).join(", "),
                    messages: state.messages,
                });
                const result = yield model.invoke(formattedPrompt);
                return { messages: [result] };
            });
        }
        // Define a new graph
        const workflow = new langgraph_1.StateGraph(GraphState)
            .addNode("agent", callModel)
            .addNode("tools", toolNode)
            .addEdge("__start__", "agent")
            .addConditionalEdges("agent", shouldContinue)
            .addEdge("tools", "agent");
        // Initialize the MongoDB memory to persist state between graph runs
        const checkpointer = new langgraph_checkpoint_mongodb_1.MongoDBSaver({ client, dbName });
        // This compiles it into a LangChain Runnable.
        // Note that we're passing the memory when compiling the graph
        const app = workflow.compile({ checkpointer });
        // Use the Runnable
        const finalState = yield app.invoke({
            messages: [new messages_1.HumanMessage(query)],
        }, { recursionLimit: 15, configurable: { thread_id: thread_id } });
        console.log(finalState.messages[finalState.messages.length - 1].content);
        return finalState.messages[finalState.messages.length - 1].content;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdlbnQsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FnZW50LC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQWlCQSw4QkF1SEM7QUF4SUQsOENBQXFEO0FBQ3JELG9EQUFxRDtBQUNyRCx1REFBZ0Y7QUFDaEYscURBR2lDO0FBQ2pDLG9EQUFrRDtBQUNsRCxvREFBa0Q7QUFDbEQsaURBQTZDO0FBQzdDLDREQUF5RDtBQUN6RCwwRkFBdUU7QUFDdkUsZ0RBQThEO0FBRTlELDZCQUF3QjtBQUN4Qix5QkFBdUI7QUFFdkIsU0FBc0IsU0FBUyxDQUFDLE1BQW1CLEVBQUUsS0FBYSxFQUFFLFNBQWlCOztRQUNuRiw2Q0FBNkM7UUFDN0MsTUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDO1FBQzdCLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0IsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU5Qyx5QkFBeUI7UUFDekIsTUFBTSxVQUFVLEdBQUcsc0JBQVUsQ0FBQyxJQUFJLENBQUM7WUFDakMsUUFBUSxFQUFFLElBQUEsc0JBQVUsRUFBZ0I7Z0JBQ2xDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQy9CLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCx3Q0FBd0M7UUFDeEMsTUFBTSxrQkFBa0IsR0FBRyxJQUFBLFlBQUksRUFDN0IsS0FBMEIsRUFBRSwwQ0FBckIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFFM0MsTUFBTSxRQUFRLEdBQUc7Z0JBQ2YsVUFBVSxFQUFFLFVBQVU7Z0JBQ3RCLFNBQVMsRUFBRSxjQUFjO2dCQUN6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LFdBQVcsRUFBRSxPQUFPLENBQUM7YUFDN0IsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQzthQUM1QyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTdCLG9FQUFvRTtRQUNwRSxNQUFNLFlBQVksR0FBRyxJQUFJLDJDQUFZLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUUxRCw4Q0FBOEM7UUFDOUMsOERBQThEO1FBQzlELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRS9DLG1CQUFtQjtRQUNuQixNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQ2pDO1lBQ0UsUUFBUSxFQUFFLENBQUMsSUFBSSx1QkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BDLEVBQ0QsRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUMvRCxDQUFDO1FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXpFLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDckUsQ0FBQztDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlbkFJRW1iZWRkaW5ncyB9IGZyb20gXCJAbGFuZ2NoYWluL29wZW5haVwiO1xyXG5pbXBvcnQgeyBDaGF0QW50aHJvcGljIH0gZnJvbSBcIkBsYW5nY2hhaW4vYW50aHJvcGljXCI7XHJcbmltcG9ydCB7IEFJTWVzc2FnZSwgQmFzZU1lc3NhZ2UsIEh1bWFuTWVzc2FnZSB9IGZyb20gXCJAbGFuZ2NoYWluL2NvcmUvbWVzc2FnZXNcIjtcclxuaW1wb3J0IHtcclxuICBDaGF0UHJvbXB0VGVtcGxhdGUsXHJcbiAgTWVzc2FnZXNQbGFjZWhvbGRlcixcclxufSBmcm9tIFwiQGxhbmdjaGFpbi9jb3JlL3Byb21wdHNcIjtcclxuaW1wb3J0IHsgU3RhdGVHcmFwaCB9IGZyb20gXCJAbGFuZ2NoYWluL2xhbmdncmFwaFwiO1xyXG5pbXBvcnQgeyBBbm5vdGF0aW9uIH0gZnJvbSBcIkBsYW5nY2hhaW4vbGFuZ2dyYXBoXCI7XHJcbmltcG9ydCB7IHRvb2wgfSBmcm9tIFwiQGxhbmdjaGFpbi9jb3JlL3Rvb2xzXCI7XHJcbmltcG9ydCB7IFRvb2xOb2RlIH0gZnJvbSBcIkBsYW5nY2hhaW4vbGFuZ2dyYXBoL3ByZWJ1aWx0XCI7XHJcbmltcG9ydCB7IE1vbmdvREJTYXZlciB9IGZyb20gXCJAbGFuZ2NoYWluL2xhbmdncmFwaC1jaGVja3BvaW50LW1vbmdvZGJcIjtcclxuaW1wb3J0IHsgTW9uZ29EQkF0bGFzVmVjdG9yU2VhcmNoIH0gZnJvbSBcIkBsYW5nY2hhaW4vbW9uZ29kYlwiO1xyXG5pbXBvcnQgeyBNb25nb0NsaWVudCB9IGZyb20gXCJtb25nb2RiXCI7XHJcbmltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XHJcbmltcG9ydCBcImRvdGVudi9jb25maWdcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYWxsQWdlbnQoY2xpZW50OiBNb25nb0NsaWVudCwgcXVlcnk6IHN0cmluZywgdGhyZWFkX2lkOiBzdHJpbmcpIHtcclxuICAvLyBEZWZpbmUgdGhlIE1vbmdvREIgZGF0YWJhc2UgYW5kIGNvbGxlY3Rpb25cclxuICBjb25zdCBkYk5hbWUgPSBcImhyX2RhdGFiYXNlXCI7XHJcbiAgY29uc3QgZGIgPSBjbGllbnQuZGIoZGJOYW1lKTtcclxuICBjb25zdCBjb2xsZWN0aW9uID0gZGIuY29sbGVjdGlvbihcImVtcGxveWVlc1wiKTtcclxuXHJcbiAgLy8gRGVmaW5lIHRoZSBncmFwaCBzdGF0ZVxyXG4gIGNvbnN0IEdyYXBoU3RhdGUgPSBBbm5vdGF0aW9uLlJvb3Qoe1xyXG4gICAgbWVzc2FnZXM6IEFubm90YXRpb248QmFzZU1lc3NhZ2VbXT4oe1xyXG4gICAgICByZWR1Y2VyOiAoeCwgeSkgPT4geC5jb25jYXQoeSksXHJcbiAgICB9KSxcclxuICB9KTtcclxuXHJcbiAgLy8gRGVmaW5lIHRoZSB0b29scyBmb3IgdGhlIGFnZW50IHRvIHVzZVxyXG4gIGNvbnN0IGVtcGxveWVlTG9va3VwVG9vbCA9IHRvb2woXHJcbiAgICBhc3luYyAoeyBxdWVyeSwgbiA9IDEwIH0pID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJFbXBsb3llZSBsb29rdXAgdG9vbCBjYWxsZWRcIik7XHJcblxyXG4gICAgICBjb25zdCBkYkNvbmZpZyA9IHtcclxuICAgICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLFxyXG4gICAgICAgIGluZGV4TmFtZTogXCJ2ZWN0b3JfaW5kZXhcIixcclxuICAgICAgICB0ZXh0S2V5OiBcImVtYmVkZGluZ190ZXh0XCIsXHJcbiAgICAgICAgZW1iZWRkaW5nS2V5OiBcImVtYmVkZGluZ1wiLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gSW5pdGlhbGl6ZSB2ZWN0b3Igc3RvcmVcclxuICAgICAgY29uc3QgdmVjdG9yU3RvcmUgPSBuZXcgTW9uZ29EQkF0bGFzVmVjdG9yU2VhcmNoKFxyXG4gICAgICAgIG5ldyBPcGVuQUlFbWJlZGRpbmdzKCksXHJcbiAgICAgICAgZGJDb25maWdcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHZlY3RvclN0b3JlLnNpbWlsYXJpdHlTZWFyY2hXaXRoU2NvcmUocXVlcnksIG4pO1xyXG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6IFwiZW1wbG95ZWVfbG9va3VwXCIsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkdhdGhlcnMgZW1wbG95ZWUgZGV0YWlscyBmcm9tIHRoZSBIUiBkYXRhYmFzZVwiLFxyXG4gICAgICBzY2hlbWE6IHoub2JqZWN0KHtcclxuICAgICAgICBxdWVyeTogei5zdHJpbmcoKS5kZXNjcmliZShcIlRoZSBzZWFyY2ggcXVlcnlcIiksXHJcbiAgICAgICAgbjogelxyXG4gICAgICAgICAgLm51bWJlcigpXHJcbiAgICAgICAgICAub3B0aW9uYWwoKVxyXG4gICAgICAgICAgLmRlZmF1bHQoMTApXHJcbiAgICAgICAgICAuZGVzY3JpYmUoXCJOdW1iZXIgb2YgcmVzdWx0cyB0byByZXR1cm5cIiksXHJcbiAgICAgIH0pLFxyXG4gICAgfVxyXG4gICk7XHJcblxyXG4gIGNvbnN0IHRvb2xzID0gW2VtcGxveWVlTG9va3VwVG9vbF07XHJcbiAgXHJcbiAgLy8gV2UgY2FuIGV4dHJhY3QgdGhlIHN0YXRlIHR5cGluZyB2aWEgYEdyYXBoU3RhdGUuU3RhdGVgXHJcbiAgY29uc3QgdG9vbE5vZGUgPSBuZXcgVG9vbE5vZGU8dHlwZW9mIEdyYXBoU3RhdGUuU3RhdGU+KHRvb2xzKTtcclxuXHJcbiAgY29uc3QgbW9kZWwgPSBuZXcgQ2hhdEFudGhyb3BpYyh7XHJcbiAgICBtb2RlbDogXCJjbGF1ZGUtMy01LXNvbm5ldC0yMDI0MDYyMFwiLFxyXG4gICAgdGVtcGVyYXR1cmU6IDAsXHJcbiAgfSkuYmluZFRvb2xzKHRvb2xzKTtcclxuXHJcbiAgLy8gRGVmaW5lIHRoZSBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgd2hldGhlciB0byBjb250aW51ZSBvciBub3RcclxuICBmdW5jdGlvbiBzaG91bGRDb250aW51ZShzdGF0ZTogdHlwZW9mIEdyYXBoU3RhdGUuU3RhdGUpIHtcclxuICAgIGNvbnN0IG1lc3NhZ2VzID0gc3RhdGUubWVzc2FnZXM7XHJcbiAgICBjb25zdCBsYXN0TWVzc2FnZSA9IG1lc3NhZ2VzW21lc3NhZ2VzLmxlbmd0aCAtIDFdIGFzIEFJTWVzc2FnZTtcclxuXHJcbiAgICAvLyBJZiB0aGUgTExNIG1ha2VzIGEgdG9vbCBjYWxsLCB0aGVuIHdlIHJvdXRlIHRvIHRoZSBcInRvb2xzXCIgbm9kZVxyXG4gICAgaWYgKGxhc3RNZXNzYWdlLnRvb2xfY2FsbHM/Lmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4gXCJ0b29sc1wiO1xyXG4gICAgfVxyXG4gICAgLy8gT3RoZXJ3aXNlLCB3ZSBzdG9wIChyZXBseSB0byB0aGUgdXNlcilcclxuICAgIHJldHVybiBcIl9fZW5kX19cIjtcclxuICB9XHJcblxyXG4gIC8vIERlZmluZSB0aGUgZnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgbW9kZWxcclxuICBhc3luYyBmdW5jdGlvbiBjYWxsTW9kZWwoc3RhdGU6IHR5cGVvZiBHcmFwaFN0YXRlLlN0YXRlKSB7XHJcbiAgICBjb25zdCBwcm9tcHQgPSBDaGF0UHJvbXB0VGVtcGxhdGUuZnJvbU1lc3NhZ2VzKFtcclxuICAgICAgW1xyXG4gICAgICAgIFwic3lzdGVtXCIsXHJcbiAgICAgICAgYFlvdSBhcmUgYSBoZWxwZnVsIEFJIGFzc2lzdGFudCwgY29sbGFib3JhdGluZyB3aXRoIG90aGVyIGFzc2lzdGFudHMuIFVzZSB0aGUgcHJvdmlkZWQgdG9vbHMgdG8gcHJvZ3Jlc3MgdG93YXJkcyBhbnN3ZXJpbmcgdGhlIHF1ZXN0aW9uLiBJZiB5b3UgYXJlIHVuYWJsZSB0byBmdWxseSBhbnN3ZXIsIHRoYXQncyBPSywgYW5vdGhlciBhc3Npc3RhbnQgd2l0aCBkaWZmZXJlbnQgdG9vbHMgd2lsbCBoZWxwIHdoZXJlIHlvdSBsZWZ0IG9mZi4gRXhlY3V0ZSB3aGF0IHlvdSBjYW4gdG8gbWFrZSBwcm9ncmVzcy4gSWYgeW91IG9yIGFueSBvZiB0aGUgb3RoZXIgYXNzaXN0YW50cyBoYXZlIHRoZSBmaW5hbCBhbnN3ZXIgb3IgZGVsaXZlcmFibGUsIHByZWZpeCB5b3VyIHJlc3BvbnNlIHdpdGggRklOQUwgQU5TV0VSIHNvIHRoZSB0ZWFtIGtub3dzIHRvIHN0b3AuIFlvdSBoYXZlIGFjY2VzcyB0byB0aGUgZm9sbG93aW5nIHRvb2xzOiB7dG9vbF9uYW1lc30uXFxue3N5c3RlbV9tZXNzYWdlfVxcbkN1cnJlbnQgdGltZToge3RpbWV9LmAsXHJcbiAgICAgIF0sXHJcbiAgICAgIG5ldyBNZXNzYWdlc1BsYWNlaG9sZGVyKFwibWVzc2FnZXNcIiksXHJcbiAgICBdKTtcclxuXHJcbiAgICBjb25zdCBmb3JtYXR0ZWRQcm9tcHQgPSBhd2FpdCBwcm9tcHQuZm9ybWF0TWVzc2FnZXMoe1xyXG4gICAgICBzeXN0ZW1fbWVzc2FnZTogXCJZb3UgYXJlIGhlbHBmdWwgSFIgQ2hhdGJvdCBBZ2VudC5cIixcclxuICAgICAgdGltZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gICAgICB0b29sX25hbWVzOiB0b29scy5tYXAoKHRvb2wpID0+IHRvb2wubmFtZSkuam9pbihcIiwgXCIpLFxyXG4gICAgICBtZXNzYWdlczogc3RhdGUubWVzc2FnZXMsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBtb2RlbC5pbnZva2UoZm9ybWF0dGVkUHJvbXB0KTtcclxuXHJcbiAgICByZXR1cm4geyBtZXNzYWdlczogW3Jlc3VsdF0gfTtcclxuICB9XHJcblxyXG4gIC8vIERlZmluZSBhIG5ldyBncmFwaFxyXG4gIGNvbnN0IHdvcmtmbG93ID0gbmV3IFN0YXRlR3JhcGgoR3JhcGhTdGF0ZSlcclxuICAgIC5hZGROb2RlKFwiYWdlbnRcIiwgY2FsbE1vZGVsKVxyXG4gICAgLmFkZE5vZGUoXCJ0b29sc1wiLCB0b29sTm9kZSlcclxuICAgIC5hZGRFZGdlKFwiX19zdGFydF9fXCIsIFwiYWdlbnRcIilcclxuICAgIC5hZGRDb25kaXRpb25hbEVkZ2VzKFwiYWdlbnRcIiwgc2hvdWxkQ29udGludWUpXHJcbiAgICAuYWRkRWRnZShcInRvb2xzXCIsIFwiYWdlbnRcIik7XHJcblxyXG4gIC8vIEluaXRpYWxpemUgdGhlIE1vbmdvREIgbWVtb3J5IHRvIHBlcnNpc3Qgc3RhdGUgYmV0d2VlbiBncmFwaCBydW5zXHJcbiAgY29uc3QgY2hlY2twb2ludGVyID0gbmV3IE1vbmdvREJTYXZlcih7IGNsaWVudCwgZGJOYW1lIH0pO1xyXG5cclxuICAvLyBUaGlzIGNvbXBpbGVzIGl0IGludG8gYSBMYW5nQ2hhaW4gUnVubmFibGUuXHJcbiAgLy8gTm90ZSB0aGF0IHdlJ3JlIHBhc3NpbmcgdGhlIG1lbW9yeSB3aGVuIGNvbXBpbGluZyB0aGUgZ3JhcGhcclxuICBjb25zdCBhcHAgPSB3b3JrZmxvdy5jb21waWxlKHsgY2hlY2twb2ludGVyIH0pO1xyXG5cclxuICAvLyBVc2UgdGhlIFJ1bm5hYmxlXHJcbiAgY29uc3QgZmluYWxTdGF0ZSA9IGF3YWl0IGFwcC5pbnZva2UoXHJcbiAgICB7XHJcbiAgICAgIG1lc3NhZ2VzOiBbbmV3IEh1bWFuTWVzc2FnZShxdWVyeSldLFxyXG4gICAgfSxcclxuICAgIHsgcmVjdXJzaW9uTGltaXQ6IDE1LCBjb25maWd1cmFibGU6IHsgdGhyZWFkX2lkOiB0aHJlYWRfaWQgfSB9XHJcbiAgKTtcclxuXHJcbiAgY29uc29sZS5sb2coZmluYWxTdGF0ZS5tZXNzYWdlc1tmaW5hbFN0YXRlLm1lc3NhZ2VzLmxlbmd0aCAtIDFdLmNvbnRlbnQpO1xyXG5cclxuICByZXR1cm4gZmluYWxTdGF0ZS5tZXNzYWdlc1tmaW5hbFN0YXRlLm1lc3NhZ2VzLmxlbmd0aCAtIDFdLmNvbnRlbnQ7XHJcbn0iXX0=