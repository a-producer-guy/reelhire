"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import type { AirtableScene } from "@/lib/airtable";

interface SceneSearchProps {
  onSelect: (scene: AirtableScene) => void;
  excludeIds?: string[];
  onClose: () => void;
}

export function SceneSearch({ onSelect, excludeIds = [], onClose }: SceneSearchProps) {
  const [query, setQuery] = useState("");
  const [scenes, setScenes] = useState<AirtableScene[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Initial load
  useEffect(() => {
    fetchScenes("");
    inputRef.current?.focus();
  }, []);

  const fetchScenes = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      params.set("maxRecords", "50");

      const res = await fetch(`/api/airtable/scenes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setScenes(data.scenes || []);
      if (data.fieldNames?.length) setFieldNames(data.fieldNames);
    } catch {
      setError("Could not load scenes from Airtable");
      setScenes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchScenes(value), 300);
  };

  const filteredScenes = scenes.filter((s) => !excludeIds.includes(s.airtableId));

  // Client-side filter as fallback (in case Airtable formula doesn't work for all fields)
  const displayScenes = query
    ? filteredScenes.filter(
        (s) =>
          s.sceneCode.toLowerCase().includes(query.toLowerCase()) ||
          s.actorName.toLowerCase().includes(query.toLowerCase()) ||
          s.description.toLowerCase().includes(query.toLowerCase())
      )
    : filteredScenes;

  return (
    <div className="absolute right-0 top-full mt-1 w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-30 overflow-hidden">
      {/* Search header */}
      <div className="p-3 border-b border-slate-200 bg-slate-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by scene code or actor name..."
            className="w-full pl-10 pr-8 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                fetchScenes("");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-500">
            {loading ? "Searching..." : `${displayScenes.length} scenes found`}
          </p>
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Close
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="max-h-72 overflow-auto">
        {loading && scenes.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <p className="text-xs text-slate-500 mt-1">
              Check your Airtable API key in .env.local
            </p>
            {fieldNames.length > 0 && (
              <p className="text-xs text-slate-400 mt-2">
                Fields found: {fieldNames.join(", ")}
              </p>
            )}
          </div>
        ) : displayScenes.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500">
              {query ? `No scenes matching "${query}"` : "No scenes available"}
            </p>
          </div>
        ) : (
          displayScenes.map((scene) => (
            <button
              key={scene.airtableId}
              onClick={() => onSelect(scene)}
              className="w-full text-left px-4 py-3 hover:bg-violet-50 border-b border-slate-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-sm font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded shrink-0">
                  {scene.sceneCode}
                </span>
                <div className="min-w-0 flex-1">
                  {scene.actorName && (
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {scene.actorName}
                    </p>
                  )}
                  {scene.description && (
                    <p className="text-xs text-slate-500 truncate">
                      {scene.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {scene.shootDate && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {new Date(scene.shootDate).toLocaleDateString()}
                      </span>
                    )}
                    {scene.status && (
                      <span className="text-[10px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">
                        {scene.status}
                      </span>
                    )}
                    {scene.genre && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                        {scene.genre}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {loading && scenes.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
          <span className="text-xs text-slate-500">Refreshing...</span>
        </div>
      )}
    </div>
  );
}
