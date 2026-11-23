import { useMemo, useState } from "react";
import { Catalogue } from "./components/Catalogue";
import { createFixtureAdapter, type DemoScenario } from "./adapters/fixtureAdapter";
import "./App.css";

const PAGE_SIZE = 5;

function App() {
  const [scenario, setScenario] = useState<DemoScenario>("normal");
  const fetchPage = useMemo(() => createFixtureAdapter(scenario), [scenario]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Neli catalogue home">
          <span className="brand-mark">N</span>
          <span>neli<span className="brand-light">commerce</span></span>
        </a>
        <div className="topbar-right">
          <span className="environment-label"><span /> Demo environment</span>
          <button className="avatar" type="button" aria-label="User account">JD</button>
        </div>
      </header>

      <div className="content">
        <div className="breadcrumbs"><span>Workspace</span><span aria-hidden="true">/</span><strong>Products</strong></div>
        <section className="page-heading">
          <div>
            <p className="eyebrow">CATALOGUE MANAGEMENT</p>
            <h1>Products</h1>
            <p className="subtitle">Manage and keep track of your product catalogue.</p>
          </div>
          <label className="scenario-control">
            <span>Demo scenario</span>
            <select
              value={scenario}
              onChange={(event) => setScenario(event.target.value as DemoScenario)}
            >
              <option value="normal">Normal response</option>
              <option value="failure">Failure and retry</option>
              <option value="race">Race condition</option>
              <option value="empty">Empty results</option>
            </select>
          </label>
        </section>

        <Catalogue fetchPage={fetchPage} pageSize={PAGE_SIZE} />
        <p className="page-footnote">Catalogue data is provided by the local assessment fixture.</p>
      </div>
    </main>
  );
}

export default App;
