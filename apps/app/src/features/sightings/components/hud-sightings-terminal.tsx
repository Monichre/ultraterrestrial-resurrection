export const HudSightingTerminal = ({currentCoordinates, year, activeSighting, activeEvent}) => {
  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <span className="terminal-title">SYS_TERM_V42.EXE</span>
        <div className="terminal-controls">
          <span className="terminal-control"></span>
          <span className="terminal-control"></span>
          <span className="terminal-control"></span>
        </div>
      </div>
      <div className="terminal-content">
        <div className="terminal-line">$ system.initialize()</div>
        <div className="terminal-line">Initializing system components...</div>
        <div className="terminal-line">Loading navigation module...</div>
        <div className="terminal-line">Loading tactical systems...</div>
        <div className="terminal-line">Loading communication protocols...</div>
        <div className="terminal-line"><span className="success">SUCCESS:</span> All modules loaded successfully</div>
        <div className="terminal-line">&nbsp;</div>
        <div className="terminal-line">$ className SpaceshipInterface {</div>
        <div className="terminal-line">&nbsp;&nbsp;constructor() {</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;this.systems = [];</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;this.status = "STANDBY";</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;this.initialize();</div>
        <div className="terminal-line">&nbsp;&nbsp;}</div>
        <div className="terminal-line">&nbsp;</div>
        <div className="terminal-line">&nbsp;&nbsp;initialize() {</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;console.log("Initializing spacecraft systems...");</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;this.status = "ACTIVE";</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;this.loadSystems();</div>
        <div className="terminal-line">&nbsp;&nbsp;}</div>
        <div className="terminal-line">&nbsp;</div>
        <div className="terminal-line">&nbsp;&nbsp;loadSystems() {</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;this.systems = [</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ name: "navigation", status: "online" },</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ name: "propulsion", status: "online" },</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ name: "life_support", status: "online" },</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ name: "weapons", status: "primed" },</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ name: "shields", status: "charged" }</div>
        <div className="terminal-line">&nbsp;&nbsp;&nbsp;&nbsp;];</div>
        <div className="terminal-line">&nbsp;&nbsp;}</div>
        <div className="terminal-line">}</div>
        <div className="terminal-line">&nbsp;</div>
        <div className="terminal-line">$ const ship = new SpaceshipInterface();</div>
        <div className="terminal-line">Initializing spacecraft systems...</div>
        <div className="terminal-line">&nbsp;</div>
        <div className="terminal-line">$ ship.status</div>
        <div className="terminal-line">"ACTIVE"</div>
        <div className="terminal-line">&nbsp;</div>
        <div className="terminal-line">$ _</div>
      </div>
    </div>
  )
}
