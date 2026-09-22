"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  LayoutDashboard,
  MapPin,
  Menu,
  Search,
  Settings2,
  Store as StoreIcon,
  UsersRound,
  X,
  BriefcaseBusiness,
  CalendarDays,
  TrendingUp,
  Mail,
  SlidersHorizontal,
} from "lucide-react";
import type {
  DashboardData,
  Section,
  User,
  Store,
  Company,
  Employee,
} from "@/lib/types";

type RecordItem = User | Store | Company | Employee;
const nav = [
  {
    key: "overview",
    label: "ダッシュボード",
    icon: LayoutDashboard,
    href: "/",
  },
  { key: "users", label: "ユーザー", icon: UsersRound, href: "/users" },
  { key: "stores", label: "店舗", icon: StoreIcon, href: "/stores" },
  {
    key: "companies",
    label: "企業・業績",
    icon: Building2,
    href: "/companies",
  },
  {
    key: "employees",
    label: "社員",
    icon: BriefcaseBusiness,
    href: "/employees",
  },
] as const;
const titles: Record<
  Section,
  { eyebrow: string; title: string; description: string }
> = {
  overview: {
    eyebrow: "OVERVIEW",
    title: "ダッシュボード",
    description: "ビジネス全体の動きを、ひと目で。",
  },
  users: {
    eyebrow: "PEOPLE / USERS",
    title: "ユーザー",
    description: "登録ユーザーの情報と利用状況を確認できます。",
  },
  stores: {
    eyebrow: "LOCATIONS / STORES",
    title: "店舗",
    description: "各店舗の売上や運営状況をまとめて確認できます。",
  },
  companies: {
    eyebrow: "BUSINESS / COMPANIES",
    title: "企業・業績",
    description: "企業ごとの業績と成長を比較できます。",
  },
  employees: {
    eyebrow: "PEOPLE / EMPLOYEES",
    title: "社員",
    description: "所属や役割から社員を探せます。",
  },
};

const yen = (n: number) => `¥${n.toLocaleString("ja-JP")}`;
const date = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;

function Growth({ value }: { value: number }) {
  return (
    <span className={`growth ${value < 0 ? "negative" : "positive"}`}>
      {value < 0 ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
      {pct(value)}
    </span>
  );
}

function Avatar({
  initials,
  color,
  size = "normal",
}: {
  initials: string;
  color: string;
  size?: "normal" | "large";
}) {
  return (
    <span
      className={`avatar ${size === "large" ? "avatar-large" : ""}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}

function Status({ value }: { value: string }) {
  const tone = ["アクティブ", "営業中", "在籍", "好調"].includes(value)
    ? "good"
    : ["休止中", "要注目"].includes(value)
      ? "warn"
      : "neutral";
  return (
    <span className={`status status-${tone}`}>
      <span className="status-dot" />
      {value}
    </span>
  );
}

function getCompany(data: DashboardData, id: string) {
  return data.companies.find((company) => company.id === id)?.name ?? "—";
}

function matches(item: RecordItem, query: string, company: string) {
  const text = Object.values(item).join(" ").toLocaleLowerCase("ja-JP");
  return (
    text.includes(query.toLocaleLowerCase("ja-JP")) &&
    (!company ||
      ("companyId" in item ? item.companyId === company : item.id === company))
  );
}

export default function Dashboard({
  data,
  section,
}: {
  data: DashboardData;
  section: Section;
}) {
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const rows = useMemo(() => {
    if (section === "overview") return [];
    return data[section].filter((item) => matches(item, query, companyFilter));
  }, [data, section, query, companyFilter]);
  const title = titles[section];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <span />
          </span>
          <span>
            atlas<span className="brand-period">.</span>
          </span>
        </div>
        <div className="workspace-picker">
          <span className="workspace-icon">A</span>
          <span>
            <strong>Atlas Workspace</strong>
            <small>サンプル環境</small>
          </span>
          <ChevronDown size={15} />
        </div>
        <div className="nav-caption">ワークスペース</div>
        <nav className="side-nav" aria-label="メインナビゲーション">
          {nav.map(({ key, label, icon: Icon, href }) => (
            <Link
              key={key}
              href={href}
              className={`nav-link ${section === key ? "active" : ""}`}
              onClick={() => {
                setMobileNav(false);
                setSelected(null);
              }}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {section === key && <span className="nav-active-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-bottom">
          <button
            type="button"
            className="nav-link nav-button"
            onClick={() => setShowHelp(true)}
          >
            <CircleHelp size={18} />
            ヘルプ
          </button>
          <button
            type="button"
            className="nav-link nav-button"
            onClick={() => setShowHelp(true)}
          >
            <Settings2 size={18} />
            設定について
          </button>
        </div>
        <div className="sidebar-profile">
          <span className="profile-avatar">DE</span>
          <span>
            <strong>Demo User</strong>
            <small>管理者</small>
          </span>
          <ChevronDown size={15} />
        </div>
      </aside>

      {mobileNav && (
        <button
          type="button"
          className="mobile-overlay"
          aria-label="メニューを閉じる"
          onClick={() => setMobileNav(false)}
        />
      )}

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="icon-button mobile-menu"
              aria-label="メニューを開く"
              onClick={() => setMobileNav(true)}
            >
              <Menu size={21} />
            </button>
            <span className="breadcrumb-root">Workspace</span>
            <ChevronRight size={15} className="breadcrumb-chevron" />
            <span className="breadcrumb-current">{title.title}</span>
          </div>
          <div className="topbar-right">
            <span className="demo-indicator">
              <span />
              デモデータ
            </span>
            <div className="topbar-divider" />
            <button
              type="button"
              className="icon-button notification-button"
              aria-label="お知らせ"
              onClick={() => setShowNotices(!showNotices)}
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <span className="topbar-avatar">DE</span>
          </div>
          {showNotices && (
            <div className="popover notice-popover">
              <strong>お知らせ</strong>
              <p>現在、新しいお知らせはありません。</p>
              <small>この画面はサンプルデータを表示しています。</small>
            </div>
          )}
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                {title.eyebrow}
              </div>
              <h1>{title.title}</h1>
              <p>{title.description}</p>
            </div>
            <div className="heading-date">
              <CalendarDays size={17} /> 2026年9月
            </div>
          </div>
          {section === "overview" ? (
            <Overview data={data} onSelect={setSelected} />
          ) : (
            <>
              <div className="list-toolbar">
                <div className="list-title">
                  <h2>
                    {title.title}一覧 <span>{data[section].length}</span>
                  </h2>
                  <p>項目をクリックすると詳しい情報を表示します</p>
                </div>
                <div className="list-controls">
                  <label className="search-field">
                    <Search size={17} />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="名前やキーワードで検索"
                      aria-label="一覧を検索"
                    />
                    {query && (
                      <button
                        type="button"
                        aria-label="検索を消去"
                        onClick={() => setQuery("")}
                      >
                        <X size={15} />
                      </button>
                    )}
                  </label>
                  <label className="filter-field">
                    <SlidersHorizontal size={16} />
                    <select
                      aria-label="企業で絞り込み"
                      value={companyFilter}
                      onChange={(event) => setCompanyFilter(event.target.value)}
                    >
                      <option value="">すべての企業</option>
                      {data.companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} />
                  </label>
                </div>
              </div>
              <div className="table-card">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {section === "users" && (
                          <>
                            <th>ユーザー</th>
                            <th>企業</th>
                            <th>プラン</th>
                            <th>登録日</th>
                            <th>ステータス</th>
                          </>
                        )}
                        {section === "stores" && (
                          <>
                            <th>店舗名</th>
                            <th>エリア / カテゴリ</th>
                            <th>月間売上</th>
                            <th>前月比</th>
                            <th>ステータス</th>
                          </>
                        )}
                        {section === "companies" && (
                          <>
                            <th>企業名</th>
                            <th>業種</th>
                            <th>売上高</th>
                            <th>前年比</th>
                            <th>ステータス</th>
                          </>
                        )}
                        {section === "employees" && (
                          <>
                            <th>社員</th>
                            <th>企業</th>
                            <th>部署 / 役職</th>
                            <th>勤務地</th>
                            <th>ステータス</th>
                          </>
                        )}
                        <th>
                          <span className="sr-only">詳細</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => setSelected(item)}
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") setSelected(item);
                          }}
                          aria-label={`${item.name}の詳細を表示`}
                          className="clickable-row"
                        >
                          {section === "users" && (
                            <UserCells item={item as User} data={data} />
                          )}
                          {section === "stores" && (
                            <StoreCells item={item as Store} />
                          )}
                          {section === "companies" && (
                            <CompanyCells item={item as Company} />
                          )}
                          {section === "employees" && (
                            <EmployeeCells
                              item={item as Employee}
                              data={data}
                            />
                          )}
                          <td className="row-arrow">
                            <ChevronRight size={18} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rows.length === 0 ? (
                  <div className="empty-state">
                    <Search size={26} />
                    <strong>該当するデータがありません</strong>
                    <span>検索条件を変えてお試しください。</span>
                  </div>
                ) : (
                  <div className="table-footer">
                    <span>{rows.length} 件を表示中</span>
                    <span>全 {data[section].length} 件</span>
                  </div>
                )}
              </div>
            </>
          )}
          <footer className="footer">
            <span>© 2026 Atlas. Sample workspace.</span>
            <span>JSON データを使用したデモ環境</span>
          </footer>
        </div>
      </main>

      {selected && (
        <Detail item={selected} data={data} onClose={() => setSelected(null)} />
      )}
      {showHelp && (
        <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
          <div
            className="help-modal"
            role="dialog"
            aria-modal="true"
            aria-label="デモについて"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="icon-button close-button"
              onClick={() => setShowHelp(false)}
              aria-label="閉じる"
            >
              <X size={20} />
            </button>
            <span className="modal-icon">
              <Command size={22} />
            </span>
            <h2>Atlas サンプル環境</h2>
            <p>
              ユーザー、店舗、企業・業績、社員の情報を確認できる実験用のダッシュボードです。データは{" "}
              <code>data/*.json</code> で管理し、<code>lib/repository.ts</code>{" "}
              を通して取得しています。
            </p>
            <button
              className="primary-button"
              onClick={() => setShowHelp(false)}
            >
              確認しました <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function UserCells({ item, data }: { item: User; data: DashboardData }) {
  return (
    <>
      <td>
        <div className="person-cell">
          <Avatar initials={item.initials} color={item.color} />
          <span>
            <strong>{item.name}</strong>
            <small>{item.email}</small>
          </span>
        </div>
      </td>
      <td>{getCompany(data, item.companyId)}</td>
      <td>
        <span className="plan-tag">{item.plan}</span>
      </td>
      <td className="muted-cell">{date(item.joinedAt)}</td>
      <td>
        <Status value={item.status} />
      </td>
    </>
  );
}
function StoreCells({ item }: { item: Store }) {
  return (
    <>
      <td>
        <div className="name-cell">
          <span className="row-icon store-row-icon">
            <StoreIcon size={18} />
          </span>
          <span>
            <strong>{item.name}</strong>
            <small>{item.address}</small>
          </span>
        </div>
      </td>
      <td>
        <strong className="secondary-strong">{item.area}</strong>
        <small className="subline">{item.category}</small>
      </td>
      <td className="number-cell">
        {item.status === "準備中" ? "—" : `${yen(item.monthlySales)}万`}
      </td>
      <td>{item.status === "準備中" ? "—" : <Growth value={item.growth} />}</td>
      <td>
        <Status value={item.status} />
      </td>
    </>
  );
}
function CompanyCells({ item }: { item: Company }) {
  return (
    <>
      <td>
        <div className="name-cell">
          <span
            className="company-logo"
            style={{ backgroundColor: item.color }}
          >
            {item.logo}
          </span>
          <span>
            <strong>{item.name}</strong>
            <small>{item.employees}名の社員</small>
          </span>
        </div>
      </td>
      <td>{item.industry}</td>
      <td className="number-cell">{yen(item.revenue)}百万円</td>
      <td>
        <Growth value={item.growth} />
      </td>
      <td>
        <Status value={item.status} />
      </td>
    </>
  );
}
function EmployeeCells({
  item,
  data,
}: {
  item: Employee;
  data: DashboardData;
}) {
  return (
    <>
      <td>
        <div className="person-cell">
          <Avatar initials={item.initials} color={item.color} />
          <span>
            <strong>{item.name}</strong>
            <small>{item.email}</small>
          </span>
        </div>
      </td>
      <td>{getCompany(data, item.companyId)}</td>
      <td>
        <strong className="secondary-strong">{item.department}</strong>
        <small className="subline">{item.role}</small>
      </td>
      <td className="muted-cell">{item.location}</td>
      <td>
        <Status value={item.status} />
      </td>
    </>
  );
}

function Overview({
  data,
  onSelect,
}: {
  data: DashboardData;
  onSelect: (item: RecordItem) => void;
}) {
  const totalRevenue = data.companies.reduce(
    (sum, company) => sum + company.revenue,
    0,
  );
  const totalSales = data.stores.reduce(
    (sum, store) => sum + store.monthlySales,
    0,
  );
  const averageGrowth =
    data.companies.reduce((sum, company) => sum + company.growth, 0) /
    (data.companies.length || 1);
  const fastestCompany = [...data.companies].sort(
    (a, b) => b.growth - a.growth,
  )[0];
  const chartMax = Math.max(
    500,
    Math.ceil(
      Math.max(...data.companies.map((company) => company.revenue), 0) / 500,
    ) * 500,
  );
  const topStores = [...data.stores]
    .filter((store) => store.status === "営業中")
    .sort((a, b) => b.monthlySales - a.monthlySales)
    .slice(0, 4);
  const maxSales = topStores[0]?.monthlySales || 1;
  return (
    <>
      <div className="welcome-banner">
        <div className="banner-copy">
          <div className="banner-kicker">
            <Activity size={15} /> BUSINESS PULSE
          </div>
          <h2>
            ビジネスの今を、
            <br />
            もっとクリアに。
          </h2>
          <p>
            ユーザー、店舗、企業の情報を一か所で。
            <br />
            サンプルデータから全体像を確認しましょう。
          </p>
          <Link href="/companies" className="banner-link">
            企業業績を見る <ArrowRight size={16} />
          </Link>
        </div>
        <div className="banner-art" aria-hidden="true">
          <div className="art-grid" />
          <div className="art-ring art-ring-1" />
          <div className="art-ring art-ring-2" />
          <div className="art-core">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="art-label art-label-top">
            INSIGHT <ArrowUpRight size={14} />
          </div>
          <div className="art-label art-label-bottom">
            GROWTH INDEX <span>↗</span>
          </div>
        </div>
      </div>
      <div className="section-header">
        <div>
          <span className="section-kicker">AT A GLANCE</span>
          <h2>主要指標</h2>
        </div>
        <span className="section-note">2026年9月時点のサンプルデータ</span>
      </div>
      <div className="metric-grid">
        <Metric
          icon={UsersRound}
          label="総ユーザー数"
          value={`${data.users.length}人`}
          change={`${data.users.filter((user) => user.status === "アクティブ").length}人`}
          note="アクティブ"
          tone="mint"
        />
        <Metric
          icon={StoreIcon}
          label="登録店舗数"
          value={`${data.stores.length}店舗`}
          change={`${data.stores.filter((store) => store.status === "営業中").length}店舗`}
          note="営業中"
          tone="peach"
        />
        <Metric
          icon={Building2}
          label="登録企業数"
          value={`${data.companies.length}社`}
          change={`${data.companies.filter((company) => company.growth > 0).length}社`}
          note="前年比プラス"
          tone="lavender"
        />
        <Metric
          icon={BriefcaseBusiness}
          label="社員数"
          value={`${data.employees.length}人`}
          change={`${new Set(data.employees.map((employee) => employee.department)).size}部署`}
          note="に所属"
          tone="blue"
        />
      </div>
      <div className="overview-grid">
        <section className="panel performance-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">PERFORMANCE</span>
              <h2>企業の売上高</h2>
              <p>登録企業の年間売上高を比較</p>
            </div>
            <span className="panel-pill">
              2026年度 <ChevronDown size={14} />
            </span>
          </div>
          <div className="chart-summary">
            <strong>
              {yen(totalRevenue)}
              <small>百万円</small>
            </strong>
            <Growth value={averageGrowth} />
            <span>全企業合計 · 平均成長率</span>
          </div>
          <div className="bar-chart">
            <div className="chart-gridlines">
              <span>{chartMax.toLocaleString("ja-JP")}</span>
              <span>
                {((chartMax * 2) / 3).toLocaleString("ja-JP", {
                  maximumFractionDigits: 0,
                })}
              </span>
              <span>
                {(chartMax / 3).toLocaleString("ja-JP", {
                  maximumFractionDigits: 0,
                })}
              </span>
              <span>0</span>
            </div>
            <div className="chart-bars">
              {data.companies.map((company) => (
                <div
                  key={company.id}
                  className="bar-group"
                  title={`${company.name}: ${yen(company.revenue)}百万円`}
                >
                  <div className="bar-wrap">
                    <div
                      className="bar"
                      style={{
                        height: `${(company.revenue / chartMax) * 100}%`,
                      }}
                    />
                  </div>
                  <span>{company.logo}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-legend">
            <span className="legend-dot" /> 売上高（百万円）
          </div>
        </section>
        <section className="panel top-stores-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">TOP LOCATIONS</span>
              <h2>店舗売上ランキング</h2>
              <p>今月の売上上位店舗</p>
            </div>
            <Link href="/stores" className="text-link">
              すべて見る <ArrowRight size={15} />
            </Link>
          </div>
          <div className="store-ranking">
            {topStores.map((store, index) => (
              <button
                type="button"
                key={store.id}
                className="ranking-row"
                onClick={() => onSelect(store)}
              >
                <span className="rank-number">0{index + 1}</span>
                <span className="ranking-info">
                  <strong>{store.name}</strong>
                  <small>
                    <MapPin size={12} />
                    {store.area} · {store.category}
                  </small>
                  <span className="ranking-track">
                    <span
                      style={{
                        width: `${(store.monthlySales / maxSales) * 100}%`,
                      }}
                    />
                  </span>
                </span>
                <span className="ranking-value">
                  <strong>{yen(store.monthlySales)}万</strong>
                  <Growth value={store.growth} />
                </span>
              </button>
            ))}
          </div>
          <div className="ranking-footer">
            登録店舗の月間売上合計 <strong>{yen(totalSales)}万</strong>
          </div>
        </section>
      </div>
      <div className="overview-grid lower-grid">
        <section className="panel recent-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">RECENT ACTIVITY</span>
              <h2>最近のユーザー</h2>
            </div>
            <Link href="/users" className="text-link">
              すべて見る <ArrowRight size={15} />
            </Link>
          </div>
          <div className="recent-list">
            {data.users.slice(0, 4).map((user) => (
              <button
                type="button"
                key={user.id}
                className="recent-row"
                onClick={() => onSelect(user)}
              >
                <Avatar initials={user.initials} color={user.color} />
                <span>
                  <strong>{user.name}</strong>
                  <small>{getCompany(data, user.companyId)}</small>
                </span>
                <Status value={user.status} />
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </section>
        <section className="insight-card">
          <div className="insight-icon">
            <TrendingUp size={23} />
          </div>
          <span className="section-kicker">QUICK INSIGHT</span>
          <h2>
            成長が見える、
            <br />
            次の一歩へ。
          </h2>
          <p>
            {fastestCompany?.name ?? "企業"}は前年比{" "}
            <strong>{pct(fastestCompany?.growth ?? 0)}</strong>
            。登録企業の中で最も高い成長率を記録しています。
          </p>
          <Link href="/companies">
            企業データを詳しく見る <ArrowRight size={16} />
          </Link>
          <div className="insight-decor">↗</div>
        </section>
      </div>
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  change,
  note,
  tone,
}: {
  icon: typeof UsersRound;
  label: string;
  value: string;
  change: string;
  note: string;
  tone: string;
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon tone-${tone}`}>
        <Icon size={21} strokeWidth={1.8} />
      </div>
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      <div className="metric-foot">
        <span>{change}</span> {note}
      </div>
      <div className="metric-spark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function Detail({
  item,
  data,
  onClose,
}: {
  item: RecordItem;
  data: DashboardData;
  onClose: () => void;
}) {
  const kind = item.id.split("-")[0];
  const company = "companyId" in item ? getCompany(data, item.companyId) : null;
  const fields: [string, string][] =
    kind === "usr"
      ? [
          ["メールアドレス", (item as User).email],
          ["所属企業", company ?? "—"],
          ["プラン", (item as User).plan],
          ["登録日", date((item as User).joinedAt)],
          ["ステータス", (item as User).status],
        ]
      : kind === "str"
        ? [
            ["所属企業", company ?? "—"],
            ["所在地", (item as Store).address],
            ["カテゴリ", (item as Store).category],
            ["店舗責任者", (item as Store).manager],
            [
              "月間売上",
              (item as Store).status === "準備中"
                ? "—"
                : `${yen((item as Store).monthlySales)}万円`,
            ],
            ["前月比", pct((item as Store).growth)],
          ]
        : kind === "co"
          ? [
              ["業種", (item as Company).industry],
              ["社員数", `${(item as Company).employees}名`],
              ["売上高", `${yen((item as Company).revenue)}百万円`],
              ["営業利益", `${yen((item as Company).profit)}百万円`],
              ["前年比", pct((item as Company).growth)],
              ["決算期", (item as Company).fiscalYear],
            ]
          : [
              ["所属企業", company ?? "—"],
              ["部署", (item as Employee).department],
              ["役職", (item as Employee).role],
              ["メールアドレス", (item as Employee).email],
              ["勤務地", (item as Employee).location],
              ["入社日", date((item as Employee).joinedAt)],
            ];
  const label =
    { usr: "ユーザー詳細", str: "店舗詳細", co: "企業詳細", emp: "社員詳細" }[
      kind
    ] ?? "詳細";
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="detail-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drawer-head">
          <span>{label}</span>
          <button
            type="button"
            className="icon-button"
            aria-label="詳細を閉じる"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="drawer-body">
          <div className="detail-hero">
            {"initials" in item ? (
              <Avatar
                initials={item.initials}
                color={item.color}
                size="large"
              />
            ) : "logo" in item ? (
              <span
                className="company-logo detail-logo"
                style={{ backgroundColor: item.color }}
              >
                {item.logo}
              </span>
            ) : (
              <span className="detail-store-icon">
                <StoreIcon size={28} />
              </span>
            )}
            <div className="detail-id">{item.id.toUpperCase()}</div>
            <h2>{item.name}</h2>
            <Status value={item.status} />
          </div>
          <div className="detail-section-title">基本情報</div>
          <dl className="detail-fields">
            {fields.map(([name, value]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {"email" in item && (
            <a className="email-link" href={`mailto:${item.email}`}>
              <Mail size={17} /> メールを送る <ArrowRight size={15} />
            </a>
          )}
        </div>
        <div className="drawer-foot">サンプルデータ · 読み取り専用</div>
      </aside>
    </div>
  );
}
