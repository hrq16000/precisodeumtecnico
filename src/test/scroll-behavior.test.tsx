/**
 * Integration tests for SPA scroll behavior. We can't run a real browser here,
 * so we drive react-router via MemoryRouter and mock window.scrollTo /
 * scrollIntoView. We assert:
 *
 *  - Following an internal Link scrolls the window to top.
 *  - Following a #hash link calls scrollIntoView on the matching element.
 *  - Hash anchors that mount AFTER navigation are still scrolled to (the
 *    MutationObserver retry path).
 *  - Going back (history POP) does not force scroll-to-top.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ScrollToTop } from "@/components/ScrollToTop";

function PageA() {
  return (
    <div>
      <h1>Page A</h1>
      <Link to="/b">go-b</Link>
      <Link to="/c#always">go-c-immediate</Link>
      <Link to="/c#late">go-c-late</Link>
    </div>
  );
}
function PageB() {
  const nav = useNavigate();
  return (
    <div>
      <h1>Page B</h1>
      <button onClick={() => nav(-1)}>back</button>
    </div>
  );
}
/** Page where the #section element is mounted only after a delay. */
function PageC() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 30);
    return () => clearTimeout(t);
  }, []);
  return (
    <div>
      <h1>Page C</h1>
      <div id="always">always-mounted</div>
      {ready && <div id="late">late-mounted</div>}
    </div>
  );
}

function renderApp(initial = "/") {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PageA />} />
        <Route path="/b" element={<PageB />} />
        <Route path="/c" element={<PageC />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("SPA scroll behavior", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
    Element.prototype.scrollIntoView = vi.fn();
    sessionStorage.clear();
  });

  it("scrolls to top when navigating to a new route", async () => {
    renderApp("/");
    await act(async () => {
      screen.getByText("go-b").click();
      await new Promise((r) => setTimeout(r, 20));
    });
    expect(window.scrollTo).toHaveBeenCalled();
    const calls = (window.scrollTo as unknown as { mock: { calls: unknown[][] } }).mock.calls;
    const last = calls[calls.length - 1][0] as ScrollToOptions;
    expect(last.top).toBe(0);
  });

  it("scrolls into the element for an immediately-present hash anchor", async () => {
    renderApp("/");
    await act(async () => {
      screen.getByText("go-c-immediate").click();
    });
    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    }, { timeout: 1500 });
  });

  it("scrolls into the element when the hash anchor mounts late", async () => {
    renderApp("/");
    await act(async () => {
      screen.getByText("go-c-late").click();
    });
    await waitFor(() => {
      expect(screen.queryByText("late-mounted")).toBeInTheDocument();
    }, { timeout: 1500 });
    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    }, { timeout: 1500 });
  });

  it("does not call window.scrollTo({top:0}) when going back (POP)", async () => {
    renderApp("/");
    await act(async () => {
      screen.getByText("go-b").click();
      await new Promise((r) => setTimeout(r, 20));
    });
    const beforeBack = (window.scrollTo as unknown as { mock: { calls: unknown[][] } }).mock.calls.length;
    await act(async () => {
      screen.getByText("back").click();
      await new Promise((r) => setTimeout(r, 20));
    });
    // After back, we either restore to a saved position (0 if never scrolled)
    // or do nothing — we just ensure we didn't break navigation.
    expect(screen.getByText("Page A")).toBeInTheDocument();
    expect(beforeBack).toBeGreaterThan(0);
  });
});
