import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDoubleLeftIcon, Bars3Icon } from "@heroicons/react/24/outline";

type IconComp = (props: { className?: string }) => JSX.Element;

export type SidebarItem = {
  id: string;
  label: string;
  icon?: IconComp;
  active?: boolean;
  onClick?: () => void;
  href?: string;
};

export type SidebarGroup = {
  title?: string;
  items: SidebarItem[];
};

export default function Sidebar({
  expanded,
  setExpanded,
  groups,
  user,
  onProfileClick,
}: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  groups: SidebarGroup[];
  user?: { name: string; role?: string; avatarUrl?: string };
  onProfileClick?: () => void;
}) {
  // Keyboard shortcut: Ctrl/Cmd + B to toggle sidebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setExpanded(!expanded);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [expanded, setExpanded]);

  return (
    <aside
      className={`fixed left-0 top-20 h-[calc(100vh-5rem)] ${
        expanded ? "w-64" : "w-20"
      } bg-[#0f1020] border-r border-gray-800 transition-all duration-300 z-40 overflow-hidden shadow-2xl`}
    >
      <div className="h-full flex flex-col">
        {/* Sidebar Toggle Button at Top */}
        <div className="p-3 border-b border-gray-800 flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-white p-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
            title={`${expanded ? "Collapse" : "Expand"} sidebar (Ctrl/Cmd + B)`}
          >
            {expanded ? (
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* User Profile Section - Moved to Top */}
        {user && (
          <div className="p-4 border-b border-gray-800">
            <div
              onClick={() => onProfileClick && onProfileClick()}
              className={`flex cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-all ${
                expanded ? "items-center gap-3" : "flex-col items-center gap-2"
              }`}
              title="Click to change profile picture"
            >
              {user.avatarUrl ? (
                <div
                  className={`${
                    expanded ? "w-12 h-12" : "w-10 h-10"
                  } rounded-full overflow-hidden border-2 border-purple-500 shadow-lg flex-shrink-0`}
                >
                  <Image
                    src={
                      user.avatarUrl.startsWith("http")
                        ? user.avatarUrl
                        : `${process.env.NEXT_PUBLIC_API_BASE || ""}${
                            user.avatarUrl
                          }`
                    }
                    alt={user.name || "User"}
                    width={expanded ? 48 : 40}
                    height={expanded ? 48 : 40}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div
                  className={`${
                    expanded ? "w-12 h-12" : "w-10 h-10"
                  } rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center border-2 border-purple-500 shadow-lg`}
                >
                  <span
                    className={`${
                      expanded ? "text-lg" : "text-base"
                    } font-bold`}
                  >
                    {(user.name || "?").trim().charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {expanded && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-semibold truncate">
                    {user.name}
                  </div>
                  <div className="text-sm text-purple-400 capitalize">
                    {(() => {
                      const role = user.role as string;
                      const pos =
                        (user as any).position ||
                        (user as any).committee_position;
                      if ((role === "ADMIN" || role === "MEMBER") && pos)
                        return pos;
                      return role || "Member";
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((g, gi) => (
            <div key={gi} className="mb-5">
              {expanded && g.title && (
                <div className="text-[12px] uppercase tracking-wider font-semibold text-gray-500 px-3 mb-2">
                  {g.title}
                </div>
              )}
              <div className="space-y-2">
                {g.items.map((it) => {
                  const Icon = it.icon as any;
                  const active = it.active;
                  return (
                    <button
                      key={it.id}
                      onClick={it.onClick}
                      className={`w-full flex items-center ${
                        expanded ? "gap-2.5 px-3" : "justify-center px-2"
                      } py-2 rounded-lg transition-all ${
                        active
                          ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-md"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {Icon ? (
                        <Icon
                          className={`${expanded ? "w-4 h-4" : "w-5 h-5"}`}
                        />
                      ) : (
                        <span className="w-4 h-4" />
                      )}
                      {expanded && (
                        <span className="text-sm font-medium">{it.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {!expanded && gi < groups.length - 1 && (
                <div className="my-4 mx-auto w-10 h-px bg-gray-700/50" />
              )}
            </div>
          ))}
        </div>

        {/* Keyboard Shortcut Hint */}
        {expanded && (
          <div className="p-3 border-t border-gray-800">
            <div className="text-[10px] text-gray-500 text-center">
              Press Ctrl/Cmd + B to toggle
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
