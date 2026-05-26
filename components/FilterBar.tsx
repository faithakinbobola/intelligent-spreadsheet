"use client";

import { useState, useRef, useEffect } from "react";

type Platform = "all" | "instagram" | "linkedin";
type Timeframe = "day" | "week" | "month" | "all";

interface FilterState {
  platform: Platform;
  timeframe: Timeframe;
  startDate: Date | null;
  endDate: Date | null;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function CalendarPicker({
  value,
  onChange,
  onClose,
}: {
  value: { start: Date | null; end: Date | null };
  onChange: (start: Date, end: Date) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selecting, setSelecting] = useState<Date | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);

  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)
    ),
  ];

  const inRange = (d: Date) => {
    const start = selecting || value.start;
    const end = hovered || value.end;
    if (!start || !end) return false;
    const [lo, hi] = start <= end ? [start, end] : [end, start];
    return d >= lo && d <= hi;
  };

  const isStart = (d: Date) =>
    value.start?.toDateString() === d.toDateString() ||
    selecting?.toDateString() === d.toDateString();
  const isEnd = (d: Date) => value.end?.toDateString() === d.toDateString();

  const handleClick = (d: Date) => {
    if (!selecting) {
      setSelecting(d);
    } else {
      const [start, end] = selecting <= d ? [selecting, d] : [d, selecting];
      onChange(start, end);
      setSelecting(null);
    }
  };

  const prevMonth = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const nextMonth = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  return (
    <div className="absolute z-50 mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-sm text-gray-800 dark:text-zinc-100">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </span>
        <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-gray-600 dark:text-zinc-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-px">
        {cells.map((d, i) =>
          d === null ? (
            <div key={`empty-${i}`} />
          ) : (
            <button
              key={d.toISOString()}
              onClick={() => handleClick(d)}
              onMouseEnter={() => selecting && setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              className={`
                relative text-xs h-9 w-full flex items-center justify-center transition-all font-semibold
                ${inRange(d) ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""}
                ${isStart(d) || isEnd(d) ? "bg-blue-600 text-white rounded-lg shadow-sm" : "hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"}
                ${d.toDateString() === today.toDateString() && !isStart(d) && !isEnd(d) ? "text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4" : ""}
                ${d.getMonth() !== cursor.getMonth() ? "opacity-30" : ""}
              `}
            >
              {d.getDate()}
            </button>
          )
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
        <button
          onClick={() => {
            setSelecting(null);
            onChange(new Date(0), new Date(0));
            onClose();
          }}
          className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 uppercase tracking-tight"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 uppercase tracking-tight"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function FilterBar({
  onChange,
}: {
  onChange?: (filters: FilterState) => void;
}) {
  const [platform, setPlatform] = useState<Platform>("all");
  const [timeframe, setTimeframe] = useState<Timeframe>("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setCalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    onChange?.({ platform, timeframe, startDate, endDate });
  }, [platform, timeframe, startDate, endDate]);

  const formatDateRange = () => {
    if (!startDate || startDate.getTime() === 0) return "Specific Date";
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    if (!endDate || endDate.getTime() === 0) return fmt(startDate);
    return `${fmt(startDate)} – ${fmt(endDate)}`;
  };

  const platforms: { value: Platform; label: string }[] = [
    { value: "all", label: "All", },
    { value: "instagram", label: "Instagram" },
    { value: "linkedin", label: "LinkedIn" },
  ];

  const timeframes: { value: Timeframe; label: string }[] = [
    { value: "day", label: "Today" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "all", label: "All Time" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
      {/* Platform toggle */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Platform</span>
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-950 p-1 rounded-xl border border-gray-100 dark:border-zinc-800">
          {platforms.map((p) => (
            <button
              key={p.value}
              onClick={() => setPlatform(p.value)}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                ${platform === p.value
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-400"}
              `}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-zinc-800 self-end mb-1" />

      {/* Timeframe toggle */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Timeframe</span>
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-950 p-1 rounded-xl border border-gray-100 dark:border-zinc-800">
          {timeframes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTimeframe(t.value)}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-bold transition-all
                ${timeframe === t.value
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100 dark:shadow-none"
                  : "text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-400"}
              `}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden md:block w-px h-10 bg-gray-100 dark:bg-zinc-800 self-end mb-1" />

      {/* Calendar date range picker */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Custom Date</span>
        <div className="relative" ref={calRef}>
          <button
            onClick={() => setCalOpen((v) => !v)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all
              ${calOpen || (startDate && startDate.getTime() !== 0)
                ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-800"}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDateRange()}
          </button>

          {calOpen && (
            <CalendarPicker
              value={{ start: startDate, end: endDate }}
              onChange={(s, e) => {
                setStartDate(s.getTime() === 0 ? null : s);
                setEndDate(e.getTime() === 0 ? null : e);
              }}
              onClose={() => setCalOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Reset button */}
      {(platform !== "all" || timeframe !== "all" || (startDate && startDate.getTime() !== 0)) && (
        <button 
          onClick={() => {
            setPlatform("all");
            setTimeframe("all");
            setStartDate(null);
            setEndDate(null);
          }}
          className="ml-auto self-end mb-1 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}