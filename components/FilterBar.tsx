"use client";

import { useState, useRef, useEffect } from "react";

type Platform = "all" | "instagram" | "linkedin";
type Timeframe = "day" | "week" | "month";

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
    <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600">
          ‹
        </button>
        <span className="font-semibold text-sm text-gray-800">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600">
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7">
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
                relative text-xs h-8 w-full flex items-center justify-center transition-colors
                ${inRange(d) ? "bg-blue-50 text-blue-700" : ""}
                ${isStart(d) || isEnd(d) ? "bg-blue-600 text-white rounded-full" : "hover:bg-gray-100 rounded-full"}
                ${d.toDateString() === today.toDateString() && !isStart(d) && !isEnd(d) ? "font-bold text-blue-600" : ""}
              `}
            >
              {d.getDate()}
            </button>
          )
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => {
            setSelecting(null);
            onChange(new Date(0), new Date(0));
            onClose();
          }}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
        <button
          onClick={onClose}
          className="text-xs font-medium text-blue-600 hover:text-blue-800"
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
  const [timeframe, setTimeframe] = useState<Timeframe>("week");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);

  // Close calendar on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setCalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Emit changes
  useEffect(() => {
    onChange?.({ platform, timeframe, startDate, endDate });
  }, [platform, timeframe, startDate, endDate]);

  const formatDateRange = () => {
    if (!startDate || startDate.getTime() === 0) return "Pick date range";
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    if (!endDate || endDate.getTime() === 0) return fmt(startDate);
    return `${fmt(startDate)} – ${fmt(endDate)}`;
  };

  const platforms: { value: Platform; label: string; icon: string }[] = [
    { value: "all", label: "All", icon: "⊞" },
    {
      value: "instagram",
      label: "Instagram",
      icon: "📸",
    },
    {
      value: "linkedin",
      label: "LinkedIn",
      icon: "💼",
    },
  ];

  const timeframes: { value: Timeframe; label: string }[] = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* Platform filter */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {platforms.map((p) => (
          <button
            key={p.value}
            onClick={() => setPlatform(p.value)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${platform === p.value
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"}
            `}
          >
            <span>{p.icon}</span>
            {p.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-8 bg-gray-200" />

      {/* Timeframe toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {timeframes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTimeframe(t.value)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${timeframe === t.value
                ? "bg-blue-600 text-white shadow"
                : "text-gray-500 hover:text-gray-700"}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-8 bg-gray-200" />

      {/* Calendar date range picker */}
      <div className="relative" ref={calRef}>
        <button
          onClick={() => setCalOpen((v) => !v)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
            ${calOpen || (startDate && startDate.getTime() !== 0)
              ? "border-blue-500 text-blue-700 bg-blue-50"
              : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"}
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

      {/* Active filter badges */}
      {(platform !== "all" || (startDate && startDate.getTime() !== 0)) && (
        <div className="flex items-center gap-2 ml-auto">
          {platform !== "all" && (
            <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">
              {platforms.find((p) => p.value === platform)?.icon} {platform}
              <button onClick={() => setPlatform("all")} className="ml-1 hover:text-blue-900">×</button>
            </span>
          )}
          {startDate && startDate.getTime() !== 0 && (
            <span className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded-full">
              📅 {formatDateRange()}
              <button onClick={() => { setStartDate(null); setEndDate(null); }} className="ml-1 hover:text-purple-900">×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}