"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DateWheel } from "@/components/date-wheel";

const storageKey = "anshuu-custom-diaries-v1";
const startingDate = { day: 1, month: 1, year: 2000 };
const allowedTags = new Set([
  "A", "B", "BLOCKQUOTE", "BR", "DEL", "DIV", "EM", "FONT", "H1", "H2", "H3",
  "HR", "I", "LI", "OL", "P", "S", "SPAN", "STRONG", "U", "UL",
]);
const dangerousTags = new Set(["IFRAME", "OBJECT", "SCRIPT", "STYLE", "SVG", "MATH"]);

type DiaryPage = { content: string; drawing?: string };

type LocalDiary = {
  id: string;
  ownerName: string;
  title: string;
  salt: string;
  passwordVerifier: string;
  createdAt: string;
  updatedAt: string;
  pages: DiaryPage[];
};

type Notice = { tone: "saved" | "error" | "maintenance"; message: string };
type View = "shelf" | "create" | "unlock" | "book";
type EditorMode = "write" | "draw";

function isLocalDiary(value: unknown): value is LocalDiary {
  if (!value || typeof value !== "object") return false;
  const diary = value as Record<string, unknown>;
  return (
    typeof diary.id === "string" &&
    typeof diary.ownerName === "string" &&
    typeof diary.title === "string" &&
    typeof diary.salt === "string" &&
    typeof diary.passwordVerifier === "string" &&
    typeof diary.createdAt === "string" &&
    typeof diary.updatedAt === "string" &&
    Array.isArray(diary.pages) &&
    diary.pages.length > 0 &&
    diary.pages.every(
      (page) =>
        Boolean(page) &&
        typeof page === "object" &&
        typeof (page as Record<string, unknown>).content === "string" &&
        ((page as Record<string, unknown>).drawing === undefined ||
          (typeof (page as Record<string, unknown>).drawing === "string" &&
            /^data:image\/png;base64,[\da-z+/]+=*$/i.test((page as Record<string, unknown>).drawing as string))),
    )
  );
}

function sanitizeDiaryHtml(html: string) {
  const parsed = document.createElement("template");
  parsed.innerHTML = html;
  parsed.content.querySelectorAll("*").forEach((element) => {
    if (dangerousTags.has(element.tagName)) {
      element.remove();
      return;
    }

    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      if (attribute.name === "style") {
        const style = (element as HTMLElement).style;
        const safeStyles: Record<string, RegExp> = {
          color: /^(#[\da-f]{3,8}|[a-z]{3,20}|rgba?\([\d.% ,]+\)|hsla?\([\d.% ,]+\))$/i,
          backgroundColor: /^(#[\da-f]{3,8}|[a-z]{3,20}|rgba?\([\d.% ,]+\)|hsla?\([\d.% ,]+\))$/i,
          fontFamily: /^[\w ,"'_-]{1,60}$/,
          fontSize: /^(xx-small|x-small|small|medium|large|x-large|xx-large|[\d.]+(px|pt|em|rem|%))$/i,
          fontWeight: /^(normal|bold|[1-9]00)$/i,
          fontStyle: /^(normal|italic|oblique)$/i,
          textAlign: /^(left|right|center|justify)$/i,
          textDecoration: /^(none|underline|line-through|underline line-through)$/i,
        };
        const allowedProperties = new Set(
          Object.keys(safeStyles).map((property) =>
            property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
          ),
        );
        Array.from(style).forEach((property) => {
          if (!allowedProperties.has(property)) style.removeProperty(property);
        });
        Object.entries(safeStyles).forEach(([property, pattern]) => {
          const value = style.getPropertyValue(property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`));
          if (value && !pattern.test(value.trim())) {
            style.removeProperty(property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`));
          }
        });
        if (style.length === 0) element.removeAttribute("style");
        return;
      }

      if (element.tagName === "A" && attribute.name === "href") {
        try {
          const url = new URL(attribute.value);
          if (!["http:", "https:", "mailto:"].includes(url.protocol)) {
            element.removeAttribute(attribute.name);
          }
        } catch {
          element.removeAttribute(attribute.name);
        }
        return;
      }

      if (element.tagName === "FONT" && attribute.name === "size" && /^[1-7]$/.test(attribute.value)) {
        return;
      }

      if (element.tagName === "FONT" && attribute.name === "color" && /^#[\da-f]{3,8}$/i.test(attribute.value)) {
        return;
      }

      if (element.tagName === "FONT" && attribute.name === "face" && /^[\w ,"'_-]{1,60}$/.test(attribute.value)) {
        return;
      }

      element.removeAttribute(attribute.name);
    });
  });
  return parsed.innerHTML;
}

async function passwordHash(salt: string, password: string) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function dateCode(date: { day: number; month: number; year: number }) {
  return `${String(date.day).padStart(2, "0")}${String(date.month).padStart(2, "0")}${date.year}`;
}

function validDateCode(value: string) {
  if (!/^\d{8}$/.test(value)) return false;
  const day = Number(value.slice(0, 2));
  const month = Number(value.slice(2, 4));
  const year = Number(value.slice(4));
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCDate() === day &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCFullYear() === year &&
    date <= new Date()
  );
}

function formatCreatedAt(date: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
}

function executeEditorCommand(command: string, value?: string) {
  document.execCommand(command, false, value);
}

function EditorButton({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="editor-tool"
      onClick={onClick}
      onMouseDown={(event) => event.preventDefault()}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function DrawingPad({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState("#25211c");
  const [size, setSize] = useState(4);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    function resizeCanvas() {
      const currentCanvas = canvasRef.current;
      if (!currentCanvas) return;
      const snapshot = currentCanvas.toDataURL("image/png");
      const bounds = currentCanvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      currentCanvas.width = Math.max(1, Math.round(bounds.width * scale));
      currentCanvas.height = Math.max(1, Math.round(bounds.height * scale));
      const currentContext = currentCanvas.getContext("2d");
      if (!currentContext) return;
      currentContext.scale(scale, scale);
      const image = new Image();
      image.onload = () => {
        currentContext.drawImage(image, 0, 0, bounds.width, bounds.height);
      };
      image.src = snapshot;
    }

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);
    resizeCanvas();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !value) return;
    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = value;
  }, [value]);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
  }

  function startStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const position = point(event);
    if (!canvas || !context || !position) return;
    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    context.beginPath();
    context.moveTo(position.x, position.y);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = tool === "eraser" ? "#f5ecde" : color;
    context.lineWidth = tool === "eraser" ? size * 4 : size;
    context.lineTo(position.x + 0.1, position.y + 0.1);
    context.stroke();
  }

  function continueStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const position = point(event);
    if (!context || !position) return;
    context.lineTo(position.x, position.y);
    context.stroke();
  }

  function endStroke() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  }

  function clearDrawing() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  }

  return (
    <div className="drawing-pad">
      <div aria-label="Drawing tools" className="drawing-toolbar" role="toolbar">
        <button aria-pressed={tool === "pen"} onClick={() => setTool("pen")} type="button">Pen</button>
        <button aria-pressed={tool === "eraser"} onClick={() => setTool("eraser")} type="button">Eraser</button>
        <label className="drawing-color">
          Ink
          <input aria-label="Ink color" onChange={(event) => setColor(event.target.value)} type="color" value={color} />
        </label>
        <label className="drawing-brush">
          Size
          <input
            aria-label="Brush size"
            max="12"
            min="1"
            onChange={(event) => setSize(Number(event.target.value))}
            type="range"
            value={size}
          />
        </label>
        <button onClick={clearDrawing} type="button">Clear</button>
      </div>
      <canvas
        aria-label="Draw on your diary page"
        className="drawing-canvas"
        onPointerCancel={endStroke}
        onPointerDown={startStroke}
        onPointerMove={continueStroke}
        onPointerUp={endStroke}
        ref={canvasRef}
      />
      <p className="drawing-hint">Draw with your finger, stylus, or mouse.</p>
    </div>
  );
}

export function CustomDiary({
  initialView = "shelf",
  diaryId,
}: {
  initialView?: View;
  diaryId?: string;
}) {
  const router = useRouter();
  const [diaries, setDiaries] = useState<LocalDiary[]>([]);
  const [view, setView] = useState<View>(initialView);
  const [activeDiaryId, setActiveDiaryId] = useState<string | null>(diaryId ?? null);
  const [unlockDiaryId, setUnlockDiaryId] = useState<string | null>(null);
  const [date, setDate] = useState(startingDate);
  const [creationDate, setCreationDate] = useState(startingDate);
  const [pageIndex, setPageIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [editorMode, setEditorMode] = useState<EditorMode>("write");
  const [ready, setReady] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const skipEditorSyncRef = useRef(false);

  const activeDiary = diaries.find((diary) => diary.id === activeDiaryId);
  const pageContent = activeDiary?.pages[pageIndex]?.content ?? "";

  useEffect(() => {
    let loadedDiaries: LocalDiary[] = [];
    let loadError: unknown;
    try {
      const serialized = window.localStorage.getItem(storageKey);
      if (serialized) {
        const parsed: unknown = JSON.parse(serialized);
        if (!Array.isArray(parsed) || !parsed.every(isLocalDiary)) {
          throw new Error("The saved notebook data has an unexpected format.");
        }
        loadedDiaries = parsed.map((diary) => ({
          ...diary,
          pages: diary.pages.map((page) => ({
            content: sanitizeDiaryHtml(page.content),
            ...(page.drawing ? { drawing: page.drawing } : {}),
          })),
        }));
      }
    } catch (error) {
      loadError = error;
    }
    const timer = window.setTimeout(() => {
      if (loadError) {
        console.error("Unable to load locally saved notebooks.", loadError);
        setNotice({
          tone: "error",
          message: "We couldn't read the notebook saved in this browser. Your other page is still available.",
        });
      }
      setDiaries(loadedDiaries);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (view !== "book" || !editorRef.current) return;
    if (skipEditorSyncRef.current) {
      skipEditorSyncRef.current = false;
      return;
    }
    editorRef.current.innerHTML = sanitizeDiaryHtml(pageContent);
  }, [activeDiaryId, pageContent, pageIndex, view]);

  function persist(nextDiaries: LocalDiary[]) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextDiaries));
      return true;
    } catch (error) {
      console.error("Unable to save the notebook to this browser.", error);
      setNotice({
        tone: "error",
        message: "This browser couldn't save your notebook. Check available device storage and try again.",
      });
      return false;
    }
  }

  async function createNotebook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ownerName = String(formData.get("ownerName") ?? "").trim();
    const title = String(formData.get("diaryTitle") ?? "").trim();
    const birthday = String(formData.get("birthday") ?? "");

    if (!ownerName || !title || !validDateCode(birthday)) {
      setNotice({ tone: "error", message: "Add your name, diary name, and a valid date of birth." });
      return;
    }

    try {
      const salt = crypto.randomUUID();
      const verifier = await passwordHash(salt, birthday);
      const newDiary: LocalDiary = {
        id: crypto.randomUUID(),
        ownerName,
        title,
        salt,
        passwordVerifier: verifier,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pages: [{ content: "" }],
      };
      const nextDiaries = [...diaries, newDiary];
      if (!persist(nextDiaries)) return;
      setDiaries(nextDiaries);
      setActiveDiaryId(newDiary.id);
      setPageIndex(0);
      setView("book");
      router.push(`/my-diary/${newDiary.id}`);
    } catch (error) {
      console.error("Unable to create the notebook password.", error);
      setNotice({
        tone: "error",
        message: "This browser couldn't set up the notebook password. Please try again.",
      });
    }
  }

  async function unlockNotebook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const diary = diaries.find((entry) => entry.id === unlockDiaryId);
    if (!diary) {
      setNotice({ tone: "error", message: "That notebook is no longer available on this device." });
      setView("shelf");
      return;
    }

    try {
      const submittedHash = await passwordHash(diary.salt, dateCode(date));
      if (submittedHash !== diary.passwordVerifier) {
        setNotice({ tone: "error", message: "That date didn't unlock the notebook. Please try again." });
        return;
      }
      router.push(`/my-diary/${diary.id}`);
    } catch (error) {
      console.error("Unable to check the notebook password.", error);
      setNotice({ tone: "error", message: "This browser couldn't check the notebook password." });
    }
  }

  function updateCurrentPage() {
    const editor = editorRef.current;
    if (!editor || !activeDiary) return;
    const content = sanitizeDiaryHtml(editor.innerHTML);
    const now = new Date().toISOString();
    const nextDiaries = diaries.map((diary) =>
      diary.id === activeDiary.id
        ? {
            ...diary,
            updatedAt: now,
            pages: diary.pages.map((page, index) =>
              index === pageIndex ? { ...page, content } : page,
            ),
          }
        : diary,
    );
    skipEditorSyncRef.current = true;
    setDiaries(nextDiaries);
    if (persist(nextDiaries)) {
      setNotice({ tone: "saved", message: "Changes saved on this device." });
    }
  }

  function changePage(nextIndex: number) {
    if (!activeDiary || nextIndex < 0 || nextIndex >= activeDiary.pages.length) return;
    setFlipping(true);
    setPageIndex(nextIndex);
    window.setTimeout(() => setFlipping(false), 520);
  }

  function addPage() {
    if (!activeDiary) return;
    const nextDiaries = diaries.map((diary) =>
      diary.id === activeDiary.id
        ? {
            ...diary,
            updatedAt: new Date().toISOString(),
            pages: [...diary.pages, { content: "" }],
          }
        : diary,
    );
    if (!persist(nextDiaries)) return;
    setDiaries(nextDiaries);
    setFlipping(true);
    setPageIndex(activeDiary.pages.length);
    window.setTimeout(() => setFlipping(false), 520);
    setNotice({ tone: "saved", message: "A new page is ready and saved on this device." });
  }

  function rememberSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange();
    }
  }

  function runCommand(command: string, value?: string) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const selection = window.getSelection();
    if (selectionRef.current && selection) {
      selection.removeAllRanges();
      selection.addRange(selectionRef.current);
    }
    executeEditorCommand(command, value);
    rememberSelection();
    updateCurrentPage();
  }

  function insertLink() {
    let url: URL;
    try {
      url = new URL(linkUrl);
    } catch {
      setNotice({ tone: "error", message: "Enter a valid website or email link before inserting it." });
      return;
    }
    if (!["http:", "https:", "mailto:"].includes(url.protocol)) {
      setNotice({ tone: "error", message: "Enter a valid website or email link before inserting it." });
      return;
    }
    runCommand("createLink", url.href);
    setLinkUrl("");
  }

  function saveNotebook() {
    if (!persist(diaries)) return;
    setNotice({
      tone: "maintenance",
      message: "Anshuu's website is under maintenance, so we can't save your precious diary online. Your pages are safe on this device. Please come back in one week. We're sorry!",
    });
  }

  if (!ready) {
    return null;
  }

  if (view === "book") {
    if (!activeDiary) {
      return (
        <section className="custom-diary-app custom-diary-form-card">
          <p className="diary-kicker">This notebook isn&apos;t on this device.</p>
          <button className="book-text-button" onClick={() => router.push("/personal-diary")} type="button">My bookshelf</button>
        </section>
      );
    }
    const pageDrawing = activeDiary.pages[pageIndex]?.drawing ?? "";

    function updateDrawing(drawing: string) {
      if (!activeDiary) return;
      const nextDiaries = diaries.map((diary) =>
        diary.id === activeDiary.id
          ? {
              ...diary,
              updatedAt: new Date().toISOString(),
              pages: diary.pages.map((page, index) =>
                index === pageIndex ? { ...page, drawing } : page,
              ),
            }
          : diary,
      );
      setDiaries(nextDiaries);
      if (persist(nextDiaries)) setNotice({ tone: "saved", message: "Changes saved on this device." });
    }

    return (
      <section aria-label={`${activeDiary.title} editor`} className="custom-diary-app custom-book-app">
        <div className="book-topbar">
          <div className="book-title-row">
            <h1>{activeDiary.title}</h1>
            <span className="book-owner">{activeDiary.ownerName}</span>
          </div>
          <button aria-label="Back to diaries" className="book-text-button" onClick={() => router.push("/personal-diary")} type="button">
            <span aria-hidden="true">←</span><span className="book-back-label">Diaries</span>
          </button>
        </div>

        <div className={`book-spread${flipping ? " book-is-flipping" : ""}`}>
          <div className="book-writing-page">
            <div aria-label="Notebook formatting tools" className="editor-toolbar" role="toolbar">
              <EditorButton label="Undo" onClick={() => runCommand("undo")}>↶</EditorButton>
              <EditorButton label="Redo" onClick={() => runCommand("redo")}>↷</EditorButton>
              <span aria-hidden="true" className="toolbar-divider" />
              <EditorButton label="Bold" onClick={() => runCommand("bold")}><strong>B</strong></EditorButton>
              <EditorButton label="Italic" onClick={() => runCommand("italic")}><em>I</em></EditorButton>
              <EditorButton label="Underline" onClick={() => runCommand("underline")}><u>U</u></EditorButton>
              <EditorButton label="Strikethrough" onClick={() => runCommand("strikeThrough")}><s>S</s></EditorButton>
              <select aria-label="Font family" className="editor-select" defaultValue="Georgia" onChange={(event) => runCommand("fontName", event.target.value)}>
                <option value="Georgia">Serif</option>
                <option value="Arial">Sans serif</option>
                <option value="Courier New">Monospace</option>
                <option value="Instrument Serif">Display</option>
              </select>
              <select aria-label="Text style" className="editor-select" defaultValue="P" onChange={(event) => runCommand("formatBlock", event.target.value)}>
                <option value="P">Text</option>
                <option value="H1">Title</option>
                <option value="H2">Heading</option>
                <option value="H3">Subheading</option>
                <option value="BLOCKQUOTE">Quote</option>
              </select>
              <select aria-label="Text size" className="editor-select editor-size-select" defaultValue="3" onChange={(event) => runCommand("fontSize", event.target.value)}>
                <option value="2">Small</option>
                <option value="3">Normal</option>
                <option value="4">Large</option>
                <option value="5">Extra large</option>
                <option value="6">Huge</option>
              </select>
              <label className="editor-color" title="Text color">
                <span aria-hidden="true">A</span>
                <input aria-label="Text color" onChange={(event) => runCommand("foreColor", event.target.value)} type="color" />
              </label>
              <label className="editor-color editor-highlight" title="Highlight color">
                <span aria-hidden="true">▰</span>
                <input aria-label="Highlight color" onChange={(event) => runCommand("hiliteColor", event.target.value)} type="color" />
              </label>
              <input
                aria-label="Link URL"
                className="editor-link-input"
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="Link URL"
                type="url"
                value={linkUrl}
              />
              <EditorButton label="Insert link" onClick={insertLink}>↗</EditorButton>
              <EditorButton label="Bulleted list" onClick={() => runCommand("insertUnorderedList")}>•≡</EditorButton>
              <EditorButton label="Numbered list" onClick={() => runCommand("insertOrderedList")}>1≡</EditorButton>
              <EditorButton label="Align left" onClick={() => runCommand("justifyLeft")}>≡</EditorButton>
              <EditorButton label="Align center" onClick={() => runCommand("justifyCenter")}>≣</EditorButton>
              <EditorButton label="Align right" onClick={() => runCommand("justifyRight")}>≡</EditorButton>
              <EditorButton label="Clear formatting" onClick={() => runCommand("removeFormat")}>Tx</EditorButton>
            </div>

            <div className="book-page-heading">
              <span>PAGE {String(pageIndex + 1).padStart(2, "0")}</span>
              <span className="autosave-indicator"><i aria-hidden="true" />Saved</span>
            </div>
            <div aria-label="Page mode" className="page-mode-tabs" role="tablist">
              <button aria-selected={editorMode === "write"} onClick={() => setEditorMode("write")} role="tab" type="button">Write</button>
              <button aria-selected={editorMode === "draw"} onClick={() => setEditorMode("draw")} role="tab" type="button">Draw</button>
            </div>
            {editorMode === "write" ? (
              <div
                aria-label={`Write on page ${pageIndex + 1}`}
                className="book-editor"
                contentEditable
                data-placeholder="Write a little something…"
                onInput={updateCurrentPage}
                onKeyUp={rememberSelection}
                onMouseUp={rememberSelection}
                ref={editorRef}
                role="textbox"
                spellCheck
                suppressContentEditableWarning
              />
            ) : (
              <DrawingPad onChange={updateDrawing} value={pageDrawing} />
            )}
            <div className="book-page-controls">
              <button
                aria-label="Previous page"
                disabled={pageIndex === 0}
                onClick={() => changePage(pageIndex - 1)}
                type="button"
              >
                ← Previous
              </button>
              <span>{pageIndex + 1} / {activeDiary.pages.length}</span>
              <button
                aria-label="Next page"
                disabled={pageIndex >= activeDiary.pages.length - 1}
                onClick={() => changePage(pageIndex + 1)}
                type="button"
              >
                Next →
              </button>
              <button className="add-book-page" onClick={addPage} type="button">+ New page</button>
            </div>
          </div>
        </div>

        <div className="book-save-row">
          <p aria-live="polite" className={`book-save-status${notice ? ` status-${notice.tone}` : ""}`} role={notice?.tone === "error" ? "alert" : undefined}>
            {notice?.tone === "maintenance" ? "Your words are safe on this device." : notice?.tone === "error" ? notice.message : "Saved on this device"}
          </p>
          <button className="book-save-button" onClick={saveNotebook} type="button">
            Save <span aria-hidden="true">↗</span>
          </button>
        </div>
        {notice?.tone === "maintenance" && (
          <div aria-live="assertive" className="save-apology" role="alert">
            <span aria-hidden="true" className="apology-page">✦</span>
            <p>So sorry! Your words are still safe here.</p>
          </div>
        )}
      </section>
    );
  }

  if (view === "create") {
    return (
      <section aria-labelledby="create-diary-heading" className="custom-diary-app custom-diary-form-card">
        <button className="book-text-button form-back-button" onClick={() => router.push("/personal-diary")} type="button">
          ← My bookshelf
        </button>
        <p className="diary-kicker"><span aria-hidden="true">✦</span> A BOOK OF YOUR OWN</p>
        <h2 id="create-diary-heading">New notebook</h2>
        <p className="builder-intro">Name your diary and set its birthday lock.</p>
        <form className="diary-creation-form" onSubmit={(event) => void createNotebook(event)}>
          <label>
            Your name
            <input autoComplete="name" maxLength={60} name="ownerName" placeholder="What should we call you?" required />
          </label>
          <label>
            Diary name
            <input maxLength={80} name="diaryTitle" placeholder="Give your notebook a name" required />
          </label>
          <input name="birthday" type="hidden" value={dateCode(creationDate)} />
          <fieldset className="safe-lock-fieldset">
            <legend>Set your date-of-birth password</legend>
            <div aria-hidden="true" className="safe-lock-illustration">
              <span className="safe-lock-shackle" />
              <span className="safe-lock-dial">✦</span>
            </div>
            <div className="wheel-grid">
              <DateWheel
                label="Day"
                min={1}
                max={new Date(creationDate.year, creationDate.month, 0).getDate()}
                onChange={(day) => setCreationDate((current) => ({ ...current, day }))}
                value={Math.min(creationDate.day, new Date(creationDate.year, creationDate.month, 0).getDate())}
              />
              <DateWheel
                label="Month"
                min={1}
                max={12}
                onChange={(month) => setCreationDate((current) => ({
                  ...current,
                  month,
                  day: Math.min(current.day, new Date(current.year, month, 0).getDate()),
                }))}
                value={creationDate.month}
              />
              <DateWheel label="Year" min={1900} max={new Date().getFullYear()} onChange={(year) => setCreationDate((current) => ({ ...current, year }))} value={creationDate.year} />
            </div>
            <p className="date-format">DAY <span>·</span> MONTH <span>·</span> YEAR</p>
          </fieldset>
          <p className="local-storage-note">Saved on this device only.</p>
          <button className="diary-enter-button" type="submit">
            <span aria-hidden="true">✦</span>Create my notebook<span aria-hidden="true">↗</span>
          </button>
        </form>
        {notice?.tone === "error" && <p aria-live="polite" className="custom-diary-error" role="alert">{notice.message}</p>}
      </section>
    );
  }

  if (view === "unlock") {
    const diary = diaries.find((entry) => entry.id === unlockDiaryId);
    return (
      <section aria-labelledby="unlock-diary-heading" className="custom-diary-app custom-diary-form-card">
        <button className="book-text-button form-back-button" onClick={() => { setView("shelf"); setNotice(null); }} type="button">
          ← My bookshelf
        </button>
        <p className="diary-kicker"><span aria-hidden="true">✦</span> A LITTLE DATE LOCK</p>
        <h2 id="unlock-diary-heading">Open {diary?.title ?? "your notebook"}.</h2>
        <p className="builder-intro">Turn the birthday wheels to unlock this book on your device.</p>
        <form className="diary-unlock-form" onSubmit={(event) => void unlockNotebook(event)}>
          <div className="wheel-grid">
            <DateWheel label="Day" min={1} max={31} onChange={(day) => setDate((current) => ({ ...current, day }))} value={date.day} />
            <DateWheel label="Month" min={1} max={12} onChange={(month) => setDate((current) => ({ ...current, month }))} value={date.month} />
            <DateWheel label="Year" min={1900} max={2099} onChange={(year) => setDate((current) => ({ ...current, year }))} value={date.year} />
          </div>
          <p className="date-format">DAY <span>·</span> MONTH <span>·</span> YEAR</p>
          {notice?.tone === "error" && <p aria-live="polite" className="custom-diary-error" role="alert">{notice.message}</p>}
          <button className="diary-enter-button" type="submit"><span aria-hidden="true">✦</span>Unlock my notebook<span aria-hidden="true">↗</span></button>
        </form>
      </section>
    );
  }

  if (diaries.length === 0) return null;

  return (
    <section aria-label="Your saved diaries" className="custom-diary-app custom-diary-shelf">
      {notice?.tone === "error" && <p aria-live="polite" className="custom-diary-error" role="alert">{notice.message}</p>}
      {diaries.length > 0 && (
        <div aria-label="Your saved notebooks" className="saved-diary-list">
          {diaries.map((diary) => (
            <article className="saved-diary-card" key={diary.id}>
              <span aria-hidden="true" className="saved-diary-icon">✦</span>
              <div>
                <h3>{diary.title}</h3>
                <p>By {diary.ownerName} · Updated {formatCreatedAt(diary.updatedAt)}</p>
              </div>
              <button
                className="shelf-open-button"
                onClick={() => {
                  setUnlockDiaryId(diary.id);
                  setDate(startingDate);
                  setNotice(null);
                  setView("unlock");
                }}
                type="button"
              >
                Open <span aria-hidden="true">↗</span>
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
