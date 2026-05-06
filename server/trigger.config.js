import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "appointment-management",
  runtime: "node",
  logLevel: "log",
  // Tells Trigger.dev where to look for tasks
  dirs: ["./trigger"],
});
