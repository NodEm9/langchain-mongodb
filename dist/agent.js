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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWdlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFpQkEsOEJBdUhDO0FBeElELDhDQUFxRDtBQUNyRCxvREFBcUQ7QUFDckQsdURBQWdGO0FBQ2hGLHFEQUdpQztBQUNqQyxvREFBa0Q7QUFDbEQsb0RBQWtEO0FBQ2xELGlEQUE2QztBQUM3Qyw0REFBeUQ7QUFDekQsMEZBQXVFO0FBQ3ZFLGdEQUE4RDtBQUU5RCw2QkFBd0I7QUFDeEIseUJBQXVCO0FBRXZCLFNBQXNCLFNBQVMsQ0FBQyxNQUFtQixFQUFFLEtBQWEsRUFBRSxTQUFpQjs7UUFDbkYsNkNBQTZDO1FBQzdDLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQztRQUM3QixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFOUMseUJBQXlCO1FBQ3pCLE1BQU0sVUFBVSxHQUFHLHNCQUFVLENBQUMsSUFBSSxDQUFDO1lBQ2pDLFFBQVEsRUFBRSxJQUFBLHNCQUFVLEVBQWdCO2dCQUNsQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUMvQixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsd0NBQXdDO1FBQ3hDLE1BQU0sa0JBQWtCLEdBQUcsSUFBQSxZQUFJLEVBQzdCLEtBQTBCLEVBQUUsMENBQXJCLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBRTNDLE1BQU0sUUFBUSxHQUFHO2dCQUNmLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixTQUFTLEVBQUUsY0FBYztnQkFDekIs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QUFXLEVBQUUsT0FBTyxDQUFDO2FBQzdCLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUM7YUFDNUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU3QixvRUFBb0U7UUFDcEUsTUFBTSxZQUFZLEdBQUcsSUFBSSwyQ0FBWSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFFMUQsOENBQThDO1FBQzlDLDhEQUE4RDtRQUM5RCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUUvQyxtQkFBbUI7UUFDbkIsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUNqQztZQUNFLFFBQVEsRUFBRSxDQUFDLElBQUksdUJBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNwQyxFQUNELEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxZQUFZLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FDL0QsQ0FBQztRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6RSxPQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3JFLENBQUM7Q0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZW5BSUVtYmVkZGluZ3MgfSBmcm9tIFwiQGxhbmdjaGFpbi9vcGVuYWlcIjtcclxuaW1wb3J0IHsgQ2hhdEFudGhyb3BpYyB9IGZyb20gXCJAbGFuZ2NoYWluL2FudGhyb3BpY1wiO1xyXG5pbXBvcnQgeyBBSU1lc3NhZ2UsIEJhc2VNZXNzYWdlLCBIdW1hbk1lc3NhZ2UgfSBmcm9tIFwiQGxhbmdjaGFpbi9jb3JlL21lc3NhZ2VzXCI7XHJcbmltcG9ydCB7XHJcbiAgQ2hhdFByb21wdFRlbXBsYXRlLFxyXG4gIE1lc3NhZ2VzUGxhY2Vob2xkZXIsXHJcbn0gZnJvbSBcIkBsYW5nY2hhaW4vY29yZS9wcm9tcHRzXCI7XHJcbmltcG9ydCB7IFN0YXRlR3JhcGggfSBmcm9tIFwiQGxhbmdjaGFpbi9sYW5nZ3JhcGhcIjtcclxuaW1wb3J0IHsgQW5ub3RhdGlvbiB9IGZyb20gXCJAbGFuZ2NoYWluL2xhbmdncmFwaFwiO1xyXG5pbXBvcnQgeyB0b29sIH0gZnJvbSBcIkBsYW5nY2hhaW4vY29yZS90b29sc1wiO1xyXG5pbXBvcnQgeyBUb29sTm9kZSB9IGZyb20gXCJAbGFuZ2NoYWluL2xhbmdncmFwaC9wcmVidWlsdFwiO1xyXG5pbXBvcnQgeyBNb25nb0RCU2F2ZXIgfSBmcm9tIFwiQGxhbmdjaGFpbi9sYW5nZ3JhcGgtY2hlY2twb2ludC1tb25nb2RiXCI7XHJcbmltcG9ydCB7IE1vbmdvREJBdGxhc1ZlY3RvclNlYXJjaCB9IGZyb20gXCJAbGFuZ2NoYWluL21vbmdvZGJcIjtcclxuaW1wb3J0IHsgTW9uZ29DbGllbnQgfSBmcm9tIFwibW9uZ29kYlwiO1xyXG5pbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xyXG5pbXBvcnQgXCJkb3RlbnYvY29uZmlnXCI7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FsbEFnZW50KGNsaWVudDogTW9uZ29DbGllbnQsIHF1ZXJ5OiBzdHJpbmcsIHRocmVhZF9pZDogc3RyaW5nKSB7XHJcbiAgLy8gRGVmaW5lIHRoZSBNb25nb0RCIGRhdGFiYXNlIGFuZCBjb2xsZWN0aW9uXHJcbiAgY29uc3QgZGJOYW1lID0gXCJocl9kYXRhYmFzZVwiO1xyXG4gIGNvbnN0IGRiID0gY2xpZW50LmRiKGRiTmFtZSk7XHJcbiAgY29uc3QgY29sbGVjdGlvbiA9IGRiLmNvbGxlY3Rpb24oXCJlbXBsb3llZXNcIik7XHJcblxyXG4gIC8vIERlZmluZSB0aGUgZ3JhcGggc3RhdGVcclxuICBjb25zdCBHcmFwaFN0YXRlID0gQW5ub3RhdGlvbi5Sb290KHtcclxuICAgIG1lc3NhZ2VzOiBBbm5vdGF0aW9uPEJhc2VNZXNzYWdlW10+KHtcclxuICAgICAgcmVkdWNlcjogKHgsIHkpID0+IHguY29uY2F0KHkpLFxyXG4gICAgfSksXHJcbiAgfSk7XHJcblxyXG4gIC8vIERlZmluZSB0aGUgdG9vbHMgZm9yIHRoZSBhZ2VudCB0byB1c2VcclxuICBjb25zdCBlbXBsb3llZUxvb2t1cFRvb2wgPSB0b29sKFxyXG4gICAgYXN5bmMgKHsgcXVlcnksIG4gPSAxMCB9KSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiRW1wbG95ZWUgbG9va3VwIHRvb2wgY2FsbGVkXCIpO1xyXG5cclxuICAgICAgY29uc3QgZGJDb25maWcgPSB7XHJcbiAgICAgICAgY29sbGVjdGlvbjogY29sbGVjdGlvbixcclxuICAgICAgICBpbmRleE5hbWU6IFwidmVjdG9yX2luZGV4XCIsXHJcbiAgICAgICAgdGV4dEtleTogXCJlbWJlZGRpbmdfdGV4dFwiLFxyXG4gICAgICAgIGVtYmVkZGluZ0tleTogXCJlbWJlZGRpbmdcIixcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIEluaXRpYWxpemUgdmVjdG9yIHN0b3JlXHJcbiAgICAgIGNvbnN0IHZlY3RvclN0b3JlID0gbmV3IE1vbmdvREJBdGxhc1ZlY3RvclNlYXJjaChcclxuICAgICAgICBuZXcgT3BlbkFJRW1iZWRkaW5ncygpLFxyXG4gICAgICAgIGRiQ29uZmlnXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB2ZWN0b3JTdG9yZS5zaW1pbGFyaXR5U2VhcmNoV2l0aFNjb3JlKHF1ZXJ5LCBuKTtcclxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlc3VsdCk7XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBuYW1lOiBcImVtcGxveWVlX2xvb2t1cFwiLFxyXG4gICAgICBkZXNjcmlwdGlvbjogXCJHYXRoZXJzIGVtcGxveWVlIGRldGFpbHMgZnJvbSB0aGUgSFIgZGF0YWJhc2VcIixcclxuICAgICAgc2NoZW1hOiB6Lm9iamVjdCh7XHJcbiAgICAgICAgcXVlcnk6IHouc3RyaW5nKCkuZGVzY3JpYmUoXCJUaGUgc2VhcmNoIHF1ZXJ5XCIpLFxyXG4gICAgICAgIG46IHpcclxuICAgICAgICAgIC5udW1iZXIoKVxyXG4gICAgICAgICAgLm9wdGlvbmFsKClcclxuICAgICAgICAgIC5kZWZhdWx0KDEwKVxyXG4gICAgICAgICAgLmRlc2NyaWJlKFwiTnVtYmVyIG9mIHJlc3VsdHMgdG8gcmV0dXJuXCIpLFxyXG4gICAgICB9KSxcclxuICAgIH1cclxuICApO1xyXG5cclxuICBjb25zdCB0b29scyA9IFtlbXBsb3llZUxvb2t1cFRvb2xdO1xyXG4gIFxyXG4gIC8vIFdlIGNhbiBleHRyYWN0IHRoZSBzdGF0ZSB0eXBpbmcgdmlhIGBHcmFwaFN0YXRlLlN0YXRlYFxyXG4gIGNvbnN0IHRvb2xOb2RlID0gbmV3IFRvb2xOb2RlPHR5cGVvZiBHcmFwaFN0YXRlLlN0YXRlPih0b29scyk7XHJcblxyXG4gIGNvbnN0IG1vZGVsID0gbmV3IENoYXRBbnRocm9waWMoe1xyXG4gICAgbW9kZWw6IFwiY2xhdWRlLTMtNS1zb25uZXQtMjAyNDA2MjBcIixcclxuICAgIHRlbXBlcmF0dXJlOiAwLFxyXG4gIH0pLmJpbmRUb29scyh0b29scyk7XHJcblxyXG4gIC8vIERlZmluZSB0aGUgZnVuY3Rpb24gdGhhdCBkZXRlcm1pbmVzIHdoZXRoZXIgdG8gY29udGludWUgb3Igbm90XHJcbiAgZnVuY3Rpb24gc2hvdWxkQ29udGludWUoc3RhdGU6IHR5cGVvZiBHcmFwaFN0YXRlLlN0YXRlKSB7XHJcbiAgICBjb25zdCBtZXNzYWdlcyA9IHN0YXRlLm1lc3NhZ2VzO1xyXG4gICAgY29uc3QgbGFzdE1lc3NhZ2UgPSBtZXNzYWdlc1ttZXNzYWdlcy5sZW5ndGggLSAxXSBhcyBBSU1lc3NhZ2U7XHJcblxyXG4gICAgLy8gSWYgdGhlIExMTSBtYWtlcyBhIHRvb2wgY2FsbCwgdGhlbiB3ZSByb3V0ZSB0byB0aGUgXCJ0b29sc1wiIG5vZGVcclxuICAgIGlmIChsYXN0TWVzc2FnZS50b29sX2NhbGxzPy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIFwidG9vbHNcIjtcclxuICAgIH1cclxuICAgIC8vIE90aGVyd2lzZSwgd2Ugc3RvcCAocmVwbHkgdG8gdGhlIHVzZXIpXHJcbiAgICByZXR1cm4gXCJfX2VuZF9fXCI7XHJcbiAgfVxyXG5cclxuICAvLyBEZWZpbmUgdGhlIGZ1bmN0aW9uIHRoYXQgY2FsbHMgdGhlIG1vZGVsXHJcbiAgYXN5bmMgZnVuY3Rpb24gY2FsbE1vZGVsKHN0YXRlOiB0eXBlb2YgR3JhcGhTdGF0ZS5TdGF0ZSkge1xyXG4gICAgY29uc3QgcHJvbXB0ID0gQ2hhdFByb21wdFRlbXBsYXRlLmZyb21NZXNzYWdlcyhbXHJcbiAgICAgIFtcclxuICAgICAgICBcInN5c3RlbVwiLFxyXG4gICAgICAgIGBZb3UgYXJlIGEgaGVscGZ1bCBBSSBhc3Npc3RhbnQsIGNvbGxhYm9yYXRpbmcgd2l0aCBvdGhlciBhc3Npc3RhbnRzLiBVc2UgdGhlIHByb3ZpZGVkIHRvb2xzIHRvIHByb2dyZXNzIHRvd2FyZHMgYW5zd2VyaW5nIHRoZSBxdWVzdGlvbi4gSWYgeW91IGFyZSB1bmFibGUgdG8gZnVsbHkgYW5zd2VyLCB0aGF0J3MgT0ssIGFub3RoZXIgYXNzaXN0YW50IHdpdGggZGlmZmVyZW50IHRvb2xzIHdpbGwgaGVscCB3aGVyZSB5b3UgbGVmdCBvZmYuIEV4ZWN1dGUgd2hhdCB5b3UgY2FuIHRvIG1ha2UgcHJvZ3Jlc3MuIElmIHlvdSBvciBhbnkgb2YgdGhlIG90aGVyIGFzc2lzdGFudHMgaGF2ZSB0aGUgZmluYWwgYW5zd2VyIG9yIGRlbGl2ZXJhYmxlLCBwcmVmaXggeW91ciByZXNwb25zZSB3aXRoIEZJTkFMIEFOU1dFUiBzbyB0aGUgdGVhbSBrbm93cyB0byBzdG9wLiBZb3UgaGF2ZSBhY2Nlc3MgdG8gdGhlIGZvbGxvd2luZyB0b29sczoge3Rvb2xfbmFtZXN9LlxcbntzeXN0ZW1fbWVzc2FnZX1cXG5DdXJyZW50IHRpbWU6IHt0aW1lfS5gLFxyXG4gICAgICBdLFxyXG4gICAgICBuZXcgTWVzc2FnZXNQbGFjZWhvbGRlcihcIm1lc3NhZ2VzXCIpLFxyXG4gICAgXSk7XHJcblxyXG4gICAgY29uc3QgZm9ybWF0dGVkUHJvbXB0ID0gYXdhaXQgcHJvbXB0LmZvcm1hdE1lc3NhZ2VzKHtcclxuICAgICAgc3lzdGVtX21lc3NhZ2U6IFwiWW91IGFyZSBoZWxwZnVsIEhSIENoYXRib3QgQWdlbnQuXCIsXHJcbiAgICAgIHRpbWU6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgdG9vbF9uYW1lczogdG9vbHMubWFwKCh0b29sKSA9PiB0b29sLm5hbWUpLmpvaW4oXCIsIFwiKSxcclxuICAgICAgbWVzc2FnZXM6IHN0YXRlLm1lc3NhZ2VzLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbW9kZWwuaW52b2tlKGZvcm1hdHRlZFByb21wdCk7XHJcblxyXG4gICAgcmV0dXJuIHsgbWVzc2FnZXM6IFtyZXN1bHRdIH07XHJcbiAgfVxyXG5cclxuICAvLyBEZWZpbmUgYSBuZXcgZ3JhcGhcclxuICBjb25zdCB3b3JrZmxvdyA9IG5ldyBTdGF0ZUdyYXBoKEdyYXBoU3RhdGUpXHJcbiAgICAuYWRkTm9kZShcImFnZW50XCIsIGNhbGxNb2RlbClcclxuICAgIC5hZGROb2RlKFwidG9vbHNcIiwgdG9vbE5vZGUpXHJcbiAgICAuYWRkRWRnZShcIl9fc3RhcnRfX1wiLCBcImFnZW50XCIpXHJcbiAgICAuYWRkQ29uZGl0aW9uYWxFZGdlcyhcImFnZW50XCIsIHNob3VsZENvbnRpbnVlKVxyXG4gICAgLmFkZEVkZ2UoXCJ0b29sc1wiLCBcImFnZW50XCIpO1xyXG5cclxuICAvLyBJbml0aWFsaXplIHRoZSBNb25nb0RCIG1lbW9yeSB0byBwZXJzaXN0IHN0YXRlIGJldHdlZW4gZ3JhcGggcnVuc1xyXG4gIGNvbnN0IGNoZWNrcG9pbnRlciA9IG5ldyBNb25nb0RCU2F2ZXIoeyBjbGllbnQsIGRiTmFtZSB9KTtcclxuXHJcbiAgLy8gVGhpcyBjb21waWxlcyBpdCBpbnRvIGEgTGFuZ0NoYWluIFJ1bm5hYmxlLlxyXG4gIC8vIE5vdGUgdGhhdCB3ZSdyZSBwYXNzaW5nIHRoZSBtZW1vcnkgd2hlbiBjb21waWxpbmcgdGhlIGdyYXBoXHJcbiAgY29uc3QgYXBwID0gd29ya2Zsb3cuY29tcGlsZSh7IGNoZWNrcG9pbnRlciB9KTtcclxuXHJcbiAgLy8gVXNlIHRoZSBSdW5uYWJsZVxyXG4gIGNvbnN0IGZpbmFsU3RhdGUgPSBhd2FpdCBhcHAuaW52b2tlKFxyXG4gICAge1xyXG4gICAgICBtZXNzYWdlczogW25ldyBIdW1hbk1lc3NhZ2UocXVlcnkpXSxcclxuICAgIH0sXHJcbiAgICB7IHJlY3Vyc2lvbkxpbWl0OiAxNSwgY29uZmlndXJhYmxlOiB7IHRocmVhZF9pZDogdGhyZWFkX2lkIH0gfVxyXG4gICk7XHJcblxyXG4gIGNvbnNvbGUubG9nKGZpbmFsU3RhdGUubWVzc2FnZXNbZmluYWxTdGF0ZS5tZXNzYWdlcy5sZW5ndGggLSAxXS5jb250ZW50KTtcclxuXHJcbiAgcmV0dXJuIGZpbmFsU3RhdGUubWVzc2FnZXNbZmluYWxTdGF0ZS5tZXNzYWdlcy5sZW5ndGggLSAxXS5jb250ZW50O1xyXG59Il19