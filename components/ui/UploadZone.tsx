"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Music2, ImageIcon, X, Check } from "lucide-react";

type UploadZoneType = "audio" | "image";

interface UploadZoneProps {
  type: UploadZoneType;
  accept: string;
  maxMB: number;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

const CONFIGS = {
  audio: {
    icon: Music2,
    label: "Drop your audio file here",
    sublabel: "MP3, WAV, FLAC, OGG, AAC",
    acceptedTypes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/flac", "audio/aac", "audio/x-m4a"],
  },
  image: {
    icon: ImageIcon,
    label: "Drop cover art here",
    sublabel: "JPG, PNG, WebP",
    acceptedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
};

export default function UploadZone({
  type,
  accept,
  maxMB,
  file,
  onChange,
  error,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const config = CONFIGS[type];
  const Icon = config.icon;

  const validate = useCallback(
    (f: File): string | null => {
      if (!config.acceptedTypes.includes(f.type) && f.type !== "") {
        return `Invalid file type. Allowed: ${config.sublabel}`;
      }
      if (f.size > maxMB * 1024 * 1024) {
        return `File must be under ${maxMB}MB`;
      }
      return null;
    },
    [config, maxMB]
  );

  const handleFile = (f: File) => {
    const err = validate(f);
    if (err) { setLocalError(err); return; }
    setLocalError(null);
    onChange(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const displayError = error || localError;
  const hasFile = !!file;

  // Image preview URL
  const previewUrl = file && type === "image" ? URL.createObjectURL(file) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          position: "relative",
          borderRadius: "16px",
          border: `1.5px dashed ${
            dragging
              ? "#7c3aed"
              : hasFile
              ? "rgba(124,58,237,0.5)"
              : "rgba(255,255,255,0.08)"
          }`,
          background: dragging
            ? "rgba(124,58,237,0.08)"
            : hasFile
            ? "rgba(124,58,237,0.05)"
            : "rgba(19,19,31,0.6)",
          padding: type === "image" && previewUrl ? "0" : "28px 20px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          overflow: "hidden",
          minHeight: type === "image" && previewUrl ? "140px" : undefined,
          boxShadow: dragging ? "0 0 0 3px rgba(124,58,237,0.2)" : "none",
        }}
      >
        {/* Image preview */}
        {type === "image" && previewUrl ? (
          <div style={{ position: "relative", width: "100%", height: "140px" }}>
            <Image
              src={previewUrl}
              alt="Cover preview"
              fill
              sizes="(max-width: 600px) 100vw, 560px"
              style={{ objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: "10px",
                  padding: "8px 14px",
                }}
              >
                <Check size={16} style={{ color: "#a78bfa" }} />
                <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 600 }}>
                  {file!.name}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: hasFile
                  ? "linear-gradient(135deg, #7c3aed, #a78bfa)"
                  : "rgba(37,37,56,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                boxShadow: hasFile ? "0 4px 16px rgba(124,58,237,0.4)" : "none",
              }}
            >
              {hasFile ? (
                <Check size={22} style={{ color: "#fff" }} />
              ) : (
                <Icon size={22} style={{ color: hasFile ? "#fff" : "#5a5a7a" }} />
              )}
            </div>
            {hasFile ? (
              <div>
                <p style={{ color: "#a78bfa", fontSize: "0.875rem", fontWeight: 600, margin: 0 }}>
                  {file!.name}
                </p>
                <p style={{ color: "#5a5a7a", fontSize: "0.75rem", margin: "4px 0 0" }}>
                  {(file!.size / 1024 / 1024).toFixed(1)}MB · Click to change
                </p>
              </div>
            ) : (
              <div>
                <p style={{ color: "#e0e0f0", fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>
                  {config.label}
                </p>
                <p style={{ color: "#5a5a7a", fontSize: "0.8rem", margin: "4px 0 0" }}>
                  or click to browse · {config.sublabel} · max {maxMB}MB
                </p>
              </div>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onInputChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Clear button */}
      {hasFile && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(null); setLocalError(null); }}
          style={{
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            background: "none",
            border: "none",
            color: "#5a5a7a",
            fontSize: "0.8rem",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "8px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#5a5a7a")}
        >
          <X size={14} />
          Remove
        </button>
      )}

      {displayError && (
        <p style={{ color: "#f87171", fontSize: "0.8rem", margin: 0 }}>{displayError}</p>
      )}
    </div>
  );
}
