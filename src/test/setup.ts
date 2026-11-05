import { afterEach, beforeEach, vi } from "vitest";
import { db } from "../db";

beforeEach(async () => {
  await db.reset();
});

afterEach(() => {
  vi.useRealTimers();
});
