CREATE INDEX "Child_parentId_index" ON "Child" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "LearningSession_childId_startedAt_index" ON "LearningSession" USING btree ("childId","startedAt");--> statement-breakpoint
CREATE INDEX "LlmCallLog_childId_index" ON "LlmCallLog" USING btree ("childId");--> statement-breakpoint
CREATE INDEX "Loop_sessionId_index" ON "Loop" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "MapNode_childId_index" ON "MapNode" USING btree ("childId");