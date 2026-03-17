export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; }
  .hl { font-family: 'Playfair Display', serif; }
  .bd { font-family: 'DM Sans', sans-serif; }
  .pill {
    border: 1px solid rgba(212,175,55,0.25); border-radius: 3px;
    padding: 10px 16px; cursor: pointer; transition: all 0.18s;
    background: transparent; color: #8a8278; font-family: 'DM Sans', sans-serif;
    font-size: 13px; text-align: left; width: 100%;
  }
  .pill:hover { border-color: #d4af37; color: #e8e0d0; background: rgba(212,175,55,0.05); }
  .pill.active { border-color: #d4af37; background: rgba(212,175,55,0.1); color: #d4af37; }
  .btn {
    border: none; padding: 13px 28px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; cursor: pointer; transition: all 0.18s;
  }
  .btn-gold { background: #d4af37; color: #0a0a0f; }
  .btn-gold:hover { background: #e8c84a; transform: translateY(-1px); }
  .btn-gold:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .btn-ghost { background: transparent; border: 1px solid rgba(212,175,55,0.3); color: #d4af37; }
  .btn-ghost:hover { background: rgba(212,175,55,0.07); }
  .card-shell {
    border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.025);
    transition: all 0.25s; position: relative; overflow: hidden;
  }
  .card-shell::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent, #d4af37), transparent);
    opacity: 0.7;
  }
  .card-shell:hover { border-color: rgba(212,175,55,0.3); transform: translateY(-2px); }
  .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); }
  input, textarea, select {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
    color: #e8e0d0; padding: 11px 14px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; outline: none; transition: border-color 0.18s;
  }
  input:focus, textarea:focus, select:focus { border-color: rgba(212,175,55,0.45); }
  select option { background: #141418; }
  .tag {
    display: inline-block; font-family: 'DM Sans', sans-serif; font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 8px;
    border: 1px solid rgba(255,255,255,0.1); color: #6a6258; border-radius: 2px;
  }
  .tag.active-tag { border-color: rgba(212,175,55,0.5); color: #d4af37; background: rgba(212,175,55,0.07); }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px);} to { opacity:1; transform:translateY(0);} }
  .fade-up { animation: fadeUp 0.45s ease forwards; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width:26px; height:26px; border:2px solid rgba(212,175,55,0.15); border-top-color:#d4af37; border-radius:50%; animation:spin 0.75s linear infinite; }
  .nav-tab {
    padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 12px;
    letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
    background: transparent; border: none; color: #5a5248; transition: all 0.18s;
    border-bottom: 2px solid transparent;
  }
  .nav-tab:hover { color: #a09888; }
  .nav-tab.active { color: #d4af37; border-bottom-color: #d4af37; }
  .stat-box {
    padding: 16px 20px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02);
  }
  .progress-bar { height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
  .progress-fill { height: 100%; transition: width 0.8s ease; }
`
