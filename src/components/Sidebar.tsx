import React from 'react';

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
}: {
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  groups: SidebarGroup[];
  user?: { name: string; role?: string; avatarUrl?: string };
}) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full ${expanded ? 'w-64' : 'w-16'} bg-[#0f1020] border-r border-gray-800 transition-all duration-300 z-40 mt-16 rounded-tr-2xl rounded-br-2xl overflow-hidden`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500" />
          {expanded && (
            <div className="text-white font-semibold">Panel</div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          {groups.map((g, gi) => (
            <div key={gi} className="mb-4">
              {expanded && g.title && (
                <div className="text-xs uppercase tracking-wider text-gray-400 px-2 mb-2">
                  {g.title}
                </div>
              )}
              <div className="space-y-1">
                {g.items.map((it) => {
                  const Icon = it.icon as any;
                  const active = it.active;
                  return (
                    <button
                      key={it.id}
                      onClick={it.onClick}
                      className={`w-full flex items-center ${expanded ? 'gap-3 px-3' : 'justify-center'} py-2 rounded-lg transition ${active ? 'bg-white/10 text-white border border-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                    >
                      {Icon ? <Icon className="w-5 h-5" /> : <span className="w-5 h-5" />}
                      {expanded && <span className="text-sm">{it.label}</span>}
                    </button>
                  );
                })}
              </div>
              {!expanded && gi < groups.length - 1 && (
                <div className="my-4 mx-auto w-8 h-px bg-gray-700" />
              )}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-gray-800">
          {user ? (
            <div className={`flex ${expanded ? 'items-center gap-3' : 'flex-col items-center gap-2'}`}>
              <img src={user.avatarUrl || '/assets/placeholder.png'} className="w-8 h-8 rounded-full object-cover border border-gray-700" />
              {expanded ? (
                <div className="text-left">
                  <div className="text-sm text-white font-medium">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.role || ''}</div>
                </div>
              ) : null}
            </div>
          ) : null}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 w-full bg-white/5 hover:bg-white/10 text-gray-200 text-sm py-2 rounded-lg"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
    </aside>
  );
}

